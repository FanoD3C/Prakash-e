// LLAMAR LOS MODULOS MAS IMPORTANTES
// JSONWEBTOKEN
const jwt = require('jsonwebtoken')
// ENCRIPTAR LA CLAVE 
const bcryptjs = require('bcryptjs')
// CONEXION PARA BD
const conexion = require('../database/db')
//PROMISIFY MODULO DE NODE -> TRBAJAMOS CON PROMESAS -> ASYNC -> 
const {promisify} = require('util');
const router = require('../src/routes/indexRoutes');

const { error } = require('console');

const authCtrl = {};

// index
authCtrl.renderIndex = (req, res) => {
    // datos del servidor vienen en objeto
    res.render('index', {
        tituloIndex: 'ENVIAMOS DATOS DEL SERVIDOR, desde routes/indexRoutes.js y para tomar la ruta anterior mencionada, se debe llamar desde el servidor ./app.js'
    });
}

// galeria
authCtrl.renderGaleria = (req, res) => {
    res.render('galeria', {
    })
}

// contacto
authCtrl.renderContacto = (req, res) => {
    res.render('contacto', {
        titulo: 'Contacto, recuerda, este objeto es obetenido desde el controlador',
        estado: false,
        contacto: 'Contacto con el motor de plantillas hbs y express + node',
        footerContacto: 'Hola soy un footer desde un JSON en app.js'
    })
}

// registro
authCtrl.renderIndexRegister = async (req, res) => {
    try {
        const name = req.body.name
        const user = req.body.user
        const pass = req.body.pass
        //empezamos a utilizar la libreria bcrypts para encriptar claves
        let passHash = await bcryptjs.hash(pass, 8)
        // console.log(passHash)
        //insertamos en la BD los datos del formulario + encriptada la clave en la bd
        conexion.query('INSERT INTO users SET ?', {user:user, name:name, pass:passHash}, (error, results) => {
            if(error) {console.log(error)}
            res.render('login/indexRegister', {
                alert: true,
                alertTitle: "Registro Okey",
                alertMessage: "Se han registrado los datos correctamente",
                alertIcon: 'success',
                showConfirmButton: false, 
                timer: 800,
                ruta: 'login/indexLogin'
            }) 
        })
    }catch (error) {

        console.log(error)
    }
}

//login 
authCtrl.renderIndexLogin = async (req, res) => {
    try {
        const user = req.body.user
        const pass = req.body.pass
        // si no coincide la passs con el user
        if (!user || !pass) {
            res.render('login/indexLogin', {
                alert: false,
                alertTitle: "Advertencia",
                alertMessage: "Ingrese un usuario y password",
                alertIcon: 'info',
                showConfirmButton: true, 
                timer: 3000,
                ruta: 'login/indexLogin'
            })
        }else {
            // const documente write
            // let docWrite = document.write("<a class='text-center' href="/">¿Problemas con la cuenta?<br>recuperala haciendo click aqui! &#128070;</a>")
            
   
            

            // en el caso de que si se ingreso el usuario, se debe buscar el usuario en la tabla SQL -> Mysql -> BD
            conexion.query('SELECT * FROM users WHERE user = ?',[user], async (error, results) =>{
                // comparamos la pass ingresada con los datos de la BD
                if(results.length == 0 || !(await bcryptjs.compare(pass, results[0].pass))) {
                    
                    // sino concide la pass, se debe validar
                    res.render( 'login/indexLogin', {
                        alert: true,
                        alertTitle: "Se encontro un problema",
                        alertMessage: "No coincide el usuario con la contraseña, intentalo nuevamente",
                        alertIcon: 'info',
                        alertShowConfirmButton: true, 
                        // segundos del popup
                        alertTimer: 10500,
                        alertIcon: 'error',
                        // ruta de asignacion en el momento de aplicar en el boton 'ok' de sweetalert
                        alertRuta: 'indexLogin',
                        alertHTML:  '<h1> hola mundo </h1>'
                    })
                }else {
                    // si todo esta bien, entonces est validado
                    const id = results[0].id
                    const token = jwt.sign({id:id}, process.env.JWT_SECRETO, {
                        expiresIn: process.env.JWT_TIEMPO_EXPIRA
                    })
                    // cookies sin tiempo de expira
                    // const token = jwt.sign({id:id}, process.env.JWT_SECRETO)
                    
                    //mostrar en consola el token 
                    console.log("TOKEN: "+token+ "para el USUARIO: "+user)

                    // config COOKIES
                    const cookiesOptions = {
                        //tiempo que expira la cookie
                        expires: new Date(Date.now()+process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                        httpOnly: true
                    }
                    // nombrar la cookie, con este nombre "jwt" aparece en el navegador
                    res.cookie('jwt', token, cookiesOptions)
                    res.render('login/indexLogin', {
                        alert: true,
                        alertTitle: "Conexion Exitosa",
                        alertMessage: "Login Correcto",
                        alertIcon: 'success',
                        // btn de confirmacion
                        alertShowConfirmButton: false, 
                        alertTimer: 1500,
                        alertRuta: '../adminFront/indexAdmin'
                    })
                }
            })
        }
        // vemos por consola el user y pass ingresadas
        console.log(user + " - "+ pass)
    } catch (error) {
        console.log(error)
        
    }
}

// Metodo autenticacion
authCtrl.isAuth = async (req, res, next) => {
    //si la cookie 
    if (req.cookies.jwt){
        try {
            // aqui usamos la variable: env con etsa verificamos el token 
            const decode = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRETO)
            //consulta para validar que el user esta en la BD
            conexion.query('SELECT * FROM users WHERE id = ?', [decode.id], (error, results)=> {
                //en el caso que los resultados no tengan ningun valor
                if(!results) {return next ()}
                req.user = results[0]
                return next()
            })
        } catch (error) {
            console.log(error)
            return next()
        }
    } else {
        res.redirect('/login/indexLogin')

    }    
}

// CERRAR SESION
authCtrl.IsLogOut = (req, res) => {
    //borramos la cookie
    res.clearCookie('jwt')
    return res.redirect('/')
}

module.exports = authCtrl;
