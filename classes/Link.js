/*
link es como lo que tenemos en links, pero tambien va a tener:
3. una cola por cada target y no por cada nodo jeje (esto lo dejo para el finde)
*/

export class Link {
    constructor(source, target, priority = 1) {
        this.source = source;
        this.target = target;
        this.priority = priority;
        this.minVelocity = priority *10;
        this.maxVelocity = priority *20;
    }    

    getMinVel() {
        return this.minVelocity;
    }

    getMaxVel() {
        return this.maxVelocity;
    }
}