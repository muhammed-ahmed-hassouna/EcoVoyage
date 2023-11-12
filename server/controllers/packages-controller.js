const db = require('../Models/config/db');

//INSERT INTO public.packages(
//	cost, title, overview, highlights, inclusions, exclusions, destination, itinerary)
//   VALUES (1000, 'tryy', 'detailssss', '{"high 1": "The magic of climbing Monte Isola to enjoy panoramic view of the Lake."}', '{"Inc 1": "Transfer from and to Milan by private minivan with driver"}', '{"Exc 1": "Airfare","Exc 2": "Visa fees","Exc 3": "Personal expenses"}', 'Europe','{"Day 1": "Brescia."}');

const getPackages = async (req, res) => {
    try {
        const query = `
        SELECT * FROM packages 
        WHERE 
            is_deleted = false`;
        const result = await db.query(query);
        res.json(result.rows)
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}

const getPackagesById = async (req, res) => {
    const { id } = req.params;
    try {
        const query = `
        SELECT * FROM packages 
        WHERE 
            is_deleted = false
        AND
            packages_id = $1 `;
        const result = await db.query(query,[id]);
        res.json(result.rows)
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}

const addPackages = async (req, res) => {
    const { cost, title, overview, highlights, inclusions, exclusions, destination, itinerary } = req.body;
    try {
        const query = `
        INSERT INTO packages(
            cost, 
            title, 
            overview, 
            highlights, 
            inclusions, 
            exclusions,
            destination,
            itinerary
            ) 
        VALUES ( $1, $2, $3, $4, $5, $6, $7, $8)`;
        const values = [cost, title, overview, highlights, inclusions, exclusions, destination, itinerary];
        const result = await db.query(query, values)
        res.json({ message: 'Package has been added !' })
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}

const updatePackages = async (req, res) => {
    // const packages_id = req.query.packages_id;
    const { id } = req.params;

    const { cost, title, overview, highlights, inclusions, exclusions, destination, itinerary } = req.body;
    
    try {
        const updateFields = [];
        const values = [];

        let placeholderCount = 1;

        if (cost) {
            updateFields.push(`cost = $${placeholderCount}`);
            values.push(cost);
            placeholderCount++;
        }
        if (title) {
            updateFields.push(`title = $${placeholderCount}`);
            values.push(title);
            placeholderCount++;
        }

        if (overview) {
            updateFields.push(`overview = $${placeholderCount}`);
            values.push(overview);
            placeholderCount++;
        }

        if (highlights) {
            updateFields.push(`highlights = $${placeholderCount}`);
            values.push(highlights);
            placeholderCount++;
        }

        if (inclusions) {
            updateFields.push(`inclusions =  $${placeholderCount}`);
            values.push(inclusions);
            placeholderCount++;
        }

        if (exclusions) {
            updateFields.push(`exclusions = $${placeholderCount}`);
            values.push(exclusions);
            placeholderCount++;
        }

        if (destination) {
            updateFields.push(`destination = $${placeholderCount}`);
            values.push(destination);
            placeholderCount++;
        }

        if (itinerary) {
            updateFields.push(`rating = $${placeholderCount}`);
            values.push(itinerary);
            placeholderCount++;
        }

        const query = `
        UPDATE packages
        SET ${updateFields.join(', ')}
        WHERE packages_id = $${placeholderCount}
        `;

        values.push(id);

        const result = await db.query(query, values);

        if (!result.rowCount) {
            return res.status(404).json({ error: "The package not found" });
        } else {
            res.status(200).json({
                message: 'The package Updated!',
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}

const deletePackages = async (req, res) => {
    const packages_id = req.query.packages_id;
    try {
        const result = await db.query("UPDATE packages SET is_deleted = true WHERE packages_id = $1", [packages_id]);
        if (!result.rowCount) {
            return res.status(404).json({ error: "The package not found" });
        } else {
            res.status(200).json({
                message: 'The package Updated!',
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}

const addComment = async (req, res) => {
    const { packages_id, user_id, comment_text } = req.body;

    try {

        const packagesQuery = `
            SELECT *
            FROM accommodation
            WHERE accommodation_id = $1 AND is_deleted = false`;
        const packagesResult = await db.query(packagesQuery, [packages_id]);

        if (packagesResult.rowCount === 0) {
            return res.status(404).json({ error: 'packages not found or deleted' });
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
            INSERT INTO comments(packages_id, user_id, comment_text)
            VALUES ($1, $2, $3)
            RETURNING *`;
        const insertCommentValues = [packages_id, user_id, comment_text];
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
            packages.*,
            comments.comment_id,
            comments.comment_text,
            comments.timestamp as comment_timestamp,
            users.first_name,
            users.last_name
        FROM packages
        INNER JOIN comments ON packages.packages_id = comments.packages_id
        INNER JOIN users ON comments.user_id = users.user_id
        WHERE
            packages.is_deleted = false
        AND
            packages.packages_id = $1`;

        const result = await db.query(query, [id]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};
module.exports = {
    getPackages,
    addPackages,
    updatePackages,
    deletePackages,
    getPackagesById,
    getAccommodationsByID2,
    addComment
}