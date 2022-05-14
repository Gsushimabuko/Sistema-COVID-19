const express = require('express')
const router = express.Router()

const db = require('../../dao/models')
var moment = require('moment'); // require
moment().format(); 
const mimeTypes = require('mime-types')

const authController = require('../controllers/authController')


router.get("/nivelesriesgo",[authController.isAuthentificated,authController.isSalud], async (req,res) => {
    res.render('nivelesriesgo')
})

//NIVELES RIESGO ALUMNOS
router.get("/nivelesriesgoalumnos/:grupos",[authController.isAuthentificated,authController.isSalud], async (req,res) => {

    const grupo = await db.Grupo.findAll({}) 
    let selectId = req.params.grupos
    
    
    if(selectId == undefined || selectId ==-1){

        const alumnosCero2 = await db.Persona.findAll({
            where :{
        
                estado : 0,
                esPersonal: 0,
                esAlumno : 1
            }
        })
        
        
        const alumnosAlta2 = await db.Persona.findAll({
            where :{
                esAlumno : 1,
                estado : 1,
                esPersonal : 0
            }
        })
        
        const alumnosAltaObservacion2 = await db.Persona.findAll({
            where :{
                esAlumno : 1,
                estado : 2,
                esPersonal : 0
            }
        })
        
        const alumnosObservados2 = await db.Persona.findAll({
            where :{
                esAlumno : 1,
                estado : 3,
                esPersonal : 0
            }
        })
        
        const alumnosConfirmados2 = await db.Persona.findAll({
            where :{
                esAlumno : 1,
                estado : 4,
                esPersonal : 0
            }
        })
        
        res.render('nivelesriesgoalumnos', {grupos : grupo, 
            alumnosCero : alumnosCero2,
            alumnosAlta : alumnosAlta2
            ,alumnosAltaObservacion : alumnosAltaObservacion2,  
            alumnosObservados : alumnosObservados2,
            alumnosConfirmados : alumnosConfirmados2, nombreSalon : -1,
            personasAfectadas :  req.session.personasMovidas})
            
        }else{
            
            //const idGrupo =  req.params.grupos  
            const salonElegido = await db.Grupo.findOne({
                where:{
                    id: selectId
                }
            }) 
            
        const alumnosCero = await db.Persona.findAll({
            where :{
                grupoId : selectId,
                estado : 0,
                esPersonal : 0,
                esAlumno : 1,
            }
        })
        const alumnosAlta = await db.Persona.findAll({
            where :{
                grupoId : selectId,
                estado : 1,
                esPersonal : 0,
                esAlumno : 1,
            }
        })
        
        const alumnosAltaObservacion = await db.Persona.findAll({
            where :{
                grupoId : selectId,
                estado : 2,
                esPersonal : 0,
                esAlumno : 1,

            }
        })
    
        const alumnosObservados = await db.Persona.findAll({
            where :{
                grupoId : selectId,
                estado : 3,
                esPersonal : 0,
                esAlumno : 1
            }
        })
    
        const alumnosConfirmados = await db.Persona.findAll({
            where :{
                grupoId : selectId,
                estado : 4,
                esPersonal : 0,
                esAlumno : 1
            }
        })
    
        
        res.render('nivelesriesgoalumnos', {grupos : grupo, 
            alumnosCero : alumnosCero,
            alumnosAlta : alumnosAlta
            ,alumnosAltaObservacion : alumnosAltaObservacion,  
            alumnosObservados : alumnosObservados,
        alumnosConfirmados : alumnosConfirmados,
        nombreSalon : salonElegido.nombre,
        personasAfectadas :  req.session.personasMovidas})
    }
})

router.post("/nivelesriesgoalumnos", async (req,res) =>{
   //STRING PARA EL ALERT
   let personasMovidas = ""
   //RESETEANDO EL SESSION
   req.session.personasMovidas = personasMovidas
  
  const fechaCaso = moment()
  const fechaProx = moment().add(process.env.DIAS_AISLAMIENTO, 'd')

  let selectId = req.body.grupoId
  if(selectId == undefined){
      selectId = -1
  }
  //accediendo al formulario
  
  const id = req.body.idcambio
  const numeroLista = req.body.numerolista
  const cantidad = req.body.cantidad
  const listas = {'0'  : 'ALTA' , '1' : "SALUDABLE", '2' : "CONTACTO CON CONFIRMADO", '3' : "OBSERVACIÓN", '4' : "COVID CONFIRMADO"}

  if(id != undefined){ 
  
      //await db.Persona.update({estado: '4'}),{where: {areaId : 1 }}
      
      //accediendo al alumno
      const alumno = await db.Persona.findOne({
          where : {
              id : id
              
          }
      })

      // moviendo a las personas de la misma area
      if(cantidad == 1) {
          const personal  = await db.Persona.findAll({ where :{
              esAlumno : 1,
              grupoId : alumno.grupoId
          }})
  
          personal.forEach(async persona=> {
              
              

              if(alumno.estado == persona.estado){
                  
                  //REGISTRANDO EN TABLA CONFIRMADO
                  
                  if (numeroLista == 4) {
                      await db.CasoPositivo.create({
                          fechaDetectado : fechaCaso.toISOString(),
                          fechaAltaProbable : fechaProx.toISOString(),
                          idPersona : persona.id
                      })

                      //cambio estado a familiares

                      const padre = await db.Persona.findOne({
                          where : { id : alumno.apoderadopId }
                      })

                      const madre = await db.Persona.findOne({
                          where : { id : alumno.apoderadomId }
                      })

                      const hijosPadre = await db.Persona.findAll({ where :{
                          apoderadopId : alumno.apoderadopId
                      }})

                      const hijosMadre = await db.Persona.findAll({ where :{
                          apoderadomId : alumno.apoderadomId
                      }})

                      var listaIdPersonas = []

                      hijosPadre.forEach(h => {
                          if(h.id != alumno.id){
                              listaIdPersonas.push(h) 
                          }
                      });

                      hijosMadre.forEach(h => {
                          if(!listaIdPersonas.includes(h)){
                              if(h.id != alumno.id){
                                  listaIdPersonas.push(h) 
                              }
                          }
                      });

                      listaIdPersonas.push(padre)
                      listaIdPersonas.push(madre)  

                      await Promise.all(listaIdPersonas.map(async e => { 
                          if (e.estado == 1){

                              await db.Hito.create({
                                  personaId : persona.id,
                                  titulo : "Cambio de lista",
                                  descripcion: "Cambio a Observado por contacto con positvo",
                                  fecha : fechaCaso.toISOString()
                                  
                              })

                              e.estado = 3
                              e.save()

                          }


                      }))



                  }
                  
                  //Creando hitos
                  await db.Hito.create({
                      personaId : persona.id,
                      titulo : "Cambio de lista",
                      descripcion: "De " +  listas[persona.estado] + " a " + listas[numeroLista],
                      fecha : fechaCaso.toISOString()
                      
                  })

                  persona.estado = numeroLista
                  persona.save()

              }
              })
      
          
      }else{

          await db.Hito.create({
              personaId : alumno.id,
              titulo : "Cambio de lista",
              descripcion: "De " +  listas[alumno.estado] + " a " + listas[numeroLista],
              fecha : fechaCaso.toISOString()

          })


      }

      alumno.estado = numeroLista
      await alumno.save()


      //Registrando el tipo de caso COVID


      if(alumno.estado == 4) {

          await db.CasoPositivo.create({
              fechaDetectado : fechaCaso.toISOString(),
              fechaAltaProbable : fechaProx.toISOString(),
              idPersona : alumno.id
          })

          //cambio estado a familiares

          const padre = await db.Persona.findOne({
              where : { id : alumno.apoderadopId }
          })

          const madre = await db.Persona.findOne({
              where : { id : alumno.apoderadomId }
          })

          const hijosPadre = await db.Persona.findAll({ where :{
              apoderadopId : alumno.apoderadopId
          }})

          const hijosMadre = await db.Persona.findAll({ where :{
              apoderadomId : alumno.apoderadomId
          }})

          var listaIdPersonas = []

          hijosPadre.forEach(h => {
              if(h.id != alumno.id){
                  listaIdPersonas.push(h) 
              }
          });

          hijosMadre.forEach(h => {
              if(!listaIdPersonas.includes(h)){
                  if(h.id != alumno.id){
                      listaIdPersonas.push(h) 
                  }
              }
          });

          listaIdPersonas.push(padre)
          listaIdPersonas.push(madre)  

          await Promise.all(listaIdPersonas.map(async e => { 
              if (e.estado == 1){

                  personasMovidas = e.apellidop + personasMovidas
                  personasMovidas = " " + personasMovidas
                  personasMovidas = e.nombre.toUpperCase() + personasMovidas
                  personasMovidas = "-" + personasMovidas

                  await db.Hito.create({
                      personaId : e.id,
                      titulo : "Cambio de lista",
                      descripcion: "Cambio a CONTACTO CON POSITVO",
                      fecha : fechaCaso.toISOString()
                      
                  })

                  e.estado = 2
                  e.save()

              }


          }))


          console.log("NUMERO LISTA: ", numeroLista)
          console.log("PERSONAS MOVIDAS: ", personasMovidas)
              
          req.session.personasMovidas = personasMovidas


      }


     return res.redirect("/nivelesriesgoalumnos/"+alumno.grupoId)

  }

  console.log(id, numeroLista)
  
 return res.redirect("/nivelesriesgoalumnos/"+selectId)
})

//NIVELES RIESGO PERSONAL
router.get("/nivelesriesgopersonal/:grupos",[authController.isAuthentificated,authController.isSalud], async (req,res) =>{
    const grupo = await db.Area.findAll({}) 
    let selectId = req.params.grupos
   
    if(selectId == undefined || selectId ==-1){

        const alumnosCero2 = await db.Persona.findAll({
            where :{
        
                estado : 0,
                esPersonal: 1
            }
        })
        
        const alumnosAlta2 = await db.Persona.findAll({
            where :{
                
                estado : 1,
                esPersonal : 1
            }
        })
        
        const alumnosAltaObservacion2 = await db.Persona.findAll({
            where :{
                
                estado : 2,
                esPersonal : 1
            }
        })
        
        const alumnosObservados2 = await db.Persona.findAll({
            where :{
                
                estado : 3,
                esPersonal : 1
            }
        })
        
        const alumnosConfirmados2 = await db.Persona.findAll({
            where :{
                
                estado : 4,
                esPersonal : 1
            }
        })

        
            
            res.render('nivelesriesgopersonal', {areas : grupo, 
                alumnosCero : alumnosCero2,
                alumnosAlta : alumnosAlta2
                ,alumnosAltaObservacion : alumnosAltaObservacion2,  
                alumnosObservados : alumnosObservados2,
                alumnosConfirmados : alumnosConfirmados2, nombreSalon : -1,
                personasAfectadas :  req.session.personasMovidas})
        
        
            
        }else{
            
            //const idGrupo =  req.params.grupos  
            const salonElegido = await db.Area.findOne({
                where:{
                    id: selectId
                }
            }) 

            const alumnosCero = await db.Persona.findAll({
                where :{
            
                    estado : 0,
                    esPersonal: 1
                }
            })
            
        const alumnosAlta = await db.Persona.findAll({
            where :{
                areaId : selectId,
                estado : 1,
                esPersonal : 1
            }
        })
        
        const alumnosAltaObservacion = await db.Persona.findAll({
            where :{
                areaId: selectId,
                estado : 2,
                esPersonal : 1
            }
        })
    
        const alumnosObservados = await db.Persona.findAll({
            where :{
                areaId : selectId,
                estado : 3,
                esPersonal : 1
            }
        })
    
        const alumnosConfirmados = await db.Persona.findAll({
            where :{
                areaId : selectId,
                estado : 4,
                esPersonal : 1
            }
        })
    
        
        res.render('nivelesriesgopersonal', {areas : grupo, 
            alumnosCero: alumnosCero,
            alumnosAlta : alumnosAlta
            ,alumnosAltaObservacion : alumnosAltaObservacion,  
            alumnosObservados : alumnosObservados,
        alumnosConfirmados : alumnosConfirmados,
        nombreSalon : salonElegido.nombre,
        personasAfectadas :  req.session.personasMovidas})
    }
})
router.post("/nivelesriesgopersonal", async (req,res) =>{
    
    const fechaCaso = moment()
    const fechaProx = moment().add(process.env.DIAS_AISLAMIENTO, 'd')
    //STRING PARA EL ALERT
    let personasMovidas = ""
    //RESETEANDO EL SESSION
    req.session.personasMovidas = personasMovidas

    let selectId = req.body.grupoId
    if(selectId == undefined){
        selectId = -1
    }
    //accediendo al formulario
    
    const id = req.body.idcambio
    const numeroLista = req.body.numerolista
    const cantidad = req.body.cantidad
    const listas = {'0' : "ALTA", '1' : "SALUDABLE", '2' : "CONTACTO CON CONFIRMADO", '3' : "OBSERVACIÓN", '4' : "COVID CONFIRMADO"}

    if(id != undefined){ 
    
        //await db.Persona.update({estado: '4'}),{where: {areaId : 1 }}
        
        //accediendo al alumno
        const alumno = await db.Persona.findOne({
            where : {
                id : id
                
            }
        })

        // moviendo a las personas de la misma area
        if(cantidad == 1) {
            const personal  = await db.Persona.findAll({ where :{
                esPersonal : 1,
                areaId : alumno.areaId

            }})
    
            personal.forEach(async persona=> {
                if(alumno.estado == persona.estado){
                    
                    //REGISTRANDO EN TABLA CONFIRMADO
                    
                    if (numeroLista == 4) {
                        await db.CasoPositivo.create({
                            fechaDetectado : fechaCaso.toISOString(),
                            fechaAltaProbable : fechaProx.toISOString(),
                            idPersona : persona.id
                        })

                        //cambio estado a familiares


                        const hijosPadre = await db.Persona.findAll({ where :{
                            apoderadopId : persona.id
                        }})

                        const hijosMadre = await db.Persona.findAll({ where :{
                            apoderadomId : persona.id
                        }})

                        var listaIdPersonas = []

                        hijosPadre.forEach(h => {
                            if(h.id != persona.id){
                                listaIdPersonas.push(h) 
                            }
                        });

                        hijosMadre.forEach(h => {
                            if(!listaIdPersonas.includes(h)){
                                if(h.id != persona.id){
                                    listaIdPersonas.push(h) 
                                }
                            }
                        });



                        await Promise.all(listaIdPersonas.map(async e => { 
                            if (e.estado == 1){
                                
                                await db.Hito.create({
                                    personaId : e.id,
                                    titulo : "Cambio de lista",
                                    descripcion: "Cambio a CONTACTO CON POSITVO",
                                    fecha : fechaCaso.toISOString()
                                    
                                })

                            e.estado = 2
                            e.save()

                            }


                        }))

                        
                    }
                    
                    //Creando hitos
                    await db.Hito.create({
                        personaId : persona.id,
                        titulo : "Cambio de lista",
                        descripcion: "De " +  listas[persona.estado] + " a " + listas[numeroLista],
                        fecha : fechaCaso.toISOString()
                        
                    })
                    persona.estado = numeroLista
                    persona.save()
                    
                }
            })
            
            
        

        return res.redirect("/nivelesriesgopersonal/"+alumno.areaId)
            
        }else{
            await db.Hito.create({
                personaId : alumno.id,
                titulo : "Cambio de lista",
                descripcion: "De " +  listas[alumno.estado] + " a " + listas[numeroLista],
                fecha : fechaCaso.toISOString()
    
            })

           if(numeroLista == 4) {
                  
               //cambio estado a familiares
               
               const hijosPadre = await db.Persona.findAll({ where :{
                   apoderadopId : alumno.id
                }})
                
                const hijosMadre = await db.Persona.findAll({ where :{
                    apoderadomId : alumno.id
                }})
                
                var listaIdPersonas = []
                
                hijosPadre.forEach(h => {
                    if(h.id != alumno.id){
                        listaIdPersonas.push(h) 
                    }
                });
                
                hijosMadre.forEach(h => {
                    if(!listaIdPersonas.includes(h)){
                        if(h.id != alumno.id){
                            listaIdPersonas.push(h) 
                        }
                    }
                });
                
                await Promise.all(listaIdPersonas.map(async e => { 
                    if (e.estado == 1){
                        
                        
                        personasMovidas = e.apellidop + personasMovidas
                        personasMovidas = " " + personasMovidas
                        personasMovidas = e.nombre.toUpperCase() + personasMovidas
                        personasMovidas = "-" + personasMovidas
                        
                        
                        await db.Hito.create({
                            personaId : e.id,
                            titulo : "Cambio de lista",
                            descripcion: "Cambio a Observado por contacto con positvo",
                            fecha : fechaCaso.toISOString()
                            
                        })
                        
                        e.estado = 2
                        e.save()
                        
                    }
                    
                    
                }))
                
                console.log("NUMERO LISTA: ", numeroLista)
                console.log("PERSONAS MOVIDAS: ", personasMovidas)
                
                req.session.personasMovidas = personasMovidas
                   
           }
           

        }

        alumno.estado = numeroLista
        await alumno.save()


        //Registrando el tipo de caso COVID

        if(alumno.estado == 4) {
            await db.CasoPositivo.create({
                fechaDetectado : fechaCaso.toISOString(),
                fechaAltaProbable : fechaProx.toISOString(),
                idPersona : alumno.id
            })
        }

        return res.redirect("/nivelesriesgopersonal/"+alumno.areaId)

    }
  
    console.log(id, numeroLista)
    
  return res.redirect("/nivelesriesgopersonal/"+selectId)
})

//NIVELES RIESGO EXTERNOS

router.get("/nivelesriesgoexternos",[authController.isAuthentificated,authController.isSalud], async (req,res) =>{

        const alumnosCero = await db.Persona.findAll({
                    where :{
                
                        estado : 0,
                        esApoderado: 1,
                        esPersonal: 0
                    }
        })
        const alumnosAlta = await db.Persona.findAll({
                    where :{
                
                        estado : 1,
                        esApoderado: 1,
                        esPersonal: 0
                    }
        })
        
        const alumnosAltaObservacion = await db.Persona.findAll({
            where :{
                
                estado : 2,
                esApoderado: 1,
                esPersonal: 0
            }
        })
    
        const alumnosObservados = await db.Persona.findAll({
            where :{
                
                estado : 3,
                esApoderado: 1,
                esPersonal: 0
            }
        })
    
        const alumnosConfirmados = await db.Persona.findAll({
            where :{
                
                estado : 4,
                esApoderado: 1,
                esPersonal: 0
            }
        })
    
        
        return res.render('nivelesriesgoexternos', {
            alumnosAlta : alumnosAlta
            ,alumnosAltaObservacion : alumnosAltaObservacion,  
            alumnosObservados : alumnosObservados,
            alumnosConfirmados : alumnosConfirmados,
            alumnosCero : alumnosCero
        })
    }
)

router.post("/nivelesriesgoexternos", async (req,res) =>{
    
    const fechaCaso = moment()
    const fechaProx = moment().add(process.env.DIAS_AISLAMIENTO, 'd')

    //accediendo al formulario
    
    const id = req.body.idcambio
    const numeroLista = req.body.numerolista
    const listas = {'0': 'ALTA','1' : "SALUDABLE", '2' : "CONTACTO CON CONFIRMADO", '3' : "OBSERVACIÓN", '4' : "COVID CONFIRMADO"}

  
    //accediendo al alumno
    const alumno = await db.Persona.findOne({
        where : {
            id : id
            
        }
    })


    await db.Hito.create({
        personaId : alumno.id,
        titulo : "Cambio de lista",
        descripcion: "De " +  listas[alumno.estado] + " a " + listas[numeroLista],
        fecha : fechaCaso.toISOString(),

    })
    alumno.estado = numeroLista
    await alumno.save()


    //Registrando el tipo de caso COVID

    if (alumno.estado == 1) {
        await db.CasoAlta.create({
            fechaIngreso : fechaCaso.toISOString(),
            fechaAltaProbable : fechaProx.toISOString(),
            idPersona : alumno.id
        })
    }else if (alumno.estado == 2 || alumno.estado == 3) {
        await db.CasoPosible.create({
            fechaDetectado : fechaCaso.toISOString(),
            fechaAltaProbable : fechaProx.toISOString(),
            idPersona : alumno.id
        })
    } else if(alumno.estado == 4) {
        await db.CasoPositivo.create({
            fechaDetectado : fechaCaso.toISOString(),
            fechaAltaProbable : fechaProx.toISOString(),
            idPersona : alumno.id
        })
    }

    return res.redirect("/nivelesriesgoexternos")

})

router.get("/agregarhito/:id" ,[authController.isAuthentificated,authController.isSalud], (req,res) => {

    const idPersona = req.params.id

    res.render('agregarhito', {idPersona : idPersona})

})

router.post("/agregarhito" , async (req,res) => {

    const idPersona = req.body.inputHiddenId
    const fecha = moment(req.body.fecha).toDate().toISOString()
    const descripcion = req.body.descripcion
    const titulo = req.body.titulo

    
    await db.Hito.create({
        personaId : idPersona,
        fecha : fecha,
        descripcion : descripcion,
        titulo : titulo
        
    })
    
    res.redirect('historialmedico/'+idPersona)
})


router.get("/historialmedico/:id",[authController.isAuthentificated,authController.isSalud], async (req,res) => {
    const persona = await db.Persona.findOne({
        where :{
            id: req.params.id
        }
    })

    const hitos = await db.Hito.findAll({
        where : {
            personaId : req.params.id
        }, order : [
            ['fecha', 'DESC']
        ]
    }) 
    
    res.render('historialmedico',{persona:persona, hitos:hitos})
})


router.get("/reportes",[authController.isAuthentificated,authController.isSalud], async(req,res) =>{
    const alumnos = await db.Persona.findAll({
       where :{esAlumno : 1}
    })
    const personal = await db.Persona.findAll({
        where :{esPersonal : 1}
     })
    const casosConfirmados = await db.CasoPositivo.findAll({
        order : [['fechaDetectado', 'DESC']]
    })
    const casosObservados = await db.CasoPosible.findAll({})
    const casosAlta = await db.CasoAlta.findAll({})
    res.render("reportes", {moment: moment,alumnos: alumnos, casosConfirmados : casosConfirmados, personal : personal, casosAlta : casosAlta, casosObservados : casosObservados})

})

router.get("/casos_pendientes",[authController.isAuthentificated,authController.isSalud], async(req,res) =>{
    const casos = await db.Caso.findAll({
    })
    res.render("casos_reportados", {moment:moment,casos : casos})

})

router.get("/fichas_llenadas/:id",[authController.isAuthentificated,authController.isSalud], async(req,res) =>{
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

router.get('/eliminarCaso/:codigo',[authController.isAuthentificated,authController.isSalud], async (req, res) => {
    const idCaso = req.params.codigo
    await db.Caso.destroy({
        where : {
            id : idCaso
        }
    })

    res.redirect('/casos_pendientes')
})

router.get("/ficha_caso/:id",[authController.isAuthentificated,authController.isSalud], async (req,res) => {
    const fichaUltima = await db.Ficha.findOne({
        where :{id: req.params.id}
    })

    let ficha=[]

    const fechaIngreso = fichaUltima.fechaIngreso


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
                prueba: fichaUltima.prueba
            })
        }

        console.log(ficha)

    const persona = await db.Persona.findOne({
        where :{
            id: fichaUltima.personaId
        }
    }) 

    const archivos = JSON.parse(fichaUltima.archivos)
    const archSub =archivos.destino

    
    res.render('casos_ficha_reportada',{moment:moment,ficha : ficha,persona:persona,archivos:archSub,fechaIngreso:fechaIngreso})
})



module.exports = router