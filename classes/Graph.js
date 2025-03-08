import { Node } from "./Node.js";
import { links } from "../data/links.js";
import { Painter } from "../service/Painter.js";
import { nodes } from "../data/nodes.js";

export class Graph {
    constructor() {

        //Procesa los links bidireccionales
        this.linkMap = new Map();
        links.forEach(link => {
            const key1 = `${link.source}-${link.target}`;
            const key2 = `${link.target}-${link.source}`;

            if (this.linkMap.has(key2)) { 
                this.linkMap.get(key2).bidirectional = true;
                link.bidirectional = true;
            }
            this.linkMap.set(key1, link);
        });
        
       Painter.get().drawGraph(nodes, links);
    }
}
