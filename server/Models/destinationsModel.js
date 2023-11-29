// const db = require('./config/db');
const db = require('../Models/config/knexConfig');

const getDestinations = async () => {
    try {
        return await db
            .select('*')
            .from('destinations')
            .where({
                is_deleted: false,
            })
        // .orderBy('titile', 'desc') // Assuming 'created_at' is the timestamp for when the accommodation was created
        // .limit(5);
    } catch (err) {
        console.error(err);
        throw new Error('Error fetching destinations');
    }
};

const getDestinationsByID = async (destinations_id) => {
    try {
        return await db('destinations')
            .select('*')
            .where({
                is_deleted: false,
                destinations_id: destinations_id
            });
    } catch (err) {
        console.error(err);
        throw new Error('Error fetching destination by ID');
    }
};

const addDestinations = async (destinationData) => {
    try {
        return await db('destinations')
            .insert(destinationData)
            .returning('*');
    } catch (err) {
        console.error(err);
        throw new Error('Error adding destination');
    }
};

const updateDestinations = async (destinations_id, destinationData) => {
    try {
        return await db('destinations')
            .where({ destinations_id: destinations_id })
            .update(destinationData)
            .returning('*');
    } catch (err) {
        console.error(err);
        throw new Error('Error updating destination');
    }
};

const markDestinationsAsDeleted = async (destinations_id) => {
    try {
        return await db('destinations')
            .where({ destinations_id: destinations_id })
            .update({ is_deleted: true });
    } catch (err) {
        console.error(err);
        throw new Error('Error marking destinations as deleted');
    }
};

const getDestinationsPaginated = async (page, pageSize) => {
    try {
        const offset = (page - 1) * pageSize;
        return await db('destinations')
            .orderBy('title', 'asc')
            .where('is_deleted', false)
            .limit(pageSize)
            .offset(offset);
    } catch (err) {
        console.error(err);
        throw new Error('Error fetching paginated accommodations');
    }
};



module.exports = {

    getDestinations,

    getDestinationsByID,

    addDestinations,

    updateDestinations,

    markDestinationsAsDeleted,

    getDestinationsPaginated
};
