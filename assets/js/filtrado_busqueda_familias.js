var nombre= ""
var esGrupo = 0
var esArea = 0
var listaAgregados=[]

const recuperarNombre = (evt) => {
    nombre = document.getElementById("input_buscar").value
    actualizarTabla()
    }

const agregarLista = (evt) => {
    nombre = document.getElementById("input_buscar").value
    actualizarTabla()
    }

const actualizarTabla = () => {
    const principal = document.getElementById("parent")
    principal.removeChild(principal.getElementsByTagName("tbody")[0])
    crearCuerpo()
    }

const crearCuerpo  = () => {
    const principal = document.getElementById("parent")
    const cuerpoTabla = document.createElement("tbody")
    cuerpoTabla.setAttribute("id","cuerpo_tabla")

    personas.forEach(e => {
        if(!listaAgregados.includes(e.id)){

            if (e.nombre.includes(nombre) || 
            e.apellidop.includes(nombre) ||
            e.apellidom.includes(nombre) ||
            e.dni.includes(nombre)){
                    if(esGrupo >0 ){
                        if(esGrupo == e.grupoId){
                            let filas = crearFila(e)
                            cuerpoTabla.appendChild(filas)
                        }
                    } 
                    else if (esArea >0){
                        if(esArea == e.areaId){
                            let filas = crearFila(e)
                            cuerpoTabla.appendChild(filas)      
                        }
                    }else{
                        let filas = crearFila(e)
                        cuerpoTabla.appendChild(filas)
                    }
            }
    }
    });
    principal.appendChild(cuerpoTabla)

}  

const crearFila = (e) => {

      
        let fila = document.createElement("tr")
        let nombre = document.createElement("td")
        let apellido = document.createElement("td")    
        let selecc = document.createElement("td")    

        nombre.innerText = e.nombre
        apellido.innerText = e.apellidop + " " +e.apellidom

        let link = document.createElement("a")
        link.setAttribute("href","#")
        link.innerText = "agregar"
        link.addEventListener("click",agregarLista)
        selecc.appendChild(link)

        fila.appendChild(nombre)
        fila.appendChild(apellido)
        fila.appendChild(selecc)

    return fila
}

const cambiarArea = (evt) => {
    esArea = document.getElementById("Areas").value
    esGrupo = 0
    document.getElementById("Aulas").value = 0
    nombre = document.getElementById("input_buscar").value
    actualizarTabla()
    }

const cambiarAula = (evt) => {
    esGrupo = document.getElementById("Aulas").value
    esArea = 0
    document.getElementById("Areas").value = 0
    nombre = document.getElementById("input_buscar").value
    actualizarTabla()
    }    

const crearListaAulas  = () => {
  const lista = document.getElementById("Aulas")
  const inicio = document.createElement("option")
  inicio.setAttribute("value",0)
  inicio.selected = true
  inicio.setAttribute("id","iniAula")
  inicio.innerText="-Filtro Aula-"

  lista.appendChild(inicio)
  
  grupos.forEach(item => {
      let listo = document.createElement("option")
      listo.setAttribute("value",item.id)
      listo.innerText = item.nombre
      lista.appendChild(listo)
  });
  
}

const crearListaAreas  = () => {
    const lista = document.getElementById("Areas")
  
    const inicio = document.createElement("option")
    inicio.setAttribute("id","iniArea")
    inicio.setAttribute("value",0)
    inicio.selected = true
    inicio.innerText="-Filtro Area-"
  
    lista.appendChild(inicio)
    
    areas.forEach(item => {
        let listo = document.createElement("option")
        listo.setAttribute("value",item.id)
        listo.innerText = item.nombre
        lista.appendChild(listo)
    });
    
  }


const principal = () => {
    const boton1 = document.getElementById("buscar_boton")
    boton1.addEventListener("click",recuperarNombre) 

    const botonA = document.getElementById("Areas")
    const botonG = document.getElementById("Aulas")

    botonA.addEventListener("change",cambiarArea)
    botonG.addEventListener("change",cambiarAula)
    

    crearCuerpo()

    crearListaAreas()

    crearListaAulas()

}

window.addEventListener("load", principal)
