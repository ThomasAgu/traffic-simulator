import { dijkstra } from "../data/utils.js";
import { Painter } from "../service/Painter.js";
import { nodes } from "../data/nodes.js";
import { Simulation } from "./Simulation.js";

export class Vehicle {
    constructor(id, initialNode, finalNode, nodes) {
        this.id = id;
        this.currentNode = initialNode;
        this.finalNode = finalNode;
        this.path = dijkstra(initialNode.id, finalNode.id);
        this.index = 0;
        this.nodes = nodes;
        this.currentNode.enqueue(this);
    }

    init() {
        const [vehicleElem, vehicleText] = Painter.get().paintVehicle(this);
        this.transit(vehicleElem, vehicleText);
    }

    transit(vehicleElem, vehicleText) {
        let nextNode = this.nodes[(this.path[this.index + 1])];
    
        if (!nextNode) {
            this.removeVehicleFromUI(vehicleElem, vehicleText);
            
            if (this.currentNode.queue.length > 0) {
                const index = this.currentNode.queue.indexOf(this);
                if (index !== -1) {
                    this.currentNode.queue.splice(index, 1);
                }
            }
            return;
        } 
        else {
            this.checkAndMove(vehicleElem, vehicleText, nextNode);
        }
    
    }

    checkAndMove(vehicleElem, vehicleText, nextNode) {
        if (
            this.currentNode.getState() !== "red" && 
            this.currentNode.queue.length > 0 && 
            this.currentNode.queue[0].id === this.id
        ) {
            this.currentNode.dequeue();
            Painter.get().moveVehicle(vehicleElem, vehicleText, nextNode);
            this.setCurrentNode(nextNode);
            nextNode.enqueue(this);
            this.index++;
            setTimeout(() => this.transit(vehicleElem, vehicleText), 500);
        } else {
            setTimeout(() => this.checkAndMove(vehicleElem, vehicleText, nextNode), 200);
        }
    }
    
    removeVehicleFromUI(vehicleElem, vehicleText) {
        vehicleElem.remove();
        vehicleText.remove();
    }

    getCurrentNode() {
        return this.currentNode;
    }

    setCurrentNode(node) {
        this.currentNode = node;
    }
}
