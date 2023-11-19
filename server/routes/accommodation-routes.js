const { Router } = require('express');
const accommodationController = require('../controllers/accommodation-controller');
const router = Router();

const verifyJWT = require('../Middleware/VerifyJWT');

router.get('/getAccommodations', accommodationController.getAccommodations);

router.get('/getAccommodationsPaginated', accommodationController.getAccommodationsPaginated); //

router.post('/addAccommodation', accommodationController.addAccommodation);

router.put(`/updateAccommodation/:id`, accommodationController.updateAccommodation);

router.put('/deleteAccommodation', accommodationController.deleteAccommodation);

router.get('/getAccommodationsByID/:id', accommodationController.getAccommodationsByID);

router.post('/addComment', verifyJWT.authorize([1]),accommodationController.addCommentAccomm);

router.get('/getAccommodationsWithComments/:id', accommodationController.getAccommodationsWithComments);

router.post('/BookAccommodation/:id',verifyJWT.authorize([1]), accommodationController.BookAccommodation);

router.get('/getBookAccommodations/:id', accommodationController.getBookAccommodations);

// router.get('/getBookById/:id', accommodationController.getBookById);

module.exports = router;
