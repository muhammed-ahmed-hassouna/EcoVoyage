const db = require('../Models/config/knexConfig');

const addFlight = async (flightsData) => {
    try {
        return await db('flights')
            .insert(flightsData)
            .returning('*');
    } catch (err) {
        console.error(err);
        throw new Error('Error adding Flights');
    }
};

const getFlights = async () => {
    try {
        return await db
            .select('*')
            .from('flights')
            .where({
                is_deleted: false,
            })
    } catch (err) {
        console.error(err);
        throw new Error('Error fetching Flights');
    }
};

const getFlightsByID = async (flights_id) => {
    try {
        return await db('flights')
            .select('*')
            .where({
                is_deleted: false,
                flights_id: flights_id
            });
    } catch (err) {
        console.error(err);
        throw new Error('Error fetching destination by ID');
    }
};

const softDeleteFlights = async (flights_id) => {
    try {
        return await db('flights')
            .where({ flights_id: flights_id })
            .update({ is_deleted: true });
    } catch (err) {
        console.error(err);
        throw new Error('Error marking accommodation as deleted');
    }
};


const updateFlight = async (flights_id, flightsData) => {
    try {
        return await db('flights')
            .where({ flights_id: flights_id })
            .update(flightsData)
            .returning('*');
    } catch (err) {
        console.error(err);
        throw new Error('Error updating Flight');
    }
};

const getFlightsPaginated = async (page, pageSize) => {
    try {
        const offset = (page - 1) * pageSize;
        return await db('flights')
            .where('is_deleted', false)
            .limit(pageSize)
            .offset(offset);
    } catch (err) {
        console.error(err);
        throw new Error('Error fetching paginated accommodations');
    }
};
module.exports = {
    addFlight,

    getFlights,

    softDeleteFlights,

    updateFlight,

    getFlightsPaginated,

    getFlightsByID
}