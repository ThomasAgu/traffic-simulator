import { nodes } from "../data/nodes.js";
import { calculateOrientation } from "../data/utils.js";

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

    moveVehicle(vehicleElem, vehicleText, nextNode, duration) {
        vehicleElem.transition()
            .duration(duration)
            .attr("cx", nextNode.x)
            .attr("cy", nextNode.y);

        vehicleText.transition()
            .duration(duration) 
            .attr("x", nextNode.x)
            .attr("y", nextNode.y + 5);
    }

   drawGraph(nodes, links) {
        this.svg.append("defs").append("marker")
            .attr("id", "arrowhead")
            .attr("viewBox", "0 -3 6 6") // Smaller viewbox
            .attr("refX", 20) // Adjust the position to fit the new size
            .attr("refY", 0)
            .attr("markerWidth", 4) // Smaller width
            .attr("markerHeight", 4) // Smaller height
            .attr("orient", "auto")
            .append("path")
            .attr("d", "M 0,-3 L 6,0 L 0,3") // Smaller arrow shape
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
            .attr("stroke", d => {
                switch (d.priority) {
                    case 1: return "#808080";  
                    case 2: return "#909090";  
                    case 3: return "#AFAFAF";  
                    case 4: return "#BEBEBE"; 
                    default: return "#808080";
                }
            })
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

    toggleTrafficLight(nodeID, state, incomingQueues) {
        const node = this.circles.filter(d => d.id === nodeID)
        node
            .transition()
            .duration(1000)
            .attr("fill", state);
        

        incomingQueues.forEach(queue => {
            const {x,y} = calculateOrientation(queue.entryNodeID, queue.outerNodeID)
            d3.select(`circle[cx='${x}'][cy='${y}']`)
            .transition()
            .duration(500)
            .attr("fill", state); // Cambia el color a azul
        });
    }

    printQueue(state, id1, id2) {
        const {x,y} = calculateOrientation(id1, id2);
        this.svg.append("circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 5)
        .attr("fill", state => {
            switch (state) {
                case "none": return "gray";  
                case "red": return "red";  
                case "green": return "green";  
                default: return "gray";
            }
        })
        .attr("fill", `${state}`);
    }
}
