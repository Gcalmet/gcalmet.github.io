
import { parseAlgorithm, invertMove } from './parser.js';
import { enqueueMoves } from '../cube/animation.js';

export function runAlgorithm(reverse = false) {
  const errorDiv = document.getElementById("algoError");
  errorDiv.textContent = "";

  const input = document.getElementById("algoInput").value;

  let moves;

  try {
    moves = parseAlgorithm(input);
  } catch (e) {
    errorDiv.textContent = e.message;
    return;
  }

  if (reverse) {
    moves = moves.reverse().map(invertMove);
  }

  enqueueMoves(moves);
}

export function refreshAlgoList() {
  const container = document.getElementById("algoList");

  let list = JSON.parse(sessionStorage.getItem("algos") || "[]");

  container.innerHTML = "";

  list.forEach((a, i) => {
    const row = document.createElement("div");
    row.className = "algo-item";

    const text = document.createElement("span");
    text.textContent = a.value;

    const del = document.createElement("span");
    del.className = "delete";
    del.textContent = "✖";

    del.onclick = (e) => {
      e.stopPropagation();
      deleteAlgo(i);
    };

    row.onclick = () => {
      document.getElementById("algoInput").value = a.value;
    };

    row.appendChild(text);
    row.appendChild(del); // à droite

    container.appendChild(row);
  });
}

export function saveAlgorithm() {
  const errorDiv = document.getElementById("algoError");
  errorDiv.textContent = "";

  const input = document.getElementById("algoInput").value.trim();
  if (!input) return;

  let moves;

  // validate before saving
  try {
    moves = parseAlgorithm(input);
  } catch (e) {
    errorDiv.textContent = e.message;
    return;
  }

  let list = JSON.parse(sessionStorage.getItem("algos") || "[]");

  const algo = {
    name: input,
    value: input
  };

  list.push(algo);

  sessionStorage.setItem("algos", JSON.stringify(list));

  refreshAlgoList();
}

export function loadAlgorithm(index) {
  if (index === "" || index === undefined) return;

  let list = JSON.parse(sessionStorage.getItem("algos") || "[]");

  const algo = list[index];

  if (!algo) return;

  document.getElementById("algoInput").value = algo.value;
}

export function deleteAlgo(index) {
  let list = JSON.parse(sessionStorage.getItem("algos") || "[]");

  list.splice(index, 1);

  sessionStorage.setItem("algos", JSON.stringify(list));

  refreshAlgoList();
}