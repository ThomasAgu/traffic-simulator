import { Painter } from "../service/Painter.js";
import { Queue } from "./Queue.js";

export class Node {
    constructor(id, x, y, state = "none", type = "normal", exitLinks, incomingLinks) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.state = state;
        this.type = type;
        this.exitLinks = exitLinks;
        this.incomingQueues = incomingLinks.map((incomingLink) => new Queue(this.state, this.type, this.id, incomingLink.source));
        this.queuesState = this.incomingQueues.map(queue => queue.getState());
        this.queue = [];
    }
    
    init() {
        if (this.getType() === 'normal') {
            let randomDelay = Math.floor(Math.random() * 3000) + 1000; 
            
            this.trafficLightInterval = setInterval(() => {
                this.toggleTrafficLight();
            }, randomDelay);
        }
    }
    

    toggleTrafficLight() {
        this.state = (this.getState() === "red") ? "green" : "red";
        
        if (this.incomingQueues.length === 0) return;
    
        // Encuentra el índice de la cola que está en verde
        let greenIndex = this.incomingQueues.findIndex(queue => queue.getState() === 'green');
    
        // Si todas están en rojo o en verde, se empieza desde el primer índice
        if (greenIndex === -1) {
            greenIndex = 0;
        }
    
        // Poner todas en rojo
        this.incomingQueues.forEach(queue => queue.setState("red"));
    
        // Cambiar al siguiente de forma cíclica
        let nextIndex = (greenIndex + 1) % this.incomingQueues.length;
        this.incomingQueues[nextIndex].setState("green");
    
        // Llamar al Painter para actualizar la UI
        Painter.get().toggleTrafficLight(this.id, this.incomingQueues);
    }

    enqueue(vehicle, pastNodeId) {
        const queueToEnqueue = this.getIncomingQueue(this.id, pastNodeId)
        queueToEnqueue.enqueue(vehicle);
    }
    
    dequeue() {
        return this.queue.shift(); // Elimina el primer vehículo en lugar del último
    }

    dequeueIncomingQueues(sourceID, targetID) {
        const queue = this.getIncomingQueue(sourceID, targetID);
        return queue.shift();
    }
    

    getType() {
        return this.type;
    }

    getState(){
        return this.state;
    }

    getIncomingQueue(sourceID, targetID) {
        return this.incomingQueues.filter(
            queue => queue.getEntryNodeID() === sourceID 
            && queue.getOuterNodeID() === targetID
        )[0];
    }

    getQueueWhereIAm(vehicleID) {
        return this.incomingQueues.filter(
            queue => queue.searchForVehicle(vehicleID)
        )[0]
    }
}