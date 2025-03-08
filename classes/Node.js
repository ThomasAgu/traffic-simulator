import { Painter } from "../service/Painter.js";

export class Node {
    constructor(id, x, y, state = "none", type = "normal") {
        this.id = id;
        this.x = x;
        this.y = y;
        this.state = state;
        this.type = type;
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
        Painter.get().toggleTrafficLight(this.id, this.state);
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