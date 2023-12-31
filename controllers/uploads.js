const path = require('path');
const fs = require('fs');
const { response } = require('express');
const { v4: uuidv4 } = require('uuid');
const {actualizarImagen} = require('../helpers/actualizar-imagen');
const fileUpload = (req, res = response) =>{

     const tipo = req.params.tipo;
     const id = req.params.id;

     const tiposValidos = ['hospitales','medicos','usuarios'];

     //validamos el tipo de archivo
     if(!tiposValidos.includes(tipo)){
          return res.status(400).json({
             ok:false,
             msg: 'No es un médico, usuario u hospital (tipo)'
          });
     }
     //Validamos que exista un archivo
     if(!req.files || Object.keys(req.files).length ===0){
          return res.status(400).json({
               ok:false,
               msg: 'No hay ningún archivo'
          });
     }
     //Procesar la imagen...
     const file = req.files.imagen;
     //extraer la extension del archivo
     const nombreCortado = file.name.split('.');
     console.log(nombreCortado);
     const extensionArchivo = nombreCortado[ nombreCortado.length -1 ];

     //validar extension
     const extensionesValidas = ['png','jpg','jpeg','gif'];
     console.log(extensionArchivo);
     if(!extensionesValidas.includes(extensionArchivo)){
          return res.status(400).json({
             ok:false,
             msg: 'Tipo de archivo no permitido'
          });
     }
     //Generar el nombre del archivo
     const nombreArchivo = `${uuidv4()}.${extensionArchivo}`;
     //Crear el path para guardar la imagen
     const path = `./uploads/${tipo}/${nombreArchivo}`;

     //Mover la imagen
     file.mv(path, (err) =>{
          if(err){
               console.log(err);
              return res.status(500).json({
                    ok:false,
                    msg: 'No se pudo guardar la imagen'
               });
          }

          //Actualizar base de datos.
           actualizarImagen(tipo, id, nombreArchivo);

          res.json({
               ok: true,
               msg: 'Archivo subido',
               nombreArchivo
          });
     });
}

const retornaImage = (req, res = response) =>{


     const tipo = req.params.tipo;
     const foto = req.params.foto;
     const pathImg = path.join(__dirname,`../uploads/${tipo}/${foto}`);
     //imagen por defecto
     if(fs.existsSync(pathImg)){
          res.sendFile(pathImg);
     }else{
     const pathImg = path.join(__dirname,`../uploads/no-img.jpg`);
          res.sendFile(pathImg);
     }
}


module.exports = {
     fileUpload,
     retornaImage
}