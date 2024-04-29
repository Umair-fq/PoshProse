const User = require('../Models/UserModel')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto')
const validator = require('validator');
const Blog = require('../Models/BlogModel');
const sendEmail = require('../utils/SendEmail')

require('dotenv').config();

const registerUser = async (req, res) => {
    const {username, email, password, bio, profilePicture} = req.body;
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
            return res.status(400).json({ message: "Password is weak"});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            bio,
            profilePicture
        })
        if(user) {
            
            // Generate a verification token
            const verificationToken = crypto.randomBytes(32).toString('hex');
            user.emailVerificationToken = verificationToken;
            user.emailVerificationTokenExpires = Date.now() + 3600000; // 1 hour from now
            await user.save();

            // send verification email
            const verificationUrl = `http://localhost:5173/verify-email?token=${verificationToken}&id=${user._id}`;
            await sendEmail(user.email, "Verify your email", `Please click on the following link to verify your email: ${verificationUrl}`)
            res.status(200).send("User registered successfully. Please check your email to verify your account.")
        } else {
            // Handle the unlikely case where user creation failed silently
            return res.status(500).json({ message: "Failed to create user"});
        }
    }
}

const verifyEmailToken = async (req, res) => {
    const { token, id } = req.params;

    try {
        const user = await User.findOne({  _id: id });

        // Check if user is found
        if (user) {
            if(user.emailVerificationToken === token) {
                 // Check if the token has expired
                if (user.emailVerificationTokenExpires < Date.now()) {
                    return res.status(400).json({ message: "This token has expired. Please request a new verification email." });
                }

                // Proceed with email verification since token is valid and not expired
                user.isVerified = true;
                user.emailVerificationToken = null;
                user.emailVerificationTokenExpires = null;

                await user.save(); // Wait for the save operation to complete before proceeding
                res.json({ message: "Email verified successfully!" });

            }
        } else {
            return res.status(400).json({ message: "User not found or invalid token." });
        }
    } catch (error) {
        res.status(500).json({ message: "An error occurred while verifying the email." });
    }
};


const loginUser = async (req, res) => {
    const {email, password} = req.body;
    if(!email || !password) {
        return res.status(400).json({ message: "All fields are required"});
    }
    const user = await User.findOne({email});
    if(user) {
        const comparePassword = await bcrypt.compare(password, user.password);
        if(comparePassword) {
            if (!user.isVerified) {
                return res.status(401).json({ message: "Check email! Please verify your email before logging in." });
            }
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
                    bio: user.bio,
                    profilePicture: user.profilePicture,
                    isPublicProfile: user.isPublicProfile,
                }
            })
        } else {
            return res.status(401).json({message: "Invalid credentials"})
        }
    } else {
        return res.status(401).json({message: "Invalid credentials"})
    }
}


const updateProfile = async (req, res) => {
    try {
        const { username, bio, profilePicture, isPublicProfile } = req.body;
        const userId = req.user.user._id;
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ message: "User does not exist" });
        }
        
        if (!username) {
            return res.status(400).json({ message: "Username field is required" });
        }
        
        const updatedUser = await User.updateOne(
            { _id: userId },
            { $set: { username, bio, profilePicture, isPublicProfile } }
        );
        
        if (updatedUser.nModified === 0) {
            // Handle if no document was modified (user data remained unchanged)
            return res.status(200).json({ message: "User data remains unchanged" });
        }
        
        // Fetch the updated user data after the update
        const updatedUserData = await User.findById(userId);
        // console.log('user ', updatedUserData);
        return res.status(200).json({ message: "User profile updated successfully", user: updatedUserData });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};


const addToFavorites = async(req, res) => {
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
        // console.log('fav blogs req received')
        const userId = req.user.user._id;
        // console.log('user id: ', userId)
        const userWithFavorites = await User.findById(userId).populate('favorites');
        // console.log('outside if user favs ', userWithFavorites)
        if (userWithFavorites && userWithFavorites.favorites.length > 0) {
            // console.log('user favs: ', userWithFavorites.favorites)
            return res.status(200).json(userWithFavorites.favorites);
        } else {
            res.status(404).json({ message: "No favorites found or user not found" });
        }
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
}


const getAuthor = async(req, res) => {
    try{
        const { authorId } = req.params;
        let user = await User.findById(authorId);
        if(!user) {
            return res.status(404).json({message: "User not found"})
        }
        user = {    
                    username: user.username,
                    email: user.email,
                    bio: user.bio,
                    profilePicture: user.profilePicture,
                    isPublicProfile: user.isPublicProfile,
                }
        return res.status(200).json({user})
    } catch(error) {
        return res.status(500).json({error: error.message});
    }
}
module.exports = { registerUser, loginUser, addToFavorites, removeFromFavorites, getUserFavoriteBlogs, verifyEmailToken, updateProfile, getAuthor }