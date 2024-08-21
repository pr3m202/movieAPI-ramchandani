const express = require("express");
const mongoose = require("mongoose");

// Google Login
//const passport = require("passport");
//const session = require("express-session");
//require("./passport");

// Allows our backend application to be available to our frontend application
// Allows us to control the app's Cross Origin Resource Sharing settings
const cors = require("cors");
require('dotenv').config();

// Allows access to routes defined within our application
const userRoutes = require("./routes/user");
//const movieRoutes = require("./routes/movie");

// const port = 4000;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
    origin: ['http://localhost:3000/'],
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Database Connection
mongoose.connect(process.env.MONGODB_STRING);
mongoose.connection.once('open', () => console.log('Now connected to MongoDB Atlas.'))

// Groups all routes in userRoutes under "/users"
app.use("/users", userRoutes);
// Groups all routes in movieRoutes under "/movie"
//app.use("/movies", movieRoutes);

if (require.main === module) {
    // "process.env.PORT || 3000" will use the environment variable if it is available OR will used port 3000 if none is defined
    // This syntax will allow flexibility when using the application locally or as a hosted application
    app.listen(process.env.PORT || 3000, () => {
        console.log(`API is now online on port ${process.env.PORT || 3000}`);
    })
}

module.exports = { app, mongoose };