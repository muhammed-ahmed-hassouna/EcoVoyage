const { Router } = require('express');
const featuresController = require('../controllers/features-controller');
const router = Router();

router.get('/searchHome', featuresController.searchHome);



module.exports = router;