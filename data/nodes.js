import { createMutex } from "./utils.js";
export const nodes = [
    { id: 0, x: 50, y: 300, state: "none", mutex: createMutex()},
    { id: 1, x: 200, y: 200, state: "red", type: "normal", queue: [], mutex: createMutex() },
    { id: 2, x: 300, y: 200, state: "green", type: "normal", queue: [], mutex: createMutex() },
    { id: 3, x: 400, y: 200, state: "red", type: "normal", queue: [], mutex: createMutex() },
    { id: 4, x: 200, y: 300, state: "green", type: "normal", queue: [], mutex: createMutex() },
    { id: 5, x: 300, y: 300, state: "red", type: "normal", queue: [], mutex: createMutex() },
    { id: 6, x: 400, y: 300, state: "green", type: "normal", queue: [], mutex: createMutex() },
    { id: 7, x: 200, y: 400, state: "red", type: "normal", queue: [], mutex: createMutex() },
    { id: 8, x: 300, y: 400, state: "green", type: "special", queue: [], mutex: createMutex() },
    { id: 9, x: 400, y: 400, state: "red", type: "normal", queue: [], mutex: createMutex() },
    { id: 10, x: 100, y: 100, state: "red", type: "normal", queue: [], mutex: createMutex() },
    { id: 11, x: 200, y: 100, state: "green", type: "special", queue: [], mutex: createMutex() },
    { id: 12, x: 300, y: 100, state: "green", type: "special", queue: [], mutex: createMutex() },
    { id: 13, x: 400, y: 100, state: "green", type: "special", queue: [], mutex: createMutex() },
    { id: 14, x: 500, y: 100, state: "red", type: "normal", queue: [], mutex: createMutex() },
    { id: 15, x: 500, y: 200, state: "green", type: "special", queue: [], mutex: createMutex() },
    { id: 16, x: 500, y: 300, state: "red", type: "normal", queue: [], mutex: createMutex() },
    { id: 17, x: 500, y: 400, state: "green", type: "special", queue: [], mutex: createMutex() },
    { id: 18, x: 500, y: 500, state: "red", type: "normal", queue: [], mutex: createMutex() },
    { id: 19, x: 400, y: 500, state: "green", type: "special", queue: [], mutex: createMutex() },
    { id: 20, x: 300, y: 500, state: "green", type: "normal", queue: [], mutex: createMutex() },
    { id: 21, x: 200, y: 500, state: "green", type: "special", queue: [], mutex: createMutex() },
    { id: 22, x: 100, y: 500, state: "red", type: "normal", queue: [], mutex: createMutex() },
    { id: 23, x: 100, y: 400, state: "green", type: "special", queue: [], mutex: createMutex() },
    { id: 24, x: 100, y: 300, state: "red", type: "normal", queue: [], mutex: createMutex() },
    { id: 25, x: 100, y: 200, state: "green", type: "normal", queue: [], mutex: createMutex() },
    { id: 26, x: 600, y: 150, state: "green", type: "normal", queue: [], mutex: createMutex() },
    { id: 27, x: 600, y: 250, state: "green", type: "normal", queue: [], mutex: createMutex() },
    { id: 28, x: 600, y: 350, state: "green", type: "normal", queue: [], mutex: createMutex() },
    { id: 29, x: 600, y: 450, state: "green", type: "normal", queue: [], mutex: createMutex() },
    { id: 30, x: 500, y: 900, state: "green", type: "special", queue: [], mutex: createMutex() },
    { id: 31, x: 400, y: 900, state: "green", type: "special", queue: [], mutex: createMutex() },
    { id: 32, x: 300, y: 900, state: "green", type: "special", queue: [], mutex: createMutex() },
    { id: 33, x: 200, y: 900, state: "green", type: "special", queue: [], mutex: createMutex() },
    { id: 34, x: 100, y: 900, state: "green", type: "special", queue: [], mutex: createMutex() },
    { id: 35, x: 50, y: 850, state: "green", type: "normal", queue: [], mutex: createMutex() },
    { id: 36, x: 100, y: 800, state: "green", type: "special", queue: [], mutex: createMutex() },
    { id: 37, x: 200, y: 800, state: "green", type: "special", queue: [], mutex: createMutex() },
    { id: 38, x: 300, y: 800, state: "green", type: "normal", queue: [], mutex: createMutex() },
    { id: 39, x: 400, y: 800, state: "green", type: "normal", queue: [], mutex: createMutex() },
    { id: 40, x: 500, y: 800, state: "green", type: "normal", queue: [], mutex: createMutex() },
    { id: 41, x: 550, y: 850, state: "green", type: "normal", queue: [], mutex: createMutex() },

];