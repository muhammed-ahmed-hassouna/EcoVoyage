const db = require('../Models/config/db');

const getContactQuery = `
    SELECT * FROM contact_us 
    WHERE 
      is_deleted = false`;

const addContactQuery = `
    INSERT INTO contact_us(
      username,
      email,
      subject,
      message,
      submitted_at)
    VALUES ($1, $2, $3, $4, $5)`;

// const getContactByIdQuery = `
//     SELECT * FROM contact_us 
//     WHERE 
//       contact_id = $1
//       AND is_deleted = false`;

const deleteContactQuery = `
    UPDATE contact_us 
    SET 
      is_deleted = true 
    WHERE 
      contact_id = $1`;

module.exports = {
    getContactQuery,
    addContactQuery,
    // getContactByIdQuery,
    deleteContactQuery
};
