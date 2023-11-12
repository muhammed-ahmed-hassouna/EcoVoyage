const { Router } = require('express');
const cartController = require('../controllers/destinations_controller');
const router = Router();

router.get("/destinations", cartController.getDestinations);

module.exports = router;