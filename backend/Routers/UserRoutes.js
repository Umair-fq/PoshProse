const express = require('express');
const { registerUser, loginUser, addToFavorites, removeFromFavorites, getUserFavoriteBlogs, verifyEmailToken, updateProfile, getAuthor } = require('../Controllers/UserController');
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
  passport.authenticate('google', { failureRedirect: '/login' }), // Passport middleware for handling Google OAuth authentication
  (req, res) => {
    const user = req.user; // Extract the authenticated user from the request object provided by Passport
    const token = user.jwtToken; // Extract the JWT token from the authenticated user object
    // Add user's _id to the redirect URL
    res.redirect(`http://localhost:5173/auth?token=${encodeURIComponent(token)}&email=${encodeURIComponent(user.email)}&username=${encodeURIComponent(user.username)}&id=${encodeURIComponent(user._id)}`);
  });

router.get('/blog/author/:authorId', getAuthor)
router.get('/favBlogs', authenticateToken, getUserFavoriteBlogs)
router.put('/addToFav/:blogId', authenticateToken, addToFavorites)
router.put('/remFromFav/:blogId', authenticateToken, removeFromFavorites)
router.get('/verify/:token/:id', verifyEmailToken)
router.patch('/update/userprofile/:id', authenticateToken, updateProfile)

module.exports = router;