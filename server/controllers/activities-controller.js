const db = require('../Models/config/db');
const activitiesQueries = require('../Models/activityQueries');

const getActivities = async (req, res) => {
    try {
        const result = await db.query(activitiesQueries.getActivitiesQuery);
        res.json(result.rows)
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}


const getActivitiesByID = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query(activitiesQueries.getActivitiesByIDQuery, [id]);
        res.json(result.rows)
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}

const addActivities = async (req, res) => {
    const { title, pricing, availability, type, activity_details } = req.body;
    try {
        const values = [title, pricing, availability, type, activity_details];
        const result = await db.query(activitiesQueries.addActivitiesQuery, values)
        res.json({ message: 'Activity has been added !' })
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}

const updateActivities = async (req, res) => {
    const { id } = req.params;
    const { title, pricing, availability, type, activity_details } = req.body;
    try {
        const values = [id, title, pricing, availability, type, activity_details];
        const result = await db.query(activitiesQueries.updateActivitiesQuery, values);

        if (!result.rowCount) {
            return res.status(404).json({ error: "The activity not found" });
        } else {
            res.status(200).json({
                message: 'The activity Updated!',
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}

const deleteActivities = async (req, res) => {
    const activities_id = req.query.activities_id;
    try {
        const result = await db.query(activitiesQueries.deleteActivitiesQuery, [activities_id]);
        if (!result.rowCount) {
            return res.status(404).json({ error: "The Activity not found" });
        } else {
            res.status(200).json({
                message: 'The Activity Updated!',
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}


const addComment = async (req, res) => {
    const { activities_id, user_id, comment_text } = req.body;

    try {
        const activitiesResult = await db.query(activitiesQueries.addCommentQuery, [activities_id]);

        if (activitiesResult.rowCount === 0) {
            return res.status(404).json({ error: 'activities not found or deleted' });
        }

        // Check if the user exists
        const userQuery = `
            SELECT *
            FROM users
            WHERE user_id = $1`;
        const userResult = await db.query(userQuery, [user_id]);

        if (userResult.rowCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Insert the comment into the comments table
        const insertCommentQuery = `
            INSERT INTO comments(activities_id, user_id, comment_text)
            VALUES ($1, $2, $3)
            RETURNING *`;
        const insertCommentValues = [activities_id, user_id, comment_text];
        const commentResult = await db.query(insertCommentQuery, insertCommentValues);

        res.json({ message: 'Comment added successfully', comment: commentResult.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};

const getActivitiesByID2 = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query(activitiesQueries.getActivitiesWithCommentsQuery, [id]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = {
    getActivities,
    addActivities,
    updateActivities,
    deleteActivities,
    getActivitiesByID,
    getActivitiesByID2,
    addComment
}