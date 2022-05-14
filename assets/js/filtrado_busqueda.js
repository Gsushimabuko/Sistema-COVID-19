
  const tablas = () => {
    $(document).ready( function () {
        $('#myTable').DataTable();    
    } 
    )
}

const buscarPorDni = (evt) => {
    const input = document.getElementById("dni")
    const valorDni = document.getElementById("dni_texto")
    input.value = valorDni.value
    EscanearAjax()
}

const buscarClick = (evt) => {
    const input = document.getElementById("dni")
    input.value = evt
    EscanearAjax()
}

const principal = () => {
    
    tablas()

    const boton = document.getElementById("boton_verificar")
    boton.addEventListener("click",buscarPorDni)

    



}

window.addEventListener("load", principal)
