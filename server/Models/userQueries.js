const db = require('../Models/config/db');

const getUserByIdQuery = `
    SELECT * FROM users 
    WHERE 
        is_deleted = false
        AND user_id = $1`;

const updateUserQuery = `
    UPDATE users 
    SET
        first_name = COALESCE($2, first_name),
        last_name = COALESCE($3, last_name),
        email = COALESCE($4, email), 
        password = COALESCE($5, password),
        country = COALESCE($6, country)
    WHERE 
        user_id = $1
    RETURNING *`;

const deleteUserQuery = `
    UPDATE users 
    SET 
        is_deleted = true 
    WHERE 
        user_id = $1`;

module.exports = {
    getUserByIdQuery,
    updateUserQuery,
    deleteUserQuery
};
