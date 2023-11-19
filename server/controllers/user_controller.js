const db = require("../Models/config/db");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const bcrypt = require('bcrypt');
const Joi = require('joi');
const nodemailer = require('nodemailer');
const userQueries = require('../Models/userQueries');


const registerUser = async (req, res) => {
    // TLD " Top-Level-Domain Like org,gov,edu,maul"
    const { first_name, last_name, email, password, confirm_password, country } = req.body;
    try {
        const schema = Joi.object({
            first_name: Joi.string().min(3).max(25).required(),
            last_name: Joi.string().min(3).max(25).required(),
            email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
            password: Joi.string().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@#$%^&!])[A-Za-z\\d@#$%^&!]{8,30}$')).required(),
            confirm_password: Joi.any().equal(Joi.ref('password')).required(),
            country: Joi.string().min(3).max(25).required()
        });
        const validate = schema.validate({ first_name, last_name, email, password, confirm_password, country });
        if (validate.error) {
            res.status(400).json({ error: validate.error.details })
        } else {
            const checkEmailQuery = "SELECT user_id FROM users WHERE email = $1";
            const emailCheck = await db.query(checkEmailQuery, [email]);

            const role_id = 1;

            if (emailCheck.rows.length > 0) {
                res.status(400).json({ error: "Email already exists" });
            }
            const hashedPassword = await bcrypt.hash(password, 10);

            const query = `INSERT into users (first_name, last_name, email, password,role_id,country)
         values ($1, $2, $3, $4, $5, $6)
         RETURNING user_id`;

            const values = [first_name, last_name, email, hashedPassword, role_id, country];
            const user = await db.query(query, values);

            const payload = {
                first_name: values[0],
                last_name: values[1],
                email: values[2],
                user_id: user.rows[0].user_id,
                role_id: values[5]
            }
            // console.log(payload);
            // console.log(user);

            const secretKey = process.env.SECRET_KEY;
            const token = jwt.sign(payload, secretKey, { expiresIn: "7d" });

            res.status(200).json({
                validate,
                message: "User added successfully",
                token: token,
            })
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed to add");
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const schema = Joi.object({
            email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
        });

        const validate = schema.validate({ email });
        if (validate.error) {
            res.status(400).json({ error: validate.error.details })
        } else {
            const getUserQuery = "SELECT * FROM users WHERE email = $1";
            const userData = await db.query(getUserQuery, [email]);

            if (userData.rows.length === 0) {
                res.status(400).json({ message: "Email is invalid" });
                return;
            }

            const storedHashedPassword = userData.rows[0].password;

            const passwordMatch = await bcrypt.compare(password, storedHashedPassword);

            if (!passwordMatch) {
                res.status(400).json({ message: "password is invalid" });
                return;
            }

            const payload = {
                first_name: userData.rows[0].first_name,
                last_name: userData.rows[0].last_name,
                user_id: userData.rows[0].user_id,
                email: userData.rows[0].email,
                role_id: userData.rows[0].role_id
            }
            // console.log(userData);
            // console.log(payload);
            const secretKey = process.env.SECRET_KEY;
            const token = jwt.sign(payload, secretKey, { expiresIn: "7d" });

            res.status(200).json({
                validate,
                message: "Successfully Login",
                token: token,
            });
        }
    } catch (err) {
        res.status(500).send("Failed to Authenticate");
    }
};

const express = require("express");
const app = express();
app.use(express.json());
var cors = require('cors');
app.use(cors());

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';


var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'mohammedhassouna000@gmail.com',
        pass: 'iyfyzqcsphpdwgvz'
    }
});


// let emailSent = false;
const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};


const generatedVerificationCode = generateVerificationCode();

const sendVerificationEmail = async (email, verificationCode) => {
    const mailOptions = {
        from: 'mohammedhassouna000@gmail.com',
        to: email,
        subject: 'Email Verification Code',
        text: `Your email verification code is: ${verificationCode}`
    };
    console.log('Sending verification email to ' + email);
    // emailSent = true;

    try {
        await transporter.sendMail(mailOptions);

    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email verification');
    }
};

let emailFromSendEmail;

const sendEmail = async (req, res) => {
    try {
        const email = req.body.email;
        emailFromSendEmail = email
        const checkEmailQuery = "SELECT user_id, password FROM users WHERE email = $1";

        const emailCheck = await db.query(checkEmailQuery, [email]);
        if (emailCheck.rows.length > 0) {
            await sendVerificationEmail(email, generatedVerificationCode);
            res.status(200).json({ message: "Verification code email has been sent." });
        } else {
            res.status(400).json({ error: "Email not found in the database." });
        }
    } catch (error) {
        console.error("Error sending verification email:", error);
        res.status(500).json({ error: "An error occurred while sending the verification email." });
    }
};

const verificationCode = async (req, res) => {

    const verificationCode = req.body.verificationCode;

    if (verificationCode === generatedVerificationCode) {
        res.status(200).json({
            message: 'You can go to reset password',
        });
    }
    else {
        res.status(400).json({
            message: "Invalid verification code",
        });
    }
}

const updatepassword = async (req, res) => {
    const newPassword = req.body.newPassword;
    const confirm_password = req.body.confirm_password;
    const email = emailFromSendEmail;

    const updateQuery = 'UPDATE users SET password = $1 WHERE email = $2';

    try {
        const schema = Joi.object({
            newPassword: Joi.string()
                .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@#$%^&!])[A-Za-z\\d@#$%^&!]{8,12}$'))
                .required(),
            confirm_password: Joi.any().valid(Joi.ref('newPassword')).required()
        });

        const validate = schema.validate({ newPassword, confirm_password });
        if (validate.error) {
            res.status(400).json({ error: validate.error.details });
        } else {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await db.query(updateQuery, [hashedPassword, email]);
            res.status(200).json({
                message: 'Password updated successfully!',
            });
        }
    } catch (err) {
        console.error('Error updating password:', err);
        res.status(500).json({ error: 'An error occurred while updating the password' });
    }
};

// setInterval(() => {
//     emailSent = false; // Reset emailSent flag every 60 seconds
// }, 60000);

const getUserData = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM users WHERE is_deleted = false');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};


const getUserId = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query(userQueries.getUserByIdQuery, [id]);
        if (!result.rowCount) {
            return res.status(404).json({ error: "The User not found" });
        } else {
            res.status(200).json(result.rows);
        }
    } catch (err) {
        res.status(500).send('Internal Server Error');
    }
};

const updateUserData = async (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, email, password, confirm_password, country } = req.body;

    try {
        const schema = Joi.object({
            first_name: Joi.string().min(3).max(25),
            last_name: Joi.string().min(3).max(25),
            email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
            country: Joi.string().min(3).max(25),
            password: Joi.string().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@#$%^&!])[A-Za-z\\d@#$%^&!]{8,30}$')),
            confirm_password: Joi.string().optional().valid(Joi.ref('password')).when('password', {
                is: Joi.exist(),
                then: Joi.required(),
            })
        });

        const validate = schema.validate({ first_name, last_name, email, password, confirm_password, country });

        if (validate.error) {
            return res.status(400).json({ error: validate.error.details });
        }

        let hashedPassword;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);

            const values = [id, first_name, last_name, email, hashedPassword, country];

            const result = await db.query(userQueries.updateUserQuery, values);

            if (!result.rowCount) {
                return res.status(404).json({ error: "The User not found" });
            } else {
                res.status(200).json({
                    message: 'The User Updated!',
                    validate,
                });
            }
        }} catch (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        }
    }

    const deleteUser = async (req, res) => {
        const user_id = req.query.user_id
        try {
            const result = await db.query(userQueries.deleteUserQuery, [user_id]);
            if (!result.rowCount) {
                return res.status(404).json({ error: "The User not found" });
            } else {
                res.status(200).json({
                    message: 'The User Deleted !',
                });
            }
        } catch (err) {
            res.status(500).send('Internal Server Error');
        }
    };

    module.exports = {
        registerUser,
        loginUser,
        updatepassword,
        getUserData,
        deleteUser,
        sendEmail,
        verificationCode,
        getUserId,
        updateUserData
    };