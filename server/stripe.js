const express = require('express');
const stripe = require('stripe')('sk_test_51O9AgVCPosaU36ulVwAl8vp0trApgSOtTai9pPaHNi3mEif2848Ym3gRqIykOfY6hCl6ciz2qX4mYMQLqe56Mmtf00BS4Ur2is'); // Replace with your actual secret key
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.render('index');
});

app.post('/charge', (req, res) => {
    const amount = 2700; // $25.00 in cents

    stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken,
    })
        .then(customer => stripe.charges.create({
            amount,
            description: 'Sample Charge',
            currency: 'aed',
            customer: customer.id,
        }))
        .then(charge => res.render('success'));
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
