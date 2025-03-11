import { Vehicle } from "./Vehicle.js";
import { Node } from "./Node.js";
import {updateCounters, state} from "../data/counters.js";

export class Simulation {
    constructor(nodes, links){
        this.nodes = nodes.map(node => new Node(node.id, node.x, node.y, node.state, node.type));
        this.links = links;
        this.totalVehicles = 1000;
    }

    start(){
        let vehicleCount = 0
        this.nodes.forEach(node => {
            node.init()
        });

        const interval = setInterval(() => {
            if (vehicleCount >= this.totalVehicles) {
                clearInterval(interval);
                return;
            }
            const initialPos = Math.floor(Math.random() * this.nodes.length);
            const finalPos = Math.floor(Math.random() * this.nodes.length);
            new Vehicle(vehicleCount, this.nodes[initialPos], this.nodes[finalPos], this.nodes).init()
            vehicleCount++;
            state.vehicleCount = vehicleCount;
            state.vehicleInSystem = state.vehicleCount - state.finishedVehicles;
            updateCounters();
        }, 50);
    }

    stop() {
        this.nodes.forEach(node => {
            if (node.trafficLightInterval) {
                clearInterval(node.trafficLightInterval);
            }
        });
    }
    
}