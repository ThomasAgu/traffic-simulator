import { dijkstra } from "../data/utils.js";
import { Painter } from "../service/Painter.js";
import {updateCounters, state} from "../data/counters.js";


export class Vehicle {
    constructor(id, initialNode, finalNode, nodes) {
        this.id = id;
        this.currentNode = initialNode;
        this.finalNode = finalNode;
        this.path = dijkstra(initialNode.id, finalNode.id);
        this.index = 0;
        this.nodes = nodes;
        //El nodo va a arrancar en una cola aleatoria y fue
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
            //calculo de velocidad (esto puede mejorar)
            const linkToNextNode =  this.currentNode.exitLinks.filter(link => link.target === nextNode.id)[0];
            const min = linkToNextNode.getMinVel();
            const max = linkToNextNode.getMaxVel();
            const randomVel = Math.random() * (max - min) + min * 100;
            
            this.currentNode.dequeue();

            Painter.get().moveVehicle(vehicleElem, vehicleText, this.currentNode, nextNode, randomVel);
            this.setCurrentNode(nextNode);
            nextNode.enqueue(this);
            this.index++;
            setTimeout(() => this.transit(vehicleElem, vehicleText), randomVel);
        } else {
            setTimeout(() => this.checkAndMove(vehicleElem, vehicleText, nextNode), 200);
        }
    }
    
    removeVehicleFromUI(vehicleElem, vehicleText) {
        vehicleElem.remove();
        vehicleText.remove();
        state.finishedVehicles++;
        state.vehicleInSystem = state.vehicleCount - state.finishedVehicles;
        updateCounters();
    }

    getCurrentNode() {
        return this.currentNode;
    }

    setCurrentNode(node) {
        this.currentNode = node;
    }
}
