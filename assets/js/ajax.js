const carga = () => {

    console.log("INICIANDO AJAX.JS")

}


const alert = (entrada, nombre) => {

    let header

    // DNI INCORRECTO
    if(entrada == -1){
        header = "DNI incorrecto o no existe"
        nombre = "Ingrese datos correctos",
        fondo = "#FFF"
    }
    else if(entrada == 0){
        header = "Entrada restringida"
        nombre += " tiene sospechas o un caso de COVID-19 activo. Comuníquese con la doctora"
        fondo = "#EE4F4C"
    }
    else if(entrada == 1){
        header = "Entrada restringida"
        nombre += " debe llenar ficha sintomatológica"
        fondo = "#EED54A"
    }else{
        header = "Entrada permitida"
        nombre += " puede ingresar al colegio"
        fondo = "#4BEB1E"
    }
    let timerInterval

    Swal.fire({
    color: '#000000',
    background: fondo,
    title: header,
    html: nombre,
    timer: 2000,
    timerProgressBar: true,
    didOpen: () => {
  },
  willClose: () => {
    clearInterval(timerInterval)
  }
}).then((result) => {
  /* Read more about handling dismissals below */  
  if (result.dismiss === Swal.DismissReason.timer) {
    console.log('I was closed by the timer')
  }
})
}

const EscanearAjax = () =>{

    const data = $('#form1').serialize();
    const puerta = document.getElementById("puerta")
    

    $.ajax({
        method : 'POST',
        url : '/probandopromesas/'+ puerta.value,
        // Lo que vas a enviar
        data : data,
        dataType: 'json',
        success : (result) => {
            if(result.estadoEntrada==0){
                // COVID CONFIRMADO / SOSPECHOSO
                alert(0,result.persona.nombre +' '+ result.persona.apellidop)
                console.log(result.persona)
                //alertify.alert('<div class="p-3 bg-danger text-white"> <b> Entrada restringida </b> </div> ', result.persona.nombre +' '+ result.persona.apellidop+ '<br>'+ 'tiene sospechas o un caso de COVID-19 activo. Comuníquese con la doctora.');
            } else if (result.estadoEntrada==1){
                // NO LLENÓ FICHA
                alert(1, result.persona.nombre +' '+ result.persona.apellidop)
                console.log(result.persona)
                
            } else if (result.estadoEntrada==2){
                // PUEDE INGRESAR
                console.log(result.persona)
                alert(2,result.persona.nombre +' '+ result.persona.apellidop)
            } else {
                // NO EXISTE DNI
                console.log(result.persona)
                alert(-1)
            }
            
        }
    })
}




window.addEventListener("load", carga)

