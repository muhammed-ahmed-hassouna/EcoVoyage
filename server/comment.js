const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const db = require('./Models/config/db');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.post('/post/comments',  async (req, res) => {
//     const { comment } = req.body;
//     try {
//         const query = `SELECT * FROM comments INNER JOIN users ON users.id = comments.user_id`;

//         const values = [first_name, last_name,comment];
//         const result = await db.query(query,values);
//         res.json(result.rows);
//     } catch (err) {
//         console.error('Error in deleteCartItem:', err);
//         res.status(500).send('Internal Server Error');
//     }
// });


app.post('/post/comments', async (req, res) => {

    const { comment } = req.body;

    try {
        const insertCommentQuery = 'INSERT INTO comments (comment) VALUES ($1) RETURNING user_id';
        const insertCommentValues = [comment];
        const { rows: insertedComment } = await db.query(insertCommentQuery, insertCommentValues);
        const newCommentId = insertedComment[0].user_id;

        const getUserQuery = 'SELECT id, first_name, last_name FROM users WHERE id = $1';
        const getUserValues = [newCommentId];
        const { rows: user } = await db.query(getUserQuery, getUserValues);

        const response = {
            user_id: user[0].id,
            first_name: user[0].first_name,
            last_name: user[0].last_name,
            comment: comment,
        };

        res.json(response);

    } catch (err) {
        console.error('Error in post comment:', err);
        res.status(500).send('Internal Server Error');
    }
});



app.get('/get/comments', async (req, res) => {
    try {
        const selectCommentQuery = 'SELECT * FROM comments INNER JOIN users ON users.id = comments.user_id';

        const p = selectCommentQuery.rows.map((row) => ({
            user_id: row.user_id,
            first_name: row.first_name,
            last_name: row.last_name,
            comment: row.comment,
        }));
        res.json(p);
    } catch (err) {
        console.error('Error in get comment:', err);
        res.status(500).send('Internal Server Error');
    }
});


const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
