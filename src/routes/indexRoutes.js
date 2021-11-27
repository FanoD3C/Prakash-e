const express = require('express');
const authCtrl = require('../../controller/authController');
// const jwt = require('jsonwebtoken');

// Modulo de var de entorno
// const dotenv = require('dotenv');

// Modulo cokkie parser 
// const cookieParser = require('cookie-parser');

// PROBAMOS LA CONEXION DE LA BASE DE DATOS
// La conexion se deb hacer desde la base de datos
// const conexion = require('../../database/db')

// el modulo Router sirve para tener o crear multiples rutas pero por archivos separados, la constante router es el encargado de redirigir las rutas
const router = express.Router();

// definir el controller, para hacer uso de los modulos
const {renderIndex, renderGaleria, renderContacto, renderIndexLogin, renderIndexRegister} = require('../../controller/authController')


//ROUTER PARA LAS VISTAS
// Enviando datos con el servidor / esta es una simulacion de un servidor
router.get('/', renderIndex)

// RUTA Galeria
router.get('/galeria', renderGaleria) 

// RUTA CONTACTO
router.get('/contacto', renderContacto);

// testeo productos
router.get('/producto', (req, res) => {
    res.render('producto', {
       
    })
})

// testeo -> login jwt 
router.get('/loginJWT', (req, res) => {
    // enviamos el archivo que queremos en este caso es: 'login/indexLogin.hbs'
    res.render('loginJWT', {
    })
})

// RUTA LOGIN
router.get('/login/indexLogin', renderIndexLogin)

// RUTA TESTEO REGISTER
router.get('/login/indexRegister', (req, res) => {
    res.render('login/indexRegister')
})


// RUTA index ADMIN
router.get('/adminFront/indexAdmin', (req, res) => {
    res.render('adminFront/indexAdmin', {
        titulo: 'Registrarse',

    })
})

//ROUTER PARA LOS METODOS DEL CONTROLADOR
// .post() -> entre parentesis se debe indicar la ruta del formulario que captura los datos 
// registerController + loginRegister son los metodos llamados desde -> authController.js
router.post('/login/indexRegister',authCtrl.renderIndexRegister)
router.post('/login/indexLogin', authCtrl.renderIndexLogin)


// AL FINAL VA LA VISTA 404 / SI ESTA ANTES DE CUALQUIER FUNCION O LLAMADA ESTA FUNCION 404 PUEDE ALTERAR EL FUNCIONAMIENTO
router.use((req, res, next) => {
    res.status(404).render("404", {
        titulo: "404",
        descripcion: "Pagina no contrada"
    })
})


module.exports = router;
// ESTA RUTA SE DEBE IMPORTAR DESDE EL ARCHIVO DEL SERVIDOR, EN ESTE CASO USAMOS APP.JS