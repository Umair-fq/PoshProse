const jwt = require('jsonwebtoken');
const Blog = require('../Models/BlogModel')
require('dotenv').config();

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null) {
        return res.status(401).json({ message: "Unauthorized"});
    }
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) {
            return res.sendStatus(403); // Invalid token
        }
        req.user = user
        next();
    })
}

module.exports = {authenticateToken};