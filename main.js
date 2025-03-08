import { links } from "./data/links.js";
import { nodes } from "./data/nodes.js";
import { Graph } from "./classes/Graph.js";
import { Simulation } from "./classes/Simulation.js";

new Graph();
const simulation = new Simulation(nodes, links);
simulation.start();