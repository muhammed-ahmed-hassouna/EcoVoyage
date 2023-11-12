const db = require("../Models/config/db");

const getDestinations = async (req, res) => {
    try {
        const query = ('SELECT * FROM destinations WHERE is_deleted = false');
        const result = await db.query(query);
        res.json(result.rows)
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}


module.exports = {
    getDestinations
}