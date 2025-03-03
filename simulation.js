import { nodes } from "./data/nodes.js";
import { links } from "./data/links.js";
import { state, updateCounters } from "./data/counters.js";
import { dijkstra } from "./data/utils.js";

let vehicleId = 0;

// Asegurar que cada nodo tiene una cola inicializada
nodes.forEach(node => node.queue = []);

export function toggleTrafficLights(circles) {
    nodes.forEach(node => {
        if (node.type === "normal") { // Solo cambiar el estado de los nodos normales
            let randomDelay = Math.floor(Math.random() * 3000) + 1000; // Entre 1s y 4s
            setTimeout(() => {
                node.state = (node.state === "red") ? "green" : "red";

                circles.filter(d => d.id === node.id)
                    .transition()
                    .duration(1000)
                    .attr("fill", node.state === "red" ? "red" : "green");
            }, randomDelay);
        }
    });
}

export function spawnVehicle(svg) {
    const initialPos = Math.floor(Math.random() * nodes.length);
    const finalPos = Math.floor(Math.random() * nodes.length);
    const path = dijkstra(initialPos, finalPos);

    console.log(initialPos, finalPos, path);

    state.vehiclesInSystem++;
    updateCounters();

    let vehicle = { node: initialPos, id: vehicleId++ };

    let vehicleElem = svg.append("circle")
        .attr("cx", nodes[initialPos].x)
        .attr("cy", nodes[initialPos].y)
        .attr("r", 8)
        .attr("fill", `hsl(${Math.random() * 360}, 70%, 50%)`);

    let vehicleText = svg.append("text")
        .attr("x", nodes[initialPos].x)
        .attr("y", nodes[initialPos].y + 5)
        .attr("text-anchor", "middle")
        .attr("font-size", 10)
        .attr("fill", "#fff")
        .text(vehicle.id);

    let index = 0;

    function moveVehicle() {
        let currentNode = nodes[vehicle.node];

        // Agregar el vehículo a la cola del nodo actual si no está en ella
        if (!currentNode.queue.includes(vehicle)) {
            currentNode.queue.push(vehicle);
        }

        function attemptMove() {
            // Si el vehículo ha llegado a su destino, eliminarlo
            if (vehicle.node === finalPos) {
                vehicleElem.remove();
                vehicleText.remove();
                state.vehiclesInSystem--;
                state.vehicleCount++;
                updateCounters();
                
                // Eliminar el vehículo de la cola del nodo final
                currentNode.queue.shift();
                return;
            }

            // Solo el primer vehículo de la cola puede moverse
            if (currentNode.queue[0] !== vehicle) {
                setTimeout(attemptMove, 500);
                return;
            }

            // Si el semáforo está en rojo y el nodo no es especial, esperar
            if (currentNode.type !== "special" && currentNode.state === "red") {
                setTimeout(attemptMove, 1000);
                return;
            }

            // Siguiente nodo en el camino
            let nextNode = nodes[path[index + 1]];
            if (!nextNode) return; // Evitar errores si no hay más nodos en el camino

            index++;

            // Iniciar la animación antes de eliminar de la cola
            vehicleElem.transition()
                .duration(2000)
                .attr("cx", nextNode.x)
                .attr("cy", nextNode.y)
                .on("end", () => {
                    // Al llegar al destino, eliminar el vehículo de la cola
                    currentNode.queue.shift();
                    vehicle.node = nextNode.id;
                    moveVehicle(); // Intentar moverse de nuevo desde el nuevo nodo
                });

            vehicleText.transition()
                .duration(2000)
                .attr("x", nextNode.x)
                .attr("y", nextNode.y + 5);
        }

        attemptMove();
    }

    moveVehicle();
}

