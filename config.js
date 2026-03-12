(function () {
  const SkyDominion = window.SkyDominion || (window.SkyDominion = {});

  const stage1Enemies = [
    { kind: "fighter", name: "敵戦闘機 アルファ", x: -520, y: 230, z: 420, yaw: 2.8 },
    { kind: "fighter", name: "敵戦闘機 ベータ", x: 480, y: 250, z: 600, yaw: 3.2 },
    { kind: "fighter", name: "敵戦闘機 ガンマ", x: -180, y: 210, z: 860, yaw: 3.1 },
    { kind: "fighter", name: "敵戦闘機 デルタ", x: 120, y: 240, z: 980, yaw: 3.05 },
    { kind: "sam", name: "沿岸SAM-1", x: -640, y: 18, z: 1020 },
    { kind: "sam", name: "沿岸SAM-2", x: 620, y: 18, z: 1260 }
  ];

  const stage2Enemies = [
    { kind: "flagship", name: "敵主艦 オケアノス", x: 0, y: 8, z: 1680, hp: 4 },
    { kind: "battleship", name: "護衛艦 ヒュドラ", x: -360, y: 8, z: 1520, hp: 2 },
    { kind: "battleship", name: "護衛艦 ネレウス", x: 360, y: 8, z: 1540, hp: 2 },
    { kind: "fighter", name: "迎撃機 ランス1", x: -620, y: 260, z: 1080, yaw: 3.1 },
    { kind: "fighter", name: "迎撃機 ランス2", x: -140, y: 240, z: 920, yaw: 3.0 },
    { kind: "fighter", name: "迎撃機 ランス3", x: 140, y: 240, z: 920, yaw: 3.2 },
    { kind: "fighter", name: "迎撃機 ランス4", x: 620, y: 260, z: 1080, yaw: 3.2 },
    { kind: "sam", name: "艦載SAM 左舷", x: -480, y: 12, z: 1400 },
    { kind: "sam", name: "艦載SAM 右舷", x: 480, y: 12, z: 1420 }
  ];

  const stage3Enemies = [
    { kind: "hq", name: "敵司令本部 バスティオン", x: 0, y: 70, z: 1880, hp: 5 },
    { kind: "sam", name: "山稜SAM-1", x: -520, y: 36, z: 1260 },
    { kind: "sam", name: "山稜SAM-2", x: 520, y: 36, z: 1260 },
    { kind: "sam", name: "内周SAM-1", x: -220, y: 52, z: 1660 },
    { kind: "sam", name: "内周SAM-2", x: 220, y: 52, z: 1660 },
    { kind: "fighter", name: "防空機 タロン1", x: -760, y: 320, z: 1320, yaw: 3.05 },
    { kind: "fighter", name: "防空機 タロン2", x: 760, y: 320, z: 1320, yaw: 3.25 },
    { kind: "fighter", name: "防空機 タロン3", x: -160, y: 280, z: 1040, yaw: 3.05 },
    { kind: "fighter", name: "防空機 タロン4", x: 160, y: 280, z: 1040, yaw: 3.2 }
  ];

  SkyDominion.CONFIG = {
    title: "空軍無双",
    player: {
      maxHealth: 3,
      maxAmmo: 20,
      ammoRegenInterval: 3,
      minSpeed: 125,
      maxSpeed: 320,
      startSpeed: 210,
      strafeSpeed: 150,
      verticalSpeed: 130,
      missileDamage: 1,
      missileCooldown: 0.42,
      collisionRadius: 16
    },
    camera: {
      near: 1,
      fov: 500,
      chaseDistance: 74,
      chaseHeight: 20
    },
    world: {
      ceiling: 660,
      floor: 8,
      oceanLevel: 0,
      radarRange: 2200
    },
    stages: [
      {
        id: "coastal-intercept",
        name: "ステージ1 / 沿岸迎撃戦",
        shortName: "沿岸迎撃戦",
        objective: "沿岸の戦闘機隊とSAM陣地を全滅させろ",
        completionLabel: "全目標の無力化",
        environment: {
          skyTop: "#5f84b6",
          skyBottom: "#f59f6f",
          seaTop: "#22496f",
          seaBottom: "#081017",
          haze: "rgba(255, 200, 150, 0.18)",
          sunColor: "rgba(255, 221, 158, 0.22)",
          terrainType: "archipelago"
        },
        missionType: "eliminate_all",
        playerStart: { x: 0, y: 210, z: -320, yaw: 0, pitch: 0.04, roll: 0 },
        enemies: stage1Enemies
      },
      {
        id: "harbor-spear",
        name: "ステージ2 / 港湾強襲",
        shortName: "港湾強襲",
        objective: "護衛網を突破して敵主艦を撃沈せよ",
        completionLabel: "主艦撃沈",
        environment: {
          skyTop: "#83a8d7",
          skyBottom: "#f0d099",
          seaTop: "#315e85",
          seaBottom: "#0a1320",
          haze: "rgba(255, 255, 255, 0.12)",
          sunColor: "rgba(255, 239, 181, 0.18)",
          terrainType: "harbor"
        },
        missionType: "destroy_flagship",
        primaryTargetName: "敵主艦 オケアノス",
        playerStart: { x: 0, y: 230, z: -380, yaw: 0, pitch: 0.02, roll: 0 },
        enemies: stage2Enemies
      },
      {
        id: "mountain-crown",
        name: "ステージ3 / 山岳司令部",
        shortName: "山岳司令部",
        objective: "山岳本部を破壊し最終防衛線を崩壊させろ",
        completionLabel: "司令本部壊滅",
        environment: {
          skyTop: "#95a2d3",
          skyBottom: "#edb386",
          seaTop: "#22354e",
          seaBottom: "#070d14",
          haze: "rgba(255, 220, 190, 0.1)",
          sunColor: "rgba(255, 244, 210, 0.15)",
          terrainType: "mountain"
        },
        missionType: "destroy_hq",
        primaryTargetName: "敵司令本部 バスティオン",
        playerStart: { x: 0, y: 260, z: -440, yaw: 0, pitch: 0.01, roll: 0 },
        enemies: stage3Enemies
      }
    ]
  };
})();
