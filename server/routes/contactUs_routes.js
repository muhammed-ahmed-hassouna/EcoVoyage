const { Router } = require("express");
const contactUsController = require("../controllers/contactUs_controller");
const router = Router();

const verifyJWT = require('../Middleware/VerifyJWT');

router.post("/sendEmailContact",verifyJWT.authorize([1 , 2]), contactUsController.sendEmailContact);

router.get("/getContact", contactUsController.getContact);

router.get("/getContactById/:id", contactUsController.getContactById);

router.put('/updateContactShownStatus/:id', contactUsController.updateContactShownStatus);



module.exports = router;