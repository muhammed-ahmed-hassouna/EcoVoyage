const { Router } = require('express');
const packagesController = require('../controllers/packages-controller');
const router = Router();
const verifyJWT = require('../Middleware/VerifyJWT');
// verifyJWT.authorize([1]),
router.get('/getPackages', packagesController.getPackages);

router.post('/addPackages', packagesController.addPackages);

router.put('/updatePackages/:id', packagesController.updatePackages);

router.put('/deletePackages', packagesController.deletePackages);

router.get('/getPackagesById/:id', packagesController.getPackagesById);

router.post('/addCommentPac',verifyJWT.authorize([1]),packagesController.addCommentPac);

router.get('/getPackagesWithComments/:id', packagesController.getPackagesWithComments);

router.post('/BookPackage/:id',verifyJWT.authorize([1]), packagesController.BookPackage);

router.get('/getBookPackages/:id', packagesController.getBookPackages);


module.exports = router;
