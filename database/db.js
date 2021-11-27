// AQUI APLICAMOS LA CONEXION CON LA BASE DE DATOS
const mysql = require('mysql');

const conexion = mysql.createConnection ({
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : process.env.DB_DATABASE
})
conexion.connect((error) => {
    if(error){
        console.log('Error de conexion es: '+ error)
        return
    }
    console.log('conexion exitosa con la BD MYSQL');
})

// Sino se exporta el modulo no funciona
module.exports = conexion