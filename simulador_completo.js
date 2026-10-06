
let clientes = [{ cedula: "1712345678", nombre: "Juan", apellido: "Pérez", ingresos: 1200, egresos: 500 },
{ cedula: "1723456789", nombre: "María", apellido: "Gómez", ingresos: 1500, egresos: 600 },
{ cedula: "1734567890", nombre: "Carlos", apellido: "Ramírez", ingresos: 900, egresos: 350 }];

let creditos = [];

let tasaInteres = 15;
let clienteSeleccionado = null;
let cuotaCalculada = 0;
let montoCalculado = 0;
let plazoCalculado = 0;
let creditoAprobado = false;


function ocultarSecciones() {
  document.getElementById("parametros").classList.remove("activa");
  document.getElementById("clientes").classList.remove("activa");
}

function mostrarSeccion(id) {
  ocultarSecciones();
  document.getElementById(id).classList.add("activa");
}

function guardarTasa() {
  let tasa = recuperarInt("tasaInteres");
  let mensaje = "";

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
  clientes.push(cliente);
}

function pintarClientes() {
  let cmpTabla = document.getElementById("tablaClientes");
  let contenido = "";
  guardarCliente();
  for (let i = 0; i < clientes.length; i++) {
    contenido += "<tr>" +
      "<td>"+clientes[i].cedula+"</td>" +
      "<td>"+clientes[i].nombre+"</td>" +
      "<td>"+clientes[i].apellido+"</td>" +
      "<td>"+clientes[i].ingresos+"</td>" +
      "<td>"+clientes[i].egresos+"</td>" +
      "<td>" +
      "<button onclick='seleccionarCliente("+clientes[i].cedula+")'>Actualizar</button>" +
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

function seleccionarCliente(cedula){
  let clienteSeleccionado = buscarCliente(cedula);
  mostrarTextoEnCaja("txtCedula",clienteSeleccionado.cedula);
  mostrarTextoEnCaja("txtNombre",clienteSeleccionado.nombre);
  mostrarTextoEnCaja("txtApellido",clienteSeleccionado.apellido);
  mostrarTextoEnCaja("txtIngresos",clienteSeleccionado.ingresos);
  mostrarTextoEnCaja("txtEgresos",clienteSeleccionado.egresos);
}