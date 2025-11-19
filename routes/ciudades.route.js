const { Router } = require('express');
const {
  createCiudad,
  getCiudades,
  getCiudadById,
  updateCiudad,
  deleteCiudad
} = require('../controllers/ciudades.controller');

const router = Router();

router.post('/', createCiudad);
router.get('/', getCiudades);
router.get('/:id', getCiudadById);
router.put('/:id', updateCiudad);
router.delete('/:id', deleteCiudad);

module.exports = router;