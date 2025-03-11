import { nodes } from "../data/nodes.js";

export class Painter {
    static instance = null;

    constructor() {
        if (!Painter.instance) {
            Painter.instance = this;
            this.svg = d3.select("#graph-container").append("svg")
            .attr("width", window.innerWidth)
            .attr("height", window.innerHeight);;
        }
        return Painter.instance;
    }

    static get() {
        if (!Painter.instance) {
            Painter.instance = new Painter();
        }
        return Painter.instance;
    }

    paintVehicle(vehicle) {
        let currentNode = vehicle.getCurrentNode().id;
        let node = nodes[currentNode]; // Aseguramos el acceso correcto

        let vehicleElem = this.svg.append("circle")
            .attr("cx", node.x)
            .attr("cy", node.y)
            .attr("r", 8)
            .attr("fill", `hsl(${Math.random() * 360}, 70%, 50%)`);

        let vehicleText = this.svg.append("text")
            .attr("x", node.x)
            .attr("y", node.y + 5)
            .attr("text-anchor", "middle")
            .attr("font-size", 10)
            .attr("fill", "#fff")
            .text(vehicle.id);

        return [vehicleElem, vehicleText];
    }

    moveVehicle(vehicleElem, vehicleText, nextNode) {
        vehicleElem.transition()
            .duration(500)
            .attr("cx", nextNode.x)
            .attr("cy", nextNode.y);

        vehicleText.transition()
            .duration(500) 
            .attr("x", nextNode.x)
            .attr("y", nextNode.y + 5);
    }

    drawGraph(nodes, links) {
        this.svg.append("defs").append("marker")
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
        this.svg.selectAll("path")
            .data(links)
            .enter().append("path")
            .attr("d", d => {
                const source = nodes[d.source];
                const target = nodes[d.target];
                if (d.bidirectional) {
                    // Separar las líneas aplicando un desplazamiento
                    const dx = target.x - source.x;
                    const dy = target.y - source.y;
                    const angle = Math.atan2(dy, dx);
                    const offset = 5; // Ajusta la separación entre líneas
        
                    const x1 = source.x + offset * Math.cos(angle + Math.PI / 2);
                    const y1 = source.y + offset * Math.sin(angle + Math.PI / 2);
                    const x2 = target.x + offset * Math.cos(angle + Math.PI / 2);
                    const y2 = target.y + offset * Math.sin(angle + Math.PI / 2);
        
                    return `M${x1},${y1} L${x2},${y2}`;
                } else {
                    return `M${source.x},${source.y} L${target.x},${target.y}`;
                }
            })
            .attr("stroke", "#999")
            .attr("stroke-width", 2)
            .attr("fill", "none")
            .attr("marker-end", "url(#arrowhead)");
        
            // Dibujar nodos
            this.circles = this.svg.selectAll("circle")
                .data(nodes)
                .enter().append("circle")
                .attr("cx", d => d.x)
                .attr("cy", d => d.y)
                .attr("r", 20)
                .attr("fill", d => {
                    if (d.id === 0) return "gray"; // Nodo de salida
                    if (d.type === "special") return "gray"; // Nodo especial
                    return d.state === "red" ? "red" : "green"; // Nodos normales
                })
                .attr("stroke", "#fff")
                .attr("stroke-width", 2);
        
            // Agregar etiquetas a los nodos
            this.svg.selectAll("text")
                .data(nodes)
                .enter().append("text")
                .attr("x", d => d.x)
                .attr("y", d => d.y - 25)
                .attr("text-anchor", "middle")
                .attr("font-size", 12)
                .attr("fill", "#333")
                .text(d => `N${d.id}`);
        
        }

    toggleTrafficLight(nodeID, state) {
        const node = this.circles.filter(d => d.id === nodeID)
        node
            .transition()
            .duration(1000)
            .attr("fill", state);
    }
}
