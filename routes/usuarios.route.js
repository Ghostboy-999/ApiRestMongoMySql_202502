const { Router } = require('express');

const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const { validarJWT} = require('../middlewares/validar-jwt');



const {
    //heroesGet,
    //heroeIdGet,
    //heroesComoGet,


    usuariosPost,
    login,
    usuariosGet
    //heroePut,
    //heroeDelete
} = require('../controllers/usuarios.controller');




const router = Router();


//select * from heroes
//router.get('/', heroesGet);


//select * from heroes where id = :id
//router.get('/:id', heroeIdGet);


//select * from heroes where nombre like '%:termino%'
//router.get('/como/:termino', heroesComoGet);


// Insert - CREATE
router.post('/', usuariosPost);

router.post('/login', check('correo','El correo es obligatorio').isEmail(), 
check('password','La contraseña es obligatoria').not().isEmpty(), 
validarCampos, login);

router.get('/', //middlewares
    validarJWT, usuariosGet);


// Update - UPDATE
//router.put('/:id', heroePut);


// Delete - DELETE
//router.delete('/:id', heroeDelete);


//router.patch('/', pruebaPatch);


module.exports = router;
