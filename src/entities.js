(function () {
  const SkyDominion = window.SkyDominion || (window.SkyDominion = {});
  const Math3D = SkyDominion.Math3D;
  const CONFIG = SkyDominion.CONFIG;

  const ENEMY_STATS = {
    fighter: { hp: 1, radius: 16, speed: 190, score: 1 },
    sam: { hp: 1, radius: 18, speed: 0, score: 1 },
    battleship: { hp: 2, radius: 34, speed: 0, score: 2 },
    flagship: { hp: 4, radius: 46, speed: 0, score: 4 },
    hq: { hp: 5, radius: 54, speed: 0, score: 5 }
  };

  let entityCounter = 0;

  function nextId(prefix) {
    entityCounter += 1;
    return prefix + "-" + entityCounter;
  }

  function randomRange(min, max) {
    return min + Math.random() * (max - min);
  }

  function createPlayer(stage) {
    const start = stage.playerStart;
    return {
      id: nextId("player"),
      kind: "player",
      team: "player",
      pos: Math3D.vec3(start.x, start.y, start.z),
      prevPos: Math3D.vec3(start.x, start.y, start.z),
      pitch: start.pitch || 0,
      yaw: start.yaw || 0,
      roll: start.roll || 0,
      speed: CONFIG.player.startSpeed,
      health: CONFIG.player.maxHealth,
      maxHealth: CONFIG.player.maxHealth,
      ammo: CONFIG.player.maxAmmo,
      maxAmmo: CONFIG.player.maxAmmo,
      ammoTimer: 0,
      missileCooldown: 0,
      radius: CONFIG.player.collisionRadius,
      invulnerableTimer: 0,
      alive: true,
      hitTimer: 0,
      throttle: 0,
      strafeVelocity: 0,
      liftVelocity: 0,
      afterburner: 0,
      cameraPitchBias: 0
    };
  }

  function createEnemy(definition) {
    const stats = ENEMY_STATS[definition.kind];
    const hp = definition.hp || stats.hp;
    return {
      id: nextId(definition.kind),
      kind: definition.kind,
      team: "enemy",
      name: definition.name,
      pos: Math3D.vec3(definition.x, definition.y, definition.z),
      prevPos: Math3D.vec3(definition.x, definition.y, definition.z),
      spawn: Math3D.vec3(definition.x, definition.y, definition.z),
      pitch: definition.pitch || 0,
      yaw: definition.yaw || Math.PI,
      roll: definition.roll || 0,
      speed: definition.speed || stats.speed,
      hp,
      maxHp: hp,
      radius: stats.radius,
      alive: true,
      cooldown: randomRange(0.25, 1.4),
      burstCooldown: 0,
      burstShots: 0,
      orbitSign: Math.random() > 0.5 ? 1 : -1,
      weaveSeed: Math.random() * Math.PI * 2,
      damageFlash: 0,
      bob: Math.random() * Math.PI * 2
    };
  }

  function createExplosion(pos, color, count, speed, life) {
    const particles = [];
    const total = count || 16;
    for (let i = 0; i < total; i += 1) {
      const direction = Math3D.normalize({
        x: randomRange(-1, 1),
        y: randomRange(-0.4, 1),
        z: randomRange(-1, 1)
      });
      particles.push({
        id: nextId("particle"),
        pos: Math3D.vec3(pos.x, pos.y, pos.z),
        vel: Math3D.scale(direction, randomRange(speed * 0.4, speed)),
        color: color || "rgba(255, 182, 90, 0.9)",
        life: randomRange(life * 0.7, life * 1.1),
        maxLife: life,
        size: randomRange(3, 9)
      });
    }
    return particles;
  }

  function createProjectile(options) {
    return {
      id: nextId(options.kind),
      kind: options.kind,
      owner: options.owner,
      ownerTeam: options.ownerTeam,
      pos: Math3D.vec3(options.pos.x, options.pos.y, options.pos.z),
      prevPos: Math3D.vec3(options.pos.x, options.pos.y, options.pos.z),
      vel: Math3D.scale(Math3D.normalize(options.direction), options.speed),
      speed: options.speed,
      damage: options.damage,
      life: options.life,
      maxLife: options.life,
      radius: options.radius,
      color: options.color,
      targetId: options.targetId || null,
      turnRate: options.turnRate || 0,
      glow: options.glow || 0
    };
  }

  function createStageState(stage) {
    return {
      player: createPlayer(stage),
      enemies: stage.enemies.map(createEnemy),
      projectiles: [],
      particles: [],
      score: 0,
      stageTime: 0
    };
  }

  function firePlayerMissile(game) {
    const state = game.stageState;
    const player = state.player;
    if (!player.alive || player.ammo <= 0 || player.missileCooldown > 0) {
      return false;
    }

    const lock = acquireTargetLock(game);
    const basis = Math3D.basisFromAngles(player.pitch, player.yaw, player.roll);
    const muzzle = Math3D.add(player.pos, Math3D.add(Math3D.scale(basis.forward, 28), Math3D.scale(basis.right, 6)));
    state.projectiles.push(createProjectile({
      kind: "missile",
      owner: player.id,
      ownerTeam: "player",
      pos: muzzle,
      direction: basis.forward,
      speed: 410,
      damage: CONFIG.player.missileDamage,
      life: 6.2,
      radius: 10,
      targetId: lock ? lock.id : null,
      turnRate: 3.8,
      color: "#ffe690",
      glow: 18
    }));

    player.ammo -= 1;
    player.missileCooldown = CONFIG.player.missileCooldown;
    player.afterburner = 0.18;
    return true;
  }

  function fireEnemyBullet(stageState, enemy, direction, spread, speed, damage) {
    const drifted = Math3D.normalize(Math3D.add(direction, {
      x: randomRange(-spread, spread),
      y: randomRange(-spread * 0.4, spread * 0.4),
      z: randomRange(-spread, spread)
    }));
    const basis = Math3D.basisFromAngles(enemy.pitch, enemy.yaw, enemy.roll);
    const muzzle = Math3D.add(enemy.pos, Math3D.scale(basis.forward, enemy.radius * 0.9));
    stageState.projectiles.push(createProjectile({
      kind: "bullet",
      owner: enemy.id,
      ownerTeam: "enemy",
      pos: muzzle,
      direction: drifted,
      speed: speed,
      damage: damage,
      life: 2.8,
      radius: 7,
      color: "#ff9d64",
      glow: 10
    }));
  }

  function fireEnemyMissile(stageState, enemy, target) {
    const aim = Math3D.normalize(Math3D.sub(target.pos, enemy.pos));
    const basis = Math3D.basisFromAngles(enemy.pitch, enemy.yaw, enemy.roll);
    const spawn = Math3D.add(enemy.pos, Math3D.scale(basis.forward, enemy.radius + 8));
    stageState.projectiles.push(createProjectile({
      kind: "enemyMissile",
      owner: enemy.id,
      ownerTeam: "enemy",
      pos: spawn,
      direction: aim,
      speed: 255,
      damage: 1,
      life: 7.2,
      radius: 12,
      color: "#ff7272",
      glow: 18,
      targetId: target.id,
      turnRate: 2.1
    }));
  }

  function applyDamageToPlayer(game, damage) {
    const player = game.stageState.player;
    if (!player.alive || player.invulnerableTimer > 0) {
      return;
    }

    player.health -= damage;
    player.invulnerableTimer = 1.0;
    player.hitTimer = 0.2;
    game.feedback.hitFlash = 0.18;
    game.stageState.particles.push.apply(
      game.stageState.particles,
      createExplosion(player.pos, "rgba(255, 110, 110, 0.85)", 8, 46, 0.55)
    );

    if (player.health <= 0) {
      player.health = 0;
      player.alive = false;
      game.stageState.particles.push.apply(
        game.stageState.particles,
        createExplosion(player.pos, "rgba(255, 174, 86, 0.9)", 26, 120, 1.25)
      );
    }
  }

  function applyDamageToEnemy(game, enemy, damage) {
    if (!enemy.alive) {
      return;
    }

    enemy.hp -= damage;
    enemy.damageFlash = 0.22;
    game.stageState.particles.push.apply(
      game.stageState.particles,
      createExplosion(enemy.pos, "rgba(255, 196, 90, 0.8)", 7, 38, 0.45)
    );

    if (enemy.hp <= 0) {
      enemy.hp = 0;
      enemy.alive = false;
      game.stageState.score += ENEMY_STATS[enemy.kind].score;
      const burstCount = enemy.kind === "fighter" ? 18 : 28;
      const burstSpeed = enemy.kind === "fighter" ? 95 : 150;
      game.stageState.particles.push.apply(
        game.stageState.particles,
        createExplosion(enemy.pos, "rgba(255, 176, 72, 0.92)", burstCount, burstSpeed, 1.1)
      );
    }
  }

  function updatePlayer(game, dt) {
    const player = game.stageState.player;
    const input = game.input;
    if (!player.alive) {
      player.roll = Math3D.lerp(player.roll, 0, dt * 0.8);
      return;
    }

    player.prevPos = Math3D.vec3(player.pos.x, player.pos.y, player.pos.z);
    const pitchInput = (input.keys.KeyW ? 1 : 0) - (input.keys.KeyS ? 1 : 0);
    const rollInput = (input.keys.KeyA ? 1 : 0) - (input.keys.KeyD ? 1 : 0);
    const yawInput = (input.keys.KeyQ ? 1 : 0) - (input.keys.KeyE ? 1 : 0);
    const throttleInput = (input.keys.ShiftLeft || input.keys.ShiftRight ? 1 : 0) - (input.keys.ControlLeft || input.keys.ControlRight ? 1 : 0);
    const verticalInput = (input.keys.ArrowUp ? 1 : 0) - (input.keys.ArrowDown ? 1 : 0);
    const turnInput = (input.keys.ArrowRight ? 1 : 0) - (input.keys.ArrowLeft ? 1 : 0);

    player.pitch = Math3D.clamp(player.pitch + pitchInput * dt * 0.9, -0.62, 0.62);
    player.roll = Math3D.clamp(player.roll + rollInput * dt * 1.8, -1.15, 1.15);
    if (!rollInput) {
      player.roll = Math3D.lerp(player.roll, 0, dt * 1.8);
    }

    const totalYawInput = yawInput + turnInput;
    player.yaw = Math3D.wrapAngle(player.yaw + (totalYawInput * 0.95 - player.roll * 0.48) * dt);
    player.speed = Math3D.clamp(player.speed + throttleInput * 92 * dt, CONFIG.player.minSpeed, CONFIG.player.maxSpeed);

    const basis = Math3D.basisFromAngles(player.pitch, player.yaw, player.roll);
    player.strafeVelocity = Math3D.lerp(player.strafeVelocity, 0, dt * 5.5);
    player.liftVelocity = Math3D.lerp(player.liftVelocity, verticalInput * CONFIG.player.verticalSpeed, dt * 4.2);

    let movement = Math3D.add(
      Math3D.scale(basis.forward, player.speed),
      Math3D.add(
        Math3D.scale(basis.right, player.strafeVelocity),
        { x: 0, y: player.liftVelocity, z: 0 }
      )
    );
    player.pos = Math3D.add(player.pos, Math3D.scale(movement, dt));
    player.pos.y = Math.min(player.pos.y, CONFIG.world.ceiling);

    const desiredCameraBias = verticalInput * 0.22;
    player.cameraPitchBias = Math3D.lerp(player.cameraPitchBias, desiredCameraBias, dt * 4.6);

    player.ammoTimer += dt;
    while (player.ammo < player.maxAmmo && player.ammoTimer >= CONFIG.player.ammoRegenInterval) {
      player.ammo += 1;
      player.ammoTimer -= CONFIG.player.ammoRegenInterval;
    }
    if (player.ammo === player.maxAmmo) {
      player.ammoTimer = 0;
    }

    player.missileCooldown = Math.max(0, player.missileCooldown - dt);
    player.invulnerableTimer = Math.max(0, player.invulnerableTimer - dt);
    player.hitTimer = Math.max(0, player.hitTimer - dt);
    player.afterburner = Math.max(0, player.afterburner - dt);
  }

  function updateFighter(game, enemy, dt) {
    const player = game.stageState.player;
    enemy.prevPos = Math3D.vec3(enemy.pos.x, enemy.pos.y, enemy.pos.z);

    const offset = Math3D.sub(player.pos, enemy.pos);
    const distance = Math3D.length(offset);
    const flatDistance = Math.max(1, Math.sqrt(offset.x * offset.x + offset.z * offset.z));
    let desiredYaw = Math.atan2(offset.x, offset.z);
    let desiredPitch = Math.atan2(offset.y, flatDistance);

    if (distance < 280) {
      desiredYaw += enemy.orbitSign * 1.1;
      desiredPitch += Math.sin(game.clock * 1.7 + enemy.weaveSeed) * 0.18;
    } else {
      desiredYaw += Math.sin(game.clock * 0.7 + enemy.weaveSeed) * 0.12;
      desiredPitch += Math.sin(game.clock * 1.3 + enemy.weaveSeed) * 0.05;
    }

    enemy.yaw = Math3D.approachAngle(enemy.yaw, desiredYaw, dt * 1.3);
    enemy.pitch = Math3D.approachAngle(enemy.pitch, desiredPitch, dt * 0.8);
    enemy.roll = Math3D.lerp(enemy.roll, Math3D.clamp(-Math3D.wrapAngle(desiredYaw - enemy.yaw) * 2.4, -0.9, 0.9), dt * 2.2);

    const basis = Math3D.basisFromAngles(enemy.pitch, enemy.yaw, enemy.roll);
    enemy.pos = Math3D.add(enemy.pos, Math3D.scale(basis.forward, enemy.speed * dt));
    enemy.pos.y = Math3D.clamp(enemy.pos.y, 90, 550);

    enemy.cooldown -= dt;
    enemy.burstCooldown -= dt;

    const aimDot = Math3D.dot(basis.forward, Math3D.normalize(offset));
    if (distance < 760 && aimDot > 0.93) {
      if (enemy.burstShots > 0 && enemy.burstCooldown <= 0) {
        fireEnemyBullet(game.stageState, enemy, Math3D.normalize(offset), 0.03, 430, 1);
        enemy.burstShots -= 1;
        enemy.burstCooldown = 0.14;
      } else if (enemy.cooldown <= 0) {
        enemy.burstShots = 3;
        enemy.cooldown = randomRange(1.25, 2.3);
      }
    }
  }

  function updateSam(game, enemy, dt) {
    const player = game.stageState.player;
    const offset = Math3D.sub(player.pos, enemy.pos);
    const distance = Math3D.length(offset);
    const flatDistance = Math.max(1, Math.sqrt(offset.x * offset.x + offset.z * offset.z));
    enemy.yaw = Math.atan2(offset.x, offset.z);
    enemy.pitch = Math3D.clamp(Math.atan2(offset.y, flatDistance), -0.2, 0.55);
    enemy.cooldown -= dt;

    if (distance < 1100 && enemy.cooldown <= 0) {
      fireEnemyMissile(game.stageState, enemy, player);
      enemy.cooldown = randomRange(3.4, 4.8);
    }
  }

  function updateShip(game, enemy, dt, isBoss) {
    const player = game.stageState.player;
    const offset = Math3D.sub(player.pos, enemy.pos);
    const distance = Math3D.length(offset);
    enemy.cooldown -= dt;
    enemy.yaw = Math.atan2(offset.x, offset.z);
    enemy.pitch = 0;
    enemy.roll = Math.sin(game.clock * 0.6 + enemy.bob) * 0.03;

    if (distance < 1250 && enemy.cooldown <= 0) {
      const lead = Math3D.add(player.pos, Math3D.scale(Math3D.sub(player.pos, player.prevPos), 7));
      const direction = Math3D.normalize(Math3D.sub(lead, enemy.pos));
      const shots = isBoss ? 3 : 2;
      for (let i = 0; i < shots; i += 1) {
        fireEnemyBullet(game.stageState, enemy, direction, isBoss ? 0.06 : 0.08, isBoss ? 380 : 340, 1);
      }
      enemy.cooldown = isBoss ? randomRange(1.0, 1.4) : randomRange(1.4, 2.0);
    }
  }

  function updateProjectiles(game, dt) {
    const state = game.stageState;
    const player = state.player;

    for (let i = state.projectiles.length - 1; i >= 0; i -= 1) {
      const projectile = state.projectiles[i];
      projectile.prevPos = Math3D.vec3(projectile.pos.x, projectile.pos.y, projectile.pos.z);
      projectile.life -= dt;

      if (projectile.turnRate > 0) {
        let target = null;
        if (projectile.ownerTeam === "player") {
          target = state.enemies.find(function (enemy) {
            return enemy.id === projectile.targetId && enemy.alive;
          }) || null;
        } else if (player.alive && projectile.targetId === player.id) {
          target = player;
        }

        if (target) {
          const desired = Math3D.normalize(Math3D.sub(target.pos, projectile.pos));
          const current = Math3D.normalize(projectile.vel);
          const steer = Math3D.normalize(Math3D.lerpVec(current, desired, Math.min(1, projectile.turnRate * dt)));
          projectile.vel = Math3D.scale(steer, projectile.speed);
        }
      }

      projectile.pos = Math3D.add(projectile.pos, Math3D.scale(projectile.vel, dt));

      if (projectile.ownerTeam === "player") {
        for (let e = 0; e < state.enemies.length; e += 1) {
          const enemy = state.enemies[e];
          if (!enemy.alive) {
            continue;
          }
          if (Math3D.distance(projectile.pos, enemy.pos) <= enemy.radius + projectile.radius) {
            applyDamageToEnemy(game, enemy, projectile.damage);
            projectile.life = -1;
            break;
          }
        }
      } else if (player.alive && Math3D.distance(projectile.pos, player.pos) <= player.radius + projectile.radius) {
        applyDamageToPlayer(game, projectile.damage);
        projectile.life = -1;
      }

      if (projectile.life <= 0) {
        state.particles.push.apply(
          state.particles,
          createExplosion(projectile.pos, projectile.ownerTeam === "player" ? "rgba(255, 225, 145, 0.75)" : "rgba(255, 123, 123, 0.75)", 5, 26, 0.32)
        );
        state.projectiles.splice(i, 1);
      }
    }
  }

  function updateParticles(stageState, dt) {
    for (let i = stageState.particles.length - 1; i >= 0; i -= 1) {
      const particle = stageState.particles[i];
      particle.life -= dt;
      particle.pos = Math3D.add(particle.pos, Math3D.scale(particle.vel, dt));
      particle.vel = Math3D.scale(particle.vel, 1 - dt * 1.6);
      particle.vel.y -= 16 * dt;
      if (particle.life <= 0) {
        stageState.particles.splice(i, 1);
      }
    }
  }

  function updateEnemies(game, dt) {
    const enemies = game.stageState.enemies;
    for (let i = 0; i < enemies.length; i += 1) {
      const enemy = enemies[i];
      if (!enemy.alive) {
        enemy.damageFlash = Math.max(0, enemy.damageFlash - dt);
        continue;
      }

      enemy.damageFlash = Math.max(0, enemy.damageFlash - dt);
      if (enemy.kind === "fighter") {
        updateFighter(game, enemy, dt);
      }
    }
  }

  function acquireTargetLock(game) {
    const player = game.stageState.player;
    const basis = Math3D.basisFromAngles(player.pitch, player.yaw, player.roll);
    let best = null;
    let bestScore = -Infinity;

    for (let i = 0; i < game.stageState.enemies.length; i += 1) {
      const enemy = game.stageState.enemies[i];
      if (!enemy.alive) {
        continue;
      }
      const offset = Math3D.sub(enemy.pos, player.pos);
      const distance = Math3D.length(offset);
      const alignment = Math3D.dot(Math3D.normalize(offset), basis.forward);
      if (distance > 1500 || alignment < 0.78) {
        continue;
      }
      const score = alignment * 2 - distance / 1700;
      if (score > bestScore) {
        bestScore = score;
        best = enemy;
      }
    }

    return best;
  }

  function getAliveEnemies(game) {
    return game.stageState.enemies.filter(function (enemy) {
      return enemy.alive;
    });
  }

  function checkMissionStatus(game) {
    const player = game.stageState.player;
    if (!player.alive) {
      return { finished: true, success: false, reason: "撃墜" };
    }

    if (player.pos.y <= CONFIG.world.floor) {
      player.alive = false;
      player.health = 0;
      game.stageState.particles.push.apply(
        game.stageState.particles,
        createExplosion(player.pos, "rgba(255, 130, 95, 0.95)", 30, 132, 1.2)
      );
      return { finished: true, success: false, reason: "墜落" };
    }

    const stage = game.currentStage;
    const alive = getAliveEnemies(game);
    if (stage.missionType === "eliminate_all" && alive.length === 0) {
      return { finished: true, success: true, reason: stage.completionLabel };
    }

    return { finished: false, success: false, reason: "" };
  }

  function update(game, dt) {
    const state = game.stageState;
    state.stageTime += dt;
    updatePlayer(game, dt);
    updateEnemies(game, dt);
    updateProjectiles(game, dt);
    updateParticles(state, dt);
    return checkMissionStatus(game);
  }

  SkyDominion.Entities = {
    createStageState,
    firePlayerMissile,
    acquireTargetLock,
    update,
    getAliveEnemies
  };
})();


