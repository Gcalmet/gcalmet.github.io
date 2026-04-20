export const moves = {

  R: { axis: 'x', set: [1], sign: -1 },
  L: { axis: 'x', set: [-1], sign: 1 },
  U: { axis: 'y', set: [1], sign: -1 },
  D: { axis: 'y', set: [-1], sign: 1 },
  F: { axis: 'z', set: [1], sign: -1 },
  B: { axis: 'z', set: [-1], sign: 1 },

  r: { axis: 'x', set: [0, 1], sign: -1 },
  l: { axis: 'x', set: [0, -1], sign: 1 },
  u: { axis: 'y', set: [0, 1], sign: -1 },
  d: { axis: 'y', set: [0, -1], sign: 1 },
  f: { axis: 'z', set: [0, 1], sign: -1 },
  b: { axis: 'z', set: [0, -1], sign: 1 },

  M: { axis: 'x', set: [0], sign: 1 },
  E: { axis: 'y', set: [0], sign: 1 },
  S: { axis: 'z', set: [0], sign: -1 },

  x: { axis: 'x', set: [-1, 0, 1], sign: -1 },
  y: { axis: 'y', set: [-1, 0, 1], sign: -1 },
  z: { axis: 'z', set: [-1, 0, 1], sign: -1 },
};

const SUFFIXES = ["", "'", "2"];

function buildMatrix(bases) {
  return SUFFIXES.map(suffix =>
    bases.map(base => base + suffix)
  );
}

export const moveGroups = [
  {
    title: "Faces",
    matrix: buildMatrix(["F", "B", "R", "L", "U", "D"])
  },
  {
    title: "Wides",
    matrix: buildMatrix(["f", "b", "r", "l", "u", "d"])
  },
  {
    title: "Slices",
    matrix: buildMatrix(["M", "E", "S"])
  },
  {
    title: "Rotations",
    matrix: buildMatrix(["x", "y", "z"])
  }
];

