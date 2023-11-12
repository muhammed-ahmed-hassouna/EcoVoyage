const { Router } = require("express");
const OAuthController = require(`../controllers/OAuth_controller`);
const router = Router();



router.get("/", OAuthController.button);

router.get("/auth/google", OAuthController.authentication);

router.get("/auth/google/callback", OAuthController.authenticationCallback);

router.get("/auth/google/failure", OAuthController.authenticationFailure);

router.get("/protected", OAuthController.protected);

router.get("/logout", OAuthController.logout);


module.exports = router;