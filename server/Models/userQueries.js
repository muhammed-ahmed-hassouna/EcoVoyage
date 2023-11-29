// const db = require('../Models/config/db');
const db = require('../Models/config/knexConfig');

const getUserByIdQuery = `
    SELECT * FROM users 
    WHERE 
        is_deleted = false
        AND user_id = $1`;

const deleteUserQuery = `
    UPDATE users 
    SET 
        is_deleted = true 
    WHERE 
        user_id = $1`;


const updateUser = async (user_id, userData) => {
    try {
        const result = await db('users')
            .where('user_id', user_id)
            .update(userData)
            .returning('*');

        return result[0];
    } catch (error) {
        throw error;
    }
};

const getBookingOfUser = async (user_id) => {
    try {
        const result = await db('booking')
            .where('user_id', user_id)
            .where('is_shown', true)
            .select(
                'book_id',
                'phone',
                'room_preference',
                'adults',
                'children',
                'user_id',
                'accommodation_id',
                'packages_id'
            );
        return result;
    } catch (error) {
        throw error;
    }
};


const getFlightsOfUser = async (user_id) => {
    try {
        const result = await db('ticketbooking')
            .where('user_id', user_id)
            .where('is_shown', true)
            .select(
                'ticket_id',
                'ticket_type',
                'date_from',
                'date_to',
                'cost',
                'user_id',
                'numberofticket',
                'flights_id'
            );
        return result;
    } catch (error) {
        throw error;
    }
};

const CancelTicket = async (ticket_id) => {
    try {
        return await db('ticketbooking')
            .where({ ticket_id: ticket_id })
            .update({ is_shown: false })
            .returning('*');
    } catch (err) {
        console.error(err);
        throw new Error('Error Cancel Ticket');
    }
};


module.exports = {
    getUserByIdQuery,
    updateUser,
    deleteUserQuery,

    getBookingOfUser,

    getFlightsOfUser,

    CancelTicket
};
