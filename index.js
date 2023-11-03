const express = require("express");
require("dotenv").config();
const { dbConnection } = require("./database/config");
const cors = require("cors");

//Crear el servidor de express
const app = express();

//Configurar cors
app.use(cors());

//Carpeta publica
app.use(express.static('public'));

// Lectura y parseo del body
app.use(express.json());

app.use(express.urlencoded({
  extended:true
  }));
//Base de datos
dbConnection();
app.use('/api/usuarios',require('./routes/usuarios'));
app.use('/api/hospitales',require('./routes/hospitales'));
app.use('/api/medicos',require('./routes/medicos'));
app.use('/api/todo',require('./routes/busquedas'));
app.use('/api/upload',require('./routes/uploads'));
app.use('/api/login',require('./routes/auth'));




//password : mqLoeiZyv5cRiPw3
//user: mean_user
//Rutas
app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});
