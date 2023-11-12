const db = require('../Models/config/db');

const getActivities = async (req, res) => {
    try {
        const query = `
        SELECT * FROM activities
        WHERE 
            is_deleted = false`;
        const result = await db.query(query);
        res.json(result.rows)
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}


const getActivitiesByID = async (req, res) => {
    const { id } = req.params;
    try {
        const query = `
        SELECT * FROM activities
        WHERE 
          is_deleted = false
        AND
          activities_id = $1`;
        const result = await db.query(query, [id]);
        res.json(result.rows)
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}

const addActivities = async (req, res) => {
    const { title, pricing, availability, type, activity_details } = req.body;
    try {
        const query = `
        INSERT INTO activities(
            title,
            pricing, 
            availability, 
            type, 
            activity_details) 
        VALUES ( $1, $2, $3, $4, $5)`;
        const values = [title, pricing, availability, type, activity_details];
        const result = await db.query(query, values)
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
        const updateFields = [];
        const values = [];

        let placeholderCount = 1;

        if (title) {
            updateFields.push(`title = $${placeholderCount}`);
            values.push(title);
            placeholderCount++;
        }

        if (pricing) {
            updateFields.push(`pricing = $${placeholderCount}`);
            values.push(pricing);
            placeholderCount++;
        }

        if (availability) {
            updateFields.push(`availability = $${placeholderCount}`);
            values.push(availability);
            placeholderCount++;
        }

        if (type) {
            updateFields.push(`type =  $${placeholderCount}`);
            values.push(type);
            placeholderCount++;
        }

        if (activity_details) {
            updateFields.push(`activity_details = $${placeholderCount}`);
            values.push(activity_details);
            placeholderCount++;
        }

        const query = `
            UPDATE activities
            SET ${updateFields.join(', ')}
            WHERE activities_id = $${placeholderCount}
        `;
        values.push(id);

        const result = await db.query(query, values);

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
        const result = await db.query(`
        UPDATE activities 
        SET
            is_deleted = true 
        WHERE 
            activities_id = $1`,
            [activities_id]);

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
        const activitiesQuery = `
            SELECT *
            FROM activities
            WHERE activities_id = $1 AND is_deleted = false`;
        const activitiesResult = await db.query(activitiesQuery, [activities_id]);

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
        const query = `
        SELECT
            activities.*,
            comments.comment_id,
            comments.comment_text,
            comments.timestamp as comment_timestamp,
            users.first_name,
            users.last_name
        FROM activities
        INNER JOIN comments ON activities.activities_id = comments.activities_id
        INNER JOIN users ON comments.user_id = users.user_id
        WHERE
            activities.is_deleted = false
        AND
        activities.activities_id = $1`;

        const result = await db.query(query, [id]);
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