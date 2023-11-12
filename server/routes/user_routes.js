const { Router } = require('express');
const userController = require('../controllers/user_controller');
const router = Router();

// const verifyJWT = require("./Midlleware/verifyJWT");

router.get("/User", userController.getUserData);

router.put("/deleteUser", userController.deleteUser);

router.post("/Signup", userController.registerUser);

router.post("/Login", userController.loginUser);

router.put("/Update", userController.updatepassword);

router.post('/sendEmail', userController.sendEmail);

router.post('/verificationCode', userController.verificationCode);

router.get('/getUserId/:id', userController.getUserId);

router.put('/updateUserData/:id', userController.updateUserData);

module.exports = router;