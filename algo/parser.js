import { moves } from '../cube/moves.js';

export function parseAlgorithm(input) {
  if (!input || typeof input !== "string") {
    throw new Error("Algorithm must be a string");
  }

  const tokens = input.trim().split(/\s+/);

  const result = [];

  for (const token of tokens) {
    const { face, suffix } = parseMove(token);

    // validate face exists in your moves map
    if (!moves[face]) {
      throw new Error(`Invalid move face: ${face}`);
    }

    // validate suffix
    if (!["", "'", "2"].includes(suffix)) {
      throw new Error(`Invalid move suffix: ${token}`);
    }

    result.push(token);
  }

  return result;
}

export function invertMove(m) {
  if (m.endsWith("2")) return m; // R2 = son propre inverse

  if (m.endsWith("'")) return m.slice(0, -1); // R' -> R

  return m + "'"; // R -> R'
}

export function parseMove(m) {
  const face = m[0];           // F, R, U, etc.
  const suffix = m.slice(1);   // '', ', 2

  return { face, suffix };
}