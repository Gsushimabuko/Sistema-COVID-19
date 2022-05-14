const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const db = require('../../dao/models')
const {promisify} = require('util')
const cookieParser = require('cookie-parser')
const { password } = require('pg/lib/defaults')

exports.iniciarSesion  = async (req,res) => {
    try{
        const username = req.body.username
        const password = req.body.password
        if(username=='' || password==''){
            console.log("no puso user name o contra")
            res.render('iniciar_sesion',{
                alert:true,
                alertMessage:"Ingrese el usuario y contraseña"
            })
        }else{
            const usuario = await db.Rol.findOne({
                where:{
                    username: username
                }
            })
            
            if (usuario==null){
                res.render('iniciar_sesion',{
                    alert:true,
                    alertMessage:"El usuario y/o contraseña ingresado es invalido"
                })

            } else{
                var igual = await bcrypt.compare(password,usuario.password)
                
                if(!igual){
                    res.render('iniciar_sesion',{
                        alert:true,
                        alertMessage:"El usuario y/o contraseña ingresado es invalido"
                    })
                    
                }else{
                    //verifica el acceso
                    const token =jwt.sign({id:usuario.username}, process.env.JWT_SECRET,{
                        expiresIn : process.env.JWT_TIEMPO_EXPIRA
                    })
                    const cookiesOptions ={
                        expires: new Date(Date.now()+process.env.JWT_COOKIE_EXPIRES*24*60*60*1000),
                        httpOnly: true
                    }
                    res.cookie('jwt',token,cookiesOptions)
                    res.redirect('/')
                }
         
            }
        }
    }catch(error){
        console.log(error)
    }
}

exports.isAuthentificated = async (req,res,next) =>{
    console.log("Cookies :  ", req.cookies.jwt);
    if(req.cookies.jwt == null){
        res.render('iniciar_sesion',{alert:false})
    }else{
            try {
                
                const decodificada = await promisify(jwt.verify)(req.cookies.jwt,process.env.JWT_SECRET)
                const usuario = await db.Rol.findOne({
                    where: {
                        username: decodificada.id
                    }
                })
                if(usuario == null){
                    res.render('no_acceso')
                }
                res.locals.user = usuario.username
                return next()
            } catch (error) {
                console.log(error)
                res.render('no_acceso')
            }
    }
}

exports.iniciarSesionApoderado  = async (req,res) => {
    try{
        const dni = req.body.dni

        const count =  await db.Persona.count({
            where: {dni:dni, esAlumno : 0}
        })
        const persona = await db.Persona.findOne({
            where: {dni:dni, esAlumno : 0}
        })

        if(count==0){
            res.render('dni_fallido')
        }else{
            const token =jwt.sign({id:persona.id}, process.env.JWT_SECRET,{
                expiresIn : process.env.JWT_TIEMPO_EXPIRA
            })
            const cookiesOptions ={
                expires: new Date(Date.now()+process.env.JWT_COOKIE_EXPIRES*24*60*60*1000),
                httpOnly: true
            }
            res.cookie('jwt',token,cookiesOptions)
            res.redirect("/panel_control")  
        }
    }catch(error){
        console.log(error)
    }
}

exports.isAuthentificatedApoderado = async (req,res,next) =>{
    if(req.cookies.jwt == null){
        res.redirect('/login_persona')
    }else{
            try {

                const decodificada = await promisify(jwt.verify)(req.cookies.jwt,process.env.JWT_SECRET)

                const usuario = await db.Persona.findOne({
                    where: {id: decodificada.id}
                })
                if(usuario == null){
                    res.render('no_acceso')
                }
                res.locals.user = usuario.id
                return next()
            } catch (error) {
                console.log(error)
                res.render('no_acceso')
            }
    }
}

exports.isSalud = async (req,res,next) =>{
    if (res.locals.user == "salud" || res.locals.user == "directivo"){
        return next()
    } else{
        res.render('no_acceso')
    }
}

exports.isSistema = async (req,res,next) =>{
    if (res.locals.user == "sistema" || res.locals.user == "directivo"){
        return next()
    } else{
        res.render('no_acceso')
    }
    
}

exports.isGuardia = async (req,res,next) =>{
    if (res.locals.user == "guardia"){
        return next()
    } else{
        res.render('no_acceso')
    }
    
}

exports.isDirectivo = async (req,res,next) =>{
    if (res.locals.user == "directivo"){
        return next()
    } else{
        res.render('no_acceso')
    }
    
}

exports.logout = (req,res) => {
    res.clearCookie('jwt')
    return res.redirect('/')
}

exports.logoutApoderado = (req,res) => {
    res.clearCookie('jwt')
    return res.redirect('/login_persona')
}
