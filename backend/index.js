const express = require('express');
const dbConnection = require('./Database/DbConfig');
const app = express();
require('dotenv').config();
const cors = require('cors')
const userRoutes = require('./Routers/UserRoutes')
const blogRoutes = require('./Routers/BlogRoutes')
const session = require('express-session');
const passport = require('passport');
const fileUpload = require('express-fileupload')
require('./Middlewares/PassportSetup'); // This imports PassportSetup.js to initialize Passport configuration

app.use(cors());
app.use(fileUpload({
  useTempFiles: true
}))

// Session middleware configuration
app.use(session({
  secret: process.env.SECRET_KEY, 
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));

const port = process.env.PORT || 8000;
// calling dbconnection for connection of database
dbConnection();


app.use(express.json());

// Initialize Passport and session middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
    res.send('Welcome to the PoshProse API!');
});
app.use(userRoutes);
app.use('/api/blog', blogRoutes)


app.listen(port, () => {
    console.log(`listening on port ${port}`)
})