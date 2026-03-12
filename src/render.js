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
      scale: 1.12,
      vertices: [
        [0, 0.2, 34],
        [0, 2.2, 16],
        [0, 2.5, 2],
        [0, 1.4, -12],
        [0, 0.6, -26],
        [0, 4.6, -10],
        [0, -1.8, -16],
        [-30, 0.5, 4],
        [30, 0.5, 4],
        [-26, 0.2, -6],
        [26, 0.2, -6],
        [-11, -2.1, 10],
        [11, -2.1, 10],
        [-8, 4.2, -4],
        [8, 4.2, -4],
        [-5, 6.2, -12],
        [5, 6.2, -12],
        [-16, 0.3, 18],
        [16, 0.3, 18],
        [-4, 2.4, 26],
        [4, 2.4, 26],
        [0, 8, -14]
      ],
      faces: [
        { i: [0, 19, 1], color: "#adb5a1" },
        { i: [0, 1, 20], color: "#9fa894" },
        { i: [19, 20, 1], color: "#7f8878" },
        { i: [17, 0, 11], color: "#8a927f" },
        { i: [0, 18, 12], color: "#96a089" },
        { i: [11, 1, 2, 9], color: "#626c5f" },
        { i: [1, 12, 10, 2], color: "#697365" },
        { i: [2, 3, 9], color: "#525b50" },
        { i: [2, 10, 3], color: "#5a6458" },
        { i: [3, 4, 6], color: "#3d463f" },
        { i: [1, 5, 2], color: "#596257" },
        { i: [13, 14, 5], color: "#2f3832" },
        { i: [15, 13, 5], color: "#444d44" },
        { i: [14, 16, 5], color: "#4b564b" },
        { i: [7, 17, 11], color: "#727a68" },
        { i: [18, 8, 12], color: "#7c8570" },
        { i: [7, 11, 9, 4], color: "#5d665a" },
        { i: [12, 8, 4, 10], color: "#667062" },
        { i: [15, 21, 5], color: "#58614f" },
        { i: [5, 21, 16], color: "#616a56" },
        { i: [9, 10, 6], color: "#384039" }
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
      meshes.push(createPyramidMesh(-1100, 0, 1620, 420, 128, ["#6f684f", "#897e5c", "#817654", "#6d6346", "#5e563d"]));
      meshes.push(createPyramidMesh(980, 0, 1880, 460, 146, ["#6b6554", "#867e68", "#7a735e", "#665f4f", "#5a5344"]));
      meshes.push(createPyramidMesh(160, 0, 2460, 620, 188, ["#4e624a", "#68825e", "#5b7552", "#4e6748", "#40563b"]));
      clouds.push({ x: -620, y: 420, z: 960, size: 90 });
      clouds.push({ x: 420, y: 460, z: 1540, size: 104 });
      clouds.push({ x: 80, y: 380, z: 2240, size: 126 });
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

        if (projectile.kind === "missile") {
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
      for (let i = 0; i < terrain.meshes.length; i += 1) {
        pushMeshPolygons(polygons, terrain.meshes[i], camera, 0);
      }
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
