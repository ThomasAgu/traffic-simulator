import { nodes } from "./nodes.js";
import { links } from "./links.js";

export function calculateDistance(nodeA, nodeB) {
    return Math.sqrt((nodeA.x - nodeB.x) ** 2 + (nodeA.y - nodeB.y) ** 2);
}

// Implementación de Dijkstra
export function dijkstra(startId, endId) {
    let distances = {};
    let previous = {};
    let queue = new Set(nodes.map(n => n.id));

    nodes.forEach(node => distances[node.id] = Infinity);
    distances[startId] = 0;

    while (queue.size) {
        let currentId = [...queue].reduce((a, b) => distances[a] < distances[b] ? a : b);
        queue.delete(currentId);

        if (currentId === endId) break;

        let neighbors = links.filter(link => link.source === currentId);
        for (let { target } of neighbors) {
            if (!queue.has(target)) continue;
            let alt = distances[currentId] + calculateDistance(nodes[currentId], nodes[target]);
            if (alt < distances[target]) {
                distances[target] = alt;
                previous[target] = currentId;
            }
        }
    }

    let path = [];
    for (let at = endId; at !== undefined; at = previous[at]) {
        path.unshift(at);
    }
    return path;
}