let vehicleCount = 0;
let vehiclesInSystem = 0;

// Datos del grafo (nodos y aristas)
const nodes = [
    { id: 0, x: 50, y: 150, state: "none" },
    { id: 1, x: 200, y: 200, state: "red", type: "normal" },
    { id: 2, x: 300, y: 200, state: "green", type: "normal" },
    { id: 3, x: 400, y: 200, state: "red", type: "normal" },
    { id: 4, x: 200, y: 300, state: "green", type: "normal" },
    { id: 5, x: 300, y: 300, state: "red", type: "normal" },
    { id: 6, x: 400, y: 300, state: "green", type: "normal" },
    { id: 7, x: 200, y: 400, state: "red", type: "normal" },
    { id: 8, x: 300, y: 400, state: "green", type: "special" },
    { id: 9, x: 400, y: 400, state: "red", type: "normal" },
    { id: 10, x: 100, y: 100, state: "red", type: "normal" },
    { id: 11, x: 200, y: 100, state: "red", type: "special" },
    { id: 12, x: 300, y: 100, state: "red", type: "special" },
    { id: 13, x: 400, y: 100, state: "red", type: "special" },
    { id: 14, x: 500, y: 100, state: "red", type: "normal" },
    { id: 15, x: 500, y: 200, state: "red", type: "special" },
    { id: 16, x: 500, y: 300, state: "red", type: "normal" },
    { id: 17, x: 500, y: 400, state: "red", type: "special" },
    { id: 18, x: 500, y: 500, state: "red", type: "normal" },
    { id: 19, x: 400, y: 500, state: "red", type: "special" },
    { id: 20, x: 300, y: 500, state: "red", type: "special" },
    { id: 21, x: 200, y: 500, state: "red", type: "special" },
    { id: 22, x: 100, y: 500, state: "red", type: "normal" },
    { id: 23, x: 100, y: 400, state: "red", type: "special" },
    { id: 24, x: 100, y: 300, state: "red", type: "normal" },
    { id: 25, x: 100, y: 200, state: "red", type: "special" },
    { id: 26, x: 550, y: 450, state: "none" },
];

// Crear las aristas (enlaces entre nodos)
const links = [
    { source: 0, target: 10 },
    { source: 1, target: 2 }, { source: 1, target: 5 }, { source: 1, target: 4 },
    { source: 2, target: 5 }, 
    { source: 3, target: 2 }, { source: 3, target: 5 },
    { source: 4, target: 5 }, { source: 4, target: 7 }, 
    { source: 5, target: 1 }, { source: 5, target: 3}, { source: 5, target: 7 }, { source: 5, target: 9},
    { source: 6, target: 3 },{ source: 6, target: 9 },
    { source: 7, target: 5 }, { source: 7, target: 8 }, { source: 8, target: 9 },
    { source: 9, target: 5 }, { source: 9, target: 18},
    { source: 10, target: 11}, { source: 10, target: 1}, 
    { source: 11, target: 12 },  
    { source: 12, target: 13 },
    { source: 13, target: 14 }, { source: 14, target: 3}, 
    { source: 14, target: 15 },
    { source: 15, target: 16 },
    { source: 16, target: 17 },
    { source: 17, target: 18 },
    { source: 18, target: 19 }, { source: 18, target: 26 },
    { source: 19, target: 20 },
    { source: 20, target: 21 },
    { source: 21, target: 22 },
    { source: 22, target: 23 }, { source: 22, target: 7 },
    { source: 23, target: 24 },
    { source: 24, target: 25 },
    { source: 25, target: 10 },
];

const width = 1000, height = 1000;
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
        if (d.id === 0 || d.id === 26) return "gray"; // Nodo de salida
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
    const initialPos = Math.floor(Math.random() * (nodes.length));
    vehiclesInSystem++;
    d3.select("#vehicles-in-system").text(`Vehículos en Sistema: ${vehiclesInSystem}`);
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
                vehiclesInSystem--
                vehicleCount++;
                d3.select("#vehicle-counter").text(`Vehículos en salida: ${vehicleCount}`);
                d3.select("#vehicles-in-system").text(`Vehículos en la red: ${vehiclesInSystem}`);
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

setInterval(spawnVehicle, 500);
