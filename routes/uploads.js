/**
 * Path: api/upload/usuarios/123
 */
const { Router } = require('express');
const expressFileUpload =  require('express-fileupload');
const { validarJWT } = require('../middlewares/validar-jwt');
const { fileUpload, retornaImage } = require('../controllers/uploads');


const router = Router();

router.use(expressFileUpload());
router.put('/:tipo/:id',validarJWT, fileUpload);
router.get('/:tipo/:foto', retornaImage);



module.exports = router;