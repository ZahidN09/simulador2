
  let clientes = [];
  let creditos = [];

  let tasaInteres = 15;
  let clienteSeleccionado = null;
  let cuotaCalculada = 0;
  let montoCalculado = 0;
  let plazoCalculado = 0;
  let creditoAprobado = false;

  
function ocultarSecciones(){
  document.getElementById("parametros").classList.remove("activa");
  document.getElementById("clientes").classList.remove("activa");
}

function mostrarSeccion(id){
  ocultarSecciones();
  document.getElementById(id).classList.add("activa");
}

function guardarTasa(){
  let tasa = recuperarInt("tasaInteres");
  let mensaje = "";

  if(tasa >= 10 && tasa <= 20){
    mensaje = "Tasa configurada correctamente: "+tasa+"%"
  }else{
    mensaje = "La tasa debe estar entre 10% y 20%";
  }

  mostrarTexto("mensajeTasa",mensaje);
}