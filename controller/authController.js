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
        let passHash = await bcryptjs.hash(pass, 8)
        // console.log(passHash)
        conexion.query('INSERT INTO users SET ?', {user:user, name:name, pass:passHash}, (error, results) => {
            if(error) {console.log(error)}
            res.redirect('/') 
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
        if (!user || !pass) {
            res.render('login/indexLogin', {
                alert: false,
                alertTitle: "Advertencia",
                alertMessage: "Ingrese un usuario y password",
                alertIcon: 'info',
                showConfirmButton: true, 
                timer: true,
                ruta: 'login/indexLogin'
            })
        }else {
            conexion.query('SELECT * FROM users WHERE user = ?',[user], async (error, results) =>{
                if(results.length == 0 || !(await bcryptjs.compare(pass, results[0].pass))) {
                    // sino concide la pass, se debe validar
                
                    res.render( 'login/indexLogin', {
                        alert: true,
                        alertTitle: "Advertencia",
                        alertMessage: "Ingrese un usuario y password",
                        alertIcon: 'info',
                        showConfirmButton: true, 
                        timer: true,
                        ruta: 'login/indexLogin'
                    })
                }else {
                    // si todo esta bien, entonces est validado
                    const id = results[0].id
                    const token = jwt.sign({id:id}, process.env.JWT_SECRETO, {
                        expiresIn: process.env.JWT_TIEMPO_EXPIRA
                    })
                   // const token = jwt.sign({id:id}, process.env.JWT_SECRETO)
                    console.log("TOKEN: "+token+ "para el USUARIO: "+user)

                    // config COOKIES
                    const cookiesOptions = {
                        expires: new Date(Date.now()+process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                        httpOnly: true
                    }
                    res.cookie('jwt', token, cookiesOptions)
                    res.render('login/indexLogin', {
                        alert: true,
                        alertTitle: "Conexion Exitosa",
                        alertMessage: "Login Correcto",
                        alertIcon: 'success',
                        showConfirmButton: false, 
                        timer: 800,
                        ruta: ''
                        
                    })
                }
            })
        }
        console.log(user + " - "+ pass)
    } catch (error) {
        console.log(error)
        
    }
}


// METODO PARA REGISTRARNOS
authCtrl.registerController = async (req, res) => {
    //capturar datos del form register, estos son: los de la propiedad name de los inputs
    
}

module.exports = authCtrl;
