const db = require('../Models/config/db');

const getActivitiesQuery = `
    SELECT * FROM activities
    WHERE is_deleted = false`;

const getActivitiesByIDQuery = `
    SELECT * FROM activities
    WHERE is_deleted = false
    AND activities_id = $1`;

const addActivitiesQuery = `
    INSERT INTO activities(
        title,
        pricing, 
        availability, 
        type, 
        activity_details
    ) 
    VALUES ($1, $2, $3, $4, $5)`;

const updateActivitiesQuery = `
    UPDATE activities 
    SET
        title = COALESCE($2, title),
        pricing = COALESCE($3, pricing), 
        availability = COALESCE($4, availability),
        type = COALESCE($5, type),
        activity_details = COALESCE($6, activity_details)
    WHERE 
        activities_id = $1
    RETURNING *`;

const deleteActivitiesQuery = `
    UPDATE activities 
    SET
        is_deleted = true 
    WHERE 
        activities_id = $1`;

const addCommentQuery = `
    INSERT INTO comments(activities_id, user_id, comment_text)
    VALUES ($1, $2, $3)
    RETURNING *`;

const getActivitiesWithCommentsQuery = `
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

module.exports = {
    getActivitiesQuery,
    getActivitiesByIDQuery,
    addActivitiesQuery,
    updateActivitiesQuery,
    deleteActivitiesQuery,
    addCommentQuery,
    getActivitiesWithCommentsQuery
};
