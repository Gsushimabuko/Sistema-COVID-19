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

const opciones = ["Sí","No"]


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
            input.disabled=true

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
    
            document.forms["ficha"]["friesgo"].value = ultima[0].frieso
    
            document.forms["ficha"]["ef1"].value = ultima[0].ef1
            document.forms["ficha"]["ef2"].value = ultima[0].ef2
            document.forms["ficha"]["ef3"].value = ultima[0].ef3
            document.forms["ficha"]["ef4"].value = ultima[0].ef4
            document.forms["ficha"]["ef5"].value = ultima[0].ef5
            document.forms["ficha"]["ef6"].value = ultima[0].ef6
            document.forms["ficha"]["ef7"].value = ultima[0].ef7
            document.forms["ficha"]["ef8"].value = ultima[0].ef8
            document.forms["ficha"]["ef9"].value = ultima[0].ef9
            document.forms["ficha"]["ef10"].value = ultima[0].ef10
            document.forms["ficha"]["ef11"].value = ultima[0].ef11
            document.forms["ficha"]["ef12"].value = ultima[0].ef12
    
            if(ultima[0].medicamento!=null){
                document.forms["ficha"]["medicina"].value = ultima[0].medicamento
            }

            document.forms["ficha"]["prueba"].value = ultima[0].prueba

}

const regresar = (evt) =>{
    history.back()
}


const main = () => {

    creartabla("tabla_personal","a")

    creartabla("tabla_familia","ef")

    traerDatos()

    const boton = document.getElementById("btnRegresar")
    boton.onclick = regresar

   
}


window.addEventListener("load", main)