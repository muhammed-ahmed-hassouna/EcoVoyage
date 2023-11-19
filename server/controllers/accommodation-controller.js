const db  = require('../Models/config/db');

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
    const accommodation_id = req.params.id;
    try {
        const result = await db.query(accommodationQueries.getAccommodationsByIDQuery, [accommodation_id]);
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
    const accommodation_id = req.params.id;

    const { title, pricing, amenities, type, location, guests, rating, accommodation_details } = req.body;
    try {
        const values = [accommodation_id, title, pricing, amenities, type, location, guests, rating, accommodation_details,];
        const result = await db.query(accommodationQueries.updateAccommodationQuery, values);

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
        const result = await db.query(accommodationQueries.deleteAccommodationQuery, [accommodation_id]);

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



const addCommentAccomm = async (req, res) => {
    const { accommodation_id, comment_text } = req.body;

    const user_id = req.user.user_id;
    // const user_id = authorize.user_id;
    // console.log(user_id);
    try {

        const accommodationResult = await db.query(accommodationQueries.addCommentQuery, [accommodation_id, user_id, comment_text]);

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

const getAccommodationsWithComments = async (req, res) => {
    const accommodation_id = req.params.id;
    try {
        const result = await db.query(accommodationQueries.getAccommodationsWithCommentsQuery, [accommodation_id]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};


// Add validate
const BookAccommodation = async (req, res) => {
    const accommodation_id = req.params.id;
    const { address, phone, room_preference, adults, children } = req.body;
    const user_id = req.user.user_id;

    try {
        const result = await db.query(accommodationQueries.BookAccommodationQuery, [accommodation_id, user_id, address, phone, room_preference, adults, children]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}

const getBookAccommodations = async (req, res) => {
    const accommodation_id = req.params.id;
    try {
        const result = await db.query(accommodationQueries.getBookAccommodationQuery, [accommodation_id]);
        if (!result.rowCount) {
            return res.status(404).json({ error: "No Books In this Accommodation !" });
        } else {
            res.json(result.rows);
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}


// const getBookById = async (req, res) => {
//     const book_id = req.params.id;
//     try {
//         const result = await db.query(accommodationQueries.getBookByIdQuery, [book_id]);
//         res.json(result.rows);
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('Internal Server Error');
//     }
// }



const getAccommodationsPaginated = async (req, res) => {
    try {
        // Extract page and pageSize from query parameters
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.pageSize) || 2;

        // Calculate the offset based on the page and pageSize
        const offset = (page - 1) * pageSize;

        // console.log(offset);

        const result = await db.query(accommodationQueries.getAccommodationsQueryPaginated, [pageSize, offset]);

        // Send the paginated data and additional pagination information in the response

        if (!result.rowCount) {
            return res.status(404).json({ error: "No Data !" });
        } else {
            res.json({
                data: result.rows,
                currentPage: page,
                pageSize: pageSize,
                // totalPages: Math.ceil(result.rowCount / pageSize),
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}


module.exports = {

    getAccommodations,

    addAccommodation,

    updateAccommodation,

    deleteAccommodation,

    getAccommodationsByID,

    addCommentAccomm,

    getAccommodationsWithComments,

    BookAccommodation,

    getBookAccommodations,

    getAccommodationsPaginated

}