// Datos del grafo (nodos y aristas)
const nodes = [
    { id: 1, x: 100, y: 100, state: "red", type: "normal" },
    { id: 2, x: 200, y: 100, state: "green", type: "normal" },
    { id: 3, x: 300, y: 100, state: "red", type: "normal" },
    { id: 4, x: 100, y: 200, state: "green", type: "normal" },
    { id: 5, x: 200, y: 200, state: "red", type: "normal" },
    { id: 6, x: 300, y: 200, state: "green", type: "normal" },
    { id: 7, x: 100, y: 300, state: "red", type: "normal" },
    { id: 8, x: 200, y: 300, state: "green", type: "special" },
    { id: 9, x: 300, y: 300, state: "red", type: "normal" },
    { id: 10, x: 100, y: 400, state: "red", type: "normal" },
    { id: 11, x: 200, y: 400, state: "red", type: "normal" },
    { id: 12, x: 300, y: 400, state: "red", type: "normal" },
];

// Crear las aristas (enlaces entre nodos)
const links = [
    { source: 0, target: 1 },
    { source: 1, target: 2 },
    { source: 1, target: 4 }, { source: 2, target: 5 }, { source: 3, target: 2 },
    { source: 4, target: 5 }, { source: 5, target: 6 },
    { source: 4, target: 7 }, { source: 5, target: 8 }, { source: 6, target: 3 },  { source: 6, target: 9 },
    { source: 7, target: 8 }, { source: 8, target: 9 },
    { source: 9, target: 13 },
    { source: 7, target: 10 }, { source: 10, target: 11}, { source: 11, target: 12 },  { source: 12, target: 13 },
];

// Agregar nodos ficticios para representar la entrada/salida
nodes.unshift({ id: 0, x: 50, y: 150, state: "none" });  // Nodo virtual de entrada
nodes.push({ id: 13, x: 350, y: 250, state: "none" });    // Nodo virtual de salida

const width = 400, height = 1000;
const svg = d3.select("#graph-container").append("svg")
    .attr("width", width)
    .attr("height", height);

// Definir marcador de flecha
svg.append("defs").append("marker")
    .attr("id", "arrowhead")
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 20)
    .attr("refY", 0)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
    .append("path")
    .attr("d", "M 0,-5 L 10,0 L 0,5")
    .attr("fill", "#999");

// Dibujar aristas con flechas
svg.selectAll("line")
    .data(links)
    .enter().append("line")
    .attr("x1", d => nodes[d.source].x)
    .attr("y1", d => nodes[d.source].y)
    .attr("x2", d => nodes[d.target].x)
    .attr("y2", d => nodes[d.target].y)
    .attr("stroke", "#999")
    .attr("stroke-width", 2)
    .attr("marker-end", "url(#arrowhead)");

// Dibujar nodos
const circles = svg.selectAll("circle")
    .data(nodes)
    .enter().append("circle")
    .attr("cx", d => d.x)
    .attr("cy", d => d.y)
    .attr("r", 20)
    .attr("fill", d => {
        if (d.id === 0 || d.id === 13) return "gray"; // Nodo de salida
        if (d.type === "special") return "gray"; // Nodo especial
        return d.state === "red" ? "red" : "green"; // Nodos normales
    })
    .attr("stroke", "#fff")
    .attr("stroke-width", 2);

// Agregar etiquetas a los nodos
svg.selectAll("text")
    .data(nodes)
    .enter().append("text")
    .attr("x", d => d.x)
    .attr("y", d => d.y - 25)
    .attr("text-anchor", "middle")
    .attr("font-size", 12)
    .attr("fill", "#333")
    .text(d => `N${d.id}`);

    function toggleTrafficLights() {
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
    
    setInterval(toggleTrafficLights, 2000);

let vehicleId = 0;

// Simular vehículos
function spawnVehicle() {
    let vehicle = { node: 0, x: nodes[0].x, y: nodes[0].y, id: vehicleId++ };
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
            if (vehicle.node === 13) {
                vehicleElem.remove();
                vehicleText.remove();
                vehicleCount++;
                d3.select("#vehicle-counter").text(`Vehículos en salida: ${vehicleCount}`);
                return;
            }
    
            let possibleLinks = links.filter(l => l.source === vehicle.node);
            if (possibleLinks.length === 0) return;

            let nextLink = possibleLinks[Math.floor(Math.random() * possibleLinks.length)];
            let nextNode = nodes[nextLink.target];
    
            // Verificar si el siguiente nodo es especial o está en verde
            if (nextNode.type !== "special" && nextNode.state === "red") {
                setTimeout(moveVehicle, 1000); // Esperar si el semáforo está en rojo
                return;
            }
    
            vehicle.node = nextNode.id; // Actualizar el nodo actual del vehículo
    
            // Mover el círculo y el texto juntos
            vehicleElem.transition()
                .duration(2000)
                .attr("cx", nextNode.x)
                .attr("cy", nextNode.y)
                .on("end", moveVehicle);
    
            vehicleText.transition()
                .duration(2000)
                .attr("x", nextNode.x)
                .attr("y", nextNode.y + 5); // Ajustar la posición del texto
    }
    
    moveVehicle();
}

setInterval(spawnVehicle, 2000);
