const db = require('../Models/config/db');

const getCartData = async (req, res) => {
    try {
        const results = await db.query('SELECT cart.product_id, cart_count, product_name, model, price, (price * cart_count) AS total FROM cart INNER JOIN product ON cart.product_id = product.id WHERE is_deleted = false');

        const cartItems = results.rows.map((row) => ({
            product_id: row.product_id,
            product_name: row.product_name,
            model: row.model,
            price: row.price,
            count: row.cart_count,
            total: (row.price * row.cart_count)
        }));

        res.json(cartItems);

    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};

const deleteCartItem = async (req, res) => {
    const  product_id  = req.query.product_id;
    try {
        await db.query('UPDATE cart SET is_deleted = true WHERE product_id = $1' ,[product_id]);
        // await db.query(query, [productId]);
        res.json({ message: 'Product removed from cart' });
    } catch (err) {
        console.error('Error in deleteCartItem:', err);
        res.status(500).send('Internal Server Error');
    }
};


module.exports = {
    getCartData,
    deleteCartItem
};
