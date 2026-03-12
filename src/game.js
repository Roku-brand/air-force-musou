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
    healthText: document.getElementById("health-text"),
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
    stageCards: document.getElementById("stage-cards"),
    radarCanvas: document.getElementById("radar-canvas"),
    touchControls: document.getElementById("touch-controls"),
    touchStickFlight: document.getElementById("touch-stick-flight"),
    menuTabButtons: document.querySelectorAll("[data-menu-tab]"),
    stageTabPanel: document.getElementById("menu-tab-stage"),
    settingsTabPanel: document.getElementById("menu-tab-settings"),
    customizeTabPanel: document.getElementById("menu-tab-customize"),
    controlModeSelect: document.getElementById("control-mode-select"),
    invertYToggle: document.getElementById("invert-y-toggle"),
    volumeRange: document.getElementById("volume-range"),
    controlSummary: document.getElementById("control-summary"),
    aircraftColorSelect: document.getElementById("aircraft-color-select"),
    aircraftFrameSelect: document.getElementById("aircraft-frame-select"),
    customizeSummary: document.getElementById("customize-summary")
  };

  const FRAME_PRESETS = {
    balanced: { label: "バランス型", maxHealth: 3, maxAmmo: 20, maxSpeed: 320 },
    light: { label: "軽量型", maxHealth: 2, maxAmmo: 16, maxSpeed: 360 },
    heavy: { label: "重装型", maxHealth: 4, maxAmmo: 24, maxSpeed: 285 }
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
    audio: {
      context: null,
      master: null,
      enabled: false
    },
    settings: {
      controlMode: "standard",
      invertY: false,
      volume: 60,
      aircraftColor: "standard",
      aircraftFrame: "balanced"
    },
    previousLockId: null,
    input: {
      keys: {},
      keyboardKeys: {},
      virtualKeys: {},
      fireQueued: false,
      touch: {
        enabled: false,
        activeButtons: {},
        flightStick: null
      }
    },
    uiActions: {
      primary: function () {},
      secondary: function () {}
    }
  };


  function ensureAudio() {
    if (game.audio.context) {
      return game.audio.enabled;
    }
    const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextCtor) {
      return false;
    }
    try {
      const context = new AudioContextCtor();
      const master = context.createGain();
      master.gain.value = game.settings.volume / 100 * 0.35;
      master.connect(context.destination);
      game.audio.context = context;
      game.audio.master = master;
      game.audio.enabled = true;
      return true;
    } catch (error) {
      game.audio.enabled = false;
      return false;
    }
  }

  function playSound(soundName, options) {
    if (!ensureAudio()) {
      return;
    }

    const context = game.audio.context;
    if (context.state === "suspended") {
      context.resume().catch(function () {});
    }

    const now = context.currentTime;
    const volume = options && options.volume != null ? options.volume : 0.18;
    const playbackRate = options && options.playbackRate != null ? options.playbackRate : 1;
    const output = context.createGain();
    output.gain.value = 1;
    output.connect(game.audio.master);

    function createLayerGain(amount) {
      const gain = context.createGain();
      gain.gain.value = amount;
      gain.connect(output);
      return gain;
    }

    function createNoiseSource(duration, layerGain, options) {
      const sampleRate = context.sampleRate;
      const length = Math.max(1, Math.floor(sampleRate * duration));
      const buffer = context.createBuffer(1, length, sampleRate);
      const data = buffer.getChannelData(0);
      const color = options && options.color ? options.color : "white";
      let previous = 0;
      for (let i = 0; i < length; i += 1) {
        const white = Math.random() * 2 - 1;
        if (color === "brown") {
          previous = (previous + white * 0.045) / 1.022;
          data[i] = previous * 2.5;
        } else if (color === "pink") {
          previous = previous * 0.985 + white * 0.22;
          data[i] = previous;
        } else {
          data[i] = white;
        }
      }

      const source = context.createBufferSource();
      source.buffer = buffer;
      source.connect(layerGain);
      source.start(now);
      source.stop(now + duration);
      return source;
    }

    function createTone(type, frequency, start, end, layerGain, sweepTo) {
      const osc = context.createOscillator();
      osc.type = type;
      osc.frequency.setValueAtTime(Math.max(1, frequency), start);
      if (sweepTo != null) {
        osc.frequency.exponentialRampToValueAtTime(Math.max(1, sweepTo), end);
      }
      osc.connect(layerGain);
      osc.start(start);
      osc.stop(end);
      return osc;
    }

    if (soundName === "playerMissile") {
      const duration = 0.45;

      const bodyGain = createLayerGain(volume * 0.95);
      bodyGain.gain.setValueAtTime(0.0001, now);
      bodyGain.gain.exponentialRampToValueAtTime(volume * 0.95, now + 0.05);
      bodyGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      const bodyFilter = context.createBiquadFilter();
      bodyFilter.type = "bandpass";
      bodyFilter.frequency.setValueAtTime(440 * playbackRate, now);
      bodyFilter.frequency.exponentialRampToValueAtTime(180 * playbackRate, now + duration);
      bodyFilter.Q.value = 0.65;
      bodyGain.disconnect();
      bodyGain.connect(bodyFilter);
      bodyFilter.connect(output);
      createNoiseSource(duration, bodyGain, { color: "pink" });

      const thrustGain = createLayerGain(volume * 0.58);
      thrustGain.gain.setValueAtTime(0.0001, now);
      thrustGain.gain.exponentialRampToValueAtTime(volume * 0.58, now + 0.015);
      thrustGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.24);
      createTone("sawtooth", 230 * playbackRate, now, now + 0.24, thrustGain, 95 * playbackRate);

      const clickGain = createLayerGain(volume * 0.28);
      clickGain.gain.setValueAtTime(volume * 0.28, now);
      clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
      const clickFilter = context.createBiquadFilter();
      clickFilter.type = "highpass";
      clickFilter.frequency.value = 1400;
      clickGain.disconnect();
      clickGain.connect(clickFilter);
      clickFilter.connect(output);
      createNoiseSource(0.07, clickGain, { color: "white" });
      return;
    }

    if (soundName === "targetLock") {
      osc.type = "square";
      osc.frequency.setValueAtTime(880 * playbackRate, now);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(volume, now + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.1);
      return;
    }

    if (soundName === "playerHit") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(170 * playbackRate, now);
      osc.frequency.exponentialRampToValueAtTime(90 * playbackRate, now + 0.1);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(volume, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.13);
      osc.start(now);
      osc.stop(now + 0.16);
      return;
    }

    if (soundName === "enemyDown") {
      const duration = 0.95;

      const boomGain = createLayerGain(volume * 0.92);
      boomGain.gain.setValueAtTime(0.0001, now);
      boomGain.gain.exponentialRampToValueAtTime(volume * 0.92, now + 0.03);
      boomGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      const lowPass = context.createBiquadFilter();
      lowPass.type = "lowpass";
      lowPass.frequency.setValueAtTime(620, now);
      lowPass.frequency.exponentialRampToValueAtTime(110, now + duration);
      boomGain.disconnect();
      boomGain.connect(lowPass);
      lowPass.connect(output);
      createNoiseSource(duration, boomGain, { color: "brown" });

      const punchGain = createLayerGain(volume * 0.55);
      punchGain.gain.setValueAtTime(0.0001, now);
      punchGain.gain.exponentialRampToValueAtTime(volume * 0.55, now + 0.01);
      punchGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
      createTone("triangle", 150 * playbackRate, now, now + 0.22, punchGain, 42 * playbackRate);

      const debrisGain = createLayerGain(volume * 0.24);
      debrisGain.gain.setValueAtTime(0.0001, now + 0.06);
      debrisGain.gain.exponentialRampToValueAtTime(volume * 0.24, now + 0.12);
      debrisGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.62);
      const debrisFilter = context.createBiquadFilter();
      debrisFilter.type = "bandpass";
      debrisFilter.frequency.value = 1500;
      debrisFilter.Q.value = 1.3;
      debrisGain.disconnect();
      debrisGain.connect(debrisFilter);
      debrisFilter.connect(output);
      createNoiseSource(0.62, debrisGain, { color: "white" });
      return;
    }

    if (soundName === "missionComplete") {
      const duration = 1.45;
      const droneGain = createLayerGain(volume * 0.2);
      droneGain.gain.setValueAtTime(0.0001, now);
      droneGain.gain.exponentialRampToValueAtTime(volume * 0.2, now + 0.12);
      droneGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      const droneFilter = context.createBiquadFilter();
      droneFilter.type = "lowpass";
      droneFilter.frequency.value = 920;
      droneGain.disconnect();
      droneGain.connect(droneFilter);
      droneFilter.connect(output);
      createNoiseSource(duration, droneGain, { color: "pink" });

      const tones = [523.25, 659.25, 783.99];
      tones.forEach(function (freq, index) {
        const start = now + index * 0.2;
        const end = start + 0.7;
        const toneGain = createLayerGain(volume * (0.33 - index * 0.04));
        toneGain.gain.setValueAtTime(0.0001, start);
        toneGain.gain.exponentialRampToValueAtTime(volume * (0.33 - index * 0.04), start + 0.02);
        toneGain.gain.exponentialRampToValueAtTime(0.0001, end);
        createTone("triangle", freq * playbackRate, start, end, toneGain, (freq * 1.03) * playbackRate);
      });

      const chimeGain = createLayerGain(volume * 0.16);
      chimeGain.gain.setValueAtTime(0.0001, now + 0.42);
      chimeGain.gain.exponentialRampToValueAtTime(volume * 0.16, now + 0.45);
      chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.1);
      createTone("sine", 1046.5 * playbackRate, now + 0.42, now + 1.1, chimeGain, 1174.66 * playbackRate);
      return;
    }

    const osc = context.createOscillator();
    const gain = context.createGain();

    osc.connect(gain);
    gain.connect(output);

    if (soundName === "playerDown") {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(180 * playbackRate, now);
      osc.frequency.exponentialRampToValueAtTime(45 * playbackRate, now + 0.4);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(volume, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);
      osc.start(now);
      osc.stop(now + 0.45);
    }
  }

  function setOverlayVisibility(element, visible) {
    element.classList.toggle("overlay-visible", visible);
  }

  function setMenuVisible(visible) {
    setOverlayVisibility(dom.menuOverlay, visible);
    document.body.classList.toggle("menu-active", visible);
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
        launchStage(index);
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
    game.previousLockId = null;

    const frame = FRAME_PRESETS[game.settings.aircraftFrame] || FRAME_PRESETS.balanced;
    game.stageState.player.maxHealth = frame.maxHealth;
    game.stageState.player.health = frame.maxHealth;
    game.stageState.player.maxAmmo = frame.maxAmmo;
    game.stageState.player.ammo = frame.maxAmmo;

    dom.hud.classList.remove("hidden");
    updateHud();
  }

  function updateControlSummary() {
    const mode = game.settings.controlMode === "wasd" ? "WASD" : "スタンダード（矢印キー）";
    const invert = game.settings.invertY ? "反転あり" : "反転なし";
    dom.controlSummary.textContent = "現在の操作: " + mode + " / " + invert + " / 音量" + game.settings.volume + "%";
  }

  function updateCustomizeSummary() {
    const frame = FRAME_PRESETS[game.settings.aircraftFrame] || FRAME_PRESETS.balanced;
    dom.customizeSummary.textContent = frame.label + ": 耐久" + frame.maxHealth + " / ミサイル" + frame.maxAmmo + " / 最高速" + frame.maxSpeed;
  }


  function launchStage(index) {
    prepareStage(index);
    closeMessage();
    game.state = "playing";
    setMenuVisible(false);
  }

  function showStageBriefing(index) {
    prepareStage(index);
    game.state = "briefing";
    setMenuVisible(false);
    openMessage({
      eyebrow: game.currentStage.name,
      title: game.currentStage.shortName,
      body: game.currentStage.objective + " 体力は3発で撃墜、ミサイルは20発まで搭載、3秒ごとに1発補充です。高度0mで墜落判定、矢印キーで上下左右に移動できます。",
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
      playSound("missionComplete", { volume: 0.22 });
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
          launchStage(game.stageIndex);
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

    dom.healthText.textContent = player.health + " / " + player.maxHealth;
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
    if (game.settings.controlMode === "wasd") {
      setVirtualKey("KeyA", flight.x < -threshold);
      setVirtualKey("KeyD", flight.x > threshold);
      if (game.settings.invertY) {
        setVirtualKey("KeyS", flight.y < -threshold);
        setVirtualKey("KeyW", flight.y > threshold);
      } else {
        setVirtualKey("KeyW", flight.y < -threshold);
        setVirtualKey("KeyS", flight.y > threshold);
      }
      setVirtualKey("ArrowLeft", false);
      setVirtualKey("ArrowRight", false);
      setVirtualKey("ArrowUp", false);
      setVirtualKey("ArrowDown", false);
    } else {
      setVirtualKey("ArrowLeft", flight.x < -threshold);
      setVirtualKey("ArrowRight", flight.x > threshold);
      if (game.settings.invertY) {
        setVirtualKey("ArrowDown", flight.y < -threshold);
        setVirtualKey("ArrowUp", flight.y > threshold);
      } else {
        setVirtualKey("ArrowUp", flight.y < -threshold);
        setVirtualKey("ArrowDown", flight.y > threshold);
      }
      setVirtualKey("KeyA", false);
      setVirtualKey("KeyD", false);
    }

    setVirtualKey("KeyQ", false);
    setVirtualKey("KeyE", false);
  }

  function setupMenuControls() {
    dom.controlModeSelect.addEventListener("change", function () {
      game.settings.controlMode = dom.controlModeSelect.value;
      updateControlSummary();
    });

    dom.invertYToggle.addEventListener("change", function () {
      game.settings.invertY = dom.invertYToggle.checked;
      updateControlSummary();
    });

    dom.volumeRange.addEventListener("input", function () {
      game.settings.volume = Number(dom.volumeRange.value);
      if (game.audio.master) {
        game.audio.master.gain.value = game.settings.volume / 100 * 0.35;
      }
      updateControlSummary();
    });

    dom.aircraftColorSelect.addEventListener("change", function () {
      game.settings.aircraftColor = dom.aircraftColorSelect.value;
    });

    dom.aircraftFrameSelect.addEventListener("change", function () {
      game.settings.aircraftFrame = dom.aircraftFrameSelect.value;
      updateCustomizeSummary();
    });

    updateControlSummary();
    updateCustomizeSummary();
  }

  function bindTouchButton(button) {
    if (!button) {
      return;
    }

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
    if (!stick || !stick.element) {
      return;
    }

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
    if (!dom.touchControls) {
      return;
    }

    dom.touchControls.style.display = isTouch ? "flex" : "none";
    if (!isTouch) {
      return;
    }

    game.input.touch.flightStick = { element: dom.touchStickFlight, pointerId: null, x: 0, y: 0 };
    bindTouchStick(game.input.touch.flightStick);

    dom.touchControls.querySelectorAll(".touch-button").forEach(bindTouchButton);
  }

  function showStageMenu() {
    closeMessage();
    game.state = "menu";
    dom.hud.classList.add("hidden");
    setMenuVisible(true);
    buildStageCards();
  }

  function setupMenuTabs() {
    const panels = {
      stage: dom.stageTabPanel,
      settings: dom.settingsTabPanel,
      customize: dom.customizeTabPanel
    };

    function activateMenuTab(name) {
      Object.keys(panels).forEach(function (key) {
        panels[key].classList.toggle("hidden", key !== name);
      });
      dom.menuTabButtons.forEach(function (button) {
        button.classList.toggle("menu-tab-active", button.dataset.menuTab === name);
      });
    }

    dom.menuTabButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        activateMenuTab(button.dataset.menuTab);
      });
    });

    activateMenuTab("stage");
  }

  function lockMobileLandscape() {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (!isTouch || !screen.orientation || !screen.orientation.lock) {
      return;
    }
    screen.orientation.lock("landscape").catch(function () {});
  }

  function mapControlCode(code) {
    if (game.settings.controlMode !== "wasd") {
      if (!game.settings.invertY) {
        return code;
      }
      if (code === "ArrowUp") {
        return "ArrowDown";
      }
      if (code === "ArrowDown") {
        return "ArrowUp";
      }
      return code;
    }

    if (code === "ArrowUp") {
      return game.settings.invertY ? "KeyS" : "KeyW";
    }
    if (code === "ArrowDown") {
      return game.settings.invertY ? "KeyW" : "KeyS";
    }
    if (code === "ArrowLeft") {
      return "KeyA";
    }
    if (code === "ArrowRight") {
      return "KeyD";
    }
    return code;
  }

  function onKeyDown(event) {
    const mappedCode = mapControlCode(event.code);
    game.input.keyboardKeys[mappedCode] = true;
    if (event.code === "Space" || event.code.indexOf("Arrow") === 0) {
      event.preventDefault();
    }
    if (event.code === "Space") {
      ensureAudio();
      game.input.fireQueued = true;
    }
    if (event.code === "KeyR") {
      if (game.state === "playing" || game.state === "briefing" || game.state === "result") {
        launchStage(game.stageIndex);
      }
    }
    if (event.code === "Escape") {
      showStageMenu();
    }
  }

  function onKeyUp(event) {
    const mappedCode = mapControlCode(event.code);
    game.input.keyboardKeys[mappedCode] = false;
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
      const lockId = game.targetLock ? game.targetLock.id : null;
      if (lockId && lockId !== game.previousLockId) {
        playSound("targetLock", { volume: 0.12 });
      }
      game.previousLockId = lockId;
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
    dom.messagePrimary.addEventListener("click", function () {
      ensureAudio();
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
    window.addEventListener("touchmove", function (event) {
      event.preventDefault();
    }, { passive: false });
    window.addEventListener("gesturestart", function (event) {
      event.preventDefault();
    }, { passive: false });

    setupTouchControls();
    setupMenuTabs();
    setupMenuControls();
    lockMobileLandscape();

    game.playSound = playSound;

    dom.hud.classList.add("hidden");
    setMenuVisible(true);
    setMessageVisible(false);
    updateHud();
    updateRadar();
    requestAnimationFrame(tick);
  }

  init();
})();
