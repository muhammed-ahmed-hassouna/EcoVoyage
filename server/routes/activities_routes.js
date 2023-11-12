const { Router } = require('express');
const activitiesController = require('../controllers/activities-controller');
const router = Router();

router.get('/getActivities', activitiesController.getActivities);

router.post('/addActivities', activitiesController.addActivities);

router.put('/updateActivities/:id', activitiesController.updateActivities);

router.put('/deleteActivities', activitiesController.deleteActivities);

router.get('/getActivitiesByID/:id', activitiesController.getActivitiesByID);

router.post('/addCommentAC', activitiesController.addComment);

router.get('/getAccommodationsByID2AC/:id', activitiesController.getActivitiesByID2);

module.exports = router;
