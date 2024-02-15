const express = require('express');
const dbConnection = require('./Database/DbConfig');
const app = express();
require('dotenv').config();
const cors = require('cors')
const userRoutes = require('./Routers/UserRoutes')
const blogRoutes = require('./Routers/BlogRoutes')

const port = process.env.PORT || 8000;
// calling dbconnection for connection of database
dbConnection();

app.use(cors());
app.use(express.json());
app.use('/api/user', userRoutes);
app.use('/api/blog', blogRoutes)


app.listen(port, () => {
    console.log(`listening on port ${port}`)
})