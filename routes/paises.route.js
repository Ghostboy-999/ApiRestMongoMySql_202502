const { Router } = require('express');
const {
  createPais,
  getAllPaises,
  getPaisById,
  updatePais,
  deletePais
} = require('../controllers/paises.controller');

const router = Router();

router.post('/', createPais);
router.get('/', getAllPaises);
router.get('/:id', getPaisById);
router.put('/:id', updatePais);
router.delete('/:id', deletePais);

module.exports = router;
