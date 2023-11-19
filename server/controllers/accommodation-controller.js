const db = require('../Models/config/db');

const accommodationQueries = require('../Models/accommodationQueries');

const getAccommodations = async (req, res) => {
    try {
        const result = await db.query(accommodationQueries.getAccommodationsQuery);
        res.json(result.rows)
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}

const getAccommodationsByID = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query(accommodationQueries.getAccommodationsByIDQuery, [id]);
        res.json(result.rows)
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}

const addAccommodation = async (req, res) => {
    const { title, pricing, amenities, type, location, guests, rating, accommodation_details } = req.body;
    try {
        const values = [title, pricing, amenities, type, location, guests, rating, accommodation_details];
        const result = await db.query(accommodationQueries.addAccommodationQuery, values)
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
        const values = [id,title, pricing, amenities, type, location, guests, rating, accommodation_details, ];
        const result = await db.query(accommodationQueries.updateAccommodationQuery, values);
        
        // return db.query(queryText, values);
        // console.log(updateFields);
        // console.log(values);
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
        const result = await db.query(accommodationQueries.deleteAccommodationQuery,[accommodation_id]);

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

       
        const accommodationResult = await db.query(accommodationQueries.addCommentQuery, [accommodation_id]);

        if (accommodationResult.rowCount === 0) {
            return res.status(404).json({ error: 'Accommodation not found or deleted' });
        }

        const userQuery = `
            SELECT *
            FROM users
            WHERE user_id = $1`;
        const userResult = await db.query(userQuery, [user_id]);

        if (userResult.rowCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

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
        const result = await db.query(accommodationQueries.getAccommodationsWithCommentsQuery, [id]);
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