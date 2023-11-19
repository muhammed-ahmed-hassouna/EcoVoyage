const db = require('../Models/config/db');

const getAccommodationsQuery = `
    SELECT * FROM accommodation
    WHERE is_deleted = false`;

const getAccommodationsByIDQuery = `
    SELECT * FROM accommodation
    WHERE is_deleted = false
    AND accommodation_id = $1`;

const addAccommodationQuery = `
    INSERT INTO accommodation(
        title,
        pricing, 
        amenities,
        type,
        location, 
        guests, rating,
        accommodation_details
    ) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;

const updateAccommodationQuery = `
    UPDATE accommodation 
    SET 
        title = COALESCE($2, title), 
        pricing = COALESCE($3, pricing), 
        amenities = COALESCE($4, amenities),
        type = COALESCE($5, type),
        location = COALESCE($6, location),
        guests = COALESCE($7, guests),
        rating = COALESCE($8, rating),
        accommodation_details = COALESCE($9, accommodation_details)
    WHERE 
        accommodation_id = $1 
    RETURNING *`;

const deleteAccommodationQuery = `
    UPDATE accommodation
    SET 
        is_deleted = true 
    WHERE 
        accommodation_id = $1`;

const addCommentQuery = `
    INSERT INTO comments(accommodation_id, user_id, comment_text)
    VALUES ($1, $2, $3)
    RETURNING *`;

const getAccommodationsWithCommentsQuery = `
    SELECT
        accommodation.*,
        comments.comment_id,
        comments.comment_text,
        comments.timestamp as comment_timestamp,
        users.first_name,
        users.last_name
    FROM accommodation
    INNER JOIN comments ON accommodation.accommodation_id = comments.accommodation_id
    INNER JOIN users ON comments.user_id = users.user_id
    WHERE
        accommodation.is_deleted = false
    AND
        accommodation.accommodation_id = $1`;

module.exports = {
    getAccommodationsQuery,
    getAccommodationsByIDQuery,
    addAccommodationQuery,
    updateAccommodationQuery,
    deleteAccommodationQuery,
    addCommentQuery,
    getAccommodationsWithCommentsQuery
};
