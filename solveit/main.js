import { initControls } from './core/controls.js';
import { scene, camera, renderer } from './core/scene.js';
import { saveAlgorithm, loadAlgorithm, refreshAlgoList, runAlgorithm } from './algo/algoManager.js';
import { toggleAxes } from './core/axes.js';
import { animate, move } from './cube/animation.js';
import { createCube } from './cube/cube.js';
import { initButtons } from './ui/buttons.js';
import { initAxesIcon } from './ui/axesIcon.js';

initAxesIcon(document.getElementById("axesIcon"));
initButtons();
initControls(camera, renderer);
scene.add(createCube());

window.move = move;
window.saveAlgorithm = saveAlgorithm;
window.loadAlgorithm = loadAlgorithm;
window.runAlgorithm = runAlgorithm;
window.toggleAxes = toggleAxes;

animate();
refreshAlgoList();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});