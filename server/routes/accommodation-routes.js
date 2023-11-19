const { Router } = require('express');
const accommodationController = require('../controllers/accommodation-controller');
const router = Router();

// const verifyJWT = require('../Middleware/VerifyJWT');
// verifyJWT.authorize([1]),
router.get('/getAccommodations', accommodationController.getAccommodations);

router.post('/addAccommodation', accommodationController.addAccommodation);

router.put(`/updateAccommodation/:id`, accommodationController.updateAccommodation);

router.put('/deleteAccommodation', accommodationController.deleteAccommodation);

router.get('/getAccommodationsByID/:id', accommodationController.getAccommodationsByID);

router.post('/addComment', accommodationController.addComment);

router.get('/getAccommodationsByID2/:id', accommodationController.getAccommodationsByID2);

module.exports = router;
