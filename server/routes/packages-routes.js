const { Router } = require('express');
const packagesController = require('../controllers/packages-controller');
const router = Router();

router.get('/getPackages', packagesController.getPackages);

router.post('/addPackages', packagesController.addPackages);

router.put('/updatePackages/:id', packagesController.updatePackages);

router.put('/deletePackages', packagesController.deletePackages);

router.get('/getPackagesById/:id', packagesController.getPackagesById);

router.post('/addCommentPC', packagesController.addComment);

router.get('/getAccommodationsByID2PC/:id', packagesController.getAccommodationsByID2);

module.exports = router;
