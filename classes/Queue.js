import { Painter } from "../service/Painter.js";


export class Queue {
    constructor(state, entryNodeID, outerNodeID){
        this.state = state;
        this.queue = []; 
        this.entryNodeID = entryNodeID;
        this.outerNodeID = outerNodeID;
        Painter.get().printQueue(this.state, entryNodeID, outerNodeID);
    }
}