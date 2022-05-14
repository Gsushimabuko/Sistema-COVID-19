const express = require('express')
const router = express.Router()

const db = require('../../dao/models')
var moment = require('moment'); // require
moment().format(); 
const fileUpload = require('express-fileupload')
const { Op, where } = require("sequelize");
const mimeTypes = require('mime-types')
const readline = require('readline');
const {google} = require('googleapis');

const fs = require('fs');
const qrcode = require("qrcode");
const XLSX = require('xlsx')
const path = require('path')



const authController = require('../controllers/authController')
const { auth } = require('googleapis/build/src/apis/abusiveexperiencereport')


const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
  );

oauth2Client.setCredentials({ refresh_token:  process.env.REFRESH_TOKEN });

router.get("/reporte_ficha_alumnos", [authController.isAuthentificated,authController.isSistema], async (req,res) =>{

    let Llenaron = []
    let faltaronLlenar = []
    let noLlenaron = []

    const fechaLimite = moment().startOf('day').toDate() 

    const alumnos = await db.Persona.findAll({

        where:{
            esAlumno: 1,
            estado:{
                [Op.in]: [0,1]
            }
        }
        
        , order : [
            ['apellidop', 'ASC']
        ]
    })
    
    const fichas =  await db.Ficha.findAll({
        where: {
          fechaIngreso: {
            [Op.gte]: fechaLimite
          }
        }
    })

    fichas.forEach(f => {
        if (!Llenaron.includes(f.personaId)){
            Llenaron.push(f.personaId)
        }       
    });

    alumnos.forEach(a => {
            if(!Llenaron.includes(a.id)){
                faltaronLlenar.push(a)
            }
    });

    await Promise.all(faltaronLlenar.map(async alumno => {

        if(alumno.getGrupo == null){
            return res.send("ERROR, HAY ALUMNOS SIN SALONES ASIGNADOS")
        }

        const grupo = await alumno.getGrupo()
        
        let padre = "-"
        if (alumno.apoderadopId != null){   
            
            const padreObjeto = await db.Persona.findOne({
                where:{
                    id : alumno.apoderadopId
                }
        
            })

            padre = padreObjeto.nombre + " " + padreObjeto.apellidop + " " + padreObjeto.telefono
            
        }
        let madre = "-"
        if (alumno.apoderadomId != null){
            
            const madreObjeto = await db.Persona.findOne({
                where:{
                    id : alumno.apoderadomId
                }
        
            })

            madre = madreObjeto.nombre + " " + madreObjeto.apellidop + " " + madreObjeto.telefono
            
        }

        noLlenaron.push({ 
            id : alumno.id,              
            nombre :  alumno.nombre,
            apellidop: alumno.apellidop,
            telefono: alumno.telefono,
            salon : grupo.nombre,
            padre : padre,
            madre : madre
        })

    }));

    return res.render("reporte_ficha_alumnos",{alumnos: noLlenaron})

})

router.get("/fichas_total/:id",[authController.isAuthentificated,authController.isSistema], async(req,res) =>{
    const fichas = await db.Ficha.findAll({
        where :{personaId: req.params.id},
        order : [['fechaIngreso', 'DESC']]
    })

    const persona = await db.Persona.findOne({
        where :{id: req.params.id}
    })

    console.log(persona)

    res.render("casos_ficha_persona", {moment:moment,fichas : fichas,persona:persona})

})


router.get("/alumnos_asist_main", [authController.isAuthentificated,authController.isSistema], async (req,res) =>{

    const secciones = await db.Grupo.findAll({})

    let listaSecciones = []

    for(let seccion of secciones){
        
        const cantAlumnos = await db.Persona.count({
            where :{
                grupoId : seccion.id
            }
        })

        console.log(cantAlumnos)

        if(cantAlumnos!=0){

            const grupo = await db.Grupo.findOne({
                where :{
                    id : seccion.id
                }
            })

            listaSecciones.push({
                id : seccion.id,
                nombre : grupo.nombre
            })

        }

    }


    res.render('asistencia_alumnos_main',{secciones:listaSecciones})
    
})

router.get("/alumnos_asist/:grupoId", [authController.isAuthentificated,authController.isSistema], async (req,res) =>{

    const grupoId = req.params.grupoId

    const fechaLimite = moment().startOf('day').toDate() 

    const personas = await db.Persona.findAll({

        where:{
            grupoId: grupoId
        }, order : [
            ['apellidop', 'ASC']
        ]
    })
    
    console.log("PERSONAS", personas)

    let listaGrande = []
    
    await Promise.all(personas.map (async persona => {

        try{

            const entradasSalidas = await db.EntradaSalida.findAll({where: {
                fechaHora: {
                    [Op.gte]: fechaLimite
                  },
                //Que tengan el mismo id que el alumno
                personaId: persona.id
                //Ordenarlas por id para que aparezcan en orden
              },order : [
                ['id', 'ASC']
            ]
            })

            if (entradasSalidas.length >= 1){

                const primerPase =  entradasSalidas[0]
                const ultimoPase =  entradasSalidas[entradasSalidas.length - 1]
        
                let listaPersonal  = {id: persona.id, nombre: persona.nombre, apellidop: persona.apellidop, primerPase: primerPase, ultimoPase: ultimoPase}
                
                listaGrande.push(listaPersonal)
                
            }else{

                let listaPersonal  = {id: persona.id, nombre: persona.nombre, apellidop: persona.apellidop, primerPase: "-", ultimoPase: "-"}

                listaGrande.push(listaPersonal)
                
            }
    
            
        } catch (error) {
            
            console.log(error)
            return res.send("ERROR"+ error)
        }
    }))

   
    //TERMINA LA PROMESA
    return res.render('asistencia_alumnos', {fecha: fechaLimite ,personas:personas, asistencia: listaGrande})
    })


router.get("/asistencias_individuales/:alumnoId", [authController.isAuthentificated,authController.isSistema], async (req,res) =>{

    const entradas = await db.EntradaSalida.findAll({
        where:{
            personaId: req.params.alumnoId
        }
    })


    return res.render('asistencias_individuales', {entradas: entradas} )  
})
router.get("/ver_fichas/:grupoId", [authController.isAuthentificated,authController.isSistema], async (req,res) =>{

    const grupoId = req.params.grupoId

   

    const fechaLimite = moment().startOf('day').toDate() 

    const alumnos = await db.Persona.findAll({

        where:{
            grupoId: grupoId
        }, order : [
            ['apellidop', 'ASC']
        ]
    })
    

    const fichas =  await db.Ficha.findAll({
        where: {
          fechaIngreso: {
            [Op.gte]: fechaLimite
          }
        }
      })


    res.render('ver_fichas', {alumnos:alumnos, fichas : fichas})  
})
router.get("/ver_fichas_main", [authController.isAuthentificated,authController.isSistema], async (req,res) =>{

    const secciones = await db.Grupo.findAll({})


    res.render('ver_fichas_main',{secciones:secciones})
    
})


router.post("/probandopromesas/:puerta", async (req,res) => {

    // una vez se realiza el post, se envia el form como data
    try {

        var fecha = moment()

        const dni = req.body.dni

        const persona =  await db.Persona.findOne({
            where :{
                dni : dni
            }
        })

        const cuentaFicha = await db.Ficha.count({where: {
            personaId : persona.id,
        }}) 

        const fichas = await db.Ficha.findAll({
            where :{
                personaId : persona.id
            }
        })

        var tieneFicha = 0

        fichas.forEach(e => {
            console.log(e.fechaIngreso,fecha)
            if(e.fechaIngreso.getDate() == fecha.get("Date") &&
            e.fechaIngreso.getMonth() == fecha.get("Month") &&
            e.fechaIngreso.getFullYear() == fecha.get("Year")){
                tieneFicha = tieneFicha + 1
                console.log("encontro ficha")
            } 
        });

        var fechaActual = moment().toISOString()
    
        if (persona.estado > 1){
            // es posible o positivo
            result = {
                persona:persona,
                estadoEntrada:0
            }
            return res.send(result)
        }else{
            if(cuentaFicha==0){
                //no tienen fichas llenadas
                result = {
                    persona:persona,
                    estadoEntrada:1
                }
                return res.send(result)

            }else{            
                if(tieneFicha >= 1){
                        //Se lleno la ficha y es negativo
                        if (persona.adentro == null){
                            persona.adentro = 0
                        }

                        await db.EntradaSalida.create({
                            personaId: persona.id,
                            fechaHora : fechaActual,
                            estado : req.body.puerta
                        })
                
                        if (persona.adentro==0 || persona.adentro == null){
                            persona.adentro = 1
                        } else{
                            persona.adentro = 0
                        }
                
                        await persona.save()
    
                        result = {
                            persona:persona,
                            estadoEntrada:2
                        }

                        return res.send(result)
                    }else{
                        //persona que no lleno la ficha y es negativo
                        result = {
                            persona:persona,
                            estadoEntrada:1
                        }
                        return res.send(result)  
                    }   
            }
        }

    } catch (error) {

        console.log("ERROR: ",error)

        result = {
        persona:null,
        estadoEntrada:4
        }

        return res.send(result)   
    }
      
});


router.get("/subir", [authController.isAuthentificated,authController.isSistema], async (req,res) =>{
    res.render('subir_persona_masiva')  
})


router.get("/recuperar_db", async (req,res) =>{

    const personas = await db.Persona.findAll({})

    var filas =[]

    var cabeza =['id','dni','nombre','apellidop','apellidom','telefono','estado','esAlumno','esApoderado','esPersonal','adentro','am1','am2','am3','am4','am5','am6','am7','otro','familiaId','areaId','grupoId','apoderadopId','apoderadom']

    filas.push(cabeza)

    personas.forEach(p => {
        var col =[] 
        col.push(p.id)
        col.push(p.dni)
        col.push(p.nombre)
        col.push(p.apellidop)
        col.push(p.apellidom)
        col.push(p.telefono)
        col.push(p.estado)
        col.push(p.esAlumno)
        col.push(p.esApoderado)
        col.push(p.esPersonal)
        col.push(p.adentro)
        col.push(p.am1)
        col.push(p.am2)
        col.push(p.am3)
        col.push(p.am4)
        col.push(p.am5)
        col.push(p.am6)
        col.push(p.am7)
        col.push(p.otro)
        col.push(p.familiaId)
        col.push(p.areaId)
        col.push(p.grupoId)
        col.push(p.apoderadopId)
        col.push(p.apoderadomId)
        filas.push(col)  
    });

    const workBook = XLSX.utils.book_new()

    const workSheet = XLSX.utils.aoa_to_sheet(filas)


    XLSX.utils.book_append_sheet(workBook,workSheet,"personas")
    
    
    XLSX.write(workBook,{bookType:'xlsx',type:"buffer"}) 

    XLSX.write(workBook,{bookType:'xlsx',type:"binary"}) 

    XLSX.writeFile(workBook,"uploads/personasData.xlsx")

    const drive = google.drive({version: 'v3',auth: oauth2Client});

    const targetFolderId = '1nJ0bXJab62Te2sNa4IpzqBqyZNmYQgXs';

    let nombreArchivo = 'personasData' + "-" + moment().format().substring(0,10)+ "-" +Date.now().toString()

    try{
        const response = await drive.files.create({
            requestBody: {
                name: nombreArchivo, //file name
                mimeType: 'application/vnd.google-apps.spreadsheet',
                parents: [targetFolderId]
                    },
            media: {
                mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                body: fs.createReadStream("uploads/personasData.xlsx"),
                    },
        });

        fs.unlink("uploads/personasData.xlsx", (err) => {
            if (err) {
                console.error(err)
                return
            }
        })  

        }catch (error) {
            //report the error message
            console.log(error.message);
        }

        res.send('se recupero correctamente')

})

router.get("/eliminarexternos/:id",[authController.isAuthentificated,authController.isSistema], async (req,res) => {

    
    const externo = await db.Persona.findOne({
        where : {
            id : req.params.id
        }
    })

    externo.estado = 0
    //faltan eliminar los FKs de HITO y Ficha
    externo.save()

    res.redirect("/gestionexternos")

    
})

router.get("/asistencia/",[authController.isAuthentificated,authController.isSistema], async (req,res) =>{

    const fecha = moment().startOf('day').format()

    const entradas = await db.EntradaSalida.findAll({
        where : {
            fechaHora : {
                [Op.gt]: fecha
            }
           
        }
    })
 
    const personas = await db.Persona.findAll({
        where : {
            esPersonal : 1
        }
    })

    
    res.render("asistencia", {entradas :entradas,  personas : personas})
})


router.post("/buscarAsistencia",[authController.isAuthentificated,authController.isSistema], async (req,res) => {

    console.log("DNI: ", req.body.dni)

    res.send("módulo en construcción")
})



router.post("/asistencia_eliminar",[authController.isAuthentificated,authController.isSistema], async (req,res) => {

    console.log("Eliminando registros de asistencia...")
    
    await db.EntradaSalida.destroy({
        where: {},
        
      })
      
   
    res.redirect("/asistencia")
})

router.get("/editarexternos/:id",[authController.isAuthentificated,authController.isSistema], async (req,res) => {

    let sexo 

    const alumno = await db.Persona.findOne({where: {
        id : req.params.id

    }}) 

    const hijosPadre = await db.Persona.findAll({
        where: {
            apoderadopId : alumno.id
        }
    })

    const hijosMadre = await db.Persona.findAll({
        where: {
            apoderadomId : alumno.id
        }
    })
    
    if( hijosPadre[0] == null ){
        sexo = 'f'
    }else{
        sexo = 'm'
    }

    if(sexo == 'm'){

       return res.render("editarexternos", {alumno: alumno, hijos:hijosPadre})
    }else{
        return res.render("editarexternos", {alumno: alumno, hijos:hijosMadre})
    }

})
router.get("/gestionexternos",[authController.isAuthentificated,authController.isSistema], async (req,res) =>{

        const alumnos = await db.Persona.findAll({
            where :{
                esApoderado : 1,
                
            }, order : [
                ['apellidop', 'ASC']
            ]
        })
       
        res.render('gestionexternos', { alumnos: alumnos}) 
})
router.get("/agregarexternos",[authController.isAuthentificated,authController.isSistema], async (req,res) => {
    
    res.render("agregarexternos")
})

router.get("/gestion",[authController.isAuthentificated,authController.isSistema], (req,res) =>{
    res.render('gestion_personas_main')
})

router.get("/gestionalumnos/:grupos",[authController.isAuthentificated,authController.isSistema], async (req,res) =>{
    const grupo = await db.Grupo.findAll({}) 
    const idGrupo =  req.params.grupos   

    if(idGrupo == -1){
        
        const alumnos = await db.Persona.findAll({
            where :{
                esAlumno : 1,
                
            } , order : [
                ['apellidop', 'ASC']
            ]
        })
       
        res.render('gestionalumnos', {salones: grupo, alumnos: alumnos, nombreSalon : -1})

    }else{
        const alumnos = await db.Persona.findAll({
            where :{
                grupoId : idGrupo,
                esAlumno : 1,
                
            }, order : [
                ['apellidop', 'ASC']
            ]
        })
        //buscando el grupo
        const grupoElegido = await db.Grupo.findOne({
            where : {
                id : idGrupo
            }
        })
        
        res.render('gestionalumnos', {salones: grupo, alumnos: alumnos, nombreSalon : grupoElegido.nombre})

    } 

})

router.get("/agregaralumnos",[authController.isAuthentificated,authController.isSistema], async (req,res) => {
    const grupo = await db.Grupo.findAll({}) 
    res.render("agregaralumnos", {salones : grupo})
})

router.get("/agregarpadre/:dnipadre/:dnialumno",[authController.isAuthentificated,authController.isSistema], async (req,res) => {


    const dniPadre = req.params.dnipadre
    const dniAlumno = req.params.dnialumno

    const alumno = await db.Persona.findOne({
        where : {
            dni : dniAlumno
        }
    })
    const padre = await db.Persona.findOne({
        where : {
            dni : dniPadre
        }
    })

    alumno.apoderadopId = padre.id

    alumno.save()

return res.redirect("/editaralumnos/"+ alumno.id)
})
router.get("/agregarmadre/:dnimadre/:dnialumno",[authController.isAuthentificated,authController.isSistema], async (req,res) => {


    const dniMadre = req.params.dnimadre
    const dniAlumno = req.params.dnialumno

    const alumno = await db.Persona.findOne({
        where : {
            dni : dniAlumno
        }
    })
    const madre = await db.Persona.findOne({
        where : {
            dni : dniMadre
        }
    })

    alumno.apoderadomId = madre.id

    alumno.save()

return res.redirect("/editaralumnos/"+ alumno.id)
})
router.get("/editarpadres/:dnialumno",[authController.isAuthentificated,authController.isSistema], async (req,res) => {

    const alumno = await db.Persona.findOne({where: {
        dni : req.params.dnialumno
    }}) 

    const externos = await db.Persona.findAll({
        where : {
            esApoderado : 1
        }
    })

    return res.render("editarpadres", {alumno: alumno, externos: externos})


})


router.get("/editaralumnos/:id",[authController.isAuthentificated,authController.isSistema], async (req,res) => {

    const alumno = await db.Persona.findOne({where: {
        id : req.params.id
    }}) 

    const grupos = await db.Grupo.findAll({}) 
    
    let padre = "No hay padre asignado"
    let madre = "No hay madre asignada"

    console.log("APODERADO P ID: ", alumno.apoderadopId)

    if (alumno.apoderadopId != null){
        padre = await db.Persona.findOne({
            where : {
                id : alumno.apoderadopId
            }
        }) 
        
    }
    
    if (alumno.apoderadomId != null){
        madre = await db.Persona.findOne({
            where : {
                id : alumno.apoderadomId
            }
        }) 
        
    }

    res.render("editaralumnos", {alumno: alumno, salones: grupos, padre: padre, madre : madre})


})

router.get("/eliminaralumnos/:id",[authController.isAuthentificated,authController.isSistema], async (req,res) => {
    const persona = await db.Persona.findOne({
        where : { id : req.params.id} })
    
    persona.estado = 0

    await persona.save()

    res.redirect("/gestionalumnos/"+persona.grupoId)
})

router.get("/gestionpersonal/:grupos",[authController.isAuthentificated,authController.isSistema], async (req,res) =>{
    const grupo = await db.Area.findAll({}) 
    const idGrupo =  req.params.grupos   

    if(idGrupo == -1){
        
        const alumnos = await db.Persona.findAll({
            where :{
                esPersonal : 1,
                
            }, order : [
                ['apellidop', 'ASC']
            ]
        })
       
        res.render('gestionpersonal', {salones: grupo, alumnos: alumnos, nombreSalon : -1})

    }else{
        const alumnos = await db.Persona.findAll({
            where :{
                areaId : idGrupo,
                esPersonal : 1,
                
            }, order : [
                ['apellidop', 'ASC']
            ]
        })
        //buscando el grupo
        const grupoElegido = await db.Area.findOne({
            where : {
                id : idGrupo
            }
        })

        
        res.render('gestionpersonal', {salones: grupo, alumnos: alumnos, nombreSalon : grupoElegido.nombre})

    } 

})

router.get("/agregarpersonal",[authController.isAuthentificated,authController.isSistema], async (req,res) => {
    const grupo = await db.Area.findAll({}) 
    res.render("agregarpersonal", {salones : grupo})
})

router.get("/eliminarpersonal/:id",[authController.isAuthentificated,authController.isSistema], async (req,res) => {


    const personal = await db.Persona.findOne({
         where : {
             id : req.params.id
         }
     })
 
    personal.estado = 0
    await personal.save()
     
 
     res.redirect("/gestionpersonal/"+personal.areaId)
 })

 router.get("/editarpersonal/:id",[authController.isAuthentificated,authController.isSistema], async (req,res) => {
    
    const alumno = await db.Persona.findOne({where: {
        id : req.params.id
    }}) 

    const grupos = await db.Area.findAll({}) 
    res.render("editarpersonal", {alumno: alumno, salones: grupos})
})

router.post("/subida_masiva", async (req,res) =>{
    var archivo = req.files.file

    let ext = mimeTypes.extension(archivo.mimetype)

    archivo.name = moment().format().substring(0,10)+ "-" +Date.now().toString()+"." + ext
        
    let uploadPath = "uploads/" + archivo.name
    
    await archivo.mv(uploadPath)

    const workBook = XLSX.readFile(uploadPath)
    const workBookSheets = workBook.SheetNames;

    const sheet = workBookSheets[0];
    const dataExcel = XLSX.utils.sheet_to_json(workBook.Sheets[sheet])

    console.log(dataExcel[0])

    let i = 1

    
    await Promise.all(dataExcel.map(async e => {
        try {

            const encontro = await db.Persona.count({
                where : {
                    dni : e.dni
                }
            })
            
            if(encontro==0){
                
                try {
    
                if(e.esAlumno==1){
    
                        const encontroPapa = await db.Persona.count({
                            where : {
                                dni : e.apoderadopId
                            }
                        })
        
                        const encontroMama = await db.Persona.count({
                            where : {
                                dni : e.apoderadomId
                            }
                        })
                        
                        var idPapa
                        var idMama
                        
                        if(encontroPapa==0){
        
                            idPapa = null
                            
                        }else{
                            const apoderadoPapa = await db.Persona.findOne({
                                where : {
                                    dni : e.apoderadopId
                                }
                            })
        
                            idPapa = apoderadoPapa.id
        
                        }
        
                        if(encontroMama==0){
        
                            idMama = null
        
                        }else{
        
                            const apoderadoMama = await db.Persona.findOne({
                                where : {
                                    dni : e.apoderadomId
                                }
                            })
        
                            idMama = apoderadoMama.id
        
                        }
        
                        await db.Persona.create({  
                            dni : e.dni,
                            nombre : e.nombre,
                            apellidop : e.apellidop,
                            apellidom : e.apellidom,
                            grupoId : e.grupoId,
                            apoderadopId: idPapa,
                            apoderadomId: idMama,
                            adentro : 0,
                            telefono: e.telefono,
                            am1 : 0,
                            am2 : 0,
                            am3 : 0,
                            am4 : 0,
                            am5 : 0,
                            am6 : 0,
                            am7 : 0,
                            am8 : 0,
                            otro : '',
                            estado: 1,
                            esPersonal : 0,
                            esApoderado : 0,  
                            esAlumno : 1
                        })   
                        
                        console.log(i)
                        i=i+1
                        
                } else if(e.esApoderado==1 && e.esPersonal==1){
        
                    await db.Persona.create({  
                        dni : e.dni,
                        nombre : e.nombre,
                        apellidop : e.apellidop,
                        apellidom : e.apellidom,
                        areaId : e.areaId,
                        adentro : 0,
                        telefono: e.telefono,
                        am1 : 0,
                        am2 : 0,
                        am3 : 0,
                        am4 : 0,
                        am5 : 0,
                        am6 : 0,
                        am7 : 0,
                        am8 : 0,
                        otro : '',
                        estado: 1,
                        esPersonal : 1,
                        esApoderado : 1,  
                        esAlumno : 0
                    })
                    console.log(i)
                    i=i+1
        
                } else if(e.esApoderado==1){
        
                    await db.Persona.create({  
                        dni : e.dni,
                        nombre : e.nombre,
                        apellidop : e.apellidop,
                        apellidom : "",
                        adentro : 0,
                        telefono: e.telefono,
                        am1 : 0,
                        am2 :0,
                        am3 : 0,
                        am4 : 0,
                        am5 : 0,
                        am6 : 0,
                        am7 : 0,
                        am8 : 0,
                        otro : '',
                        estado: 1,
                        esPersonal : 0,
                        esApoderado : 1,  
                        esAlumno : 0
                    })
                    console.log(i)
                    i=i+1
        
                } else if(e.esPersonal==1){
                    await db.Persona.create({  
                        dni : e.dni,
                        nombre : e.nombre,
                        apellidop : e.apellidop,
                        apellidom : e.apellidom,
                        areaId : e.areaId,
                        adentro : 0,
                        telefono: e.telefono,
                        am1 : 0,
                        am2 : 0,
                        am3 : 0,
                        am4 : 0,
                        am5 : 0,
                        am6 : 0,
                        am7 : 0,
                        am8 : 0,
                        otro : '',
                        estado: 1,
                        esPersonal : 1,
                        esApoderado : 0,  
                        esAlumno : 0
                    })
                    console.log(i)
                    i=i+1
                }
    
            } catch (error) {
                console.log(error)
            }
    
            }else{
    
                try {
                    
                    const perMod = await db.Persona.findOne({
                        where : {
                            dni : e.dni
                        }
                    })
        
                    if(e.esAlumno==1){
        
                        const encontroPapa = await db.Persona.count({
                            where : {
                                dni : e.apoderadopId
                            }
                        })
        
                        const encontroMama = await db.Persona.count({
                            where : {
                                dni : e.apoderadomId
                            }
                        })
        
                        var idPapa
                        var idMama
                        
                        if(encontroPapa==0){
        
                            idPapa = null
                            
                        }else{
                            const apoderadoPapa = await db.Persona.findOne({
                                where : {
                                    dni : e.apoderadopId
                                }
                            })
        
                            idPapa = apoderadoPapa.id
        
                        }
        
                        if(encontroMama==0){
        
                            idMama = null
        
                        }else{
        
                            const apoderadoMama = await db.Persona.findOne({
                                where : {
                                    dni : e.apoderadomId
                                }
                            })
        
                            idMama = apoderadoMama.id
        
                        }
        
        
                        perMod.nombre = e.nombre
                        perMod.apellidop = e.apellidop
                        perMod.apellidom = e.apellidom
                        perMod.grupoId = e.grupoId
                        perMod.apoderadopId = idPapa  
                        perMod.apoderadomId = idMama
                        perMod.telefono = e.telefono

                        await perMod.save()
                    
                        console.log(i)
                        i=i+1
            
                    } else if(e.esApoderado==1 && e.esPersonal==1){
            
                
                        perMod.nombre = e.nombre
                        perMod.apellidop = e.apellidop
                        perMod.apellidom = e.apellidom
                        perMod.areaId = e.areaId
                        perMod.telefono = e.telefono
                        perMod.esApoderado = 1
                        perMod.esPersonal = 1
        
                        await perMod.save()
                       
                        console.log(i)
                        i=i+1
            
                    } else if(e.esApoderado==1){
            
                        perMod.nombre = e.nombre
                        perMod.apellidop = e.apellidop
                        perMod.apellidom = e.apellidom
                        perMod.telefono = e.telefono
                        perMod.esApoderado = 1

                        console.log("EsPersonal",e.esPersonal)

                        if(e.esPersonal!=undefined){
                            perMod.esPersonal= e.esPersonal
                        }
                        
        
                        await perMod.save()
        
                        console.log(i)
                        i=i+1
            
                    } else if(e.esPersonal==1){
        
                        perMod.nombre = e.nombre
                        perMod.apellidop = e.apellidop
                        perMod.apellidom = e.apellidom
                        perMod.areaId = e.areaId
                        perMod.telefono = e.telefono
                        perMod.esPersonal = 1

                        console.log("EsApoderado",e.esApoderado)

                        if(e.esApoderado!=undefined){
                            perMod.esApoderado= e.esApoderado
                        }
                      
        
                        await perMod.save()
        
                        console.log(i)
                        i=i+1
                    }
                } catch (error) {
                    console.log(error)
                
                }
    
    
    
            }
            
        } catch (error) {
            console.log(error)
        }
       
        

    }))


    fs.unlink(uploadPath, (err) => {
        if (err) {
            console.error(err)
            return
        }
    })  

    res.send('Subio Correctamente')
})

router.post("/gestionalumnos", async (req,res) =>{

    const idGrupo =  req.body.grupo   

    res.redirect("/gestionalumnos/"+idGrupo)

})

router.post("/agregaralumnos", async (req,res) => {
    const dni = req.body.dni
    const nombre = req.body.nombre
    const apellidom = req.body.apellidom
    const apellidop = req.body.apellidop
    const grupo = req.body.grupo
    const telefono = req.body.telefono
    const am1 = req.body.am1
    const am2 = req.body.am2
    const am3 = req.body.am3
    const am4 = req.body.am4
    const am5= req.body.am5
    const am6 = req.body.am6
    const am7 = req.body.am7
    const am8 = req.body.am8
    const otro = req.body.otro


    if(grupo == "all"){
        return res.send("Rellene todos los campos")
    }
  
    //telefono, fecha Nac, 

    await db.Persona.create({  
        dni : dni,
        nombre : nombre,
        apellidop : apellidop,
        apellidom : apellidom,
        grupoId : grupo,
        telefono: telefono,
        am1 : am1,
        am2 : am2,
        am3 : am3,
        am4 : am4,
        am5 : am5,
        am6 : am6,
        am7 : am7,
        am8 : am8,
        otro : otro,
        estado: 1,
        esPersonal : 0,
        esApoderado : 0,  
        esAlumno : 1 
    })

    res.redirect("/gestionalumnos/"+grupo)

})


router.post("/editaralumnos/:id", async (req,res) => {

    console.log("ID: ", req.params.id)

    const nuevoDni = req.body.dni
    const nuevoNombre = req.body.nombre
    const nuevoApellidom = req.body.apellidom
    const nuevoApellidop = req.body.apellidop
    const nuevoGrupo = req.body.grupo

    if(nuevoGrupo == "all"){
        return res.send("Rellene todos los campos")
    }

    const nuevoTelefono = req.body.telefono

    const alumno = await db.Persona.findOne({where: {
        id : req.params.id
    }}) 

    alumno.dni = nuevoDni
    alumno.nombre = nuevoNombre
    alumno.apellidop = nuevoApellidop
    alumno.apellidom = nuevoApellidom
    
    alumno.grupoId = nuevoGrupo
    alumno.telefono = nuevoTelefono
    await alumno.save()
    res.redirect("/gestionalumnos/"+alumno.grupoId)
})


router.post("/gestionpersonal", async (req,res) =>{

    const idGrupo =  req.body.grupo   

    res.redirect("/gestionpersonal/"+idGrupo)

})

router.post("/agregarpersonal", async (req,res) => {
    const dni = req.body.dni
    const nombre = req.body.nombre
    const apellidom = req.body.apellidom
    const apellidop = req.body.apellidop
    const grupo = req.body.grupo

    if(grupo == "all"){
        return res.send("Rellene todos los campos")
    }

    const telefono = req.body.telefono
    const esApoderado = req.body.esApoderado
    const am1 = req.body.am1
    const am2 = req.body.am2
    const am3 = req.body.am3
    const am4 = req.body.am4
    const am5= req.body.am5
    const am6 = req.body.am6
    const am7 = req.body.am7
    const am8 = req.body.am8
    const otro = req.body.otro

  
    //telefono, fecha Nac, 

    await db.Persona.create({  
        dni : dni,
        nombre : nombre,
        apellidop : apellidop,
        apellidom : apellidom,
        areaId : grupo,
        telefono: telefono,
        am1 : am1,
        am2 : am2,
        am3 : am3,
        am4 : am4,
        am5 : am5,
        am6 : am6,
        am7 : am7,
        am8 : am8,
        otro : otro,
        estado: 1,
        esPersonal : 1,
        esApoderado : esApoderado,  
        esAlumno : 0 
    })
    res.redirect("/gestionpersonal/"+grupo)
})

router.post("/editarpersonal/:id", async (req,res) => {
    
    

    const nuevoDni = req.body.dni
    const nuevoNombre = req.body.nombre
    const nuevoApellidom = req.body.apellidom
    const nuevoApellidop = req.body.apellidop
    const nuevoGrupo = req.body.grupo

    if(nuevoGrupo == "all"){
        return res.send("Rellene todos los campos")
    }


    const nuevoTelefono = req.body.telefono

    const alumno = await db.Persona.findOne({where: {
        id : req.params.id
    }}) 

    alumno.dni = nuevoDni
    alumno.nombre = nuevoNombre
    alumno.apellidop = nuevoApellidop
    alumno.apellidom = nuevoApellidom
    
    alumno.areaId = nuevoGrupo
    alumno.telefono = nuevoTelefono



    await alumno.save()
    res.redirect("/gestionpersonal/"+alumno.areaId)
})

router.post("/agregarexternos", async (req,res) => {
    const dni = req.body.dni
    const nombre = req.body.nombre
    const apellidom = req.body.apellidom
    const apellidop = req.body.apellidop
    const grupo = req.body.grupo

    if(grupo == "all"){
        return res.send("Rellene todos los campos")
    }
    const telefono = req.body.telefono

    const esApoderado = req.body.esApoderado
    const am1 = req.body.am1
    const am2 = req.body.am2
    const am3 = req.body.am3
    const am4 = req.body.am4
    const am5= req.body.am5
    const am6 = req.body.am6
    const am7 = req.body.am7
    const am8 = req.body.am8
    const otro = req.body.otro

    //telefono, fecha Nac, 
    await db.Persona.create({  
        dni : dni,
        nombre : nombre,
        apellidop : apellidop,
        apellidom : apellidom,
        areaId : grupo,
        telefono: telefono,
        
        am1 : am1,
        am2 : am2,
        am3 : am3,
        am4 : am4,
        am5 : am5,
        am6 : am6,
        am7 : am7,
        am8 : am8,
        otro : otro,
        estado: 1,
        
        esApoderado : esApoderado,  
        esAlumno : 0 
    })
    res.redirect("/gestionexternos")
})

router.post("/editarexternos/:id", async (req,res) => {

    const nuevoDni = req.body.dni
    const nuevoNombre = req.body.nombre
    const nuevoApellidom = req.body.apellidom
    const nuevoApellidop = req.body.apellidop
    const nuevoTelefono = req.body.telefono


    const alumno = await db.Persona.findOne({where: {
        id : req.params.id
    }}) 

    alumno.dni = nuevoDni
    alumno.nombre = nuevoNombre
    alumno.apellidop = nuevoApellidop
    alumno.apellidom = nuevoApellidom
    alumno.telefono = nuevoTelefono
    
    await alumno.save()

    res.redirect("/gestionexternos")
})


router.get("/generarqrmasivo", async (req,res) => {
    
    let contador = 0
    const personal = await db.Persona.findAll({

        where:{
            esAlumno : 1
        }, order : [
            ['grupoId', 'ASC'] ,
            ['apellidop', 'ASC']
        ]


    })


    console.log("-------------IMPRMIENDO---------------------")

    let lista = []

    for(e of personal){
        
        const nombre =  e.nombre
        const apellido =  e.apellidop
        const seccion = await e.getGrupo()
        const QR =  await qrcode.toDataURL(e.dni)
        
        
        const htmlContent =  `
        <div> ------------------------------------- </div>
         <div style="justify-content: center; align-items: center;">
            <div> <h2>${nombre} ${apellido} </h2> </div>
            <div> <h2>${seccion.nombre} </h2> </div>
           
            
            <div style=" display: flex; align-items: right;">
            <div> <img width="150px" src="${QR}">  </div>
            
            
            </div>
        </div>
        <div> ------------------------------------- </div>
        `;
    
         lista.push(htmlContent)
    }
            

        contador++

    

    console.log(lista)

    return res.render("pruebaImpresionQR",{lista : lista})
  

    
})

router.get("/eliminarusuarios", async (req,res) => {

    listaAlumnos = []
    
    const alumnos = await db.Persona.findAll({
        where:{
            esAlumno : 1
        }
    })
    
    await Promise.all(alumnos.map(async alumno => {

        
        if(alumno.getGrupo == null){
            return res.send("ERROR, HAY ALUMNOS SIN SALONES ASIGNADOS")
        }
        
        const grupo = await alumno.getGrupo()
       

        listaAlumnos.push({
            nombre : alumno.nombre,
            apellidop : alumno.apellidop,
            dni : alumno.dni,
            seccion : grupo.nombre
        })

    }))
    

    res.render("eliminarusuarios",{listaAlumnos: listaAlumnos})
})

router.get("/eliminar/:dni", async (req,res) =>{

    console.log("DNI PARAMS: ", req.params.dni)
   

    const busqueda = await db.Persona.findOne({
        where : {
            dni: req.params.dni
        }
    })

    const entradas = await db.EntradaSalida.findAll({
        where : {
            personaId: busqueda.id
        }
    })

    const hitos = await db.Hito.findAll({
        where : {
            personaId: busqueda.id
        }
    })
    const fichas = await db.Ficha.findAll({
        where : {
            personaId: busqueda.id
        }
    })
    
    console.log("Eliminando entradas...")
    entradas.forEach(async entrada => {
        await entrada.destroy()
    });
    console.log("Eliminando hitos...")
    hitos.forEach(async hito => {
        await hito.destroy()
    });
    console.log("Eliminando fichas...")
    fichas.forEach(async ficha => {
        await ficha.destroy()
    });
    console.log("Eliminando persona...")
    await busqueda.destroy()
    

    

    //EntradaSalida Ficha Hito Persona



    

    res.redirect("/eliminarusuarios")

} )

// DNI / FECHA / HORA Y MINUTO -> Router generar asistencias

router.get("/generar_asistencia", [authController.isAuthentificated,authController.isSistema], async (req,res) =>{

    console.log("Entrando al generador de asistencia")
    let texto = ""

    const fechaLimite = moment().startOf('day').toDate() 

    const asistencias = await db.EntradaSalida.findAll({

        where:{
            fechaHora : {
                [Op.gte]: fechaLimite
            }
        }
    })

    

    for await (entrada of asistencias) {

        const persona = await entrada.getPersona()
        if (persona.esAlumno == 1){
            
            const dni =  persona.dni.substr(4, persona.dni.length)  //eliminando 2022
            const nombre = persona.nombre
            const apellidop = persona.apellidop
            const apellidom =  persona.apellidom
            const fecha = moment(entrada.fechaHora).format('MM / DD / YYYY, h:mm:ss a')
            
            texto = texto + dni + ", " + nombre + ", " + apellidop + ", " + apellidom + ", " + fecha + "#"

        } 
    }

    return res.render("generar_asistencia", {fecha: fechaLimite, lista: texto})

} )

module.exports = router