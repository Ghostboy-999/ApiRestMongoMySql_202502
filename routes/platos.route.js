const { Router } = require('express');
const {
  createPlato,
  getAllPlatos,
  getPlatoById,
  updatePlato,
  deletePlato
} = require('../controllers/platos.controller');

const router = Router();

router.post('/', createPlato);
router.get('/', getAllPlatos);
router.get('/:id', getPlatoById);
router.put('/:id', updatePlato);
router.delete('/:id', deletePlato);

module.exports = router;