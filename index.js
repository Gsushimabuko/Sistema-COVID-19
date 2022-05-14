const express = require('express')
const app = express()

//agregando
const {promisify} = require('util')
const jwt = require('jsonwebtoken')

const dotenv = require('dotenv')

const cookieParser = require('cookie-parser')

const PORT = process.env.PORT || 8000

const DIAS_AISLAMIENTO = 15

const fileUpload = require('express-fileupload')
const { Op } = require("sequelize");

const XLSX = require('xlsx')
const path = require('path')

//para utilizar google drive
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

//prueb a del moment
var moment = require('moment'); // require
moment().format(); 

//BASE DE DATOS
const db = require('./dao/models')
//BODYPARSER
const bodyParser = require('body-parser')

//SESIONES

const mimeTypes = require('mime-types')
const { user } = require('pg/lib/defaults');
const persona = require('./dao/models/persona');

const session = require('express-session')

dotenv.config({path: './env/.env'})



//variable local para tiempo
app.locals.moment = require('moment');

//TEMPLATES
app.use(express.static('assets'))
app.use(fileUpload())
app.set('view engine', 'ejs') 


app.listen(PORT, () =>{
    console.log(`SE INICIÓ EL SERVER ${PORT}`)
})

app.use(session({
    secret : "daleu",
    resave : false,
    saveUninitialized : false
}))


app.use(cookieParser())

//SETEANDO BODYPARSER
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended : false
}))

app.all('/*', async function(req,res,next){
    if(req.cookies.jwt == null){
        res.locals.userPermanente = false
        res.locals.userPermanenteApoderado = false
        next()
    }else{
            try {

                const decodificada = await promisify(jwt.verify)(req.cookies.jwt,process.env.JWT_SECRET)

                var rol
                var apoderado

                try{
                    rol = await db.Rol.findOne({
                        where: {username: decodificada.id}
                    })
                }catch(error){
                    rol = null
                }

                try{
                    apoderado = await db.Persona.findOne({
                        where: {id: decodificada.id}
                    })
                }catch(error){
                    apoderado = null
                }

                if(rol == null && apoderado == null){
                    res.locals.userPermanente = false
                    res.locals.userPermanenteApoderado = false
                    next()
                } else if (apoderado == null){
                    res.locals.userPermanente = true
                    res.locals.userPermanenteApoderado = false
                    return next()
                } else{
                    res.locals.userPermanenteApoderado = true
                    res.locals.userPermanente = false
                    return next()
                }

            } catch (error) {
                console.log(error)
                res.locals.userPermanente = false
                res.locals.userPermanenteApoderado = false
                return next()
            }


        }
    
})

//llamar al router
app.use('/',require('./src/routes/router'))
app.use('/',require('./src/routes/salud'))
app.use('/',require('./src/routes/sistemas'))



