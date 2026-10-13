let monto;
let plazo;
let cuota;

function calcularCredito() {

    // ---- Validación previa (agregada) ----
    if (!validarGrupo(["buscarCedulaCredito", "montoCredito", "plazoCredito"])) {
        return;
    }
    // ---- fin validación ----

    let cedula = recuperaraTexto("buscarCedulaCredito");
    let clienteEncontrado = buscarCliente(cedula);

    //Calculo de valor disponible
    let ingresos = clienteEncontrado.ingresos;
    let egresos = clienteEncontrado.egresos;
    let saldo = calcularDisponible(ingresos, egresos);

    //Calculo de capacidad de pago
    let capacidadDePago = calcularCapacidadPago(saldo);

    //Calculo de interés simple
    monto = recuperarInt("montoCredito");
    plazo = recuperarInt("plazoCredito");
    tasa = tasaInteres;
    let interes = calcularInteresSimple(monto, tasa, plazo);

    //Calculo de total a pagar
    let total = calularTotalPagar(monto, interes);

    //Calculo de cuota mensual
    cuota = calcularCuotaMensual(total, plazo);

    //Analisis de crédito
    let estado = aprobarCredito(capacidadDePago, cuota);
    let resultado = "";
    if (estado) {
        resultado = "APROBADO";
        document.getElementById("resultadoCredito").className = "aprobado";
        document.getElementById("btnSolicitarCredito").disabled = false;
    } else {
        resultado = "RECHAZADO";
        document.getElementById("resultadoCredito").className = "rechazado";
        document.getElementById("btnSolicitarCredito").disabled = true;
    }

    let cmpCredito = document.getElementById("resultadoCredito");
    let contenido = "Capacidad de pago:" + capacidadDePago + "<br>" +
        "Total a pagar: " + total + "<br>" +
        "Cuota mensual: " + cuota.toFixed(2) + "<br>" +
        "RESULTADO: " + resultado;

    cmpCredito.innerHTML = contenido;
}