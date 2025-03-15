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
        Painter.get().toggleTrafficLight(this.id, this.state, this.incomingQueues);
    }

    enqueue(vehicle) {
        this.queue.push(vehicle);
    }
    
    dequeue() {
        return this.queue.shift(); // Elimina el primer vehículo en lugar del último
    }
    

    getType() {
        return this.type;
    }

    getState(){
        return this.state;
    }
}