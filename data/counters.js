// state
export const state = {
    vehicleCount: 0,
    vehicleInSystem: 0,
    finishedVehicles: 0
};

export function updateCounters() {
    d3.select("#vehicle-counter").text(`Vehículos en salida: ${state.vehicleCount}`);
    d3.select("#vehicles-in-system").text(`Vehículos en el sistema: ${state.vehicleInSystem}`);
    d3.select("#vehicles-finished").text(`Vehículos que terminaron: ${state.finishedVehicles}`);
}