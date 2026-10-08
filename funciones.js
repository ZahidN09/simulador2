const APORTE_SOLCA = 100;

function calcularDisponible(ingresos, egresos) {
    if (ingresos > egresos) {
        return ingresos - egresos;
    } else {
        return 0;
    }
}

function calcularCapacidadPago(montoDisponible) {
    return montoDisponible * 0.3;
}

function calcularInteresSimple(monto,tasa,plazoAnios){
    return plazoAnios*monto*tasa/100;
}

function calularTotalPagar(monto,interes){
    return monto + interes + APORTE_SOLCA;
}

function calcularCuotaMensual(total,plazoAnios){
    return total/(plazoAnios*12);
}

function aprobarCredito(capacidadPago,cuotaMensual){
    return capacidadPago > cuotaMensual;
}