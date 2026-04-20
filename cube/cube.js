import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

export const cubeGroup = new THREE.Group();

export const colors = {
  right: 0xff0000,
  left: 0xff7f00,
  top: 0xffffff,
  bottom: 0xffff00,
  front: 0x00ff00,
  back: 0x0000ff
};

export const faceState = {
  F: { color: 0x00ff00 },
  B: { color: 0x0000ff },
  R: { color: 0xff0000 },
  L: { color: 0xff7f00 },
  U: { color: 0xffffff },
  D: { color: 0xffff00 },
};

const cycles = {
  x: ["U", "B", "D", "F"],
  y: ["F", "L", "B", "R"],
  z: ["U", "R", "D", "L"],
};

export function createCube() {
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        const cubie = createCubie(x, y, z);
        cubeGroup.add(cubie);
      }
    }
  }

  return cubeGroup;
}

function createCubie(x, y, z) {
  const geometry = new THREE.BoxGeometry(0.95, 0.95, 0.95);

  const materials = [
    new THREE.MeshBasicMaterial({ color: x === 1 ? colors.right : 0x111111 }),
    new THREE.MeshBasicMaterial({ color: x === -1 ? colors.left : 0x111111 }),
    new THREE.MeshBasicMaterial({ color: y === 1 ? colors.top : 0x111111 }),
    new THREE.MeshBasicMaterial({ color: y === -1 ? colors.bottom : 0x111111 }),
    new THREE.MeshBasicMaterial({ color: z === 1 ? colors.front : 0x111111 }),
    new THREE.MeshBasicMaterial({ color: z === -1 ? colors.back : 0x111111 })
  ];

  const cube = new THREE.Mesh(geometry, materials);

  cube.position.set(x, y, z);

  cube.userData = {
    pos: { x, y, z },
    rot: { x: 0, y: 0, z: 0 }
  };

  return cube;
}

export function updateFaceState(move) {
  const { axis, angle } = move;

  const cycle = getFaceCycle(axis, angle);
  applyCycle(faceState, cycle);
}

function getFaceCycle(axis, angle) {
  const base = cycles[axis];

  if (!base) {
    throw new Error(`Invalid axis: ${axis}`);
  }

  // clockwise vs counterclockwise
  if (angle > 0) {
    return base;
  } else {
    return [...base].reverse();
  }
}

function applyCycle(state, cycle) {
  const temp = state[cycle[0]].color;

  for (let i = 0; i < cycle.length - 1; i++) {
    state[cycle[i]].color = state[cycle[i + 1]].color;
  }

  state[cycle[cycle.length - 1]].color = temp;
}

