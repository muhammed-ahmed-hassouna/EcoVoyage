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

const cartController = require('./routes/cart_routes');


const destinations_routes = require('./routes/destinations_routes');

const accommodationRoutes = require('./routes/accommodation-routes');

const activitiesRoutes = require('./routes/activities_routes');

const packagesRoutes = require('./routes/packages-routes');

const contactUsRouter = require('./routes/contactUs_routes');

app.use(userRouter);

app.use(OAuthRouter);

app.use(cartController);

app.use(destinations_routes);

app.use(accommodationRoutes);

app.use(activitiesRoutes);

app.use(contactUsRouter);

app.use(packagesRoutes);

app.listen(3999, () => { console.log(`Server started on port http://localhost:3999`) });
