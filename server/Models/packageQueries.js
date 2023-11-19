const db = require('../Models/config/db');

const getPackagesQuery = `
    SELECT * FROM packages 
    WHERE 
        is_deleted = false`;

const getPackagesByIdQuery = `
    SELECT * FROM packages 
    WHERE 
        is_deleted = false
        AND packages_id = $1`;

const addPackagesQuery = `
    INSERT INTO packages(
        cost, 
        title, 
        overview, 
        highlights, 
        inclusions, 
        exclusions,
        destination,
        itinerary
    ) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;

const updatePackagesQuery = `
    UPDATE packages 
    SET
        cost = COALESCE($2, cost),
        title = COALESCE($3, title),
        overview = COALESCE($4, overview), 
        highlights = COALESCE($5, highlights),
        inclusions = COALESCE($6, inclusions),
        exclusions = COALESCE($7, exclusions),
        destination = COALESCE($8, destination),
        itinerary = COALESCE($9, itinerary)
    WHERE 
        packages_id = $1
    RETURNING *`;

const deletePackagesQuery = `
    UPDATE packages 
    SET 
        is_deleted = true 
    WHERE 
        packages_id = $1`;

const addCommentQuery = `
    INSERT INTO comments(packages_id, user_id, comment_text)
    VALUES ($1, $2, $3)
    RETURNING *`;

const getPackageWithCommentsQuery = `
    SELECT
        packages.packages_id,
        comments.comment_id,
        comments.comment_text,
        comments.timestamp as comment_timestamp,
        users.first_name,
        users.last_name
    FROM packages
    INNER JOIN comments ON packages.packages_id = comments.packages_id
    INNER JOIN users ON comments.user_id = users.user_id
    WHERE
        packages.is_deleted = false
    AND
        packages.packages_id = $1`;



const BookPackageQuery = `
INSERT INTO booking(packages_id,user_id,address,phone,room_preference,adults,children)
VALUES ($1, $2, $3, $4, $5, $6, $7)
RETURNING *`;


const getBookPackagesQuery = `
SELECT
    packages.packages_id,
    booking.book_id,
    booking.phone,
    booking.room_preference,
    booking.adults,
    booking.children,
    users.user_id,
    users.first_name,
    users.last_name
FROM packages
    INNER JOIN booking ON packages.packages_id = booking.packages_id
    INNER JOIN users ON booking.user_id = users.user_id
    WHERE
        packages.is_deleted = false
    AND
        packages.packages_id = $1`;

module.exports = {
    getPackagesQuery,

    getPackagesByIdQuery,

    addPackagesQuery,

    updatePackagesQuery,

    deletePackagesQuery,

    addCommentQuery,

    getPackageWithCommentsQuery,

    BookPackageQuery,

    getBookPackagesQuery,

};
