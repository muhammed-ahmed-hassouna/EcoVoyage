const db = require('../Models/config/db');

const packageQueries = require('../Models/packageQueries');

//INSERT INTO public.packages(
//	cost, title, overview, highlights, inclusions, exclusions, destination, itinerary)
//   VALUES (1000, 'tryy', 'detailssss', '{"high 1": "The magic of climbing Monte Isola to enjoy panoramic view of the Lake."}', '{"Inc 1": "Transfer from and to Milan by private minivan with driver"}', '{"Exc 1": "Airfare","Exc 2": "Visa fees","Exc 3": "Personal expenses"}', 'Europe','{"Day 1": "Brescia."}');

const getPackages = async (req, res) => {
    try {
        const result = await db.query(packageQueries.getPackagesQuery);
        res.json(result.rows)
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}

const getPackagesById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query(packageQueries.getPackagesByIdQuery,[id]);
        res.json(result.rows)
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}

const addPackages = async (req, res) => {
    const { cost, title, overview, highlights, inclusions, exclusions, destination, itinerary } = req.body;
    try {
        const values = [cost, title, overview, highlights, inclusions, exclusions, destination, itinerary];
        const result = await db.query(packageQueries.addPackagesQuery, values)
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
        const values = [id, cost, title, overview, highlights, inclusions, exclusions, destination, itinerary];
        const result = await db.query(packageQueries.updatePackagesQuery, values);


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
        const result = await db.query(packageQueries.deletePackagesQuery, [packages_id]);
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
        const packagesResult = await db.query(packageQueries.addCommentQuery, [packages_id]);

        if (packagesResult.rowCount === 0) {
            return res.status(404).json({ error: 'packages not found or deleted' });
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
        const result = await db.query(packageQueries.getPackageWithCommentsQuery, [id]);
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