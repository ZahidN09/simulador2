function calcularCredito() {

    let cedula = recuperaraTexto("buscarCedulaCredito");
    let clienteEncontrado = buscarCliente(cedula);

    //Calculo de valor disponible
    let ingresos = clienteEncontrado.ingresos;
    let egresos = clienteEncontrado.egresos;
    let saldo = calcularDisponible(ingresos, egresos);

    //Calculo de capacidad de pago
    let capacidadDePago = calcularCapacidadPago(saldo);

    //Calculo de interés simple
    let monto = recuperarInt("montoCredito");
    let plazo = recuperarInt("plazoCredito");
    let tasa = tasaInteres;
    let interes = calcularInteresSimple(monto, tasa, plazo);

    //Calculo de total a pagar
    let total = calularTotalPagar(monto, interes);

    //Calculo de cuota mensual
    let cuota = calcularCuotaMensual(total, plazo);

    //Analisis de crédito
    let estado = aprobarCredito(capacidadDePago, cuota);
    let resultado = "";
    if (estado) {
        resultado = "APROBADO";
        document.getElementById("resultadoCredito").className = "aprobado";
    } else {
        resultado = "RECHAZADO";
        document.getElementById("resultadoCredito").className = "rechazado";
    }

    let cmpCredito = document.getElementById("resultadoCredito");
    let contenido = "Capacidad de pago:" + capacidadDePago + "<br>" +
        "Total a pagar: " + total + "<br>" +
        "Cuota mensual: " + cuota.toFixed(2) + "<br>" +
        "RESULTADO: " + resultado;

    cmpCredito.innerHTML = contenido;
}