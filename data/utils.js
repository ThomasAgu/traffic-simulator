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

export function createMutex() {
    let locked = false;
    const queue = [];

    function acquire() {
        return new Promise((resolve) => {
            if (!locked) {
                locked = true;
                resolve();
            } else {
                queue.push(resolve);
            }
        });
    }

    function release() {
        if (queue.length > 0) {
            const next = queue.shift();
            next();
        } else {
            locked = false;
        }
    }

    return { acquire, release };
}

//Funcion creada para calcular el corrimiento sobre UI de una cola segun la posicion de los nodos y su inclinacion
export function calculateOrientation(nodeID2, nodeID1) {
    const node1 = getNode(nodeID1);
    const node2 = getNode(nodeID2);

    let angle = Math.atan2(node2.y - node1.y, node2.x - node1.x);
    let xDisplacement = node2.x - 25 * Math.cos(angle); // Desplazamiento en X
    let yDisplacement = node2.y - 25  * Math.sin(angle); // Desplazamiento en Y

    return { x: xDisplacement, y: yDisplacement };;
}

function getNode(id){
    return nodes.filter(node => node.id === id)[0];
}