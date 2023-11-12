const db = require("../Models/config/db");


const getContact = async (req, res) => {
  try {
    const query = `
    SELECT * FROM contact_us 
    WHERE 
      is_deleted = false`;
    const result = await db.query(query);
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
    const query = `
    INSERT INTO contact_us(
      username,
      email,
      subject,
      message,
      submitted_at)
    values ($1, $2, $3, $4, $5)`;

    values = [username, email, subject, message, time];
    await db.query(query, values);
    res.status(201).json({ message: `Your Message have been sent` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// const contactid = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const query = `select * from contact_us where contact_id=$1 and is_deleted = false`;
//     const result = await db.query(query, [id]);
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
    const query = `
    UPDATE contact_us 
    SET 
      is_deleted = true 
    WHERE 
      contact_id =$1`;
    const result = await db.query(query, [id]);
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
  deleteContact,

}