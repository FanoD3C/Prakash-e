// Invocar los modulos instalados en el proyecto
// EXPRESSS
const express = require("express");
// JSONWEBTOKEN
const jwt = require('jsonwebtoken');
// DOTENV
const dotenv = require('dotenv');
// COOKIE-PARSER 
const cookieParser = require('cookie-parser');
// HANDLEBARS
const hbs = require('hbs');
// PATH // path le enseña a node identificar en que maquina estamos programando si en mac o windows o linnux
const path = require('path');
// FIN DE INVOCACIONES DE LOS MODULOS

// INCIALIZAR LOS MODULOS INSTALADOS
// EXPRESS
const app = express();
// Configuramos el puerto express
const port = process.env.PORT || 3003;
// FIN DE LA INICIALIZACION DE MODULOS

// CONFIG DE LOS MODULOS DEL SERVIDOR
// registerPartials es el metodo de hbs que nos permite utilizar {{> turuta}} 
hbs.registerPartials(__dirname + '/views/partials', function (err) {});
// Aqui seteamos la carpeta en donde estaran los index hbs, contact hbs / carpetas etc
app.set('views', path.join(__dirname, 'views'));
// Seteamos el mortor de la vista, aqui le indicamos a express que usamos las vista .hbs
app.set('view engine', '.hbs');

// config dotenv
dotenv.config({path:'./env/.env'});
// Aqui indacamos el directorio que tendra todo nuestros recursos css, img, favicon etc
app.use(express.static(__dirname + '/src'));

// Aqui para procesar datos de formularios
app.use(express.urlencoded({extended:true}));
app.use(express.json());

// TRABAJANDO CON COOKIES
app.use(cookieParser());

//eliminar cache
app.use(function (req, res, next){
    if(!req.user)
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate' )
    next();
})

// FAVICON
// app.use('/favicon.ico', express.static('/icon-prakash.ico'));

// RUTAS
// Todas las rutas estran en un archivso separado en js llamado indexRoutes.js
app.use(require('./src/routes/indexRoutes'));
// FIN DE CONFIG DE LOS MODULSO DEL SERVIDOR


// MEOTDO escuhar e inicializamos al servidor 
app.listen(port, ()=>{
    // indicamos el puerto 
    console.log(`Ejemplo ${port}`)
})


// CODIGO EXTRA 
// metodo para configurar el motor de plantillas asignando la extension del archivo el cual trabajaremos, en este caso es hbs
// app.engine('hbs', hbs({
//     defaultLayout: 'main',
//     layoutsDir: path.join(app.get('views'), 'partials'),
//     partialsDir: path.join(app.get('views'), 'login'),
//     extname: '.hbs'
// }));
// FIN CODIGO EXTRA