// graph.js
import { nodes } from "/data/nodes.js";
import { links } from "/data/links.js";

export function createGraph(containerId, width, height) {
    const svg = d3.select(`#${containerId}`).append("svg")
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

    return { svg, circles };
}