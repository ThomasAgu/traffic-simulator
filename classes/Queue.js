import { Painter } from "../service/Painter.js";


export class Queue {
    constructor(state, type, entryNodeID, outerNodeID){
        this.state = state;
        this.type = type;
        this.queue = []; 
        this.entryNodeID = entryNodeID;
        this.outerNodeID = outerNodeID;
        Painter.get().printQueue(this.state, this.type, entryNodeID, outerNodeID);
    }

    setState(state) {
        this.state = state;
    } 

    getState() {
        return this.state;
    }

    getEntryNodeID() {
        return this.entryNodeID;
    }

    getOuterNodeID() {
        return this.outerNodeID;
    }
}