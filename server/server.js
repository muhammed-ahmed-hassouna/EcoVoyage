const express = require("express");
const app = express();
const session = require("express-session");
const passport = require("passport");
app.use(express.json());
var cors = require('cors');
app.use(cors());

app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

const userRouter = require("./routes/user_routes");

const OAuthRouter = require('./routes/OAuth_routes');

const destinations_routes = require('./routes/destinations_routes');

const accommodationRoutes = require('./routes/accommodation-routes');

const activitiesRoutes = require('./routes/activities_routes');

const packagesRoutes = require('./routes/packages-routes');

const contactUsRouter = require('./routes/contactUs_routes');

const flightsRoute = require('./routes/flights-routes');

const statisticsRoute = require('./routes/statistics-routes');

const featuresRoute = require('./routes/features-routes');

const ticketbooking = require('./routes/ticketbooking-routes');

const stripeRouter = require('./routes/stripe-routes');

app.use(userRouter);

app.use(OAuthRouter);

app.use(destinations_routes);

app.use(accommodationRoutes);

app.use(activitiesRoutes);

app.use(contactUsRouter);

app.use(packagesRoutes);

app.use(flightsRoute);

app.use(statisticsRoute);

app.use(featuresRoute);

app.use(ticketbooking);

app.use(stripeRouter);

app.listen(3999, () => { console.log(`Server started on port http://localhost:3999`) });
