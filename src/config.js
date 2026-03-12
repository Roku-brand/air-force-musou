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
    { kind: "fighter", name: "迎撃機 ランス1", x: -980, y: 320, z: 1280, yaw: 3.1 },
    { kind: "fighter", name: "迎撃機 ランス2", x: -520, y: 300, z: 1120, yaw: 3.0 },
    { kind: "fighter", name: "迎撃機 ランス3", x: 520, y: 300, z: 1120, yaw: 3.2 },
    { kind: "fighter", name: "迎撃機 ランス4", x: 980, y: 320, z: 1280, yaw: 3.2 },
    { kind: "fighter", name: "迎撃機 ランス5", x: -260, y: 360, z: 1680, yaw: 3.12 },
    { kind: "fighter", name: "迎撃機 ランス6", x: 260, y: 360, z: 1680, yaw: 3.08 }
  ];

  const stage3Enemies = [
    { kind: "fighter", name: "防空機 タロン1", x: -1240, y: 420, z: 1520, yaw: 3.05 },
    { kind: "fighter", name: "防空機 タロン2", x: 1240, y: 420, z: 1520, yaw: 3.25 },
    { kind: "fighter", name: "防空機 タロン3", x: -580, y: 360, z: 1320, yaw: 3.05 },
    { kind: "fighter", name: "防空機 タロン4", x: 580, y: 360, z: 1320, yaw: 3.2 },
    { kind: "fighter", name: "防空機 タロン5", x: -220, y: 440, z: 1980, yaw: 3.12 },
    { kind: "fighter", name: "防空機 タロン6", x: 220, y: 440, z: 1980, yaw: 3.08 },
    { kind: "fighter", name: "防空機 タロン7", x: 0, y: 500, z: 2320, yaw: 3.14 }
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
        enemies: stage1Enemies
      },
      {
        id: "harbor-spear",
        name: "ステージ2 / 港湾強襲",
        shortName: "港湾強襲",
        objective: "広域哨戒中の迎撃飛行隊を殲滅せよ",
        completionLabel: "迎撃飛行隊壊滅",
        environment: {
          skyTop: "#83a8d7",
          skyBottom: "#f0d099",
          seaTop: "#315e85",
          seaBottom: "#0a1320",
          haze: "rgba(255, 255, 255, 0.12)",
          sunColor: "rgba(255, 239, 181, 0.18)",
          terrainType: "harbor"
        },
        missionType: "eliminate_all",
        playerStart: { x: 0, y: 230, z: -380, yaw: 0, pitch: 0.02, roll: 0 },
        enemies: stage2Enemies
      },
      {
        id: "mountain-crown",
        name: "ステージ3 / 山岳司令部",
        shortName: "山岳司令部",
        objective: "最終防衛飛行隊を撃破し制空権を確保せよ",
        completionLabel: "最終防衛飛行隊壊滅",
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
        enemies: stage3Enemies
      }
    ]
  };
})();
