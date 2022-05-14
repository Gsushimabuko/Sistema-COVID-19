const regresar = (evt) =>{
    history.back()
}

const main = () => {
    console.log("INICIANDO JS...")
    const boton = document.getElementById("btnRegresar")
    boton.onclick = regresar
}


window.addEventListener("load", main)