const { Router } = require('express');


const { heroesGet,
        heroeIdGet,
        heroesComoGet,
        heroesPost,
        heroePut,
        heroeDelete
    
} = require('../controllers/heroes.controller');




const router = Router();


router.get('/', heroesGet);


router.get('/:id', heroeIdGet);


router.get('/como/:termino', heroesComoGet);


// Insert - CREATE
router.post('/', heroesPost);


router.put('/:id', heroePut);


router.delete('/:id', heroeDelete);





module.exports = router;
