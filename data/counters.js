// state
export const state = {
    vehicleCount: 0,
    vehiclesInSystem: 0
};

export function updateCounters() {
    d3.select("#vehicle-counter").text(`Vehículos en salida: ${state.vehicleCount}`);
    d3.select("#vehicles-in-system").text(`Vehículos en la red: ${state.vehiclesInSystem}`);
}