const express = require('express');
const { registerUser, loginUser, addToFavorites, removeFromFavorites, getUserFavoriteBlogs } = require('../Controllers/UserController');
const { authenticateToken } = require('../Middlewares/Auth');
const router = express.Router();
const passport = require('passport')

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.get('/auth/google', passport.authenticate('google', { // using Google as an authentication strategy
    scope: ['email', 'profile'] // accessing user email address and profile's information
}))

// Inside the Google OAuth callback route
router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Extract the user and JWT token from the request
    const user = req.user;
    const token = user.jwtToken;
    // Add user's _id to the redirect URL
    res.redirect(`http://localhost:5173/auth?token=${encodeURIComponent(token)}&email=${encodeURIComponent(user.email)}&username=${encodeURIComponent(user.username)}&id=${encodeURIComponent(user._id)}`);
  });


router.get('/favBlogs', authenticateToken, getUserFavoriteBlogs)
router.put('/addToFav/:blogId', authenticateToken, addToFavorites)
router.put('/remFromFav/:blogId', authenticateToken, removeFromFavorites)

module.exports = router;