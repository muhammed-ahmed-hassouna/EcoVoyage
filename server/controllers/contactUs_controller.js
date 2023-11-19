// Original file

const db = require("../Models/config/db");
const contactQueries = require('../Models/contactQueries');

const getContact = async (req, res) => {
  try {
    const result = await db.query(contactQueries.getContactQuery);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const addContact = async (req, res) => {
  const { username, email, subject, message } = req.body;
  const time = new Date();
  try {
    const values = [username, email, subject, message, time];
    await db.query(contactQueries.addContactQuery, values);
    res.status(201).json({ message: `Your Message has been sent` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// const contactId = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const result = await db.query(contactQueries.getContactByIdQuery, [id]);
//     if (!result.rowCount) {
//       return res.status(404).json({ error: "Message not found" });
//     } else {
//       res.json(result.rows);
//     }
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

const deleteContact = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(contactQueries.deleteContactQuery, [id]);
    if (!result.rowCount) {
      return res.status(404).json({ error: "Message not found" });
    } else {
      res.status(200).json({
        message: "Deleted Successfully",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  getContact,
  addContact,
  // contactId,
  deleteContact
};
