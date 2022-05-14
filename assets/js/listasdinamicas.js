const main2 = () => {

    console.log("INICIANDO JS...") 
    
    obtenerIds(obtenerLongitud())
    tablas()
    
}

const tablas = () => {
    $(document).ready( function () {
        $('#myTable0').DataTable();    
        $('#myTable1').DataTable();    
        $('#myTable2').DataTable();    
        $('#myTable3').DataTable();    
        $('#myTable4').DataTable();  
       
    } 
    )
}

const ejecutarModal = () => {
    $(document).ready( function () { 
        $('#myModal1').modal("show"); 
    } )
    
}



const obtenerLongitud = () =>{

    const conteoCero =  document.getElementById("cuerpoCero").childElementCount
    const conteoAlta =  document.getElementById("cuerpoAlta").childElementCount
    const conteoObsAlta =  document.getElementById("cuerpoObsAlta").childElementCount
    const conteoObs =  document.getElementById("cuerpoObs").childElementCount
    const conteoConf =  document.getElementById("cuerpoConf").childElementCount

    const conteos = []
    conteos.push(conteoCero ,conteoAlta,conteoObsAlta, conteoObs, conteoConf)
    
    return conteos

}

const obtenerIds = (conteos) =>{

    console.log("obteniendo ids...")

    //ACCEDIENDO A LOS BOTONES

    //SALUDABLE
    for (let index = 0; index < conteos[1]; index++) {
        
        const botonAlta = document.getElementById("cuerpoAlta").children[index].children[6].children[0].children[0]
       const botonAltaObs = document.getElementById("cuerpoAlta").children[index].children[6].children[0].children[1]
       const botonObs = document.getElementById("cuerpoAlta").children[index].children[6].children[0].children[2]
       const botonConf = document.getElementById("cuerpoAlta").children[index].children[6].children[0].children[3]
       
       pasarInfo(botonAlta, '0')
       pasarInfo(botonAltaObs, '2')
       pasarInfo(botonObs, '3')
       pasarInfo(botonConf, '4')

    }
    //ALTA
    for (let index = 0; index < conteos[0]; index++) {
        
        
       const botonSaludable = document.getElementById("cuerpoCero").children[index].children[6].children[0].children[0]
       const botonAltaObs = document.getElementById("cuerpoCero").children[index].children[6].children[0].children[1]
       const botonObs = document.getElementById("cuerpoCero").children[index].children[6].children[0].children[2]
       const botonConf = document.getElementById("cuerpoCero").children[index].children[6].children[0].children[3]
       
       pasarInfo(botonSaludable, '1')
       pasarInfo(botonAltaObs, '2')
       pasarInfo(botonObs, '3')
       pasarInfo(botonConf, '4')
       

    }
    // CONTACTO CON CONFIRMADO
    
    for (let index = 0; index < conteos[2]; index++) {
        
       const botonSaludable = document.getElementById("cuerpoObsAlta").children[index].children[6].children[0].children[0]
       const botonAlta = document.getElementById("cuerpoObsAlta").children[index].children[6].children[0].children[1]
       const botonObs = document.getElementById("cuerpoObsAlta").children[index].children[6].children[0].children[2]
       const botonConf = document.getElementById("cuerpoObsAlta").children[index].children[6].children[0].children[3]
       
       pasarInfo(botonSaludable, '1')
       pasarInfo(botonAlta, '0')
       pasarInfo(botonObs, '3')
       pasarInfo(botonConf, '4')

    }
    // OBSERVACIÓN
    for (let index = 0; index < conteos[3]; index++) {
        
        const botonAlta = document.getElementById("cuerpoObs").children[index].children[6].children[0].children[0]
       const botonCero = document.getElementById("cuerpoObs").children[index].children[6].children[0].children[1]
       const botonAltaObs = document.getElementById("cuerpoObs").children[index].children[6].children[0].children[2]
       const botonConf = document.getElementById("cuerpoObs").children[index].children[6].children[0].children[3]
       
       pasarInfo(botonCero, '0')
       pasarInfo(botonAlta, '1')
       pasarInfo(botonAltaObs, '2')
       pasarInfo(botonConf, '4')

    }

    //CONFIRMADO
    for (let index = 0; index < conteos[4]; index++) {
        
        const botonAlta = document.getElementById("cuerpoConf").children[index].children[6].children[0].children[0]
       const botonCero = document.getElementById("cuerpoConf").children[index].children[6].children[0].children[1]
       const botonAltaObs = document.getElementById("cuerpoConf").children[index].children[6].children[0].children[2]
       const botonObs = document.getElementById("cuerpoConf").children[index].children[6].children[0].children[3]
      
       
       pasarInfo(botonCero, '0')
       pasarInfo(botonAlta, '1')
       pasarInfo(botonAltaObs, '2')
       pasarInfo(botonObs, '3')
       
    }
    

}

const pasarInfo = (boton, listaAEnviar) => {

    console.log("pasando info...")

    boton.onclick = () => {
        

        const inputLista = document.getElementById("listaAEnviar")
        const inputId = document.getElementById("idACambiar")

        //pasar el id del boton 
        inputId.value = boton.value
        inputLista.value = listaAEnviar

        
        ejecutarModal()

    }
}





window.addEventListener("load", main2)