const mongoose = require('mongoose')
require('dotenv').config();
// your db url
const dbUri = process.env.DBURI;

// db connection code
const dbConnection = async () => {
    try {
        // command for connecting mongodb
        await mongoose.connect(dbUri)
        console.log('connected to monogdb successfully')
    } catch (error) {
        console.log(error)
    }
}

module.exports = dbConnection;