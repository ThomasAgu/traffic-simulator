// main.js
import { createGraph } from "./graph.js";
import { toggleTrafficLights, spawnVehicle } from "./simulation.js";

const width = 1000, height = 1000;
const { svg, circles } = createGraph("graph-container", width, height);

// Iniciar la simulación
setInterval(() => toggleTrafficLights(circles), 2000);
setInterval(() => spawnVehicle(svg), 500);