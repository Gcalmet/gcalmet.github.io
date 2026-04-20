import { initCubeControls, initZoom } from './core/cubeControls.js';
import { scene, camera, renderer } from './core/scene.js';
import { saveAlgorithm, loadAlgorithm, refreshAlgoList, runAlgorithm } from './algo/algoManager.js';
import { animate, move, applyMove} from './cube/animation.js';
import { getHistoryIndex, getHistoryStack, setHistoryIndex } from './cube/animation.js';
import { createCube, toggleSolve, toggleScramble } from './cube/cube.js';
import { toggleAxes } from './core/axes.js';
import { initButtons } from './ui/buttons.js';
import { initAxesIcon } from './ui/axesIcon.js';
import { initSolveIcon } from './ui/solveIcon.js';
import { initScrambleIcon } from './ui/scrambleIcon.js';
import { invertMove } from './algo/parser.js';
import { setAnimationSpeed, setUIInteracting } from './core/speed.js';


initAxesIcon(document.getElementById("axesIcon"));
initSolveIcon(document.getElementById("solveIcon"));
initScrambleIcon(document.getElementById("scrambleIcon"));

initButtons();
initCubeControls();
initZoom();

scene.add(createCube());

window.move = applyMove;
window.saveAlgorithm = saveAlgorithm;
window.loadAlgorithm = loadAlgorithm;
window.runAlgorithm = runAlgorithm;
window.toggleAxes = toggleAxes;
window.toggleSolve = toggleSolve;
window.toggleScramble = toggleScramble;


animate();
refreshAlgoList();

window.addEventListener("popstate", (event) => {
  if (!event.state) return;

  const newIndex = event.state.index;
  const currentIndex = getHistoryIndex();
  const stack = getHistoryStack();

  if (newIndex < currentIndex) {
    // UNDO
    const moveToUndo = stack[currentIndex];
    const inverse = invertMove(moveToUndo);
    move(inverse);

  } else if (newIndex > currentIndex) {
    // REDO
    const moveToRedo = stack[newIndex];
    move(moveToRedo);
  }

  setHistoryIndex(newIndex);
});

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});


const slider = document.getElementById("speedSlider");

slider.addEventListener("input", (e) => {
  setAnimationSpeed(parseFloat(e.target.value));
});

slider.addEventListener("pointerdown", () => setUIInteracting(true));
slider.addEventListener("pointerup", () => setUIInteracting(false));
slider.addEventListener("pointerleave", () => setUIInteracting(false));

const panel = document.getElementById("panel")
panel.addEventListener("pointerdown", () => setUIInteracting(true));
panel.addEventListener("pointerup", () => setUIInteracting(false));
panel.addEventListener("pointerleave", () => setUIInteracting(false));