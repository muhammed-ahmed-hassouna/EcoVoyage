const db = require('../Models/config/db');

const searchHome = async (req, res) => {
    const { title, best, depart_date, return_date } = req.body;

    let query = `
        SELECT flights.*, destinations.title AS destination_title
        FROM flights
        JOIN destinations ON flights.destinations_id = destinations.destinations_id
    `;

    const conditions = [];
    const values = [];

    if (title !== undefined && title !== '') {
        conditions.push(`destinations.title ILIKE $${values.length + 1}`);
        values.push(`%${title}%`);
    }

    if (best !== undefined && best !== '') {
        conditions.push(`flights.best <= $${values.length + 1}`);
        values.push(best);
    }

    if (depart_date !== undefined && depart_date !== '') {
        conditions.push(`flights.depart_date = $${values.length + 1}`);
        values.push(depart_date);
    }

    if (return_date !== undefined && return_date !== '') {
        conditions.push(`flights.return_date <= $${values.length + 1}`);
        values.push(return_date);
    }

    if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(' AND ')}`;
    } else {
        return res.status(404).json({ error: "No Data !" });
    }

    try {
        const result = await db.query(query, values);
        if (!result.rowCount) {
            return res.status(404).json({ error: "No Data !" });
        } else {
            res.json(result.rows);
            // console.log('Generated Query:', query);
            console.log('Parameter Values:', values);
        }
    } catch (err) {
        console.error('Error executing the query:', err);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = {
    searchHome
};
