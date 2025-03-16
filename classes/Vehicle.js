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
        //this.currentNode.enqueue(this);
        this.currentNode.incomingQueues[0].enqueue(this);
    }

    init() {
        const [vehicleElem, vehicleText] = Painter.get().paintVehicle(this);
        this.transit(vehicleElem, vehicleText);
    }

    transit(vehicleElem, vehicleText) {
        let nextNode = this.nodes[(this.path[this.index + 1])];
        
        if (!nextNode) {
            this.removeVehicleFromUI(vehicleElem, vehicleText);
            
            //Removerlo de la incomingLink de this.currentNode (donde esta encolado)
            const QueuedWhereIAmEncoled =  this.currentNode.getQueueWhereIAm(this.id);
        
            if (QueuedWhereIAmEncoled.queue.length > 0) {
                const index = QueuedWhereIAmEncoled.queue.indexOf(this);
                if (index !== -1) {
                    QueuedWhereIAmEncoled.queue.splice(index, 1);
                }
            }
            return;
        } 
        else {
            this.checkAndMove(vehicleElem, vehicleText, nextNode);
        }
    
    }

    checkAndMove(vehicleElem, vehicleText, nextNode) {
        //fijarse donde estra encolado. El estado y todo eso
        const QueuedWhereIAmEncoled =  this.currentNode.getQueueWhereIAm(this.id);
        debugger
        if (
            QueuedWhereIAmEncoled.getState() !== "red" && 
            QueuedWhereIAmEncoled.queue.length > 0 && 
            QueuedWhereIAmEncoled.queue[0].id === this.id
        ) {
            //calculo de velocidad (esto puede mejorar)
            const linkToNextNode =  this.currentNode.exitLinks.filter(link => link.target === nextNode.id)[0];
            const min = linkToNextNode.getMinVel();
            const max = linkToNextNode.getMaxVel();
            const randomVel = Math.random() * (max - min) + min * 100;
            
            //fijarse donde estra encolado. Una vez eso desencolarlo
            QueuedWhereIAmEncoled.dequeue();

            Painter.get().moveVehicle(vehicleElem, vehicleText, this.currentNode, nextNode, randomVel);
            //fijarse donde tiene que encolarse encolado. Una vez eso desencolarlo (incoming link nextNode.id + this.currentNode.id)
            nextNode.enqueue(this, this.currentNode.id);
            this.setCurrentNode(nextNode);
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
