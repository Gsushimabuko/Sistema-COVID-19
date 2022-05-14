const express = require('express')
const { Op } = require('sequelize');
const router = express.Router()
const db = require('../../dao/models')
const {promisify} = require('util')
const jwt = require('jsonwebtoken')
var moment = require('moment'); // require
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const mimeTypes = require('mime-types')
const bcrypt = require('bcryptjs')

const qrcode = require("qrcode");

const authController = require('../controllers/authController')
const { auth } = require('googleapis/build/src/apis/abusiveexperiencereport')


const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
  );

oauth2Client.setCredentials({ refresh_token:  process.env.REFRESH_TOKEN });


router.get("/lista", async (req,res) =>{
    
    lista = []
  


    try {

        const jsonString =  fs.readFileSync('./alumnos_fotocheck.json', 'utf-8')
        const personal = JSON.parse(jsonString)

       for (let index = 3; index < personal.length; index++) {
         
        //NOMBRE
        const nombre = personal[index].Column4
        const apellido = personal[index].Column2.toUpperCase()
        //DNI
        let DNI = personal[index].Column6.toString()
        DNI = "2022" + DNI
        const QR =  await qrcode.toDataURL(DNI)
        //Area
        const area = personal[index].Column5
        
        console.log("DNI: ", DNI)
        console.log("nombre: ", nombre)
        console.log("nombre: ", area)
        console.log("nombre: ", QR)

        const htmlContent =  `
         <div style=" width:100%; 
         height:100%;
         page-break-after:always; padding: 150px; justify-content: center; align-items: center;">
            <div> <h2>${nombre} ${apellido} </h2> </div>
           
            
            <div style="  display: flex; align-items: right;">
            <div> <img width="150px" src="${QR}">  </div>
            
            <h2> DNI/C.E: ${DNI}</h2>
            </div>
            <div> <h2>${area}</h2> </div>
            <div> -----------------------------------</div>
        </div>
        `;

        lista.push(htmlContent)

        
       }

    return res.render("pruebaImpresionQR",{lista : lista})

        
        
    } catch (err) {
        console.log(err)
    }
    

})

router.get("/", (req,res) =>{
    res.render('home')
})

router.get("/qr", async (req,res) =>{
    
  
    res.render('qr')
     
})
router.get("/qrrecibir/:dni", async (req,res) =>{
    
   

        
        const QR = await qrcode.toDataURL(req.params.dni)
    
        const htmlContent =  `<div style="display: flex; justify-content: center; align-items: center;">
        
        <img src="${QR}" height="200px">
        </div>`;

      

  
  
    res.render('qrrecibir', {html : htmlContent})
     
})
router.post("/qrenviar", async (req,res) =>{
    
   

        console.log("DNI INPUT", req.body.dni)
  
  
    res.redirect('/qrrecibir/'+req.body.dni)
     
})


router.get("/iniciar_sesion", (req,res) =>{
    res.render('iniciar_sesion',{alert:false})
})

router.get("/cambiar_pass",[authController.isAuthentificated,authController.isDirectivo], (req,res) =>{
    res.render('cambiar_pass')
})

router.post("/cambiar_pass", async (req,res) =>{

    const username = req.body.username
    const pass2 = req.body.password2

    console.log("Paso1")

        const salt = await bcrypt.genSalt(10)
        const nuevoPass = await bcrypt.hash(pass2,salt)

    console.log("paso2")

    const rol = await db.Rol.findOne({where: {
        username : username
    }}) 

    rol.password = nuevoPass

    await rol.save()

    res.redirect('/cambiar_pass')
})

router.get("/cerrar_sesion", authController.logout)

router.get("/cerrar_sesion_apoderado", authController.logoutApoderado)

router.get("/login_persona", (req,res) =>{
    res.render('login_persona')  
})

router.get("/puerta/:escaner",[authController.isAuthentificated,authController.isGuardia], async (req,res) =>{

    let escaner = req.params.escaner

    console.log("Escaneando en: ", escaner)
    
    if (escaner == "ios"){
        escaner = "lectorqr_ios"
    } else if (escaner == "android"){
        escaner =  "lectorqr_android"
    }else if (escaner == "pistola"){
        escaner = "lectorpistola"
    }
 
    const jsonString =  fs.readFileSync('./puertas.json', 'utf-8')
    const puertas = JSON.parse(jsonString)

    return res.render('puertas', {puertas: puertas, path: escaner})   
    

})

router.get("/lectorpistola/:puerta",[authController.isAuthentificated,authController.isGuardia], async (req,res) =>{
    const persona = await db.Persona.findAll({}) 

    const puerta = req.params.puerta

    console.log("Escaneando en puerta: ", puerta)

    res.render('lectorpistola', {
        personasTotal: persona , puerta:puerta
    })      

})

router.get("/lectorqr_android/:puerta",[authController.isAuthentificated,authController.isGuardia], async (req,res) =>{
    const persona = await db.Persona.findAll({}) 

    const puerta = req.params.puerta

    console.log("Escaneando en puerta: ", puerta)

    res.render('lector_qr_android', {
        personasTotal: persona, puerta:puerta
    })      

})

router.get("/lectorqr_ios/:puerta",[authController.isAuthentificated,authController.isGuardia], async (req,res) =>{
    const persona = await db.Persona.findAll({}) 

    const puerta = req.params.puerta

    console.log("Escaneando en puerta: ", puerta)

    res.render('lector_qr_ios', {
        personasTotal: persona , puerta:puerta
    })      

})

router.get("/panel_control",authController.isAuthentificatedApoderado, async (req,res) => {
    
    const decodificada = await promisify(jwt.verify)(req.cookies.jwt,process.env.JWT_SECRET)

    const persona = await db.Persona.findOne({where: {
        id : decodificada.id
    }})
    
    const cantidad = await db.Persona.count({where: {
        apoderadopId : decodificada.id
    }})
    
    console.log(cantidad)
    
    var hijo=[]
    
    if(cantidad==0){
        hijo = await db.Persona.findAll({where: {
            apoderadomId : decodificada.id
        }})       
    }else{
        hijo = await db.Persona.findAll({where: {
            apoderadopId : decodificada.id
        }})      
    }    
    res.render("panel_control_persona",{persona:persona,hijos:hijo})     
})

router.get("/form/estudiante/:id",authController.isAuthentificatedApoderado, async (req,res) =>{
    
    const decodificada = await promisify(jwt.verify)(req.cookies.jwt,process.env.JWT_SECRET)
    
    const cantPadre = await db.Persona.count({ where :{
        apoderadopId : decodificada.id
    }})
    
    var hijos
    var encontrado = false

    if(cantPadre != 0){
        hijos = await db.Persona.findAll({ where :{
            apoderadopId : decodificada.id
        }})
    } else{
        hijos = await db.Persona.findAll({ where :{
            apoderadomId : decodificada.id
        }})
    }

    hijos.forEach(h => {
        if(h.id == req.params.id){
           encontrado = true
        } 
    });

    if(encontrado){
        var fecha = moment().format()
        var fechaFutura = moment().add(2,"d").format()
        const fechaMin = fecha.substring(0,10)
        const fechaMax = fechaFutura.substring(0,10)

        const persona = await db.Persona.findOne({where: {
            id : req.params.id
        }})
    
        const fichaUltima = await db.Ficha.findOne({
            where: {personaId : req.params.id},
            order: [ [ 'fechaIngreso', 'DESC' ]]    
        })

        let ficha=[]


        if (fichaUltima != null){
    
            ficha.push({
                salida: fichaUltima.salida,
                a1: fichaUltima.a1,
                a2: fichaUltima.a2,
                a3: fichaUltima.a3,
                a4: fichaUltima.a4,
                a5: fichaUltima.a5,
                a6: fichaUltima.a6,
                a7: fichaUltima.a7,
                a8: fichaUltima.a8,
                a9: fichaUltima.a9,
                a10: fichaUltima.a10,
                a11: fichaUltima.a11,
                a12: fichaUltima.a12,
                friesgo: fichaUltima.friesgo,
                ef1: fichaUltima.ef1,
                ef2: fichaUltima.ef2,
                ef3: fichaUltima.ef3,
                ef4: fichaUltima.ef4,
                ef5: fichaUltima.ef5,
                ef6: fichaUltima.ef6,
                ef7: fichaUltima.ef7,
                ef8: fichaUltima.ef8,
                ef9: fichaUltima.ef9,
                ef10: fichaUltima.ef10,
                ef11: fichaUltima.ef11,
                ef12: fichaUltima.ef12,
                medicina: fichaUltima.medicina,
                prueba: fichaUltima.prueba,
    
            })
        }
    
        const fichasFechas = await db.Ficha.findAll({where: {
            personaId : req.params.id
        }})
    
        let listaFichas =[]

        
    
        for (let unidad of fichasFechas) {
            listaFichas.push({
                fecha: moment(unidad.fechaIngreso).format()
            })
        }

        res.render('form_estudiante', {
            alumno:persona,
            fechaMin:fechaMin,
            fechaMax:fechaMax,
            listaFichas:listaFichas,
            fichaUltima: ficha
        })
    } else {
        res.send("No esta autorizado")
    }
})

router.get("/form/personal/:id",authController.isAuthentificatedApoderado, async (req,res) =>{

    const decodificada = await promisify(jwt.verify)(req.cookies.jwt,process.env.JWT_SECRET)

    if(decodificada.id == req.params.id){
        var fecha = moment().format()
        var fechaFutura = moment().add(2,"d").format()
        const fechaMin = fecha.substring(0,10)
        const fechaMax = fechaFutura.substring(0,10)
    
        const personal = await db.Persona.findOne({where: {
            id : req.params.id
        }})
    
        const fichaUltima = await db.Ficha.findOne({
            where: {
            personaId : req.params.id
        },
            order: [ [ 'fechaIngreso', 'DESC' ]]    
        })

        let ficha=[]


        if (fichaUltima != null){
    
            ficha.push({
                salida: fichaUltima.salida,
                a1: fichaUltima.a1,
                a2: fichaUltima.a2,
                a3: fichaUltima.a3,
                a4: fichaUltima.a4,
                a5: fichaUltima.a5,
                a6: fichaUltima.a6,
                a7: fichaUltima.a7,
                a8: fichaUltima.a8,
                a9: fichaUltima.a9,
                a10: fichaUltima.a10,
                a11: fichaUltima.a11,
                a12: fichaUltima.a12,
                friesgo: fichaUltima.friesgo,
                ef1: fichaUltima.ef1,
                ef2: fichaUltima.ef2,
                ef3: fichaUltima.ef3,
                ef4: fichaUltima.ef4,
                ef5: fichaUltima.ef5,
                ef6: fichaUltima.ef6,
                ef7: fichaUltima.ef7,
                ef8: fichaUltima.ef8,
                ef9: fichaUltima.ef9,
                ef10: fichaUltima.ef10,
                ef11: fichaUltima.ef11,
                ef12: fichaUltima.ef12,
                medicina: fichaUltima.medicina,
                prueba: fichaUltima.prueba,
    
            })
        }
    
        const fichasFechas = await db.Ficha.findAll({where: {
            personaId : req.params.id
        }})
    
        let listaFichas =[]
    
        for (let unidad of fichasFechas) {
            listaFichas.push({
                fecha: moment(unidad.fechaIngreso).format()
            })
        }
    
        res.render('form_personal', {
            personal:personal,
            fechaMin:fechaMin,
            fechaMax:fechaMax,
            listaFichas:listaFichas,
            fichaUltima: ficha
        })
    }else{
        res.send("No esta autorizado")
    }
})

router.get("/form/externo/:id", authController.isAuthentificatedApoderado, async (req,res) =>{

    const decodificada = await promisify(jwt.verify)(req.cookies.jwt,process.env.JWT_SECRET)

    if(decodificada.id == req.params.id){
    var fecha = moment().format()
    var fechaFutura = moment().add(2,"d").format()
    const fechaMin = fecha.substring(0,10)
    const fechaMax = fechaFutura.substring(0,10)
    const externo = await db.Persona.findOne({where: {
        id : req.params.id
    }})

    const fichaUltima = await db.Ficha.findOne({
        where: {
        personaId : req.params.id
    },
        order: [ [ 'fechaIngreso', 'DESC' ]]    
    })

    let ficha=[]


        if (fichaUltima != null){
    
            ficha.push({
                salida: fichaUltima.salida,
                a1: fichaUltima.a1,
                a2: fichaUltima.a2,
                a3: fichaUltima.a3,
                a4: fichaUltima.a4,
                a5: fichaUltima.a5,
                a6: fichaUltima.a6,
                a7: fichaUltima.a7,
                a8: fichaUltima.a8,
                a9: fichaUltima.a9,
                a10: fichaUltima.a10,
                a11: fichaUltima.a11,
                a12: fichaUltima.a12,
                friesgo: fichaUltima.friesgo,
                ef1: fichaUltima.ef1,
                ef2: fichaUltima.ef2,
                ef3: fichaUltima.ef3,
                ef4: fichaUltima.ef4,
                ef5: fichaUltima.ef5,
                ef6: fichaUltima.ef6,
                ef7: fichaUltima.ef7,
                ef8: fichaUltima.ef8,
                ef9: fichaUltima.ef9,
                ef10: fichaUltima.ef10,
                ef11: fichaUltima.ef11,
                ef12: fichaUltima.ef12,
                medicina: fichaUltima.medicina,
                prueba: fichaUltima.prueba,
    
            })
        }

    const fichasFechas = await db.Ficha.findAll({where: {
        personaId : req.params.id
    }})

    let listaFichas =[]

    for (let unidad of fichasFechas) {
        listaFichas.push({
            fecha: moment(unidad.fechaIngreso).format()
        })
    }

    res.render('form_externo', {
        externo:externo,
        fechaMin:fechaMin,
        fechaMax:fechaMax,
        listaFichas:listaFichas,
        fichaUltima: ficha
    })
    
    }else{
        res.send("No esta autorizado")
    }

})

router.get("/reportes_main",authController.isAuthentificated, (req,res) =>{

    res.render("reportesmain")
})

router.post("/iniciar_sesion", authController.iniciarSesion)

router.post("/login_persona",authController.iniciarSesionApoderado)

router.post("/form/new", async (req,res) =>{
    // ACA INICIA LA SUBIDA

    console.log("carga de fomulario")

    if(req.files != null){
        var archivo = req.files.files
    }

    const targetFolderId = process.env.FOLDER_SUBIDA;
    
    var urlDestino = []

    var grupoUrl = new Object()
    grupoUrl.destino = urlDestino


    if(Array.isArray(archivo)){
        var listaNombres=[]
        var listaTipos=[]
        var listaDest = []

        await Promise.all(archivo.map(async e=> {
            
            let ext = mimeTypes.extension(e.mimetype)
            e.name = req.body.dni + "-" + moment().format().substring(0,10)+ "-" +Date.now().toString()+"." + ext
        
            let uploadPath = "uploads/" + e.name

            console.log("entro en each")

            await e.mv(uploadPath) 
            console.log("dentro de upload tal vez")
            listaNombres.push(e.name)
            listaDest.push(uploadPath)
            listaTipos.push(e.mimetype)

        }))

        console.log("aca termino each")
        console.log (listaNombres,listaDest,listaTipos)

        const drive = google.drive({version: 'v3',auth: oauth2Client});
        
            let i = 0
            for await (file of listaNombres){
                console.log("entro al for await")
                try{
                    const response = await drive.files.create({
                          requestBody: {
                              name: listaNombres[i], //file name
                              mimeType: listaTipos[i],
                              parents: [targetFolderId]
                          },
                          media: {
                              mimeType: listaTipos[i],
                              body: fs.createReadStream(listaDest[i]),
                          },
                    });
                      
                      urlDestino.push('https://docs.google.com/file/d/'+ response.data.id)
                      console.log("termino un el responsse")
                } catch(error){
                    console.log(error.menssage)
                }
                i=i+1
            }   
            
            grupoUrl.destino = urlDestino  

       
            
            for await (e of listaDest){
                fs.unlink(e, (err) => {
                     if (err) {              
                     console.error(err)
                     return
                   }
                 })  
            } 


            console.log(grupoUrl)
        
    
    } else if (req.files!=null){
    
        let ext = mimeTypes.extension(archivo.mimetype)

        archivo.name = req.body.dni + "-" + moment().format().substring(0,10)+ "-" +Date.now().toString()+"." + ext
        
        let uploadPath = "uploads/" + archivo.name
    
        await archivo.mv(uploadPath)

        const drive = google.drive({version: 'v3',auth: oauth2Client});
        const filePath = uploadPath;

        try{
            const response = await drive.files.create({
                requestBody: {
                    name: archivo.name, //file name
                    mimeType: archivo.mimetype,
                    parents: [targetFolderId]
                        },
                media: {
                    mimeType: archivo.mimetype,
                    body: fs.createReadStream(filePath),
                        },
            });

            urlDestino.push('https://docs.google.com/file/d/'+ response.data.id)  
            grupoUrl.destino = urlDestino    



            fs.unlink(uploadPath, (err) => {
                if (err) {
                    console.error(err)
                    return
                }
            })  

            }catch (error) {
                //report the error message
                console.log(error.message);
            }             
    }

    // termina la subida de archivos
            
    const id = req.body.id
        const fechaIngreso = moment(req.body.fechaIngreso).toDate().toISOString() // comando fecha
        const salida = req.body.salida
        const a1 = req.body.a1
        const a2 = req.body.a2
        const a3 = req.body.a3
        const a4 = req.body.a4
        const a5 = req.body.a5
        const a6 = req.body.a6
        const a7 = req.body.a7
        const a8 = req.body.a8
        const a9 = req.body.a9
        const a10 = req.body.a10
        const a11 = req.body.a11
        const a12 = req.body.a12

        const friesgo = req.body.friesgo

        const ef1 = req.body.ef1
        const ef2 = req.body.ef2
        const ef3 = req.body.ef3
        const ef4 = req.body.ef4
        const ef5 = req.body.ef5
        const ef6 = req.body.ef6
        const ef7 = req.body.ef7
        const ef8 = req.body.ef8
        const ef9 = req.body.ef9
        const ef10 = req.body.ef10
        const ef11 = req.body.ef11
        const ef12 = req.body.ef12

        const medicina = req.body.medicina

        const prueba = req.body.prueba

        const urlDestinoFinal = JSON.stringify(grupoUrl)
        console.log("este es el ultimo")
        console.log(urlDestinoFinal )

        const porPersonal = 0

        let llenoNuevo = false

        console.log(moment(req.body.fechaIngreso).toDate().toISOString())

        try {
            const encontrada = await db.Ficha.findOne({
                where: {
                    [Op.and]:[
                        {personaId: req.body.id},
                        {fechaIngreso: moment(req.body.fechaIngreso).toDate().toISOString()}
                    ]
                  }
            })

            if(encontrada == null){
                
                llenoNuevo = true

                await db.Ficha.create({  
                    personaId : id,
                    tipoSalida : salida,
                    fechaIngreso : fechaIngreso,
                    a1 : a1,
                    a2 : a2,
                    a3 : a3,
                    a4 : a4,
                    a5 : a5,
                    a6 : a6,
                    a7 : a7,
                    a8 : a8,
                    a9 : a9,
                    a10 : a10,
                    a11 : a11,
                    a12 : a12,
                    friesgo : friesgo,
                    ef1 : ef1,
                    ef2 : ef2,
                    ef3 : ef3,
                    ef4 : ef4,
                    ef5 : ef5,
                    ef6 : ef6,
                    ef7 : ef7,
                    ef8 : ef8,
                    ef9 : ef9,
                    ef10 : ef10,
                    ef11 : ef11,
                    ef12 : ef12,
                    medicamento : medicina,
                    prueba : prueba,
                    porPersonal: porPersonal,
                    archivos: urlDestinoFinal
                })
            } else{
                console.log(encontrada)
    
                console.log("ya se tiene ficha llenada  y registrada")
    
                //redirige porque ya esta llenado
                return res.redirect("/panel_control")
            }

        } catch (error) {
            console.log(error)

            llenoNuevo = true

            await db.Ficha.create({  
                personaId : id,
                tipoSalida : salida,
                fechaIngreso : fechaIngreso,
                a1 : a1,
                a2 : a2,
                a3 : a3,
                a4 : a4,
                a5 : a5,
                a6 : a6,
                a7 : a7,
                a8 : a8,
                a9 : a9,
                a10 : a10,
                a11 : a11,
                a12 : a12,
                friesgo : friesgo,
                ef1 : ef1,
                ef2 : ef2,
                ef3 : ef3,
                ef4 : ef4,
                ef5 : ef5,
                ef6 : ef6,
                ef7 : ef7,
                ef8 : ef8,
                ef9 : ef9,
                ef10 : ef10,
                ef11 : ef11,
                ef12 : ef12,
                medicamento : medicina,
                prueba : prueba,
                porPersonal: porPersonal,
                archivos: urlDestinoFinal
            })
        }
        

        if (req.body.enRecuperacion == 1 && llenoNuevo){
            console.log("entro a recuperacion")

            const per = await db.Persona.findOne({where: {
                id : req.body.id
            }}) 

            per.estado = 0

            await per.save()

            return res.render("ficha_exitosa")
        } else{
            
            if (req.body.estadoActual!=1  && llenoNuevo){
                
                console.log("entro algun estado")
                
                const per = await db.Persona.findOne({where: {
                    id : req.body.id
                }}) 
                
                per.estado = req.body.estadoActual
    
                //datos para casos
                var nombreApellido = per.nombre + " "+ per.apellidop
                var telefonoCaso = per.telefono
                var tipoPersona
                //datos para casos
    
                if(per.esPersonal == 1){
                    tipoPersona = "Personal"
                } else if(per.esApoderado == 1){
                    tipoPersona = "Apoderado"
                } else{
                    tipoPersona = "Alumno"
                }
    
                await per.save()
                
                
                //aca se agrega el caso con laa ficha
                var estadoCovid
                if(req.body.estadoActual==2){
                    estadoCovid = "Contacto con confirmado"
                } else {
                    estadoCovid = "Observado"
                }
    
                const fichas = await db.Ficha.findAll({
                    where: {
                        personaId : req.body.id
                    }
                }) 
    
                var fechaComparar = moment(req.body.fechaIngreso)
    
                fichas.forEach(e => {
                    console.log(e.fechaIngreso,fechaIngreso)
    
                    if(e.fechaIngreso.getDate() == fechaComparar.get("Date") &&
                    e.fechaIngreso.getMonth() == fechaComparar.get("Month") &&
                    e.fechaIngreso.getFullYear() == fechaComparar.get("Year")){
                    fichaActual = e
                } 
        
                });
    
                await db.Caso.create({  
                    fecha: fechaIngreso,
                    nombre: nombreApellido,
                    telefono: telefonoCaso,
                    tipo:tipoPersona,
                    estado:estadoCovid,
                    fichaId:fichaActual.id
                })
    
            }
        }


       return res.render("ficha_exitosa")

})

router.get("/desarrollo",authController.isAuthentificated, (req,res) => {
    res.render('desarrollo')
})


module.exports = router