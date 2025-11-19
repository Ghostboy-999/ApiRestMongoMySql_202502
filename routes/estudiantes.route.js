const { Router } = require('express');

const{
    estudiantesGet,
    estudianteIdGet,
    estudiantesComoGet,
    estudiantesPost,
    estudiantePut,
    estudianteDelete
} = require('../controllers/estudiantes.controller')

const router = Router();

router.get('/', estudiantesGet);

router.get('/:idestudiante', estudianteIdGet)

router.get('/carrera/:idcarrera', estudiantesComoGet);

router.post('/', estudiantesPost);

router.put('/:idestudiante', estudiantePut);

router.delete('/:idestudiante', estudianteDelete);

module.exports = router;
