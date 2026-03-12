(function () {
  const SkyDominion = window.SkyDominion || (window.SkyDominion = {});

  function vec3(x, y, z) {
    return { x: x || 0, y: y || 0, z: z || 0 };
  }

  function add(a, b) {
    return { x: a.x + b.x, y: a.y + b.y, z: a.z + b.z };
  }

  function sub(a, b) {
    return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
  }

  function scale(v, s) {
    return { x: v.x * s, y: v.y * s, z: v.z * s };
  }

  function dot(a, b) {
    return a.x * b.x + a.y * b.y + a.z * b.z;
  }

  function cross(a, b) {
    return {
      x: a.y * b.z - a.z * b.y,
      y: a.z * b.x - a.x * b.z,
      z: a.x * b.y - a.y * b.x
    };
  }

  function length(v) {
    return Math.sqrt(dot(v, v));
  }

  function normalize(v) {
    const len = length(v) || 1;
    return scale(v, 1 / len);
  }

  function distance(a, b) {
    return length(sub(a, b));
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function lerpVec(a, b, t) {
    return {
      x: lerp(a.x, b.x, t),
      y: lerp(a.y, b.y, t),
      z: lerp(a.z, b.z, t)
    };
  }

  function wrapAngle(angle) {
    let result = angle;
    while (result > Math.PI) {
      result -= Math.PI * 2;
    }
    while (result < -Math.PI) {
      result += Math.PI * 2;
    }
    return result;
  }

  function approachAngle(current, target, maxStep) {
    const delta = wrapAngle(target - current);
    const step = clamp(delta, -maxStep, maxStep);
    return wrapAngle(current + step);
  }

  function rotateX(v, angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return {
      x: v.x,
      y: v.y * c - v.z * s,
      z: v.y * s + v.z * c
    };
  }

  function rotateY(v, angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return {
      x: v.x * c + v.z * s,
      y: v.y,
      z: -v.x * s + v.z * c
    };
  }

  function rotateZ(v, angle) {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    return {
      x: v.x * c - v.y * s,
      y: v.x * s + v.y * c,
      z: v.z
    };
  }

  function rotateEuler(v, pitch, yaw, roll) {
    return rotateY(rotateX(rotateZ(v, roll), pitch), yaw);
  }

  function rotateAroundAxis(v, axis, angle) {
    const a = normalize(axis);
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const term1 = scale(v, cos);
    const term2 = scale(cross(a, v), sin);
    const term3 = scale(a, dot(a, v) * (1 - cos));
    return add(add(term1, term2), term3);
  }

  function forwardFromAngles(pitch, yaw) {
    return normalize({
      x: Math.sin(yaw) * Math.cos(pitch),
      y: Math.sin(pitch),
      z: Math.cos(yaw) * Math.cos(pitch)
    });
  }

  function basisFromAngles(pitch, yaw, roll) {
    const forward = forwardFromAngles(pitch, yaw);
    let right = normalize(cross({ x: 0, y: 1, z: 0 }, forward));
    if (length(right) < 0.001) {
      right = { x: 1, y: 0, z: 0 };
    }
    let up = normalize(cross(right, forward));
    if (roll) {
      right = rotateAroundAxis(right, forward, roll);
      up = rotateAroundAxis(up, forward, roll);
    }
    return { forward, right, up };
  }

  SkyDominion.Math3D = {
    vec3,
    add,
    sub,
    scale,
    dot,
    cross,
    length,
    normalize,
    distance,
    clamp,
    lerp,
    lerpVec,
    wrapAngle,
    approachAngle,
    rotateX,
    rotateY,
    rotateZ,
    rotateEuler,
    rotateAroundAxis,
    forwardFromAngles,
    basisFromAngles
  };
})();

