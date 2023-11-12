const { Router } = require('express');
const cartController = require('../controllers/cart_controller');
const router = Router();

router.get("/cart", cartController.getCartData);

router.put("/delete_product", cartController.deleteCartItem);

module.exports = router;