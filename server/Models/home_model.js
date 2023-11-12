
// const pool = require('../db/db');
  
// class HomeModel {
//     async hero() {
//         try {
//           const result = await pool.query('SELECT id, product_name, descreption, price, image_url, model, catalog_id, rating, count  FROM public.product LIMIT  4;');
//           return result.rows;
//         } catch (error) {
//           throw error;
//         }
//       }
    

//   async top() {
//     try {
//       const result = await pool.query('SELECT id, product_name, descreption, price, image_url, model, catalog_id, rating, count  FROM public.product   order by count ;');
//       return result.rows;
//     } catch (error) {
//       throw error;
//     }
//   }


//   async get() {
//     try {
//       const result = await pool.query('SELECT id, product_name, descreption, price, image_url, model, catalog_id, rating, count  FROM public.product LIMIT  12;');
//       return result.rows;
//     } catch (error) {
//       throw error;
//     }
//   }
// }

// module.exports = new HomeModel();
