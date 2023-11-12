const { Router } = require("express");
const contactUsController = require("../controllers/contactUs_controller");
const router = Router();

router.get("/getContact", contactUsController.getContact);

router.post("/addContact", contactUsController.addContact);

// router.get("/contactid/:id", contactUsController.contactid);

router.put("/deleteContact/:id", contactUsController.deleteContact);

module.exports = router;