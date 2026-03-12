(function () {
  const SkyDominion = window.SkyDominion || (window.SkyDominion = {});
  const Math3D = SkyDominion.Math3D;
  const CONFIG = SkyDominion.CONFIG;

  const terrainCache = {};

  const MODELS = {
    player: {
      scale: 1.32,
      vertices: [
        [0, 0.6, 34],
        [0, 2.8, 15],
        [0, 2.1, 2],
        [0, 1, -22],
        [0, 8.2, -12],
        [0, -1.6, -18],
        [-31, 0.6, 4],
        [31, 0.6, 4],
        [-24, 0.2, -7],
        [24, 0.2, -7],
        [-9, -2.1, 12],
        [9, -2.1, 12],
        [-7, 5.8, -6],
        [7, 5.8, -6],
        [-4.8, 9.2, -14],
        [4.8, 9.2, -14]
      ],
      faces: [
        { i: [0, 1, 10], color: "#e6eef7" },
        { i: [0, 11, 1], color: "#d6e4f4" },
        { i: [10, 1, 2, 8], color: "#9bb0c7" },
        { i: [1, 11, 9, 2], color: "#a9c0d8" },
        { i: [2, 9, 3], color: "#72889f" },
        { i: [8, 2, 3], color: "#63788e" },
        { i: [1, 4, 2], color: "#6f859a" },
        { i: [12, 13, 4], color: "#314558" },
        { i: [14, 12, 4], color: "#556980" },
        { i: [13, 15, 4], color: "#60748a" },
        { i: [6, 10, 8, 3], color: "#7a8ea4" },
        { i: [11, 7, 3, 9], color: "#8ca2bb" },
        { i: [6, 0, 10], color: "#f2ce78" },
        { i: [0, 7, 11], color: "#f2ce78" },
        { i: [8, 9, 5], color: "#485e73" }
      ]
    },
    fighter: {
      scale: 1.16,
      vertices: [
        [0, 0.4, 30],
        [0, 2.4, 11],
        [0, 1.8, -1],
        [0, 0.8, -19],
        [0, 6.4, -9],
        [0, -1.6, -15],
        [-25, 0.4, 3],
        [25, 0.4, 3],
        [-19, 0, -6],
        [19, 0, -6],
        [-8, -1.8, 9],
        [8, -1.8, 9],
        [-6, 4.8, -4],
        [6, 4.8, -4],
        [-3.5, 7.5, -11],
        [3.5, 7.5, -11]
      ],
      faces: [
        { i: [0, 1, 10], color: "#d8e2ed" },
        { i: [0, 11, 1], color: "#c5d4e3" },
        { i: [10, 1, 2, 8], color: "#8ea2b6" },
        { i: [1, 11, 9, 2], color: "#9cb1c6" },
        { i: [8, 2, 3], color: "#65798d" },
        { i: [2, 9, 3], color: "#73889e" },
        { i: [1, 4, 2], color: "#5e7185" },
        { i: [12, 13, 4], color: "#2d3f50" },
        { i: [14, 12, 4], color: "#4a6074" },
        { i: [13, 15, 4], color: "#546a7e" },
        { i: [6, 10, 8, 3], color: "#76899d" },
        { i: [11, 7, 3, 9], color: "#859ab1" },
        { i: [6, 0, 10], color: "#d9704d" },
        { i: [0, 7, 11], color: "#d9704d" },
        { i: [8, 9, 5], color: "#425567" }
      ]
    },
    sam: {
      scale: 1.8,
      vertices: [
        [-8, 0, -8],
        [8, 0, -8],
        [8, 0, 8],
        [-8, 0, 8],
        [-8, 8, -8],
        [8, 8, -8],
        [8, 8, 8],
        [-8, 8, 8],
        [-2, 10, 0],
        [2, 10, 0],
        [-1, 12, 18],
        [1, 12, 18]
      ],
      faces: [
        { i: [0, 1, 5, 4], color: "#455361" },
        { i: [1, 2, 6, 5], color: "#556777" },
        { i: [2, 3, 7, 6], color: "#4d5d6b" },
        { i: [3, 0, 4, 7], color: "#60707f" },
        { i: [4, 5, 6, 7], color: "#738493" },
        { i: [8, 9, 11, 10], color: "#c8d8dc" }
      ]
    },
    battleship: {
      scale: 2.6,
      vertices: [
        [-16, 0, -40],
        [16, 0, -40],
        [26, 0, 34],
        [-26, 0, 34],
        [-13, 10, -20],
        [13, 10, -20],
        [16, 10, 16],
        [-16, 10, 16],
        [-6, 18, -4],
        [6, 18, -4],
        [6, 18, 10],
        [-6, 18, 10]
      ],
      faces: [
        { i: [0, 1, 2, 3], color: "#53667a" },
        { i: [4, 5, 6, 7], color: "#8ea0af" },
        { i: [0, 1, 5, 4], color: "#6d7f90" },
        { i: [1, 2, 6, 5], color: "#5b6c7d" },
        { i: [2, 3, 7, 6], color: "#47596b" },
        { i: [8, 9, 10, 11], color: "#d2dadd" }
      ]
    },
    flagship: {
      scale: 3.25,
      vertices: [
        [-18, 0, -54],
        [18, 0, -54],
        [30, 0, 46],
        [-30, 0, 46],
        [-16, 12, -26],
        [16, 12, -26],
        [19, 12, 22],
        [-19, 12, 22],
        [-8, 24, -4],
        [8, 24, -4],
        [10, 24, 18],
        [-10, 24, 18],
        [0, 34, 4]
      ],
      faces: [
        { i: [0, 1, 2, 3], color: "#4d6076" },
        { i: [4, 5, 6, 7], color: "#8195a9" },
        { i: [0, 1, 5, 4], color: "#687b90" },
        { i: [1, 2, 6, 5], color: "#5a6f84" },
        { i: [2, 3, 7, 6], color: "#425365" },
        { i: [8, 9, 10, 11], color: "#d1dadd" },
        { i: [8, 9, 12], color: "#f0db82" },
        { i: [9, 10, 12], color: "#d6edf5" },
        { i: [10, 11, 12], color: "#afc4d7" },
        { i: [11, 8, 12], color: "#c2d6e8" }
      ]
    },
    hq: {
      scale: 3.8,
      vertices: [
        [-24, 0, -24],
        [24, 0, -24],
        [24, 0, 24],
        [-24, 0, 24],
        [-24, 18, -24],
        [24, 18, -24],
        [24, 18, 24],
        [-24, 18, 24],
        [-12, 32, -12],
        [12, 32, -12],
        [12, 32, 12],
        [-12, 32, 12],
        [0, 52, 0]
      ],
      faces: [
        { i: [0, 1, 2, 3], color: "#4e4a57" },
        { i: [4, 5, 6, 7], color: "#8f8a95" },
        { i: [0, 1, 5, 4], color: "#66616d" },
        { i: [1, 2, 6, 5], color: "#5a5560" },
        { i: [2, 3, 7, 6], color: "#423d48" },
        { i: [3, 0, 4, 7], color: "#57525f" },
        { i: [8, 9, 12], color: "#f0dc80" },
        { i: [9, 10, 12], color: "#d5d9e8" },
        { i: [10, 11, 12], color: "#aab0c4" },
        { i: [11, 8, 12], color: "#c6cbe0" }
      ]
    }
  };

  function hexToRgb(hex) {
    const clean = hex.replace("#", "");
    const value = parseInt(clean, 16);
    return {
      r: (value >> 16) & 255,
      g: (value >> 8) & 255,
      b: value & 255
    };
  }

  function shadeColor(hex, brightness, flash) {
    const rgb = hexToRgb(hex);
    const light = 0.28 + brightness * 0.72;
    const extra = flash || 0;
    const r = Math.min(255, Math.round(rgb.r * light + 255 * extra * 0.35));
    const g = Math.min(255, Math.round(rgb.g * light + 224 * extra * 0.22));
    const b = Math.min(255, Math.round(rgb.b * light + 160 * extra * 0.1));
    return "rgb(" + r + ", " + g + ", " + b + ")";
  }

  function createBoxMesh(x, y, z, width, height, depth, colors) {
    const w = width / 2;
    const h = height;
    const d = depth / 2;
    return {
      pos: { x: x, y: y, z: z },
      vertices: [
        [-w, 0, -d], [w, 0, -d], [w, 0, d], [-w, 0, d],
        [-w, h, -d], [w, h, -d], [w, h, d], [-w, h, d]
      ],
      faces: [
        { i: [0, 1, 2, 3], color: colors[0] },
        { i: [4, 5, 6, 7], color: colors[1] },
        { i: [0, 1, 5, 4], color: colors[2] },
        { i: [1, 2, 6, 5], color: colors[3] },
        { i: [2, 3, 7, 6], color: colors[4] },
        { i: [3, 0, 4, 7], color: colors[5] }
      ]
    };
  }

  function createPyramidMesh(x, y, z, size, height, colors) {
    const s = size / 2;
    return {
      pos: { x: x, y: y, z: z },
      vertices: [
        [-s, 0, -s], [s, 0, -s], [s, 0, s], [-s, 0, s], [0, height, 0]
      ],
      faces: [
        { i: [0, 1, 2, 3], color: colors[0] },
        { i: [0, 1, 4], color: colors[1] },
        { i: [1, 2, 4], color: colors[2] },
        { i: [2, 3, 4], color: colors[3] },
        { i: [3, 0, 4], color: colors[4] }
      ]
    };
  }

  function buildTerrain(stage) {
    if (terrainCache[stage.id]) {
      return terrainCache[stage.id];
    }

    const meshes = [];
    const clouds = [];
    const terrain = stage.environment.terrainType;

    if (terrain === "archipelago") {
      meshes.push(createPyramidMesh(-640, 0, 1020, 280, 92, ["#6f684f", "#897e5c", "#817654", "#6d6346", "#5e563d"]));
      meshes.push(createPyramidMesh(620, 0, 1260, 320, 108, ["#6b6554", "#867e68", "#7a735e", "#665f4f", "#5a5344"]));
      meshes.push(createPyramidMesh(80, 0, 1650, 420, 128, ["#4e624a", "#68825e", "#5b7552", "#4e6748", "#40563b"]));
      clouds.push({ x: -420, y: 360, z: 520, size: 70 });
      clouds.push({ x: 260, y: 410, z: 910, size: 84 });
      clouds.push({ x: 20, y: 340, z: 1340, size: 92 });
    }

    if (terrain === "harbor") {
      meshes.push(createBoxMesh(-560, 0, 1510, 320, 38, 220, ["#4a4d5e", "#7b7f90", "#686c7d", "#55596a", "#424656", "#5c6172"]));
      meshes.push(createBoxMesh(560, 0, 1510, 320, 38, 220, ["#4a4d5e", "#7b7f90", "#686c7d", "#55596a", "#424656", "#5c6172"]));
      meshes.push(createPyramidMesh(-820, 0, 1800, 500, 140, ["#565d4d", "#6e7a61", "#627055", "#556248", "#4b573f"]));
      meshes.push(createPyramidMesh(860, 0, 1820, 520, 150, ["#565d4d", "#6e7a61", "#627055", "#556248", "#4b573f"]));
      clouds.push({ x: -220, y: 370, z: 700, size: 76 });
      clouds.push({ x: 420, y: 420, z: 1160, size: 96 });
      clouds.push({ x: 0, y: 320, z: 1700, size: 108 });
    }

    if (terrain === "mountain") {
      meshes.push(createPyramidMesh(-760, 0, 1320, 620, 220, ["#534c46", "#75695f", "#6b5f56", "#5c514a", "#4f4540"]));
      meshes.push(createPyramidMesh(760, 0, 1320, 620, 220, ["#534c46", "#75695f", "#6b5f56", "#5c514a", "#4f4540"]));
      meshes.push(createPyramidMesh(0, 0, 1900, 860, 340, ["#4b4543", "#675d5a", "#5f5653", "#544b49", "#463f3d"]));
      meshes.push(createBoxMesh(0, 48, 1880, 260, 18, 180, ["#494450", "#8d8891", "#6a6570", "#5d5864", "#47424d", "#54505b"]));
      clouds.push({ x: -460, y: 470, z: 980, size: 92 });
      clouds.push({ x: 380, y: 420, z: 1260, size: 88 });
      clouds.push({ x: 20, y: 520, z: 1700, size: 120 });
    }

    terrainCache[stage.id] = { meshes: meshes, clouds: clouds };
    return terrainCache[stage.id];
  }

  function createRenderer(canvas) {
    const ctx = canvas.getContext("2d");
    const renderer = {
      canvas: canvas,
      ctx: ctx,
      width: 0,
      height: 0,
      pixelRatio: Math.min(window.devicePixelRatio || 1, 2)
    };

    function resize() {
      const width = canvas.clientWidth || window.innerWidth;
      const height = canvas.clientHeight || window.innerHeight;
      const targetWidth = Math.round(width * renderer.pixelRatio);
      const targetHeight = Math.round(height * renderer.pixelRatio);
      if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
        canvas.width = targetWidth;
        canvas.height = targetHeight;
      }
      renderer.width = width;
      renderer.height = height;
      ctx.setTransform(renderer.pixelRatio, 0, 0, renderer.pixelRatio, 0, 0);
    }

    function buildCamera(player) {
      const basis = Math3D.basisFromAngles(player.pitch * 0.92, player.yaw, player.roll * 0.65);
      const pos = Math3D.add(
        Math3D.sub(player.pos, Math3D.scale(basis.forward, CONFIG.camera.chaseDistance)),
        Math3D.scale(basis.up, CONFIG.camera.chaseHeight)
      );
      return {
        pos: pos,
        forward: basis.forward,
        right: basis.right,
        up: basis.up
      };
    }

    function worldToCamera(point, camera) {
      const relative = Math3D.sub(point, camera.pos);
      return {
        x: Math3D.dot(relative, camera.right),
        y: Math3D.dot(relative, camera.up),
        z: Math3D.dot(relative, camera.forward)
      };
    }

    function projectPoint(point, camera) {
      const transformed = worldToCamera(point, camera);
      if (transformed.z <= CONFIG.camera.near) {
        return null;
      }
      const scale = CONFIG.camera.fov / transformed.z;
      return {
        x: renderer.width * 0.5 + transformed.x * scale,
        y: renderer.height * 0.5 - transformed.y * scale,
        z: transformed.z,
        scale: scale
      };
    }

    function drawSky(environment, player) {
      const sky = ctx.createLinearGradient(0, 0, 0, renderer.height);
      sky.addColorStop(0, environment.skyTop);
      sky.addColorStop(0.6, environment.skyBottom);
      sky.addColorStop(1, environment.seaBottom);
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, renderer.width, renderer.height);

      ctx.fillStyle = environment.sunColor;
      ctx.beginPath();
      ctx.arc(renderer.width * 0.78, renderer.height * 0.2, 110, 0, Math.PI * 2);
      ctx.fill();

      const hazeOffset = Math.max(-90, Math.min(90, -player.pitch * 180));
      ctx.fillStyle = environment.haze;
      ctx.fillRect(0, renderer.height * 0.45 + hazeOffset, renderer.width, renderer.height * 0.18);
    }

    function drawOcean(camera, player, environment) {
      const horizonProbe = projectPoint({ x: camera.pos.x + camera.forward.x * 2800, y: 0, z: camera.pos.z + camera.forward.z * 2800 }, camera);
      const horizonY = horizonProbe ? horizonProbe.y : renderer.height * 0.56;

      const ocean = ctx.createLinearGradient(0, horizonY, 0, renderer.height);
      ocean.addColorStop(0, environment.seaTop);
      ocean.addColorStop(1, environment.seaBottom);
      ctx.fillStyle = ocean;
      ctx.fillRect(0, horizonY, renderer.width, renderer.height - horizonY + 20);

      ctx.strokeStyle = "rgba(175, 226, 255, 0.12)";
      ctx.lineWidth = 1;
      const step = 180;
      const baseX = Math.round(player.pos.x / step) * step;
      const baseZ = Math.round(player.pos.z / step) * step;
      for (let x = -8; x <= 8; x += 1) {
        const xPos = baseX + x * step;
        const start = projectPoint({ x: xPos, y: 0, z: baseZ - 320 }, camera);
        const end = projectPoint({ x: xPos, y: 0, z: baseZ + 3400 }, camera);
        if (!start || !end) {
          continue;
        }
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
      }
      for (let z = 0; z <= 20; z += 1) {
        const zPos = baseZ + z * step;
        const start = projectPoint({ x: baseX - 1800, y: 0, z: zPos }, camera);
        const end = projectPoint({ x: baseX + 1800, y: 0, z: zPos }, camera);
        if (!start || !end) {
          continue;
        }
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
      }
    }

    function pushMeshPolygons(polygons, mesh, camera, flash, offset, orientation) {
      const vertices = mesh.vertices.map(function (vertex) {
        const local = { x: vertex[0], y: vertex[1], z: vertex[2] };
        const rotated = orientation ? Math3D.rotateEuler(local, orientation.pitch, orientation.yaw, orientation.roll) : local;
        return Math3D.add(rotated, offset || mesh.pos);
      });

      for (let f = 0; f < mesh.faces.length; f += 1) {
        const face = mesh.faces[f];
        const worldPoints = face.i.map(function (index) {
          return vertices[index];
        });
        if (worldPoints.length < 3) {
          continue;
        }

        const normal = Math3D.cross(Math3D.sub(worldPoints[1], worldPoints[0]), Math3D.sub(worldPoints[2], worldPoints[0]));
        const toCamera = Math3D.sub(camera.pos, worldPoints[0]);
        if (Math3D.dot(normal, toCamera) <= 0) {
          continue;
        }

        const projected = [];
        let depth = 0;
        for (let i = 0; i < worldPoints.length; i += 1) {
          const projectedPoint = projectPoint(worldPoints[i], camera);
          if (!projectedPoint) {
            depth = -1;
            break;
          }
          projected.push(projectedPoint);
          depth += projectedPoint.z;
        }

        if (depth <= 0) {
          continue;
        }

        const brightness = Math.max(0.15, Math.min(1, Math3D.normalize(normal).y * 0.35 + 0.7));
        polygons.push({
          type: "polygon",
          points: projected,
          depth: depth / projected.length,
          fill: shadeColor(face.color, brightness, flash),
          stroke: "rgba(9, 14, 18, 0.5)"
        });
      }
    }

    function pushEntityPolygons(polygons, entity, camera) {
      if (!entity.alive) {
        return;
      }
      const modelKey = entity.kind === "player" ? "player" : entity.kind;
      const model = MODELS[modelKey];
      const offset = entity.pos;
      const vertices = model.vertices.map(function (vertex) {
        const scaled = { x: vertex[0] * model.scale, y: vertex[1] * model.scale, z: vertex[2] * model.scale };
        const rotated = Math3D.rotateEuler(scaled, entity.pitch, entity.yaw, entity.roll);
        return Math3D.add(rotated, offset);
      });

      for (let f = 0; f < model.faces.length; f += 1) {
        const face = model.faces[f];
        const worldPoints = face.i.map(function (index) {
          return vertices[index];
        });
        const normal = Math3D.cross(Math3D.sub(worldPoints[1], worldPoints[0]), Math3D.sub(worldPoints[2], worldPoints[0]));
        const toCamera = Math3D.sub(camera.pos, worldPoints[0]);
        if (Math3D.dot(normal, toCamera) <= 0) {
          continue;
        }
        const projected = [];
        let depth = 0;
        for (let i = 0; i < worldPoints.length; i += 1) {
          const p = projectPoint(worldPoints[i], camera);
          if (!p) {
            depth = -1;
            break;
          }
          projected.push(p);
          depth += p.z;
        }
        if (depth <= 0) {
          continue;
        }
        const brightness = Math.max(0.2, Math.min(1, Math3D.normalize(normal).y * 0.45 + 0.62));
        polygons.push({
          type: "polygon",
          points: projected,
          depth: depth / projected.length,
          fill: shadeColor(face.color, brightness, entity.damageFlash || entity.hitTimer || 0),
          stroke: entity.kind === "player" ? "rgba(240, 245, 255, 0.26)" : "rgba(4, 8, 12, 0.58)"
        });
      }

      if (entity.kind === "player" && entity.afterburner > 0) {
        const basis = Math3D.basisFromAngles(entity.pitch, entity.yaw, entity.roll);
        const trailStart = projectPoint(Math3D.sub(entity.pos, Math3D.scale(basis.forward, 20)), camera);
        const trailEnd = projectPoint(Math3D.sub(entity.pos, Math3D.scale(basis.forward, 48)), camera);
        if (trailStart && trailEnd) {
          polygons.push({
            type: "beam",
            depth: (trailStart.z + trailEnd.z) * 0.5,
            start: trailStart,
            end: trailEnd,
            color: "rgba(255, 209, 112, " + (0.35 + entity.afterburner * 1.2) + ")",
            width: 12
          });
        }
      }
    }

    function drawClouds(clouds, camera) {
      const sorted = clouds.slice().sort(function (a, b) {
        return b.z - a.z;
      });
      for (let i = 0; i < sorted.length; i += 1) {
        const cloud = sorted[i];
        const projected = projectPoint(cloud, camera);
        if (!projected) {
          continue;
        }
        const radius = cloud.size * projected.scale;
        ctx.fillStyle = "rgba(255, 255, 255, 0.09)";
        ctx.beginPath();
        ctx.ellipse(projected.x, projected.y, radius * 1.5, radius * 0.55, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function drawProjectiles(projectiles, camera) {
      for (let i = 0; i < projectiles.length; i += 1) {
        const projectile = projectiles[i];
        const start = projectPoint(projectile.prevPos, camera);
        const end = projectPoint(projectile.pos, camera);
        if (!end) {
          continue;
        }
        if (start) {
          ctx.strokeStyle = projectile.ownerTeam === "player" ? "rgba(255, 230, 136, 0.75)" : "rgba(255, 134, 110, 0.72)";
          ctx.lineWidth = projectile.kind === "bullet" ? 2 : 4;
          ctx.beginPath();
          ctx.moveTo(start.x, start.y);
          ctx.lineTo(end.x, end.y);
          ctx.stroke();
        }
        ctx.fillStyle = projectile.ownerTeam === "player" ? "rgba(255, 241, 189, 0.9)" : "rgba(255, 138, 120, 0.9)";
        ctx.beginPath();
        ctx.arc(end.x, end.y, Math.max(2, projectile.radius * end.scale * 0.2), 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function drawParticles(particles, camera) {
      for (let i = 0; i < particles.length; i += 1) {
        const particle = particles[i];
        const projected = projectPoint(particle.pos, camera);
        if (!projected) {
          continue;
        }
        const alpha = Math.max(0, particle.life / particle.maxLife);
        ctx.fillStyle = particle.color.replace(/0?\.?\d*\)$/u, alpha.toFixed(2) + ")");
        ctx.beginPath();
        ctx.arc(projected.x, projected.y, Math.max(1.5, particle.size * projected.scale * 0.5), 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function drawLockMarker(lock, camera) {
      if (!lock || !lock.alive) {
        return;
      }
      const projected = projectPoint(lock.pos, camera);
      if (!projected) {
        return;
      }
      const size = Math.max(18, 320 / projected.z * 30);
      ctx.strokeStyle = "rgba(255, 232, 126, 0.92)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(projected.x - size, projected.y - size * 0.65);
      ctx.lineTo(projected.x - size * 0.4, projected.y - size * 0.65);
      ctx.lineTo(projected.x - size * 0.4, projected.y - size);
      ctx.moveTo(projected.x + size, projected.y - size * 0.65);
      ctx.lineTo(projected.x + size * 0.4, projected.y - size * 0.65);
      ctx.lineTo(projected.x + size * 0.4, projected.y - size);
      ctx.moveTo(projected.x - size, projected.y + size * 0.65);
      ctx.lineTo(projected.x - size * 0.4, projected.y + size * 0.65);
      ctx.lineTo(projected.x - size * 0.4, projected.y + size);
      ctx.moveTo(projected.x + size, projected.y + size * 0.65);
      ctx.lineTo(projected.x + size * 0.4, projected.y + size * 0.65);
      ctx.lineTo(projected.x + size * 0.4, projected.y + size);
      ctx.stroke();
    }

    function render(game) {
      resize();
      const stage = game.currentStage;
      const environment = stage.environment;
      const state = game.stageState;
      const player = state.player;
      const camera = buildCamera(player);
      const terrain = buildTerrain(stage);

      drawSky(environment, player);
      drawOcean(camera, player, environment);
      drawClouds(terrain.clouds, camera);

      const polygons = [];
      for (let i = 0; i < terrain.meshes.length; i += 1) {
        pushMeshPolygons(polygons, terrain.meshes[i], camera, 0);
      }
      pushEntityPolygons(polygons, player, camera);
      for (let i = 0; i < state.enemies.length; i += 1) {
        const enemy = state.enemies[i];
        if (enemy.alive) {
          pushEntityPolygons(polygons, enemy, camera);
        }
      }

      polygons.sort(function (a, b) {
        return b.depth - a.depth;
      });

      for (let i = 0; i < polygons.length; i += 1) {
        const polygon = polygons[i];
        if (polygon.type === "beam") {
          ctx.strokeStyle = polygon.color;
          ctx.lineWidth = polygon.width;
          ctx.beginPath();
          ctx.moveTo(polygon.start.x, polygon.start.y);
          ctx.lineTo(polygon.end.x, polygon.end.y);
          ctx.stroke();
          continue;
        }
        ctx.fillStyle = polygon.fill;
        ctx.strokeStyle = polygon.stroke;
        ctx.beginPath();
        ctx.moveTo(polygon.points[0].x, polygon.points[0].y);
        for (let p = 1; p < polygon.points.length; p += 1) {
          ctx.lineTo(polygon.points[p].x, polygon.points[p].y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }

      drawProjectiles(state.projectiles, camera);
      drawParticles(state.particles, camera);
      drawLockMarker(game.targetLock, camera);
    }

    return {
      render: render,
      resize: resize,
      projectPointForUi: function (point, player) {
        const camera = buildCamera(player);
        return projectPoint(point, camera);
      }
    };
  }

  SkyDominion.Renderer = {
    createRenderer: createRenderer
  };
})();

