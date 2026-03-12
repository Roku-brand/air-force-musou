(function () {
  const SkyDominion = window.SkyDominion || (window.SkyDominion = {});
  const Math3D = SkyDominion.Math3D;
  const CONFIG = SkyDominion.CONFIG;

  const terrainCache = {};
  const NAVAL_KINDS = { battleship: true, carrier: true, flagship: true };
  const THREE_MODEL_KINDS = { fighter: true, sam: true, hq: true };

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
        [0, 0.6, 38],
        [0, 2.8, 18],
        [0, 2.4, 4],
        [0, 1.6, -12],
        [0, 0.8, -30],
        [0, 5.2, -10],
        [0, -2.2, -18],
        [-34, 0.8, 6],
        [34, 0.8, 6],
        [-28, 0.3, -8],
        [28, 0.3, -8],
        [-12, -2.3, 12],
        [12, -2.3, 12],
        [-10, 4.5, -3],
        [10, 4.5, -3],
        [-6.5, 7.2, -12],
        [6.5, 7.2, -12],
        [-20, 0.2, 22],
        [20, 0.2, 22],
        [-4.6, 2.8, 29],
        [4.6, 2.8, 29],
        [0, 9.4, -15],
        [-3.2, 3.3, 12],
        [3.2, 3.3, 12],
        [-22, 1.4, -18],
        [22, 1.4, -18],
        [0, 3.4, -24]
      ],
      faces: [
        { i: [0, 19, 1], color: "#c0c6b6" },
        { i: [0, 1, 20], color: "#b4bcad" },
        { i: [19, 20, 1], color: "#8b9385" },
        { i: [17, 0, 11], color: "#9aa18f" },
        { i: [0, 18, 12], color: "#a7af98" },
        { i: [11, 1, 22], color: "#6f786c" },
        { i: [1, 12, 23], color: "#778175" },
        { i: [22, 1, 23], color: "#8f9b88" },
        { i: [22, 9, 2], color: "#687166" },
        { i: [23, 2, 10], color: "#727c6f" },
        { i: [2, 3, 9], color: "#596257" },
        { i: [2, 10, 3], color: "#616b5f" },
        { i: [3, 24, 4, 6], color: "#434b44" },
        { i: [3, 4, 25], color: "#50584f" },
        { i: [1, 5, 2], color: "#656e63" },
        { i: [13, 14, 5], color: "#333b34" },
        { i: [15, 13, 5], color: "#495246" },
        { i: [14, 16, 5], color: "#535d50" },
        { i: [5, 21, 16], color: "#67705a" },
        { i: [15, 21, 5], color: "#5f6853" },
        { i: [21, 26, 16], color: "#4f5949" },
        { i: [24, 25, 4], color: "#3f463f" },
        { i: [7, 17, 11], color: "#7e876f" },
        { i: [18, 8, 12], color: "#8b947a" },
        { i: [7, 11, 9, 24], color: "#697162" },
        { i: [12, 8, 25, 10], color: "#737c6a" },
        { i: [9, 10, 6], color: "#3f463f" }
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
        [1, 12, 18],
        [-5, 8, -2],
        [5, 8, -2],
        [0, 15, 8]
      ],
      faces: [
        { i: [0, 1, 5, 4], color: "#455361" },
        { i: [1, 2, 6, 5], color: "#556777" },
        { i: [2, 3, 7, 6], color: "#4d5d6b" },
        { i: [3, 0, 4, 7], color: "#60707f" },
        { i: [4, 5, 6, 7], color: "#738493" },
        { i: [8, 9, 11, 10], color: "#c8d8dc" },
        { i: [12, 13, 14], color: "#9ba9b7" },
        { i: [10, 11, 14], color: "#e2edf3" }
      ]
    },
    battleship: {
      scale: 2.9,
      vertices: [
        [-10, 0, -76], [10, 0, -76], [20, 0, -58], [25, 0, -20], [27, 0, 36], [16, 0, 74], [-16, 0, 74], [-27, 0, 36], [-25, 0, -20], [-20, 0, -58],
        [-8, 8, -64], [8, 8, -64], [16, 8, -48], [20, 8, -18], [21, 8, 32], [13, 8, 62], [-13, 8, 62], [-21, 8, 32], [-20, 8, -18], [-16, 8, -48],
        [-7, 14, -34], [7, 14, -34], [11, 14, -10], [12, 14, 20], [9, 14, 46], [-9, 14, 46], [-12, 14, 20], [-11, 14, -10],
        [-4, 24, -14], [4, 24, -14], [6, 24, 10], [-6, 24, 10],
        [-12, 12, -58], [12, 12, -58], [0, 17, -60],
        [-10, 18, -4], [10, 18, -4], [0, 24, -2],
        [-9, 16, 34], [9, 16, 34], [0, 21, 34],
        [-3, 22, -44], [3, 22, -44], [0, 29, -44]
      ],
      faces: [
        { i: [0, 1, 2, 9], color: "#4d5f71" },
        { i: [9, 2, 3, 8], color: "#425262" },
        { i: [8, 3, 4, 7], color: "#4a5b6b" },
        { i: [7, 4, 5, 6], color: "#3e4c5a" },
        { i: [10, 11, 12, 19], color: "#7f92a3" },
        { i: [19, 12, 13, 18], color: "#748798" },
        { i: [18, 13, 14, 17], color: "#6d8091" },
        { i: [17, 14, 15, 16], color: "#65798a" },
        { i: [0, 1, 11, 10], color: "#5f7283" },
        { i: [1, 2, 12, 11], color: "#56697a" },
        { i: [2, 3, 13, 12], color: "#506273" },
        { i: [3, 4, 14, 13], color: "#4a5a69" },
        { i: [4, 5, 15, 14], color: "#445462" },
        { i: [5, 6, 16, 15], color: "#3f4e5d" },
        { i: [6, 7, 17, 16], color: "#435464" },
        { i: [7, 8, 18, 17], color: "#4a5b6c" },
        { i: [8, 9, 19, 18], color: "#516475" },
        { i: [20, 21, 22, 27], color: "#99aebb" },
        { i: [27, 22, 23, 26], color: "#8ba0ae" },
        { i: [26, 23, 24, 25], color: "#8196a5" },
        { i: [28, 29, 30, 31], color: "#ced8df" },
        { i: [32, 33, 34], color: "#d6dee5" },
        { i: [35, 36, 37], color: "#d3dce4" },
        { i: [38, 39, 40], color: "#d0dae2" },
        { i: [41, 42, 43], color: "#c4ced8" },
        { i: [20, 21, 29, 28], color: "#5c6f80" },
        { i: [21, 22, 29], color: "#627687" },
        { i: [22, 23, 30, 29], color: "#5a6d7d" },
        { i: [23, 24, 30], color: "#516372" },
        { i: [24, 25, 31, 30], color: "#4c5e6d" },
        { i: [25, 20, 28, 31], color: "#566879" }
      ]
    },
    carrier: {
      scale: 3.35,
      vertices: [
        [-14, 0, -92], [14, 0, -92], [32, 0, -56], [42, 0, -8], [46, 0, 40], [34, 0, 98], [-34, 0, 98], [-46, 0, 40], [-42, 0, -8], [-32, 0, -56],
        [-12, 10, -86], [12, 10, -86], [28, 10, -52], [37, 10, -6], [40, 10, 36], [30, 10, 92], [-30, 10, 92], [-40, 10, 36], [-37, 10, -6], [-28, 10, -52],
        [-24, 15, -30], [22, 15, -30], [30, 15, 70], [-26, 15, 70],
        [-14, 27, -48], [10, 27, -48], [12, 27, -10], [-12, 27, -10],
        [-10, 36, -36], [8, 36, -36], [8, 36, -18], [-10, 36, -18],
        [-6, 20, 12], [6, 20, 12], [8, 20, 52], [-8, 20, 52],
        [-26, 12, -78], [26, 12, -78], [0, 18, -80],
        [-20, 12, 82], [20, 12, 82], [0, 17, 86],
        [-40, 8, -20], [-44, 8, 8], [40, 8, -20], [44, 8, 8]
      ],
      faces: [
        { i: [0, 1, 2, 9], color: "#4f5d6e" },
        { i: [9, 2, 3, 8], color: "#465463" },
        { i: [8, 3, 4, 7], color: "#41505f" },
        { i: [7, 4, 5, 6], color: "#3b4957" },
        { i: [10, 11, 12, 19], color: "#7f8f9f" },
        { i: [19, 12, 13, 18], color: "#748595" },
        { i: [18, 13, 14, 17], color: "#6d7e8e" },
        { i: [17, 14, 15, 16], color: "#657787" },
        { i: [0, 1, 11, 10], color: "#5d6c7b" },
        { i: [1, 2, 12, 11], color: "#556472" },
        { i: [2, 3, 13, 12], color: "#4f5e6c" },
        { i: [3, 4, 14, 13], color: "#475563" },
        { i: [4, 5, 15, 14], color: "#41505d" },
        { i: [5, 6, 16, 15], color: "#3d4a58" },
        { i: [6, 7, 17, 16], color: "#42505f" },
        { i: [7, 8, 18, 17], color: "#495867" },
        { i: [8, 9, 19, 18], color: "#526170" },
        { i: [20, 21, 22, 23], color: "#9aacba" },
        { i: [24, 25, 26, 27], color: "#adbcca" },
        { i: [28, 29, 30, 31], color: "#bac7d4" },
        { i: [32, 33, 34, 35], color: "#94a5b5" },
        { i: [36, 37, 38], color: "#d7e0e8" },
        { i: [39, 40, 41], color: "#cdd7e0" },
        { i: [42, 43, 20, 23], color: "#5b6a79" },
        { i: [44, 45, 21, 22], color: "#5c6c7b" },
        { i: [20, 21, 33, 32], color: "#6b7c8c" },
        { i: [21, 22, 34, 33], color: "#657687" },
        { i: [22, 23, 35, 34], color: "#5e6f80" }
      ]
    },
    flagship: {
      scale: 3.15,
      vertices: [
        [-12, 0, -98], [12, 0, -98], [28, 0, -70], [38, 0, -24], [42, 0, 34], [34, 0, 96], [-34, 0, 96], [-42, 0, 34], [-38, 0, -24], [-28, 0, -70],
        [-10, 10, -90], [10, 10, -90], [24, 10, -66], [33, 10, -22], [36, 10, 30], [30, 10, 90], [-30, 10, 90], [-36, 10, 30], [-33, 10, -22], [-24, 10, -66],
        [-9, 18, -52], [9, 18, -52], [14, 18, -18], [16, 18, 18], [12, 18, 56], [-12, 18, 56], [-16, 18, 18], [-14, 18, -18],
        [-6, 30, -22], [6, 30, -22], [8, 30, 10], [-8, 30, 10],
        [-4, 42, -8], [4, 42, -8], [4, 42, 4], [-4, 42, 4],
        [0, 50, -2],
        [-16, 15, -76], [16, 15, -76], [0, 22, -78],
        [-12, 22, -4], [12, 22, -4], [0, 28, -2],
        [-12, 20, 40], [12, 20, 40], [0, 26, 40],
        [-2, 46, 16], [2, 46, 16], [0, 56, 16]
      ],
      faces: [
        { i: [0, 1, 2, 9], color: "#4c6076" },
        { i: [9, 2, 3, 8], color: "#425466" },
        { i: [8, 3, 4, 7], color: "#3d4f61" },
        { i: [7, 4, 5, 6], color: "#364759" },
        { i: [10, 11, 12, 19], color: "#8297ab" },
        { i: [19, 12, 13, 18], color: "#788da1" },
        { i: [18, 13, 14, 17], color: "#708599" },
        { i: [17, 14, 15, 16], color: "#677c90" },
        { i: [0, 1, 11, 10], color: "#647a90" },
        { i: [1, 2, 12, 11], color: "#5c7186" },
        { i: [2, 3, 13, 12], color: "#53687d" },
        { i: [3, 4, 14, 13], color: "#4a5e72" },
        { i: [4, 5, 15, 14], color: "#44576a" },
        { i: [5, 6, 16, 15], color: "#3e5163" },
        { i: [6, 7, 17, 16], color: "#45596c" },
        { i: [7, 8, 18, 17], color: "#4d6174" },
        { i: [8, 9, 19, 18], color: "#566a7f" },
        { i: [20, 21, 22, 27], color: "#9eb2c4" },
        { i: [27, 22, 23, 26], color: "#90a5b8" },
        { i: [26, 23, 24, 25], color: "#869bae" },
        { i: [28, 29, 30, 31], color: "#c1cfdb" },
        { i: [32, 33, 34, 35], color: "#d6e1ea" },
        { i: [32, 33, 37], color: "#f0db82" },
        { i: [33, 34, 37], color: "#d6edf5" },
        { i: [34, 35, 37], color: "#afc4d7" },
        { i: [35, 32, 37], color: "#c2d6e8" },
        { i: [38, 39, 40], color: "#d4dde6" },
        { i: [41, 42, 43], color: "#d1dbe5" },
        { i: [44, 45, 46], color: "#ced8e2" },
        { i: [46, 47, 48], color: "#c8d3df" }
      ]
    },
    hq: {
      scale: 4,
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
        [0, 52, 0],
        [-30, 0, -8],
        [-24, 10, -8],
        [30, 0, -8],
        [24, 10, -8],
        [0, 12, -34],
        [0, 20, -26]
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
        { i: [11, 8, 12], color: "#c6cbe0" },
        { i: [13, 14, 7, 3], color: "#5f5a67" },
        { i: [2, 6, 16, 15], color: "#5f5a67" },
        { i: [17, 18, 5, 4], color: "#76707e" }
      ]
    }
  };

  function createNavalShadow(THREE) {
    const geometry = new THREE.CircleGeometry(1, 18);
    const material = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.24,
      depthWrite: false
    });
    const shadow = new THREE.Mesh(geometry, material);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.6;
    shadow.renderOrder = 1;
    return shadow;
  }

  function createNavalShipGroup(THREE, kind) {
    const palette = {
      hull: 0x4f6578,
      side: 0x3d5162,
      deck: 0x8da2b5,
      bridge: 0xa8bac7,
      turret: 0x72889b,
      mast: 0xb8c6d1
    };

    const group = new THREE.Group();
    const matHull = new THREE.MeshStandardMaterial({ color: palette.hull, roughness: 0.88, metalness: 0.08, flatShading: true });
    const matSide = new THREE.MeshStandardMaterial({ color: palette.side, roughness: 0.9, metalness: 0.05, flatShading: true });
    const matDeck = new THREE.MeshStandardMaterial({ color: palette.deck, roughness: 0.78, metalness: 0.08, flatShading: true });
    const matBridge = new THREE.MeshStandardMaterial({ color: palette.bridge, roughness: 0.74, metalness: 0.09, flatShading: true });
    const matTurret = new THREE.MeshStandardMaterial({ color: palette.turret, roughness: 0.82, metalness: 0.1, flatShading: true });
    const matMast = new THREE.MeshStandardMaterial({ color: palette.mast, roughness: 0.76, metalness: 0.11, flatShading: true });

    const hull = new THREE.Mesh(new THREE.BoxGeometry(30, 10, 118), matHull);
    hull.position.y = 6;
    group.add(hull);

    const bow = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 13.5, 26, 5, 1), matSide);
    bow.rotation.x = Math.PI / 2;
    bow.rotation.z = Math.PI / 2;
    bow.position.set(0, 6.8, -70);
    group.add(bow);

    const stern = new THREE.Mesh(new THREE.BoxGeometry(22, 8, 18), matSide);
    stern.position.set(0, 5, 60);
    group.add(stern);

    const deck = new THREE.Mesh(new THREE.BoxGeometry(24, 4, 90), matDeck);
    deck.position.set(0, 11, -2);
    group.add(deck);

    const bridgeBase = new THREE.Mesh(new THREE.BoxGeometry(14, 8, 20), matBridge);
    bridgeBase.position.set(0, 15, -8);
    group.add(bridgeBase);

    const bridgeTop = new THREE.Mesh(new THREE.BoxGeometry(10, 6, 12), matBridge);
    bridgeTop.position.set(0, 21, -6);
    group.add(bridgeTop);

    const turretPositions = [-44, -20, 8, 34];
    for (let i = 0; i < turretPositions.length; i += 1) {
      const turret = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 3.6, 3.8, 8, 1), matTurret);
      turret.position.set(0, 13.5, turretPositions[i]);
      turret.rotation.y = i % 2 ? Math.PI * 0.14 : -Math.PI * 0.14;
      group.add(turret);

      const barrel = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.1, 10), matTurret);
      barrel.position.set(0, 14.4, turretPositions[i] - 7.2);
      barrel.rotation.y = turret.rotation.y;
      group.add(barrel);
    }

    const mast = new THREE.Mesh(new THREE.BoxGeometry(1.5, 18, 1.5), matMast);
    mast.position.set(0, 27, 8);
    group.add(mast);

    const mastYard = new THREE.Mesh(new THREE.BoxGeometry(11, 1, 1), matMast);
    mastYard.position.set(0, 32, 8);
    group.add(mastYard);

    if (kind === "carrier") {
      deck.scale.set(1.5, 1.1, 1.36);
      bridgeBase.scale.set(1.1, 1.2, 1.1);
      bridgeBase.position.set(8, 16, -6);
      bridgeTop.position.set(10, 23, -4);
    } else if (kind === "flagship") {
      bridgeBase.scale.set(1.2, 1.4, 1.2);
      bridgeTop.scale.set(1.3, 1.35, 1.2);
      bridgeTop.position.y = 23;
      mast.scale.y = 1.4;
      mast.position.y = 31;
      mastYard.position.y = 37;
    }

    group.add(createNavalShadow(THREE));
    return group;
  }

  function createThreeLayer(threeCanvas) {
    if (!threeCanvas || typeof window.THREE === "undefined") {
      return null;
    }

    const THREE = window.THREE;
    const renderer = new THREE.WebGLRenderer({
      canvas: threeCanvas,
      alpha: true,
      antialias: (window.devicePixelRatio || 1) < 1.75,
      powerPreference: "high-performance"
    });
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(48, 1, 1, 6800);

    const hemi = new THREE.HemisphereLight(0xb8deff, 0x1a2a34, 0.72);
    scene.add(hemi);
    const sun = new THREE.DirectionalLight(0xfff2d6, 0.88);
    sun.position.set(180, 260, -240);
    scene.add(sun);

    return {
      THREE: THREE,
      renderer: renderer,
      scene: scene,
      camera: camera,
      materials: new Map(),
      ships: new Map(),
      entities: new Map(),
      activeShipKeys: [],
      activeEntityKeys: [],
      terrainRoot: null,
      terrainStageId: null
    };
  }

  function getThreeMaterial(threeState, hex) {
    if (threeState.materials.has(hex)) {
      return threeState.materials.get(hex);
    }
    const mat = new threeState.THREE.MeshStandardMaterial({
      color: hex,
      roughness: 0.86,
      metalness: 0.06,
      flatShading: true
    });
    threeState.materials.set(hex, mat);
    return mat;
  }

  function addFaceMesh(threeState, group, vertices, face, scale) {
    if (!face.i || face.i.length < 3) {
      return;
    }
    const THREE = threeState.THREE;
    const positions = [];
    for (let i = 1; i < face.i.length - 1; i += 1) {
      const a = vertices[face.i[0]];
      const b = vertices[face.i[i]];
      const c = vertices[face.i[i + 1]];
      if (!a || !b || !c) {
        continue;
      }
      positions.push(
        a[0] * scale, a[1] * scale, a[2] * scale,
        b[0] * scale, b[1] * scale, b[2] * scale,
        c[0] * scale, c[1] * scale, c[2] * scale
      );
    }
    if (!positions.length) {
      return;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geometry.computeVertexNormals();
    group.add(new THREE.Mesh(geometry, getThreeMaterial(threeState, face.color || "#8b95a5")));
  }

  function createModelThreeGroup(threeState, model) {
    const group = new threeState.THREE.Group();
    for (let i = 0; i < model.faces.length; i += 1) {
      addFaceMesh(threeState, group, model.vertices, model.faces[i], model.scale || 1);
    }
    return group;
  }

  function createTerrainMeshGroup(threeState, mesh) {
    const group = new threeState.THREE.Group();
    for (let i = 0; i < mesh.faces.length; i += 1) {
      addFaceMesh(threeState, group, mesh.vertices, mesh.faces[i], 1);
    }
    group.position.set(mesh.pos.x, mesh.pos.y, mesh.pos.z);
    return group;
  }

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
      meshes.push(createPyramidMesh(-1100, 0, 1620, 420, 128, ["#6f684f", "#897e5c", "#817654", "#6d6346", "#5e563d"]));
      meshes.push(createPyramidMesh(-980, 12, 1530, 220, 64, ["#7f7a61", "#938a68", "#8a825f", "#776f52", "#6b634a"]));
      meshes.push(createPyramidMesh(980, 0, 1880, 460, 146, ["#6b6554", "#867e68", "#7a735e", "#665f4f", "#5a5344"]));
      meshes.push(createPyramidMesh(1150, 8, 1780, 240, 78, ["#7c765f", "#958d74", "#888067", "#746d58", "#68614e"]));
      meshes.push(createPyramidMesh(160, 0, 2460, 620, 188, ["#4e624a", "#68825e", "#5b7552", "#4e6748", "#40563b"]));
      meshes.push(createBoxMesh(120, 20, 2380, 120, 18, 80, ["#515b50", "#6f7a6d", "#636e61", "#586356", "#4c564a", "#5a6558"]));
      clouds.push({ x: -620, y: 420, z: 960, size: 90 });
      clouds.push({ x: 420, y: 460, z: 1540, size: 104 });
      clouds.push({ x: 80, y: 380, z: 2240, size: 126 });
    }

    if (terrain === "open-ocean") {
      clouds.push({ x: -280, y: 360, z: 900, size: 82 });
      clouds.push({ x: 460, y: 410, z: 1380, size: 110 });
      clouds.push({ x: 20, y: 345, z: 1980, size: 124 });
      clouds.push({ x: -520, y: 390, z: 2360, size: 96 });
    }

    if (terrain === "mountain") {
      meshes.push(createPyramidMesh(0, 0, 1880, 760, 190, ["#6a745c", "#7f8a6f", "#768164", "#667156", "#59634a"]));
      meshes.push(createPyramidMesh(-520, 0, 1260, 460, 126, ["#5f6a52", "#758061", "#6d785b", "#5f6b4e", "#535e45"]));
      meshes.push(createPyramidMesh(520, 0, 1260, 460, 126, ["#5f6a52", "#758061", "#6d785b", "#5f6b4e", "#535e45"]));
      meshes.push(createPyramidMesh(-230, 0, 1650, 280, 84, ["#66604f", "#7b735d", "#716a56", "#625b4a", "#574f41"]));
      meshes.push(createPyramidMesh(230, 0, 1650, 280, 84, ["#66604f", "#7b735d", "#716a56", "#625b4a", "#574f41"]));
      meshes.push(createBoxMesh(0, 40, 1880, 340, 20, 240, ["#52505a", "#9693a0", "#74717c", "#63606b", "#4e4b55", "#5b5863"]));
      meshes.push(createBoxMesh(0, 18, 1760, 540, 8, 360, ["#3e473e", "#556056", "#4b554b", "#434c43", "#394239", "#454f45"]));
      clouds.push({ x: -420, y: 430, z: 980, size: 92 });
      clouds.push({ x: 360, y: 400, z: 1320, size: 88 });
      clouds.push({ x: 40, y: 500, z: 1720, size: 120 });
    }

    if (terrain === "metropolis") {
      meshes.push(createBoxMesh(0, 3, 1650, 1400, 3, 2050, ["#3f464f", "#5a636f", "#4b535d", "#444b55", "#3d434d", "#49515c"]));
      meshes.push(createBoxMesh(-780, 155, 980, 140, 155, 140, ["#4f5660", "#7a828d", "#5f6772", "#58606b", "#505762", "#656e79"]));
      meshes.push(createBoxMesh(-460, 130, 980, 128, 130, 128, ["#48515b", "#727c88", "#59636e", "#535c67", "#4c5560", "#626c77"]));
      meshes.push(createBoxMesh(-120, 145, 980, 132, 145, 132, ["#4c5561", "#757f8b", "#5c6672", "#56606c", "#4f5964", "#646f7b"]));
      meshes.push(createBoxMesh(220, 125, 980, 124, 125, 124, ["#505865", "#788390", "#606a77", "#5a6471", "#535d69", "#687482"]));
      meshes.push(createBoxMesh(560, 160, 980, 138, 160, 138, ["#4a525d", "#737d89", "#5a6370", "#545d6a", "#4d5663", "#636d79"]));
      meshes.push(createBoxMesh(860, 110, 980, 112, 110, 112, ["#515a65", "#79838f", "#616a76", "#5b6470", "#545d69", "#69737f"]));
      meshes.push(createBoxMesh(-860, 135, 1320, 126, 135, 126, ["#4a535e", "#737d89", "#5b6471", "#555f6b", "#4e5863", "#646e7a"]));
      meshes.push(createBoxMesh(-520, 170, 1320, 144, 170, 144, ["#47505b", "#707a86", "#57616d", "#515b67", "#4a5460", "#606a76"]));
      meshes.push(createBoxMesh(-220, 105, 1320, 118, 105, 118, ["#535d68", "#7d8793", "#636d79", "#5d6673", "#56606c", "#6b7581"]));
      meshes.push(createBoxMesh(120, 180, 1320, 152, 180, 152, ["#46505a", "#6e7985", "#56606c", "#505a66", "#49535f", "#5f6a76"]));
      meshes.push(createBoxMesh(460, 115, 1320, 118, 115, 118, ["#4f5863", "#78828e", "#5f6975", "#59626f", "#525c68", "#67717d"]));
      meshes.push(createBoxMesh(820, 150, 1320, 136, 150, 136, ["#49525d", "#727c88", "#59626e", "#535c68", "#4c5561", "#626c78"]));
      meshes.push(createBoxMesh(-740, 120, 1660, 122, 120, 122, ["#4c5661", "#75808c", "#5d6773", "#57616d", "#505a66", "#65707c"]));
      meshes.push(createBoxMesh(-420, 165, 1660, 148, 165, 148, ["#46505a", "#6f7a86", "#56616d", "#505a66", "#49535f", "#606b77"]));
      meshes.push(createBoxMesh(-80, 140, 1660, 132, 140, 132, ["#4d5662", "#76808d", "#5d6774", "#57616e", "#505966", "#66717e"]));
      meshes.push(createBoxMesh(280, 160, 1660, 138, 160, 138, ["#47515b", "#707b87", "#57616d", "#515b67", "#4a5460", "#616b77"]));
      meshes.push(createBoxMesh(620, 125, 1660, 126, 125, 126, ["#505a66", "#798490", "#606b77", "#5a6471", "#535d69", "#697480"]));
      meshes.push(createBoxMesh(900, 105, 1660, 110, 105, 110, ["#535d69", "#7d8793", "#636d79", "#5d6673", "#56606c", "#6b7581"]));
      meshes.push(createBoxMesh(-860, 110, 2020, 112, 110, 112, ["#4f5863", "#78828e", "#5f6975", "#59626f", "#525c68", "#67717d"]));
      meshes.push(createBoxMesh(-560, 155, 2020, 138, 155, 138, ["#49525d", "#727c88", "#59626e", "#535c68", "#4c5561", "#626c78"]));
      meshes.push(createBoxMesh(-220, 195, 2020, 154, 195, 154, ["#444d57", "#6c7782", "#545f6a", "#4e5863", "#47515b", "#5d6873"]));
      meshes.push(createBoxMesh(140, 150, 2020, 136, 150, 136, ["#4b5460", "#747f8b", "#5b6571", "#555f6b", "#4e5863", "#646f7a"]));
      meshes.push(createBoxMesh(500, 175, 2020, 146, 175, 146, ["#45505a", "#6e7985", "#55606b", "#4f5964", "#48535d", "#5f6a75"]));
      meshes.push(createBoxMesh(860, 120, 2020, 120, 120, 120, ["#525c67", "#7b8591", "#626d78", "#5c6671", "#555f6a", "#6a747f"]));
      meshes.push(createBoxMesh(-700, 145, 2380, 134, 145, 134, ["#4a535f", "#737e8a", "#5a6470", "#545e6a", "#4d5762", "#636d79"]));
      meshes.push(createBoxMesh(-360, 110, 2380, 116, 110, 116, ["#55606b", "#7f8a96", "#66717d", "#606a76", "#59636e", "#6e7984"]));
      meshes.push(createBoxMesh(-20, 170, 2380, 144, 170, 144, ["#47515b", "#707b87", "#57616d", "#515b67", "#4a5460", "#616b77"]));
      meshes.push(createBoxMesh(320, 125, 2380, 124, 125, 124, ["#515b66", "#7a8490", "#616b77", "#5b6571", "#545e69", "#697480"]));
      meshes.push(createBoxMesh(660, 160, 2380, 138, 160, 138, ["#48525d", "#717c88", "#58626e", "#525c68", "#4b5560", "#616b77"]));
      meshes.push(createBoxMesh(940, 100, 2380, 108, 100, 108, ["#57616c", "#818b97", "#67727d", "#616b76", "#5a646e", "#6f7984"]));
      meshes.push(createBoxMesh(-310, 12, 1110, 420, 8, 40, ["#2f353c", "#49505a", "#3e454f", "#373d46", "#313740", "#3a414b"]));
      meshes.push(createBoxMesh(350, 12, 1470, 560, 8, 40, ["#2f353c", "#49505a", "#3e454f", "#373d46", "#313740", "#3a414b"]));
      meshes.push(createBoxMesh(-210, 12, 1830, 620, 8, 40, ["#2f353c", "#49505a", "#3e454f", "#373d46", "#313740", "#3a414b"]));
      meshes.push(createBoxMesh(190, 12, 2190, 520, 8, 40, ["#2f353c", "#49505a", "#3e454f", "#373d46", "#313740", "#3a414b"]));
      clouds.push({ x: -340, y: 560, z: 1180, size: 84 });
      clouds.push({ x: 420, y: 520, z: 1760, size: 92 });
      clouds.push({ x: 20, y: 600, z: 2340, size: 110 });
    }

    terrainCache[stage.id] = { meshes: meshes, clouds: clouds };
    return terrainCache[stage.id];
  }

  function createRenderer(canvas, threeCanvas) {
    const ctx = canvas.getContext("2d");
    const renderer = {
      canvas: canvas,
      ctx: ctx,
      width: 0,
      height: 0,
      pixelRatio: Math.min(window.devicePixelRatio || 1, 2),
      three: createThreeLayer(threeCanvas)
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

      if (renderer.three) {
        renderer.three.renderer.setPixelRatio(renderer.pixelRatio);
        renderer.three.renderer.setSize(width, height, false);
      }
    }

    function buildCamera(player) {
      const lookPitch = player.pitch * 0.92 + (player.cameraPitchBias || 0);
      const basis = Math3D.basisFromAngles(lookPitch, player.yaw, player.roll * 0.65);
      const pos = Math3D.add(
        Math3D.add(player.pos, Math3D.scale(basis.forward, CONFIG.camera.cockpitForward)),
        Math3D.scale(basis.up, CONFIG.camera.cockpitHeight)
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

    function getHorizonY(camera) {
      const horizonProbe = projectPoint({ x: camera.pos.x + camera.forward.x * 2800, y: 0, z: camera.pos.z + camera.forward.z * 2800 }, camera);
      const fallback = renderer.height * 0.52;
      return Math3D.clamp(horizonProbe ? horizonProbe.y : fallback, renderer.height * 0.12, renderer.height * 0.9);
    }

    function drawSky(environment, player, camera, horizonY) {
      const look = Math3D.clamp(camera.forward.y, -0.95, 0.95);
      const sky = ctx.createLinearGradient(0, 0, 0, horizonY);
      sky.addColorStop(0, environment.skyTop);
      sky.addColorStop(0.78, environment.skyBottom);
      sky.addColorStop(1, environment.haze);
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, renderer.width, horizonY + 2);

      ctx.fillStyle = environment.sunColor;
      ctx.beginPath();
      ctx.arc(renderer.width * 0.78, renderer.height * 0.2, 110, 0, Math.PI * 2);
      ctx.fill();

      const hazeOffset = Math.max(-120, Math.min(120, -camera.forward.y * 240));
      ctx.fillStyle = environment.haze;
      ctx.fillRect(0, horizonY - 40 + hazeOffset * 0.2, renderer.width, renderer.height * 0.2);
    }

    function drawOcean(camera, player, environment, horizonY) {
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
      for (let x = -14; x <= 14; x += 1) {
        const xPos = baseX + x * step;
        const start = projectPoint({ x: xPos, y: 0, z: baseZ - 700 }, camera);
        const end = projectPoint({ x: xPos, y: 0, z: baseZ + 6200 }, camera);
        if (!start || !end) {
          continue;
        }
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
      }
      for (let z = 0; z <= 34; z += 1) {
        const zPos = baseZ + z * step;
        const start = projectPoint({ x: baseX - 3000, y: 0, z: zPos }, camera);
        const end = projectPoint({ x: baseX + 3000, y: 0, z: zPos }, camera);
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
        if (worldPoints.length < 3 || worldPoints.indexOf(undefined) !== -1) {
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
      if (!model) {
        return;
      }
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
        if (worldPoints.length < 3 || worldPoints.indexOf(undefined) !== -1) {
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

        if (projectile.kind === "missile" || projectile.kind === "enemyMissile") {
          drawMissileProjectile(projectile, start, end);
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

    function drawMissileProjectile(projectile, start, end) {
      const missileLength = Math.max(12, projectile.radius * end.scale * 1.55);
      const bodyWidth = Math.max(3.5, projectile.radius * end.scale * 0.28);
      let dirX = 0;
      let dirY = -1;

      if (start) {
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const mag = Math.hypot(dx, dy);
        if (mag > 0.001) {
          dirX = dx / mag;
          dirY = dy / mag;
        }
      }

      const perpX = -dirY;
      const perpY = dirX;

      const noseX = end.x + dirX * missileLength * 0.6;
      const noseY = end.y + dirY * missileLength * 0.6;
      const tailX = end.x - dirX * missileLength * 0.68;
      const tailY = end.y - dirY * missileLength * 0.68;

      if (start) {
        const glow = ctx.createLinearGradient(tailX, tailY, start.x, start.y);
        glow.addColorStop(0, projectile.ownerTeam === "player" ? "rgba(255, 196, 98, 0.52)" : "rgba(255, 142, 118, 0.5)");
        glow.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx.strokeStyle = glow;
        ctx.lineWidth = Math.max(4, bodyWidth * 1.35);
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(start.x, start.y);
        ctx.stroke();
      }

      const finSpan = bodyWidth * 2.1;
      const finOffset = missileLength * 0.22;
      ctx.fillStyle = "rgba(230, 235, 242, 0.92)";
      ctx.beginPath();
      ctx.moveTo(tailX + dirX * finOffset + perpX * bodyWidth * 0.5, tailY + dirY * finOffset + perpY * bodyWidth * 0.5);
      ctx.lineTo(tailX + dirX * (finOffset + bodyWidth * 0.4) + perpX * finSpan, tailY + dirY * (finOffset + bodyWidth * 0.4) + perpY * finSpan);
      ctx.lineTo(tailX + dirX * (finOffset - bodyWidth * 0.8), tailY + dirY * (finOffset - bodyWidth * 0.8));
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(tailX + dirX * finOffset - perpX * bodyWidth * 0.5, tailY + dirY * finOffset - perpY * bodyWidth * 0.5);
      ctx.lineTo(tailX + dirX * (finOffset + bodyWidth * 0.4) - perpX * finSpan, tailY + dirY * (finOffset + bodyWidth * 0.4) - perpY * finSpan);
      ctx.lineTo(tailX + dirX * (finOffset - bodyWidth * 0.8), tailY + dirY * (finOffset - bodyWidth * 0.8));
      ctx.closePath();
      ctx.fill();

      const bodyGradient = ctx.createLinearGradient(noseX, noseY, tailX, tailY);
      bodyGradient.addColorStop(0, "rgba(248, 249, 252, 0.98)");
      bodyGradient.addColorStop(0.45, "rgba(216, 222, 230, 0.95)");
      bodyGradient.addColorStop(1, "rgba(168, 176, 188, 0.9)");
      ctx.strokeStyle = bodyGradient;
      ctx.lineWidth = bodyWidth;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(noseX, noseY);
      ctx.lineTo(tailX, tailY);
      ctx.stroke();

      const bandX = end.x - dirX * missileLength * 0.15;
      const bandY = end.y - dirY * missileLength * 0.15;
      ctx.strokeStyle = "rgba(76, 126, 168, 0.95)";
      ctx.lineWidth = Math.max(1.5, bodyWidth * 0.42);
      ctx.beginPath();
      ctx.moveTo(bandX + perpX * bodyWidth * 0.72, bandY + perpY * bodyWidth * 0.72);
      ctx.lineTo(bandX - perpX * bodyWidth * 0.72, bandY - perpY * bodyWidth * 0.72);
      ctx.stroke();

      const engineGlow = ctx.createRadialGradient(tailX, tailY, 0, tailX, tailY, bodyWidth * 2.7);
      engineGlow.addColorStop(0, projectile.ownerTeam === "player" ? "rgba(255, 234, 170, 0.95)" : "rgba(255, 178, 148, 0.95)");
      engineGlow.addColorStop(0.5, projectile.ownerTeam === "player" ? "rgba(255, 170, 76, 0.55)" : "rgba(255, 122, 92, 0.5)");
      engineGlow.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = engineGlow;
      ctx.beginPath();
      ctx.arc(tailX, tailY, bodyWidth * 2.7, 0, Math.PI * 2);
      ctx.fill();
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

    function drawLockMarker(lock, camera, clock) {
      if (!lock || !lock.alive) {
        return;
      }
      const projected = projectPoint(lock.pos, camera);
      if (!projected) {
        return;
      }
      const size = Math.max(24, 320 / projected.z * 34);
      const pulse = 0.65 + Math.sin(clock * 12) * 0.35;

      ctx.strokeStyle = "rgba(255, 232, 126, 0.98)";
      ctx.lineWidth = 2.6;
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

      ctx.strokeStyle = "rgba(255, 90, 90, " + (0.5 + pulse * 0.45) + ")";
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(projected.x, projected.y, size * (0.42 + pulse * 0.12), 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = "rgba(255, 239, 170, 0.84)";
      ctx.beginPath();
      ctx.moveTo(projected.x - size * 0.24, projected.y);
      ctx.lineTo(projected.x + size * 0.24, projected.y);
      ctx.moveTo(projected.x, projected.y - size * 0.24);
      ctx.lineTo(projected.x, projected.y + size * 0.24);
      ctx.stroke();

      ctx.fillStyle = "rgba(16, 18, 22, 0.66)";
      ctx.fillRect(projected.x - 34, projected.y - size - 22, 68, 16);
      ctx.fillStyle = "rgba(255, 224, 130, 0.95)";
      ctx.font = "bold 11px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("LOCK", projected.x, projected.y - size - 10);
    }

    function syncThreeCamera(cameraBasis) {
      if (!renderer.three) {
        return;
      }
      const threeState = renderer.three;
      const threeCam = threeState.camera;
      const fovY = 2 * Math.atan(renderer.height / (2 * CONFIG.camera.fov)) * (180 / Math.PI);
      threeCam.fov = Math.max(24, Math.min(86, fovY));
      threeCam.aspect = renderer.width / Math.max(1, renderer.height);
      threeCam.updateProjectionMatrix();

      threeCam.position.set(cameraBasis.pos.x, cameraBasis.pos.y, cameraBasis.pos.z);
      const target = new threeState.THREE.Vector3(
        cameraBasis.pos.x + cameraBasis.forward.x,
        cameraBasis.pos.y + cameraBasis.forward.y,
        cameraBasis.pos.z + cameraBasis.forward.z
      );
      threeCam.up.set(cameraBasis.up.x, cameraBasis.up.y, cameraBasis.up.z);
      threeCam.lookAt(target);
    }

    function syncTerrainThreeLayer(stage, terrain) {
      if (!renderer.three) {
        return;
      }
      const threeState = renderer.three;
      if (threeState.terrainStageId === stage.id && threeState.terrainRoot) {
        return;
      }
      if (threeState.terrainRoot) {
        threeState.scene.remove(threeState.terrainRoot);
      }
      const root = new threeState.THREE.Group();
      for (let i = 0; i < terrain.meshes.length; i += 1) {
        root.add(createTerrainMeshGroup(threeState, terrain.meshes[i]));
      }
      threeState.scene.add(root);
      threeState.terrainRoot = root;
      threeState.terrainStageId = stage.id;
    }

    function renderThreeLayer(stage, terrain, enemies, cameraBasis) {
      if (!renderer.three) {
        return;
      }
      const threeState = renderer.three;
      syncThreeCamera(cameraBasis);
      syncTerrainThreeLayer(stage, terrain);

      threeState.activeShipKeys.length = 0;
      threeState.activeEntityKeys.length = 0;
      for (let i = 0; i < enemies.length; i += 1) {
        const enemy = enemies[i];
        if (!enemy.alive) {
          continue;
        }
        const key = enemy.id || (enemy.name + "-" + enemy.kind + "-" + i);
        const distance = Math3D.length(Math3D.sub(enemy.pos, cameraBasis.pos));

        if (NAVAL_KINDS[enemy.kind]) {
          let ship = threeState.ships.get(key);
          if (!ship) {
            ship = createNavalShipGroup(threeState.THREE, enemy.kind);
            threeState.scene.add(ship);
            threeState.ships.set(key, ship);
          }
          const lodScale = Math3D.clamp(1.12 - distance / 4800, 0.84, 1.1);
          const typeScale = enemy.kind === "carrier" ? 1.42 : enemy.kind === "flagship" ? 1.6 : 1.18;
          ship.scale.setScalar(typeScale * lodScale);
          ship.position.set(enemy.pos.x, enemy.pos.y + 0.4, enemy.pos.z);
          ship.rotation.set(enemy.pitch * 0.35, enemy.yaw, enemy.roll * 0.5);

          const shadow = ship.children[ship.children.length - 1];
          if (shadow) {
            shadow.scale.set(24 * typeScale, 13 * typeScale, 1);
            shadow.material.opacity = Math3D.clamp(0.3 - distance / 9000, 0.08, 0.26);
          }

          threeState.activeShipKeys.push(key);
          continue;
        }

        if (!THREE_MODEL_KINDS[enemy.kind]) {
          continue;
        }

        let entityMesh = threeState.entities.get(key);
        if (!entityMesh) {
          entityMesh = createModelThreeGroup(threeState, MODELS[enemy.kind]);
          threeState.scene.add(entityMesh);
          threeState.entities.set(key, entityMesh);
        }
        const lodScale = Math3D.clamp(1.16 - distance / 5200, 0.82, 1.05);
        entityMesh.scale.setScalar(lodScale);
        entityMesh.position.set(enemy.pos.x, enemy.pos.y, enemy.pos.z);
        entityMesh.rotation.set(enemy.pitch, enemy.yaw, enemy.roll);
        threeState.activeEntityKeys.push(key);
      }

      threeState.ships.forEach(function (mesh, key) {
        mesh.visible = threeState.activeShipKeys.indexOf(key) !== -1;
      });
      threeState.entities.forEach(function (mesh, key) {
        mesh.visible = threeState.activeEntityKeys.indexOf(key) !== -1;
      });

      threeState.renderer.render(threeState.scene, threeState.camera);
    }

    function render(game) {
      resize();
      const stage = game.currentStage;
      const environment = stage.environment;
      const state = game.stageState;
      const player = state.player;
      const camera = buildCamera(player);
      const terrain = buildTerrain(stage);

      const horizonY = getHorizonY(camera);
      drawSky(environment, player, camera, horizonY);
      drawOcean(camera, player, environment, horizonY);
      drawClouds(terrain.clouds, camera);

      const polygons = [];
      if (!renderer.three) {
        for (let i = 0; i < terrain.meshes.length; i += 1) {
          pushMeshPolygons(polygons, terrain.meshes[i], camera, 0);
        }
      }
      for (let i = 0; i < state.enemies.length; i += 1) {
        const enemy = state.enemies[i];
        if (enemy.alive && !(renderer.three && (NAVAL_KINDS[enemy.kind] || THREE_MODEL_KINDS[enemy.kind]))) {
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

      renderThreeLayer(stage, terrain, state.enemies, camera);
      drawProjectiles(state.projectiles, camera);
      drawParticles(state.particles, camera);
      drawLockMarker(game.targetLock, camera, game.clock);
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
