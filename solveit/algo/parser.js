import { moves } from '../cube/moves.js';

export function parseAlgorithm(input) {
  if (!input || typeof input !== "string") {
    throw new Error("Algorithm must be a string");
  }

  input = expandGroups(input);

  const tokens = input.trim().split(/\s+/);
  const parsed = [];

  for (const token of tokens) {
    const { face, suffix } = parseMove(token);

    if (!moves[face]) {
      throw new Error(`Invalid move face: ${face}`);
    }

    if (!["", "'", "2"].includes(suffix)) {
      throw new Error(`Invalid move suffix: ${token}`);
    }

    parsed.push({ face, suffix });
  }

  const simplified = simplifyMoves(parsed);

  return simplified.map(m => m.face + m.suffix);
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

function expandGroups(input) {
  const regex = /\(([^()]+)\)x(\d+)/g;

  let result = input;

  while (regex.test(result)) {
    result = result.replace(regex, (_, group, count) => {
      return Array(parseInt(count))
        .fill(group.trim())
        .join(" ");
    });
  }

  return result;
}

function simplifyMoves(moves) {
  const result = [];

  for (const m of moves) {
    const last = result[result.length - 1];

    if (last && last.face === m.face) {
      const v1 = moveToValue(last.suffix);
      const v2 = moveToValue(m.suffix);

      const combined = v1 + v2;
      const suffix = valueToSuffix(combined);

      result.pop();

      if (suffix !== null) {
        result.push({ face: m.face, suffix });
      }

    } else {
      result.push({ ...m });
    }
  }

  return result;
}

function moveToValue(suffix) {
  if (suffix === "") return 1;
  if (suffix === "'") return -1;
  if (suffix === "2") return 2;
  return 0;
}

function valueToSuffix(v) {
  v = ((v % 4) + 4) % 4;

  if (v === 0) return null;
  if (v === 1) return "";
  if (v === 2) return "2";
  if (v === 3) return "'";
}