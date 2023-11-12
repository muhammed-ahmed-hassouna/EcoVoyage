const db = require('../Models/config/db');

// const { getAccommodationsQuery } = require('../Models/Queries');

const getAccommodations = async (req, res) => {
    try {
        const query = `
        SELECT * FROM accommodation
        WHERE 
          is_deleted = false`;
        const result = await db.query(query);
        res.json(result.rows)
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}

const getAccommodationsByID = async (req, res) => {
    const { id } = req.params;
    try {
        const query = `
        SELECT * FROM accommodation
        WHERE 
          is_deleted = false
        AND
          accommodation_id = $1`;
        const result = await db.query(query,[id]);
        res.json(result.rows)
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}


const addAccommodation = async (req, res) => {
    const { title, pricing, amenities, type, location, guests, rating, accommodation_details } = req.body;
    try {
        const query = `
        INSERT INTO accommodation(
            title,
            pricing, 
            amenities,
            type,
            location, 
            guests, rating,
            accommodation_details
            ) 
        VALUES ( $1, $2, $3, $4, $5, $6, $7, $8)`;
        const values = [title, pricing, amenities, type, location, guests, rating, accommodation_details];
        const result = await db.query(query, values)
        res.json({ message: 'Accommodation has been added !' })
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}

const updateAccommodation = async (req, res) => {
    const { id } = req.params;

    const { title, pricing, amenities, type, location, guests, rating, accommodation_details } = req.body;
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

        if (amenities) {
            updateFields.push(`amenities = $${placeholderCount}`);
            values.push(amenities);
            placeholderCount++;
        }

        if (type) {
            updateFields.push(`type =  $${placeholderCount}`);
            values.push(type);
            placeholderCount++;
        }

        if (location) {
            updateFields.push(`location = $${placeholderCount}`);
            values.push(location);
            placeholderCount++;
        }

        if (guests) {
            updateFields.push(`guests = $${placeholderCount}`);
            values.push(guests);
            placeholderCount++;
        }

        if (rating) {
            updateFields.push(`rating = $${placeholderCount}`);
            values.push(rating);
            placeholderCount++;
        }

        if (accommodation_details) {
            updateFields.push(`accommodation_details = $${placeholderCount}`);
            values.push(accommodation_details);
            placeholderCount++;
        }

        const query = `
            UPDATE accommodation
            SET ${updateFields.join(', ')}
            WHERE accommodation_id = $${placeholderCount}
        `;

        values.push(id);

        const result = await db.query(query, values);

        console.log(placeholderCount);

        if (!result.rowCount) {
            return res.status(404).json({ error: "The Accommodation not found" });
        } else {
            res.status(200).json({
                message: 'The Accommodation Updated!',
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};


const deleteAccommodation = async (req, res) => {
    const accommodation_id = req.query.accommodation_id;
    try {
        const result = await db.query(`
        UPDATE accommodation
        SET 
         is_deleted = true 
        WHERE 
         accommodation_id = $1`,
            [accommodation_id]);

        if (!result.rowCount) {
            return res.status(404).json({ error: "The Accommodation not found" });
        } else {
            res.status(200).json({
                message: 'The Accommodation Is Deleted !',
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}



const addComment = async (req, res) => {
    const { accommodation_id, user_id, comment_text } = req.body;

    try {

        const accommodationQuery = `
            SELECT *
            FROM accommodation
            WHERE accommodation_id = $1 AND is_deleted = false`;
        const accommodationResult = await db.query(accommodationQuery, [accommodation_id]);

        if (accommodationResult.rowCount === 0) {
            return res.status(404).json({ error: 'Accommodation not found or deleted' });
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
            INSERT INTO comments(accommodation_id, user_id, comment_text)
            VALUES ($1, $2, $3)
            RETURNING *`;
        const insertCommentValues = [accommodation_id, user_id, comment_text];
        const commentResult = await db.query(insertCommentQuery, insertCommentValues);

        res.json({ message: 'Comment added successfully', comment: commentResult.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};

const getAccommodationsByID2 = async (req, res) => {
    const { id } = req.params;
    try {
        const query = `
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

        const result = await db.query(query, [id]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};


module.exports = {
    getAccommodations,
    addAccommodation,
    updateAccommodation,
    deleteAccommodation,
    getAccommodationsByID,
    addComment,
    getAccommodationsByID2
    
}