let clientes = [{ cedula: "1712345678", nombre: "Juan", apellido: "Pérez", ingresos: 1200, egresos: 500 },
{ cedula: "1723456789", nombre: "María", apellido: "Gómez", ingresos: 1500, egresos: 600 },
{ cedula: "1734567890", nombre: "Carlos", apellido: "Ramírez", ingresos: 900, egresos: 350 }];

let creditos = [{ cedula: "1712345678", nombre: "Juan", apellido: "Pérez", monto: 3000, tasa: 15, plazo: 12, cuota: 287.50 },
{ cedula: "1723456789", nombre: "María", apellido: "Gómez", monto: 5000, tasa: 14, plazo: 24, cuota: 237.50 },
{ cedula: "1734567890", nombre: "Carlos", apellido: "Ramírez", monto: 1500, tasa: 16, plazo: 6, cuota: 290.00 }];

let tasaInteres = 15;
let clienteSeleccionado = null;
let cuotaCalculada = 0;
let montoCalculado = 0;
let plazoCalculado = 0;
let creditoAprobado = false;

/* =========================================================
   MÓDULO DE VALIDACIÓN
   ========================================================= */

const REGLAS_VALIDACION = {
  txtCedula: {
    obligatorio: true,
    validar: v => /^\d{10}$/.test(v),
    mensaje: "La cédula debe tener exactamente 10 dígitos numéricos"
  },
  txtNombre: {
    obligatorio: true,
    validar: v => /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/.test(v),
    mensaje: "El nombre solo debe contener letras"
  },
  txtApellido: {
    obligatorio: true,
    validar: v => /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/.test(v),
    mensaje: "El apellido solo debe contener letras"
  },
  txtIngresos: {
    obligatorio: true,
    validar: v => !isNaN(Number(v)) && Number(v) > 0,
    mensaje: "Los ingresos deben ser un número mayor a 0"
  },
  txtEgresos: {
    obligatorio: true,
    validar: v => !isNaN(Number(v)) && Number(v) >= 0,
    mensaje: "Los egresos deben ser un número mayor o igual a 0"
  },
  buscarCedulaCredito: {
    obligatorio: true,
    validar: v => /^\d{10}$/.test(v),
    mensaje: "La cédula debe tener exactamente 10 dígitos numéricos"
  },
  montoCredito: {
    obligatorio: true,
    validar: v => !isNaN(Number(v)) && Number(v) > 0,
    mensaje: "El monto debe ser un número mayor a 0"
  },
  plazoCredito: {
    obligatorio: true,
    validar: v => /^\d+$/.test(v) && Number(v) > 0,
    mensaje: "El plazo debe ser un número entero de años mayor a 0"
  }
};

function mostrarErrorCampo(id, mensaje) {
  const input = document.getElementById(id);
  const errorSpan = document.getElementById("error-" + id);
  if (!input || !errorSpan) return;
  errorSpan.textContent = mensaje;
  errorSpan.classList.add("visible");
  input.classList.add("campo-error");
}

function limpiarErrorCampo(id) {
  const input = document.getElementById(id);
  const errorSpan = document.getElementById("error-" + id);
  if (!input || !errorSpan) return;
  errorSpan.textContent = "";
  errorSpan.classList.remove("visible");
  input.classList.remove("campo-error");
}

function validarCampo(id) {
  const regla = REGLAS_VALIDACION[id];
  if (!regla) return true;

  const input = document.getElementById(id);
  const valor = (input.value || "").trim();

  if (valor === "") {
    if (regla.obligatorio) {
      mostrarErrorCampo(id, "Este campo es obligatorio");
      return false;
    }
    limpiarErrorCampo(id);
    return true;
  }

  if (!regla.validar(valor)) {
    mostrarErrorCampo(id, regla.mensaje);
    return false;
  }

  limpiarErrorCampo(id);
  return true;
}

function validarGrupo(ids) {
  let valido = true;
  let primerCampoInvalido = null;
  for (let i = 0; i < ids.length; i++) {
    if (!validarCampo(ids[i])) {
      valido = false;
      if (primerCampoInvalido === null) primerCampoInvalido = ids[i];
    }
  }
  if (primerCampoInvalido) {
    const input = document.getElementById(primerCampoInvalido);
    if (input) input.focus();
  }
  return valido;
}

function limpiarErroresGrupo(ids) {
  for (let i = 0; i < ids.length; i++) {
    limpiarErrorCampo(ids[i]);
  }
}

/* =========================================================
   FIN MÓDULO DE VALIDACIÓN
   ========================================================= */


function ocultarSecciones() {
  document.getElementById("parametros").classList.remove("activa");
  document.getElementById("clientes").classList.remove("activa");
  document.getElementById("credito").classList.remove("activa");
  document.getElementById("listaCreditos").classList.remove("activa");
}

function mostrarSeccion(id) {
  ocultarSecciones();
  document.getElementById(id).classList.add("activa");
}

function guardarTasa() {
  let tasa = recuperarInt("tasaInteres");
  let mensaje = "";
  tasaInteres = tasa;

  if (tasa >= 10 && tasa <= 20) {
    mensaje = "Tasa configurada correctamente: " + tasa + "%"
  } else {
    mensaje = "La tasa debe estar entre 10% y 20%";
  }

  mostrarTexto("mensajeTasa", mensaje);
}

function guardarCliente() {
  let cedulaFormulario = recuperaraTexto("txtCedula");
  let nombreFormulario = recuperaraTexto("txtNombre");
  let apellidoFormulario = recuperaraTexto("txtApellido");
  let ingresosFormulario = recuperarInt("txtIngresos");
  let egresosFormulario = recuperarInt("txtEgresos");
  let cliente = {
    cedula: cedulaFormulario,
    nombre: nombreFormulario,
    apellido: apellidoFormulario,
    ingresos: ingresosFormulario,
    egresos: egresosFormulario
  }

  let clienteEncontrado = buscarCliente(cliente.cedula);

  if (clienteEncontrado == null) {
    clientes.push(cliente);
  } else {
    modificarCliente(cliente);
  }
}

function pintarClientes() {
  // ---- Validación antes de guardar (agregada) ----
  const camposCliente = ["txtCedula", "txtNombre", "txtApellido", "txtIngresos", "txtEgresos"];
  if (!validarGrupo(camposCliente)) {
    return;
  }
  // ---- fin validación ----

  let cmpTabla = document.getElementById("tablaClientes");
  let contenido = "";
  guardarCliente();
  for (let i = 0; i < clientes.length; i++) {
    contenido += "<tr>" +
      "<td>" + clientes[i].cedula + "</td>" +
      "<td>" + clientes[i].nombre + "</td>" +
      "<td>" + clientes[i].apellido + "</td>" +
      "<td>" + clientes[i].ingresos + "</td>" +
      "<td>" + clientes[i].egresos + "</td>" +
      "<td>" +
      "<button onclick='seleccionarCliente(" + clientes[i].cedula + ")'>Actualizar</button>" +
      "<button>Eliminar</button>" +
      "</td>" + "</tr>"
  }

  cmpTabla.innerHTML = contenido;
}

function buscarCliente(cedula) {
  let clienteEncontrado = null;
  for (let i = 0; i < clientes.length; i++) {
    if (clientes[i].cedula == cedula) {
      clienteEncontrado = clientes[i];
      break
    }
  }
  return clienteEncontrado;
}

function seleccionarCliente(cedula) {
  let clienteSeleccionado = buscarCliente(cedula);
  mostrarTextoEnCaja("txtCedula", clienteSeleccionado.cedula);
  mostrarTextoEnCaja("txtNombre", clienteSeleccionado.nombre);
  mostrarTextoEnCaja("txtApellido", clienteSeleccionado.apellido);
  mostrarTextoEnCaja("txtIngresos", clienteSeleccionado.ingresos);
  mostrarTextoEnCaja("txtEgresos", clienteSeleccionado.egresos);
}

function modificarCliente(cliente) {
  let clienteEncontrado = buscarCliente(cliente.cedula);
  if (clienteEncontrado != null) {
    clienteEncontrado.nombre = cliente.nombre;
    clienteEncontrado.apellido = cliente.apellido;
    clienteEncontrado.ingresos = cliente.ingresos;
    clienteEncontrado.egresos = cliente.egresos;
  }
}

function limpiar() {
  mostrarTextoEnCaja("txtCedula", "");
  mostrarTextoEnCaja("txtNombre", "");
  mostrarTextoEnCaja("txtApellido", "");
  mostrarTextoEnCaja("txtIngresos", "");
  mostrarTextoEnCaja("txtEgresos", "");

  // ---- Limpieza de mensajes de error (agregada) ----
  limpiarErroresGrupo(["txtCedula", "txtNombre", "txtApellido", "txtIngresos", "txtEgresos"]);
}

function buscarClienteCredito() {
  // ---- Validación: solo cédula (agregada) ----
  if (!validarCampo("buscarCedulaCredito")) {
    return;
  }
  // ---- fin validación ----

  let cedula = recuperaraTexto("buscarCedulaCredito");
  let clienteEncontrado = buscarCliente(cedula);
  let cmpDatos = document.getElementById("datosClienteCredito");
  let contenido = "<h3>Cliente No Encontrado</h3>";
  if (clienteEncontrado != null) {
    contenido = "<h3>Datos del Cliente</h3>" +
      "<p><strong>Cédula:</strong>" + clienteEncontrado.cedula + "</p>" +
      "<p><strong>Nombre:</strong>" + clienteEncontrado.nombre + "</p>" +
      "<p><strong>Apellido:</strong>" + clienteEncontrado.apellido + "</p>" +
      "<p><strong>Ingresos:</strong>" + clienteEncontrado.ingresos + "</p>" +
      "<p><strong>Egresos:</strong>" + clienteEncontrado.egresos + "</p>";
  }

  cmpDatos.innerHTML = contenido;
}

function solicitarCredito() {
  if (!validarGrupo(["buscarCedulaCredito", "montoCredito", "plazoCredito"])) {
    return;
  }

  let cedula = recuperaraTexto("buscarCedulaCredito");
  let clienteSeleccionado = buscarCliente(cedula);

  let nuevoCredito = {
    cedula: clienteSeleccionado.cedula,
    nombre: clienteSeleccionado.nombre,
    apellido: clienteSeleccionado.apellido,

    monto: monto,
    tasa: tasa,
    plazo: plazo,
    cuota: cuota
  };

  creditos.push(nuevoCredito);
}

function buscarCreditos(cedula) {
  let creditosEncontrados = [];
  for (let i = 0; i < creditos.length; i++) {
    if (creditos[i].cedula == cedula) {
      creditosEncontrados.push(creditos[i]);
    }
  }
  return creditosEncontrados;
}

function pintarCreditos(creditos) {
  let cmpTabla = document.getElementById("tablaCreditos");
  let contenido = "";
  for (let i = 0; i < creditos.length; i++) {
    contenido += "<tr>" +
      "<td>" + creditos[i].cedula + "</td>" +
      "<td>" + creditos[i].nombre + "</td>" +
      "<td>" + creditos[i].apellido + "</td>" +
      "<td>" + creditos[i].monto + "</td>" +
      "<td>" + creditos[i].tasa + "</td>" +
      "<td>" + creditos[i].plazo + "</td>" +
      "<td>" + creditos[i].cuota + "</td>" +
      "<td>" +
      "<button>Eliminar</button>" +
      "</td>" + "</tr>"
  }

  cmpTabla.innerHTML = contenido;
}