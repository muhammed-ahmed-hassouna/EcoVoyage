const db = require('../Models/config/db');
// CREATE
exports.addAccommodation = async (userId, comment, rating) => {
    try {
        // Insert into the accommodation table
        const insertAccommodationQuery = 'INSERT INTO accommodation (user_id, comment, rating) VALUES ($1, $2, $3) RETURNING *';
        const accommodationResult = await client.query(insertAccommodationQuery, [userId, comment, rating]);
        const insertedAccommodation = accommodationResult.rows[0];

        return insertedAccommodation;
    } catch (error) {
        console.error('Error adding accommodation:', error);
        throw error;
    }
};

// READ
exports.getAccommodations = async () => {
    try {
        // Join the accommodation table with the users table to get first name and last name
        const selectAccommodationsQuery = 'SELECT accommodation.*, users.first_name, users.last_name FROM accommodation JOIN users ON accommodation.user_id = users.id';
        const accommodationsResult = await client.query(selectAccommodationsQuery);

        return accommodationsResult.rows;
    } catch (error) {
        console.error('Error getting accommodations:', error);
        throw error;
    }
}

// UPDATE
//   async function updateAccommodation(accommodationId, newComment, newRating) {
//     try {
//       const updateAccommodationQuery = 'UPDATE accommodation SET comment = $1, rating = $2 WHERE id = $3 RETURNING *';
//       const updatedAccommodationResult = await client.query(updateAccommodationQuery, [newComment, newRating, accommodationId]);
//       const updatedAccommodation = updatedAccommodationResult.rows[0];

//       return updatedAccommodation;
//     } catch (error) {
//       console.error('Error updating accommodation:', error);
//       throw error;
//     }
//   }

// DELETE
exports.deleteAccommodation = async (accommodationId) => {
    try {
        const deleteAccommodationQuery = 'DELETE FROM accommodation WHERE id = $1 RETURNING *';
        const deletedAccommodationResult = await client.query(deleteAccommodationQuery, [accommodationId]);
        const deletedAccommodation = deletedAccommodationResult.rows[0];

        return deletedAccommodation;
    } catch (error) {
        console.error('Error deleting accommodation:', error);
        throw error;
    }
}
