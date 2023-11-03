const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');
const {googleVerify} = require('../helpers/google-verify');


const login = async(req, res = response) =>{

     const { email, password } = req.body;

     try { 

          //verificar email
          const usuarioDB = await Usuario.findOne({email});

          if(!usuarioDB){
               return res.status(404).json({
                    ok: false,
                    msg: 'Credenciales incorrectas'
               })
          }
          //Varificar password
          const validPassword = bcrypt.compareSync( password, usuarioDB.password );
        
          if(!validPassword){
             return res.status(400).json({
               ok: false,
               msg: 'Credenciales incorrectas'
             });
          }
          // Generar el TOKEN = jwt
          const token = await generarJWT(usuarioDB.id);

          res.json({
               ok: true,
               token
          });
          
     } catch (error) {
          console.log(error);
          res.status(500).json({
               ok: false,
               msg: 'Hable con el administrador'
          })
     }
}

const renewToken = async(req, res = response) =>{
      
     const uid = req.uid;
     //Generar el Token -JWT
     const token = await generarJWT(uid);

     res.json({
          ok:true,
          token
     })
}

const googleSignIn = async(req, res = response) =>{
 
     try {
     const {email, name, picture } = await googleVerify(req.body.token);

     const usuarioDB = await Usuario.findOne({email});
     let usuario;

     if(!usuarioDB){
       usuario = new Usuario({
          nombre:name,
          email,
          password: '@@@',
          img: picture,
          google: true
       });
     }else{
         usuario = usuarioDB;
         usuario.google = true;
     }

     //Guardar Usuario
     await usuario.save();

     //Generar el TOKEN - JWT.
     const token = await generarJWT(usuario.id);

            res.json({
               ok: true,
               token  
            });
     } catch (error) {
          console.log(error);
          res.status(500).json({
               ok: false,
               msg: 'Token de google no es correcto'  
            });
     }
}

module.exports = {
     login,
     renewToken,
     googleSignIn
}