const preguntas = [
    "Dolor de garganta o tos",
    "Sensacion de alza termica, fiebre o escalofrios",
    "Estornudos o congestion nasal",
    "Dificultadad para respirar",
    "Expectoración o flema amarilla o verdosa",
    "Dolor de musculos o articulaciones",
    "Dolor de cabeza",
    "Fatiga o malestar general",
    "Perdida de gusto o de olfato",
    "Diarrea",
    "Contacto con un caso confirmado de COVID - 19",
    "Contacto con un caso sospechoso de COVID - 19"
]

var estado

const opciones = ["Sí","No"]

const verificarEstado = () =>{

    const a1 = document.forms["ficha"]["a1"].value

    const a11 = document.forms["ficha"]["a11"].value

    const ef11 = 0

    const ef1 = 0

    if ( ef11 == 1){
        estado = 3
    } else if (a11 == 1) {
        estado = 2
    } else{
        sumaPer = 0
            for (let i = 2;i<13;i++){
                let valor = "a"+i
                sumaPer = sumaPer + document.forms["ficha"][valor].value
            }
    
        sumaFam = 0
    
        if(a1==1 && sumaPer != 0){
        //No puede entrar necesita la persona una prueba
            estado = 3
        } else if( ef1==1 && sumaFam != 0) {
        //No puede entrar necesita la persona una prueba pro sospecha del familiar
            estado = 3
        }else if(a1 ==  1 && sumaPer == 0){
            //puede entrar pero con recomendaciones
            estado = 1
        } else if (ef1 ==1 && sumaFam == 0){
        //puede entrar pero con recomendaciones
            estado = 1
        } else if (sumaPer !=0 || sumaFam !=0){
            //puede entrar pero con recomendaciones
            estado =  1
        } else {
            //puede entrar no se le necesita decir recomendaciones
            estado = 0
        }
    }
    
}

const actualizarBoton = () =>{

    const fecha = document.forms["ficha"]["fechaIngreso"].value

    if(fecha == ""){
        const boton = document.getElementById("boton_aceptar")
        boton.setAttribute("type","submit")
        boton.removeAttribute("data-bs-toggle")
        boton.removeAttribute("data-bs-target")

    } else {
        
        verificarEstado()

        const boton = document.getElementById("boton_aceptar")
        if (estado==0){
           boton.setAttribute("type","submit")
           boton.removeAttribute("data-bs-toggle")
           boton.removeAttribute("data-bs-target")
    
        }else {
            boton.setAttribute("type","button")
            boton.setAttribute("data-bs-toggle","modal")
            boton.setAttribute("data-bs-target","#exampleModal")     
        } 
        
        boton.addEventListener("click",actualizarMensaje)

    } 
}

const actualizarMensaje = () =>{

    const mensaje = document.getElementById("mensaje_doc")
    const estadoActual = document.getElementById("estadoActual")

    if (estado==0){
        mensaje.innerText = "Tiene Permiso"
        estadoActual.setAttribute("value",1)
    }else if (estado ==1) {
        mensaje.innerText = "Puede entrar pero con recomendaciones"
        estadoActual.setAttribute("value",1)
    }else if (estado ==2){
        mensaje.innerText = "No puede entrar hasta que se haga una evaluacion de descarte de COVID-19."
        estadoActual.setAttribute("value",2)
    }else{
        mensaje.innerText = "No puede entrar hasta que se haga una evaluacion de descarte de COVID-19."
        estadoActual.setAttribute("value",3)
    }

}


const creartabla = (nombre,a) => {
    const tabla = document.getElementById(nombre)
    
    let c = 1

    preguntas.forEach(p => {
        const fila = document.createElement("div")
        fila.setAttribute("class","row fila_tabla")

        const pre = document.createElement("div")
        pre.setAttribute("class","col-8")
        pre.innerText=p

        fila.appendChild(pre)

        let i = 1
        opciones.forEach(o => {
            const op = document.createElement("div")
            op.setAttribute("class","col-2 position-relative")
            
            const opRaiz =document.createElement("div")
            opRaiz.setAttribute("class","form-check position-absolute top-50 start-50 translate-middle")
            
            const input =document.createElement("input")
            input.setAttribute("class","form-check-input")
            input.setAttribute("type","radio")
            input.setAttribute("name",a+c)
            input.setAttribute("id","flexRadio"+a+c+i)
            input.setAttribute("value",i)
            input.addEventListener("click",actualizarBoton)

            if (i==0){
                input.checked = true    
            }
            
            const label =document.createElement("label")
            label.setAttribute("class","form-check-label")
            label.setAttribute("for","flexRadio"+a+c+i)
            label.innerText=o
            
            opRaiz.appendChild(input)
            opRaiz.appendChild(label)

            op.appendChild(opRaiz)

            fila.appendChild(op)

            i=i-1

        });

        c= c+1

        
        
        tabla.appendChild(fila)
    });

    
}

const traerDatos = () =>{

        if(ultima.length==0){
            alert("No se encuentra registro de alguna ficha llenada con anterioridad")
        } else{
            console.log("entro")
            if(ultima[0].salida!=null){
                document.forms["ficha"]["salida"].value = ultima[0].salida
            }
    
            document.forms["ficha"]["a1"].value = ultima[0].a1
            document.forms["ficha"]["a2"].value = ultima[0].a2
            document.forms["ficha"]["a3"].value = ultima[0].a3
            document.forms["ficha"]["a4"].value = ultima[0].a4
            document.forms["ficha"]["a5"].value = ultima[0].a5
            document.forms["ficha"]["a6"].value = ultima[0].a6
            document.forms["ficha"]["a7"].value = ultima[0].a7
            document.forms["ficha"]["a8"].value = ultima[0].a8
            document.forms["ficha"]["a9"].value = ultima[0].a9
            document.forms["ficha"]["a10"].value = ultima[0].a10
            document.forms["ficha"]["a11"].value = ultima[0].a11
            document.forms["ficha"]["a12"].value = ultima[0].a12

            document.forms["ficha"]["prueba"].value = ultima[0].prueba
    
            verificarEstado()
        }

}


const verificarFecha = () =>{
    
    var encontrado = 0

    fechas.forEach(e => {
        if(e.fecha.substring(0,10) == document.forms["ficha"]["fechaIngreso"].value){
            encontrado = 1
            actualizarBoton()
        }
    });
    
    if (encontrado == 1){
        alert("No se puede llenar una ficha de un dia que ya se realizo")
        document.forms["ficha"]["fechaIngreso"].value = null
        actualizarBoton()
    } else{
        actualizarBoton() 
    }

}

const regresar = (evt) =>{
    history.back()
}



const main = () => {

    creartabla("tabla_personal","a")

    const botonCarga = document.getElementById("cargar_ficha")
    botonCarga.addEventListener("click",traerDatos)

    const inputFecha = document.forms["ficha"]["fechaIngreso"]

    console.log(inputFecha.value)

    inputFecha.addEventListener("change",verificarFecha)

    const boton = document.getElementById("btnRegresar")
    boton.onclick = regresar
    
   
}


window.addEventListener("load", main)