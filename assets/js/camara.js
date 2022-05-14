var app = {
    scanner: null,
    activeCameraId: null,
    camaras: []
}

const cambiarCamara = (e) => {
    const boton = e.target;
    app.scanner.stop()
    var index = app.camaras.findIndex(cam => cam.id === boton.id)
    app.scanner.start(app.camaras[index]).catch(function (e){
        console.log(e);
        alert("Ocurrio un error en la opcion elegida. Espere a que cargue completamente la cámara o verificar que la cámara exista y no sea una mala desinstalación. Refrescar la pagina para que vuelva a funcionar correctamente")
    })
}

const crearBoton = (elemento) => {
    const listaBotones = document.getElementById("opciones")
    var boton = document.createElement("button")
    boton.setAttribute("id",elemento.id)
    boton.setAttribute("class","btn btn-primary")
    boton.innerText = elemento.name
    listaBotones.appendChild(boton)
    return boton
}

const main = () => {

    let scanner = new Instascan.Scanner({ video: document.getElementById('preview'),mirror: false});
    scanner.addListener('scan', function (content) {
        console.log(content)
        const input = document.getElementById("dni")
        input.value = content;
        EscanearAjax()
    });

    app.scanner=scanner

    Instascan.Camera.getCameras().then(function (cameras) {
        console.log("entro")
    }).catch(function (e){
        console.log(e);
    })

  
    Instascan.Camera.getCameras().then(function (cameras) { 
        if(cameras.length > 0){
            app.camaras=cameras
            app.camaras.forEach(elemento => {
                var boton = crearBoton(elemento)
                boton.addEventListener("click",cambiarCamara)   
            });
        
        scanner.start(cameras[0])

        } else {
            alert('No se econtraron camaras');
        }     
    }).catch(function (e) {
        console.error(e);
    });  

}

window.addEventListener("load", main)
