(function () {
  const SkyDominion = window.SkyDominion || (window.SkyDominion = {});
  const CONFIG = SkyDominion.CONFIG;
  const Entities = SkyDominion.Entities;
  const Math3D = SkyDominion.Math3D;

  const dom = {
    canvas: document.getElementById("game-canvas"),
    hud: document.getElementById("hud"),
    menuOverlay: document.getElementById("menu-overlay"),
    messageOverlay: document.getElementById("message-overlay"),
    missionName: document.getElementById("mission-name"),
    missionObjective: document.getElementById("mission-objective"),
    lockName: document.getElementById("lock-name"),
    lockDistance: document.getElementById("lock-distance"),
    healthFill: document.getElementById("health-fill"),
    healthText: document.getElementById("health-text"),
    ammoFill: document.getElementById("ammo-fill"),
    ammoText: document.getElementById("ammo-text"),
    speedText: document.getElementById("speed-text"),
    altitudeText: document.getElementById("altitude-text"),
    hostilesText: document.getElementById("hostiles-text"),
    stageText: document.getElementById("stage-text"),
    hitFlash: document.getElementById("hit-flash"),
    messageEyebrow: document.getElementById("message-eyebrow"),
    messageTitle: document.getElementById("message-title"),
    messageBody: document.getElementById("message-body"),
    messagePrimary: document.getElementById("message-primary"),
    messageSecondary: document.getElementById("message-secondary"),
    startButton: document.getElementById("start-button"),
    stageCards: document.getElementById("stage-cards"),
    radarCanvas: document.getElementById("radar-canvas"),
    touchControls: document.getElementById("touch-controls"),
    touchStickFlight: document.getElementById("touch-stick-flight"),
    touchStickMove: document.getElementById("touch-stick-move")
  };

  const game = {
    renderer: SkyDominion.Renderer.createRenderer(dom.canvas),
    radarContext: dom.radarCanvas.getContext("2d"),
    state: "menu",
    stageIndex: 0,
    selectedStageIndex: 0,
    currentStage: CONFIG.stages[0],
    stageState: Entities.createStageState(CONFIG.stages[0]),
    targetLock: null,
    clock: 0,
    lastFrameTime: 0,
    feedback: {
      hitFlash: 0
    },
    input: {
      keys: {},
      keyboardKeys: {},
      virtualKeys: {},
      fireQueued: false,
      touch: {
        enabled: false,
        activeButtons: {},
        flightStick: null,
        moveStick: null
      }
    },
    uiActions: {
      primary: function () {},
      secondary: function () {}
    }
  };

  function setOverlayVisibility(element, visible) {
    element.classList.toggle("overlay-visible", visible);
  }

  function setMenuVisible(visible) {
    setOverlayVisibility(dom.menuOverlay, visible);
  }

  function setMessageVisible(visible) {
    setOverlayVisibility(dom.messageOverlay, visible);
  }

  function openMessage(options) {
    dom.messageEyebrow.textContent = options.eyebrow;
    dom.messageTitle.textContent = options.title;
    dom.messageBody.textContent = options.body;
    dom.messagePrimary.textContent = options.primaryLabel || "続行";
    dom.messageSecondary.textContent = options.secondaryLabel || "ステージ選択";
    dom.messageSecondary.style.display = options.hideSecondary ? "none" : "inline-block";
    game.uiActions.primary = options.onPrimary || function () {};
    game.uiActions.secondary = options.onSecondary || function () {};
    setMessageVisible(true);
  }

  function closeMessage() {
    setMessageVisible(false);
  }

  function buildStageCards() {
    dom.stageCards.innerHTML = "";
    CONFIG.stages.forEach(function (stage, index) {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "stage-card" + (index === game.selectedStageIndex ? " stage-card-active" : "");
      card.innerHTML = "<h3>" + stage.shortName + "</h3><p>" + stage.objective + "</p><span class=\"stage-tag\">" + stage.completionLabel + "</span>";
      card.addEventListener("click", function () {
        game.selectedStageIndex = index;
        buildStageCards();
      });
      dom.stageCards.appendChild(card);
    });
  }

  function prepareStage(index) {
    game.stageIndex = index;
    game.selectedStageIndex = index;
    game.currentStage = CONFIG.stages[index];
    game.stageState = Entities.createStageState(game.currentStage);
    game.targetLock = null;
    game.feedback.hitFlash = 0;
    game.input.fireQueued = false;
    game.input.keys = {};
    game.input.keyboardKeys = {};
    game.input.virtualKeys = {};
    dom.hud.classList.remove("hidden");
    updateHud();
  }

  function showStageBriefing(index) {
    prepareStage(index);
    game.state = "briefing";
    setMenuVisible(false);
    openMessage({
      eyebrow: game.currentStage.name,
      title: game.currentStage.shortName,
      body: game.currentStage.objective + " 体力は3発で撃墜、ミサイルは20発まで搭載、3秒ごとに1発補充です。矢印キーで上下左右に移動できます。",
      primaryLabel: "出撃",
      secondaryLabel: "ステージ選択",
      onPrimary: function () {
        closeMessage();
        game.state = "playing";
      },
      onSecondary: function () {
        closeMessage();
        game.state = "menu";
        dom.hud.classList.add("hidden");
        setMenuVisible(true);
      }
    });
  }

  function handleMissionEnd(result) {
    game.state = "result";
    if (result.success) {
      const isLastStage = game.stageIndex === CONFIG.stages.length - 1;
      openMessage({
        eyebrow: "任務成功",
        title: isLastStage ? "全作戦完了" : "空域制圧完了",
        body: isLastStage
          ? "敵司令系統を壊滅させ、3つの作戦空域を制圧しました。再出撃するか、任意のステージを選択できます。"
          : result.reason + "。次の戦域へ移行します。",
        primaryLabel: isLastStage ? "このステージを再出撃" : "次のステージへ",
        secondaryLabel: "ステージ選択",
        onPrimary: function () {
          closeMessage();
          if (isLastStage) {
            showStageBriefing(game.selectedStageIndex);
          } else {
            game.selectedStageIndex = game.stageIndex + 1;
            showStageBriefing(game.stageIndex + 1);
          }
        },
        onSecondary: function () {
          closeMessage();
          game.state = "menu";
          dom.hud.classList.add("hidden");
          setMenuVisible(true);
          buildStageCards();
        }
      });
    } else {
      openMessage({
        eyebrow: "任務失敗",
        title: "機体喪失",
        body: "被弾限界に達しました。同じステージへ即座に再出撃するか、メニューに戻って作戦を選び直せます。",
        primaryLabel: "再出撃",
        secondaryLabel: "ステージ選択",
        onPrimary: function () {
          closeMessage();
          showStageBriefing(game.stageIndex);
        },
        onSecondary: function () {
          closeMessage();
          game.state = "menu";
          dom.hud.classList.add("hidden");
          setMenuVisible(true);
          buildStageCards();
        }
      });
    }
  }

  function updateHud() {
    const player = game.stageState.player;
    const aliveHostiles = Entities.getAliveEnemies(game);
    dom.missionName.textContent = game.currentStage.shortName;
    dom.missionObjective.textContent = game.currentStage.objective;
    dom.stageText.textContent = String(game.stageIndex + 1) + " / " + CONFIG.stages.length;

    dom.healthFill.style.width = ((player.health / player.maxHealth) * 100).toFixed(1) + "%";
    dom.healthText.textContent = player.health + " / " + player.maxHealth;
    dom.ammoFill.style.width = ((player.ammo / player.maxAmmo) * 100).toFixed(1) + "%";
    dom.ammoText.textContent = player.ammo + " / " + player.maxAmmo;

    dom.speedText.textContent = Math.round(player.speed).toString();
    dom.altitudeText.textContent = Math.round(player.pos.y).toString();
    dom.hostilesText.textContent = aliveHostiles.length.toString();

    if (game.targetLock) {
      const distance = Math.round(Math3D.distance(player.pos, game.targetLock.pos));
      dom.lockName.textContent = game.targetLock.name;
      dom.lockDistance.textContent = distance + " m";
    } else {
      dom.lockName.textContent = "ロックなし";
      dom.lockDistance.textContent = "---";
    }

    dom.hitFlash.classList.toggle("active", game.feedback.hitFlash > 0);
  }

  function updateRadar() {
    const ctx = game.radarContext;
    const width = dom.radarCanvas.width;
    const height = dom.radarCanvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = 76;
    const player = game.stageState.player;
    const basis = Math3D.basisFromAngles(0, player.yaw, 0);

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "rgba(0, 16, 28, 0.72)";
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = "rgba(121, 224, 255, 0.2)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.66, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius * 0.33, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(centerX - radius, centerY);
    ctx.lineTo(centerX + radius, centerY);
    ctx.moveTo(centerX, centerY - radius);
    ctx.lineTo(centerX, centerY + radius);
    ctx.stroke();

    const hostiles = Entities.getAliveEnemies(game);
    hostiles.forEach(function (enemy) {
      const relative = Math3D.sub(enemy.pos, player.pos);
      const forward = Math3D.dot(relative, basis.forward);
      const side = Math3D.dot(relative, basis.right);
      const distance = Math.sqrt(forward * forward + side * side);
      if (distance > CONFIG.world.radarRange) {
        return;
      }
      const x = centerX + (side / CONFIG.world.radarRange) * radius;
      const y = centerY - (forward / CONFIG.world.radarRange) * radius;
      ctx.fillStyle = enemy === game.targetLock ? "#ffe17b" : enemy.kind === "fighter" ? "#ff7373" : "#ffb96f";
      ctx.beginPath();
      ctx.arc(x, y, enemy.kind === "fighter" ? 3 : 4.6, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.fillStyle = "#79e0ff";
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - 8);
    ctx.lineTo(centerX + 6, centerY + 8);
    ctx.lineTo(centerX - 6, centerY + 8);
    ctx.closePath();
    ctx.fill();
  }


  function setVirtualKey(code, pressed) {
    game.input.virtualKeys[code] = !!pressed;
  }

  function updateCombinedKeys() {
    const keys = {};
    Object.keys(game.input.keyboardKeys).forEach(function (code) {
      if (game.input.keyboardKeys[code]) {
        keys[code] = true;
      }
    });
    Object.keys(game.input.virtualKeys).forEach(function (code) {
      if (game.input.virtualKeys[code]) {
        keys[code] = true;
      }
    });
    game.input.keys = keys;
  }

  function updateStickVisual(stick) {
    if (!stick || !stick.element) {
      return;
    }
    const knob = stick.element.querySelector(".touch-stick-knob");
    if (!knob) {
      return;
    }
    const move = 30;
    knob.style.transform = "translate(" + (stick.x * move).toFixed(1) + "px, " + (stick.y * move).toFixed(1) + "px)";
  }

  function setStickFromPointer(stick, event) {
    const rect = stick.element.getBoundingClientRect();
    const cx = rect.left + rect.width * 0.5;
    const cy = rect.top + rect.height * 0.5;
    const maxDistance = rect.width * 0.4;
    let dx = event.clientX - cx;
    let dy = event.clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > maxDistance && dist > 0) {
      const ratio = maxDistance / dist;
      dx *= ratio;
      dy *= ratio;
    }
    stick.x = Math3D.clamp(dx / maxDistance, -1, 1);
    stick.y = Math3D.clamp(dy / maxDistance, -1, 1);
    updateStickVisual(stick);
  }

  function resetStick(stick) {
    stick.pointerId = null;
    stick.x = 0;
    stick.y = 0;
    updateStickVisual(stick);
  }

  function applyTouchKeys() {
    const touch = game.input.touch;
    if (!touch.enabled) {
      return;
    }
    const threshold = 0.32;
    const flight = touch.flightStick;
    const move = touch.moveStick;

    setVirtualKey("KeyW", flight.y < -threshold);
    setVirtualKey("KeyS", flight.y > threshold);
    setVirtualKey("KeyQ", flight.x < -threshold);
    setVirtualKey("KeyE", flight.x > threshold);

    setVirtualKey("ArrowLeft", move.x < -threshold);
    setVirtualKey("ArrowRight", move.x > threshold);
    setVirtualKey("ArrowUp", move.y < -threshold);
    setVirtualKey("ArrowDown", move.y > threshold);
  }

  function bindTouchButton(button) {
    const key = button.dataset.key;
    const isFire = button.dataset.fire === "true";

    function activate() {
      if (key) {
        game.input.touch.activeButtons[key] = true;
        setVirtualKey(key, true);
      }
      if (isFire) {
        game.input.fireQueued = true;
      }
      button.classList.add("touch-button-active");
    }

    function deactivate() {
      if (key) {
        delete game.input.touch.activeButtons[key];
        setVirtualKey(key, false);
      }
      button.classList.remove("touch-button-active");
    }

    button.addEventListener("pointerdown", function (event) {
      event.preventDefault();
      activate();
    });

    ["pointerup", "pointercancel", "pointerleave"].forEach(function (type) {
      button.addEventListener(type, function (event) {
        event.preventDefault();
        deactivate();
      });
    });
  }

  function bindTouchStick(stick) {
    const element = stick.element;
    element.addEventListener("pointerdown", function (event) {
      event.preventDefault();
      stick.pointerId = event.pointerId;
      setStickFromPointer(stick, event);
      element.setPointerCapture(event.pointerId);
    });

    element.addEventListener("pointermove", function (event) {
      if (stick.pointerId !== event.pointerId) {
        return;
      }
      event.preventDefault();
      setStickFromPointer(stick, event);
    });

    ["pointerup", "pointercancel"].forEach(function (type) {
      element.addEventListener(type, function (event) {
        if (stick.pointerId !== event.pointerId) {
          return;
        }
        event.preventDefault();
        resetStick(stick);
      });
    });
  }

  function setupTouchControls() {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    game.input.touch.enabled = isTouch;
    dom.touchControls.style.display = isTouch ? "flex" : "none";
    if (!isTouch) {
      return;
    }

    game.input.touch.flightStick = { element: dom.touchStickFlight, pointerId: null, x: 0, y: 0 };
    game.input.touch.moveStick = { element: dom.touchStickMove, pointerId: null, x: 0, y: 0 };

    bindTouchStick(game.input.touch.flightStick);
    bindTouchStick(game.input.touch.moveStick);

    dom.touchControls.querySelectorAll(".touch-button").forEach(bindTouchButton);
  }

  function onKeyDown(event) {
    game.input.keyboardKeys[event.code] = true;
    if (event.code === "Space" || event.code.indexOf("Arrow") === 0) {
      event.preventDefault();
    }
    if (event.code === "Space") {
      game.input.fireQueued = true;
    }
    if (event.code === "KeyR") {
      if (game.state === "playing" || game.state === "briefing" || game.state === "result") {
        showStageBriefing(game.stageIndex);
      }
    }
    if (event.code === "Escape") {
      closeMessage();
      game.state = "menu";
      dom.hud.classList.add("hidden");
      setMenuVisible(true);
    }
  }

  function onKeyUp(event) {
    game.input.keyboardKeys[event.code] = false;
  }

  function tick(timestamp) {
    if (!game.lastFrameTime) {
      game.lastFrameTime = timestamp;
    }
    const dt = Math.min(0.033, (timestamp - game.lastFrameTime) / 1000 || 0.016);
    game.lastFrameTime = timestamp;
    game.clock += dt;
    game.feedback.hitFlash = Math.max(0, game.feedback.hitFlash - dt);

    applyTouchKeys();
    updateCombinedKeys();

    if (game.state === "playing") {
      if (game.input.fireQueued) {
        Entities.firePlayerMissile(game);
        game.input.fireQueued = false;
      }
      game.targetLock = Entities.acquireTargetLock(game);
      const result = Entities.update(game, dt);
      game.targetLock = Entities.acquireTargetLock(game);
      updateHud();
      updateRadar();
      if (result.finished) {
        handleMissionEnd(result);
      }
    } else {
      updateHud();
      updateRadar();
    }

    game.renderer.render(game);
    requestAnimationFrame(tick);
  }

  function init() {
    buildStageCards();
    dom.startButton.addEventListener("click", function () {
      showStageBriefing(game.selectedStageIndex);
    });
    dom.messagePrimary.addEventListener("click", function () {
      game.uiActions.primary();
    });
    dom.messageSecondary.addEventListener("click", function () {
      game.uiActions.secondary();
    });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("resize", function () {
      game.renderer.resize();
    });

    setupTouchControls();

    dom.hud.classList.add("hidden");
    setMenuVisible(true);
    setMessageVisible(false);
    updateHud();
    updateRadar();
    requestAnimationFrame(tick);
  }

  init();
})();
