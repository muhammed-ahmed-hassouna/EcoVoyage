const { Router } = require('express');
const commentController = require('../controllers/comments-controller');
const router = Router();

router.post("/add", commentController.addAccommodation);
router.get("/get", commentController.getAccommodations);
router.delete("/add", commentController.addAccommodation);



module.exports = router;