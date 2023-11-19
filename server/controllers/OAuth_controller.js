const passport = require('passport');
const db = require("../Models/config/db");
const jwt = require("jsonwebtoken");
require('../Middleware/auth');



function isLoggedIn(req, res, next) {
    req.user ? next() : res.sendStatus(401);
}

const button = (req, res) => {
    res.send('<a href="/auth/google">Authenticate with Google</a>');
};

const authentication = passport.authenticate("google", {
    scope: ["email", "profile"],
});

const authenticationCallback = passport.authenticate("google", {
    successRedirect: "/protected",
    failureRedirect: "/auth/google/failure",
});

const protected = (isLoggedIn, async (req, res) => {
    try {
        const userEmail = req.user && req.user.emails && req.user.emails[0] && req.user.emails[0].value;
        const userid = req.user.id;
        const displayName = req.user.displayName;
        const [firstName, lastName] = displayName.split(' ');

        // Query the database to check if the email from Google already exists
        const checkEmailQuery = 'SELECT * FROM users WHERE email = $1';
        const email = await db.query(checkEmailQuery, [userEmail]);
        if (email.rows.length > 0) {
            const payload = {
                first_name: firstName,
                last_name: lastName,
                email: userEmail,
                user_id: userid,
                role: email.rows[0].role_id
            }

            const secretKey = process.env.SECRET_KEY;
            const token = jwt.sign(payload, secretKey, { expiresIn: "7d" });
            res.status(200).json({
                message: "User added successfully",
                token: token
            });
        } else {
            // Email doesn't exist in the database
            const role_id = 1;
            const password = 'No Access';
            const country = 'No Access';
            const values = [firstName, lastName, userEmail, role_id, password, country];
            const query = `INSERT into users (first_name, last_name, email, role_id, password, country) values ($1, $2, $3, $4, $5, $6) RETURNING user_id`;
            const user = await db.query(query, values);

            const payload = {
                first_name: firstName,
                last_name: lastName,
                email: userEmail,
                user_id: userid,
                role: role_id
            }

            const secretKey = process.env.SECRET_KEY;
            const token = jwt.sign(payload, secretKey, { expiresIn: "7d" });
            res.status(200).json({
                message: "User added successfully",
                token: token
            });
        }
    } catch (error) {
        console.error("Error in protected route:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
});

const logout = (req, res) => {
    req.logout(() => {
        req.session.destroy((err) => {
            if (err) {
                console.error("Error destroying session:", err);
            }
            res.send("Goodbye!");
        });
    });
};

const authenticationFailure = (req, res) => {
    res.send('Failed to authenticate..');
};

module.exports = {
    button,
    authentication,
    authenticationCallback,
    protected,
    logout,
    authenticationFailure
};
