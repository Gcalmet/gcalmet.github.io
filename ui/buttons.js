import { move, applyMove } from '../cube/animation.js';
import { moveGroups } from '../cube/moves.js';

export function initButtons() {
  const container = document.getElementById("buttonPanel");

  moveGroups.forEach(group => {
    const groupDiv = document.createElement("div");
    groupDiv.className = "button-group";

    const title = document.createElement("div");
    title.textContent = group.title;
    title.className = "group-title";

    groupDiv.appendChild(title);

    group.matrix.forEach(row => {
      const rowDiv = document.createElement("div");
      rowDiv.className = "button-row";

      row.forEach(m => {
        const btn = document.createElement("button");
        btn.textContent = m;

        btn.onclick = () => applyMove(m);

        rowDiv.appendChild(btn);
      });

      groupDiv.appendChild(rowDiv);
    });

    container.appendChild(groupDiv);
  });
}
