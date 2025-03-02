import { nodes } from "./data/nodes.js";
import { links } from "./data/links.js";

import { state, updateCounters } from "./data/counters.js"


let vehicleId = 0;

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
    const initialPos = Math.floor(Math.random() * (nodes.length));
    state.vehiclesInSystem++; // Modificar el estado compartido
    updateCounters();

    let vehicle = { node: initialPos, x: nodes[initialPos].x, y: nodes[initialPos].y, id: vehicleId++ };
    let vehicleElem = svg.append("circle")
        .attr("cx", vehicle.x)
        .attr("cy", vehicle.y)
        .attr("r", 8)
        .attr("fill", `hsl(${Math.random() * 360}, 70%, 50%)`);

    // Agregar un texto con el ID del vehículo
    let vehicleText = svg.append("text")
        .attr("x", vehicle.x)
        .attr("y", vehicle.y + 5)
        .attr("text-anchor", "middle")
        .attr("font-size", 10)
        .attr("fill", "#fff")
        .text(vehicle.id);

    function moveVehicle() {
        if (vehicle.node === 26) {
            vehicleElem.remove();
            vehicleText.remove();
            state.vehiclesInSystem--; // Modificar el estado compartido
            state.vehicleCount++; // Modificar el estado compartido
            updateCounters();
            return;
        }

        let possibleLinks = links.filter(l => l.source === vehicle.node);
        if (possibleLinks.length === 0) return;

        let nextLink = possibleLinks[Math.floor(Math.random() * possibleLinks.length)];
        let nextNode = nodes[nextLink.target];

        if (nextNode.type !== "special" && nextNode.state === "red") {
            setTimeout(moveVehicle, 1000);
            return;
        }

        vehicle.node = nextNode.id;

        vehicleElem.transition()
            .duration(2000)
            .attr("cx", nextNode.x)
            .attr("cy", nextNode.y)
            .on("end", moveVehicle);

        vehicleText.transition()
            .duration(2000)
            .attr("x", nextNode.x)
            .attr("y", nextNode.y + 5);
    }

    moveVehicle();
}