const User = require('../Models/UserModel')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const Blog = require('../Models/BlogModel');

require('dotenv').config();

const registerUser = async (req, res) => {
    const {username, email, password, bio} = req.body;
    if(!username || !email || !password) {
        // 400 Bad Request is useful for signaling that the client should modify the request before retrying.
        return res.status(400).json({ message: "All fields are required"});
    }
    if(!validator.isEmail(email)) {
        return res.status(400).json({ message: "Email is not valid"});
    }

    // Check if the user already exists by username or email
    const isUserRegistered = await User.findOne({ $or: [{ username: username }, { email: email }] });
    if (isUserRegistered) {
        return res.status(400).json({ message: "User already exists with given username or email"});
    } else {
        if(!validator.isStrongPassword(password)) {
            return res.status(400).json({ message: "Password is not weak"});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            bio
        })
        if(user) {
            // using 201 Created status code
            return res.status(201).json({
                _id: user._id, // It's common to use _id for MongoDB documents
                username: user.username,
                email: user.email,
                // Optionally include other non-sensitive fields you want to return
            })
        } else {
            // Handle the unlikely case where user creation failed silently
            return res.status(500).json({ message: "Failed to create user"});
        }
    }
}

const loginUser = async (req, res) => {
    const {email, password} = req.body;
    if(!email || !password) {
        return res.status(400).json({ message: "All fields are required"});
    }
    const user = await User.findOne({email});
    if(user) {
        const comparePassword = await bcrypt.compare(password, user.password);
        if(comparePassword) {
            const accessToken = jwt.sign({
                user: {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                }
            }, 
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: "3d"}
            );
            return res.status(200).json({
                accessToken,
                user: {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                }
            })
        } else {
            return res.status(401).json({message: "Invalid credentials"})
        }
    } else {
        return res.status(401).json({message: "Invalid credentials"})
    }
}


const addToFavorites = async(req, res) => {
    try{
        const { blogId } = req.params;
        const  userId  = req.user.user._id;
        console.log('user id: ', userId)
        const user = await User.find({userId});
        if (!user) {
            return res.status(404).json({message: "User not found"})
        }
        const blog = await Blog.find({blogId});
        if (!blog) {
            return res.status(404).json({message: "Blog not found"})
        }

        await User.findByIdAndUpdate(userId, {
            $addToSet: { favorites: blogId} // use  $addToSet to prevent duplicates
        })
        return res.status(200).json({ message: "Blog added to favorites."})
    } catch(err) {
        return res.status(500).json({message: "Internal server error ", err: err.message})
    }
}

const removeFromFavorites = async(req, res) => {
    try{
        const { blogId } = req.params;
        const  userId  = req.user.user._id;
        const user = await User.find({userId});
        if (!user) {
            return res.status(404).json({message: "User not found"})
        }
        const blog = await Blog.find({blogId});
        if (!blog) {
            return res.status(404).json({message: "Blog not found"})
        }

        await User.findByIdAndUpdate(userId, {
            $pull: { favorites: blogId} // Use $pull to remove the blog ID from the array
        })
        return res.status(200).json({ message: "Blog added to favorites."})
    } catch(err) {
        return res.status(500).json({message: "Internal server error ", err: err.message})
    }
}

const getUserFavoriteBlogs = async (req, res) => {
    try {
        const userId = req.user.user._id;
        const userWithFavorites = await User.findById(userId).populate('favorites');
        if (userWithFavorites && userWithFavorites.favorites.length > 0) {
            return res.status(200).json(userWithFavorites.favorites);
        } else {
            res.status(404).json({ message: "No favorites found or user not found" });
        }
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}
module.exports = { registerUser, loginUser, addToFavorites, removeFromFavorites, getUserFavoriteBlogs }