const db = require('../Models/config/knexConfig');

const activityModel = require('../Models/activityModel');

const Firebase = require("../Middleware/FirebaseConfig/FireBaseConfig");

const addActivities = async (req, res) => {
    try {
        const activitiesData = req.body;

        const files = req.files;
        if (files && files.length > 0) {
            const fileUrls = await Promise.all(files.map(async (file) => {
                const fileName = `${Date.now()}_${file.originalname}`;
                return await Firebase.uploadFileToFirebase(file, fileName);
            }));

            req.body.imageactivity = fileUrls;
        }
        const result = await activityModel.addActivities(activitiesData);

        res.json({ message: 'activities has been added!', data: result[0] });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getActivities = async (req, res) => {
    try {
        const result = await activityModel.getActivities();
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};


const getActivitiesByID = async (req, res) => {
    const activities_id = req.params.id;
    try {
        const result = await activityModel.getActivitiesByID(activities_id);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};

const updateActivities = async (req, res) => {
    try {
        const activities_id = req.params.id;
        const activitiesData = req.body;

        const files = req.files;
        if (files && files.length > 0) {
            const fileUrls = await Promise.all(files.map(async (file) => {
                const fileName = `${Date.now()}_${file.originalname}`;
                return await Firebase.uploadFileToFirebase(file, fileName);
            }));

            req.body.imageactivity = fileUrls;
        }

        const result = await activityModel.updateActivities(activities_id, activitiesData);

        if (!result.length) {
            return res.status(404).json({ error: 'The activities not found' });
        } else {
            res.status(200).json({
                message: 'The activities Updated!',
                data: result[0],
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};

const markActivityAsDeleted = async (req, res) => {
    const activities_id = req.params.id;
    try {
        const result = await activityModel.markActivityAsDeleted(activities_id);

        if (!result) {
            return res.status(404).json({ error: "The activities not found" });
        } else {
            res.status(200).json({
                message: 'The activities Is Marked as Deleted!',
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};

const addCommentToAc = async (req, res) => {
    const comment_text = req.body.comment_text;
    const activities_id = req.params.id;
    const user_id = req.user.user_id;

    try {
        const commentResult = await activityModel.addCommentToAc(activities_id, user_id, comment_text);
        res.status(200).json({ message: 'Comment added successfully', commentResult });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};

const getActivitiesWithComments = async (req, res) => {
    const activities_id = req.params.id;
    try {
        const result = await activityModel.getActivitiesWithComments(activities_id);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};

const getActivitiesPaginated = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 4;

        const result = await activityModel.getActivitiesPaginated(page, pageSize);

        if (!result) {
            return res.status(404).json({ error: "No Data !" });
        } else {
            res.json({
                data: result,
                currentPage: page,
                pageSize: pageSize,
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};


module.exports = {
    getActivities,

    getActivitiesByID,

    addActivities,

    updateActivities,

    markActivityAsDeleted,

    addCommentToAc,

    getActivitiesWithComments,

    getActivitiesPaginated
}