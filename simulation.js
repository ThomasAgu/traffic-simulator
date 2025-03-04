import { nodes } from "./data/nodes.js";
import { links } from "./data/links.js";
import { state, updateCounters } from "./data/counters.js";
import { dijkstra } from "./data/utils.js";

let vehicleId = 0;

// Asegurar que cada nodo tiene una cola inicializada todos los nodos tienen cola aca
nodes.forEach(node => node.queue = []);

// Agarra todos los nodos y pregunta si tiene semaforo, hace un ramdom entre 1 y 4 segundos y le cambia el estado (rojo <--> verde)
export function toggleTrafficLights(circles) {
    nodes.forEach(node => {
        if (node.type === "normal") {
            let randomDelay = Math.floor(Math.random() * 3000) + 1000; 
            setTimeout(
                () => {toggleTrafficLight(node, circles.filter(d => d.id === node.id))}, 
                randomDelay
            );
        }
    });
}

// Define el nodo inicial y final 
export function spawnVehicle(svg) {
    const [initialPos, finalPos, path] = defineVehiculeRoute();
    const vehicle = { node: initialPos, id: vehicleId++ };
    const [vehicleElem, vehicleText] = defineVehicleInUI(svg, initialPos, vehicle);
    state.vehiclesInSystem++;
    updateCounters();
    let index = 0;

    console.log('vehicle id:', vehicle.id, initialPos, finalPos, path);

    async function moveVehicle() {
        let currentNode = nodes[vehicle.node];
    
        // Log: Estado del nodo actual y su cola
        console.log(`[Vehículo ${vehicle.id}] Nodo actual: ${currentNode.id}, Estado: ${currentNode.state}, Cola:`, currentNode.queue.map(v => v.id));
    
        // Adquirir el Mutex del nodo actual
        await currentNode.mutex.acquire();
    
        try {
            // Agregar el vehículo a la cola del nodo actual si no está en ella
            if (!currentNode.queue.some(v => v.id === vehicle.id)) {
                currentNode.queue.push(vehicle);
                console.log(`[Vehículo ${vehicle.id}] Agregado a la cola del nodo ${currentNode.id}. Cola actual:`, currentNode.queue.map(v => v.id));
            }
    
            // Función para intentar mover el vehículo
            async function attemptMove() {
                // Si el vehículo ha llegado a su destino, eliminarlo
                if (vehicle.node === finalPos) {
                    vehicleElem.remove();
                    vehicleText.remove();
                    state.vehiclesInSystem--;
                    state.vehicleCount++;
    
                    // Eliminar el vehículo específico de la cola
                    const vehicleIndex = currentNode.queue.findIndex(v => v.id === vehicle.id);
                    if (vehicleIndex !== -1) {
                        currentNode.queue.splice(vehicleIndex, 1);
                        console.log(`[Vehículo ${vehicle.id}] Eliminado de la cola del nodo ${currentNode.id}. Cola actual:`, currentNode.queue.map(v => v.id));
                    }
    
                    updateCounters();
                    return;
                }
    
                // Solo el primer vehículo de la cola puede moverse
                if (currentNode.queue[0] !== vehicle) {
                    //console.log(`[Vehículo ${vehicle.id}] No es el primero en la cola del nodo ${currentNode.id}. Esperando...`);
                    setTimeout(attemptMove, 100);
                    return;
                }
    
                // Si el semáforo está en rojo y el nodo no es especial, esperar
                if (currentNode.type !== "special" && currentNode.state === "red") {
                    //console.log(`[Vehículo ${vehicle.id}] Semáforo en rojo en el nodo ${currentNode.id}. Esperando...`);
                    setTimeout(attemptMove, 100);
                    return;
                }
    
                // Siguiente nodo en el camino
                let nextNode = nodes[path[index + 1]];
                if (!nextNode) {
                    //console.log(`[Vehículo ${vehicle.id}] No hay más nodos en la ruta. Fin del recorrido.`);
                    return; // Evitar errores si no hay más nodos en el camino
                }
    
                // Adquirir el Mutex del siguiente nodo
                await nextNode.mutex.acquire();
    
                try {
                    // Verificar si el siguiente nodo está disponible
                    if (nextNode.queue.length >= 100) {
                        //console.log(`[Vehículo ${vehicle.id}] Cola llena en el nodo ${nextNode.id}. Esperando...`);
                        setTimeout(attemptMove, 100);
                        return;
                    }
    
                    index++;
    
                    // Log: Movimiento del vehículo
                    //console.log(`[Vehículo ${vehicle.id}] Moviéndose del nodo ${currentNode.id} al nodo ${nextNode.id}.`);
    
                    // Iniciar la animación antes de eliminar de la cola
                    vehicleElem.transition()
                        .duration(500)
                        .attr("cx", nextNode.x)
                        .attr("cy", nextNode.y)
                        .on("end", async () => {
                            // Al llegar al destino, eliminar el vehículo de la cola
                            const vehicleIndex = currentNode.queue.findIndex(v => v.id === vehicle.id);
                            if (vehicleIndex !== -1) {
                                currentNode.queue.splice(vehicleIndex, 1);
                                //console.log(`[Vehículo ${vehicle.id}] Eliminado de la cola del nodo ${currentNode.id}. Cola actual:`, currentNode.queue.map(v => v.id));
                            }
    
                            // Liberar el Mutex del nodo actual
                            currentNode.mutex.release();
    
                            // Mover el vehículo al siguiente nodo
                            vehicle.node = nextNode.id;
                            moveVehicle(); // Intentar moverse de nuevo desde el nuevo nodo
                        });
    
                    vehicleText.transition()
                        .duration(500)
                        .attr("x", nextNode.x)
                        .attr("y", nextNode.y + 5);
                } finally {
                    // Liberar el Mutex del siguiente nodo
                    nextNode.mutex.release();
                }
            }
    
            await attemptMove();
        } finally {
            // Liberar el Mutex del nodo actual
            currentNode.mutex.release();
        }
    }
    moveVehicle();
}

function defineVehiculeRoute() {
    const initialPos = Math.floor(Math.random() * nodes.length);
    const finalPos = Math.floor(Math.random() * nodes.length);
    const path = dijkstra(initialPos, finalPos);

    return [initialPos, finalPos, path];
}

function defineVehicleInUI(svg, initialPos, vehicle) {
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

    return [vehicleElem, vehicleText];
}
 
function toggleTrafficLight(node, nodeUI) {
    node.state = (node.state === "red") ? "green" : "red";

    nodeUI
        .transition()
        .duration(1000)
        .attr("fill", node.state === "red" ? "red" : "green");
}
