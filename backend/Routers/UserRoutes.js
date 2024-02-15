const express = require('express');
const { registerUser, loginUser, addToFavorites, removeFromFavorites, getUserFavoriteBlogs } = require('../Controllers/UserController');
const { authenticateToken } = require('../Middlewares/Auth');
const router = express.Router();

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.get('/favBlogs', authenticateToken, getUserFavoriteBlogs)
router.put('/addToFav/:blogId', authenticateToken, addToFavorites)
router.put('/remFromFav/:blogId', authenticateToken, removeFromFavorites)

module.exports = router;