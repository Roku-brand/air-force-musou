(function () {
  const SkyDominion = window.SkyDominion || (window.SkyDominion = {});

  const stage1Enemies = [
    { kind: "fighter", name: "敵戦闘機 アルファ", x: -920, y: 250, z: 840, yaw: 2.8 },
    { kind: "fighter", name: "敵戦闘機 ベータ", x: 860, y: 290, z: 1060, yaw: 3.2 },
    { kind: "fighter", name: "敵戦闘機 ガンマ", x: -420, y: 240, z: 1360, yaw: 3.1 },
    { kind: "fighter", name: "敵戦闘機 デルタ", x: 360, y: 300, z: 1520, yaw: 3.05 },
    { kind: "fighter", name: "敵戦闘機 イプシロン", x: -120, y: 340, z: 1780, yaw: 3.02 }
  ];

  const stage2Enemies = [
    { kind: "battleship", name: "重巡洋艦 ヴォルカ", x: -860, y: 0, z: 1080, yaw: 3.14 },
    { kind: "carrier", name: "空母 アトラス", x: 860, y: 0, z: 1080, yaw: 3.14 },
    { kind: "battleship", name: "駆逐艦 ストーム", x: -340, y: 0, z: 1420, yaw: 3.14 },
    { kind: "battleship", name: "駆逐艦 ガスト", x: 340, y: 0, z: 1420, yaw: 3.14 },
    { kind: "flagship", name: "旗艦 リヴァイアサン", x: 0, y: 0, z: 1880, yaw: 3.14 }
  ];

  const stage3Enemies = [
    { kind: "sam", name: "防空砲台 オービットL", x: -740, y: 0, z: 1260, yaw: 3.1 },
    { kind: "sam", name: "防空砲台 オービットR", x: 740, y: 0, z: 1260, yaw: 3.18 },
    { kind: "sam", name: "防空砲台 ヘリオスL", x: -420, y: 0, z: 1680, yaw: 3.1 },
    { kind: "sam", name: "防空砲台 ヘリオスR", x: 420, y: 0, z: 1680, yaw: 3.18 },
    { kind: "hq", name: "軍事基地 アイアンドーム", x: 0, y: 0, z: 2180, yaw: 3.14 }
  ];

  const stage4Enemies = [
    { kind: "fighter", name: "迎撃機 ヴァイス1", x: -620, y: 220, z: 920, yaw: 2.9 },
    { kind: "fighter", name: "迎撃機 ヴァイス2", x: 620, y: 240, z: 980, yaw: 3.2 },
    { kind: "fighter", name: "迎撃機 ヴァイス3", x: -260, y: 300, z: 1240, yaw: 3.05 },
    { kind: "fighter", name: "迎撃機 ヴァイス4", x: 240, y: 280, z: 1310, yaw: 3.12 },
    { kind: "fighter", name: "迎撃機 ヴァイス5", x: -720, y: 340, z: 1580, yaw: 2.88 },
    { kind: "fighter", name: "迎撃機 ヴァイス6", x: 740, y: 360, z: 1660, yaw: 3.2 },
    { kind: "fighter", name: "迎撃機 ヴァイス7", x: -160, y: 420, z: 1960, yaw: 3.06 },
    { kind: "fighter", name: "迎撃機 ヴァイス8", x: 180, y: 410, z: 2040, yaw: 3.1 }
  ];

  const stage4Obstacles = [
    { type: "building", x: -780, z: 980, radius: 150, height: 310 },
    { type: "building", x: -460, z: 980, radius: 136, height: 260 },
    { type: "building", x: -120, z: 980, radius: 142, height: 290 },
    { type: "building", x: 220, z: 980, radius: 132, height: 250 },
    { type: "building", x: 560, z: 980, radius: 148, height: 320 },
    { type: "building", x: 860, z: 980, radius: 120, height: 220 },
    { type: "building", x: -860, z: 1320, radius: 138, height: 270 },
    { type: "building", x: -520, z: 1320, radius: 152, height: 340 },
    { type: "building", x: -220, z: 1320, radius: 126, height: 210 },
    { type: "building", x: 120, z: 1320, radius: 160, height: 360 },
    { type: "building", x: 460, z: 1320, radius: 126, height: 230 },
    { type: "building", x: 820, z: 1320, radius: 146, height: 300 },
    { type: "building", x: -740, z: 1660, radius: 130, height: 240 },
    { type: "building", x: -420, z: 1660, radius: 154, height: 330 },
    { type: "building", x: -80, z: 1660, radius: 136, height: 280 },
    { type: "building", x: 280, z: 1660, radius: 148, height: 320 },
    { type: "building", x: 620, z: 1660, radius: 132, height: 250 },
    { type: "building", x: 900, z: 1660, radius: 118, height: 210 },
    { type: "building", x: -860, z: 2020, radius: 120, height: 220 },
    { type: "building", x: -560, z: 2020, radius: 148, height: 310 },
    { type: "building", x: -220, z: 2020, radius: 162, height: 390 },
    { type: "building", x: 140, z: 2020, radius: 146, height: 300 },
    { type: "building", x: 500, z: 2020, radius: 154, height: 350 },
    { type: "building", x: 860, z: 2020, radius: 126, height: 240 },
    { type: "building", x: -700, z: 2380, radius: 140, height: 290 },
    { type: "building", x: -360, z: 2380, radius: 122, height: 220 },
    { type: "building", x: -20, z: 2380, radius: 156, height: 340 },
    { type: "building", x: 320, z: 2380, radius: 130, height: 250 },
    { type: "building", x: 660, z: 2380, radius: 146, height: 320 },
    { type: "building", x: 940, z: 2380, radius: 114, height: 200 }
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
      cockpitForward: 10,
      cockpitHeight: 6
    },
    targeting: {
      maxLockDistance: 2200,
      minAlignment: 0.62,
      leadTime: 0.55,
      lockStickinessBonus: 0.28
    },
    world: {
      ceiling: 920,
      floor: 0,
      oceanLevel: 0,
      radarRange: 4200
    },
    stages: [
      {
        id: "coastal-intercept",
        name: "ステージ1 / 沿岸迎撃戦",
        shortName: "沿岸迎撃戦",
        objective: "沿岸空域を巡回する敵戦闘機隊を全滅させろ",
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
        enemies: stage1Enemies,
        obstacles: [
          { type: "island", x: -1100, z: 1620, radius: 240, height: 170 },
          { type: "island", x: 980, z: 1880, radius: 260, height: 190 },
          { type: "island", x: 160, z: 2460, radius: 320, height: 230 }
        ]
      },
      {
        id: "harbor-spear",
        name: "ステージ2 / 大洋艦隊決戦",
        shortName: "大洋艦隊決戦",
        objective: "外洋で敵主力艦隊を撃滅し制海権を奪取せよ",
        completionLabel: "敵艦隊壊滅",
        environment: {
          skyTop: "#83a8d7",
          skyBottom: "#f0d099",
          seaTop: "#315e85",
          seaBottom: "#0a1320",
          haze: "rgba(255, 255, 255, 0.12)",
          sunColor: "rgba(255, 239, 181, 0.18)",
          terrainType: "open-ocean"
        },
        missionType: "eliminate_all",
        playerStart: { x: 0, y: 230, z: -380, yaw: 0, pitch: 0.02, roll: 0 },
        enemies: stage2Enemies,
        obstacles: []
      },
      {
        id: "mountain-crown",
        name: "ステージ3 / 軍事基地制圧",
        shortName: "軍事基地制圧",
        objective: "山岳地帯の軍事基地を制圧し作戦を完遂せよ",
        completionLabel: "軍事基地の無力化",
        environment: {
          skyTop: "#95a2d3",
          skyBottom: "#edb386",
          seaTop: "#22354e",
          seaBottom: "#070d14",
          haze: "rgba(255, 220, 190, 0.1)",
          sunColor: "rgba(255, 244, 210, 0.15)",
          terrainType: "mountain"
        },
        missionType: "eliminate_all",
        playerStart: { x: 0, y: 260, z: -440, yaw: 0, pitch: 0.01, roll: 0 },
        enemies: stage3Enemies,
        obstacles: [
          { type: "mountain", x: 0, z: 1880, radius: 380, height: 250 },
          { type: "mountain", x: -520, z: 1260, radius: 240, height: 180 },
          { type: "mountain", x: 520, z: 1260, radius: 240, height: 180 }
        ]
      },
      {
        id: "urban-tempest",
        name: "ステージ4 / 市街地制空戦",
        shortName: "市街地制空戦",
        objective: "超高層ビル群を縫って侵入した敵航空隊を迎撃せよ",
        completionLabel: "敵航空隊壊滅",
        environment: {
          skyTop: "#86a1c4",
          skyBottom: "#f0b07e",
          seaTop: "#20364d",
          seaBottom: "#050b12",
          haze: "rgba(195, 205, 220, 0.16)",
          sunColor: "rgba(255, 230, 190, 0.16)",
          terrainType: "metropolis"
        },
        missionType: "eliminate_all",
        playerStart: { x: 0, y: 300, z: -520, yaw: 0, pitch: 0.03, roll: 0 },
        enemies: stage4Enemies,
        obstacles: stage4Obstacles
      }
    ]
  };
})();
