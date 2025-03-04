// main.js
import { createGraph } from "./graph.js";
import { toggleTrafficLights, spawnVehicle } from "./simulation.js";

const width = window.innerWidth, height = window.innerHeight;
const { svg, circles } = createGraph("graph-container", width, height);

// Iniciar la simulación
setInterval(() => toggleTrafficLights(circles), 2000);
let vehicleCount = 0;
const maxVehicles = 100;

const interval = setInterval(() => {
    if (vehicleCount >= maxVehicles) {
        clearInterval(interval); // Detiene el intervalo cuando llega a 100 vehículos
        return;
    }

    spawnVehicle(svg);
    vehicleCount++;
}, 200);