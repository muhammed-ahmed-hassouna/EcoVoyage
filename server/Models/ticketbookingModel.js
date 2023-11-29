// const db = require('./config/db');
const db = require('../Models/config/knexConfig');

const getTickets = async () => {
    try {
        return await db
            .select('*')
            .from('ticketbooking')
            .where({
                is_deleted: false,
            })
        // .orderBy('titile', 'desc') // Assuming 'created_at' is the timestamp for when the accommodation was created
        // .limit(5);
    } catch (err) {
        console.error(err);
        throw new Error('Error fetching Tickets');
    }
};

const getTicketByID = async (ticket_id) => {
    try {


        return await db('ticketbooking')
            .select('*')
            .where({
                is_deleted: false,
                ticket_id: ticket_id
            });
    } catch (err) {
        console.error(err);
        throw new Error('Error fetching Ticket by ID');
    }
};

const addTicket = async (ticketData, user_id) => {
    try {
        const userResult = await db('users')
            .where({ user_id: user_id })
            .first();

        if (!userResult) {
            throw new Error('User not found');
        }

        const insertedTicket = await db('ticketbooking')
            .insert({ ...ticketData, user_id: user_id, is_shown: true })
            .returning('*');

        return insertedTicket;

    } catch (err) {
        console.error(err);
        throw new Error('Error adding Ticket');
    }
};

const updateTicket = async (ticket_id, ticketData) => {
    try {
        return await db('ticketbooking')
            .where({ ticket_id: ticket_id })
            .update(ticketData)
            .returning('*');
    } catch (err) {
        console.error(err);
        throw new Error('Error updating Ticket');
    }
};

const markTicketAsDeleted = async (ticket_id) => {
    try {
        return await db('ticketbooking')
            .where({ ticket_id: ticket_id })
            .update({ is_deleted: true });
    } catch (err) {
        console.error(err);
        throw new Error('Error marking Ticket as deleted');
    }
};

// const getDestinationsPaginated = async (page, pageSize) => {
//     try {
//         const offset = (page - 1) * pageSize;
//         return await db('destinations')
//             .orderBy('title', 'asc')
//             .where('is_deleted', false)
//             .limit(pageSize)
//             .offset(offset);
//     } catch (err) {
//         console.error(err);
//         throw new Error('Error fetching paginated accommodations');
//     }
// };



module.exports = {

    getTickets,

    getTicketByID,

    addTicket,

    updateTicket,

    markTicketAsDeleted,

    // getDestinationsPaginated
};
