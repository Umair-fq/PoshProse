const Blog = require('../Models/BlogModel')
const cloudinary = require('cloudinary').v2;
require('dotenv').config();
          
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.API_KEY, 
  api_secret:  process.env.API_SECRET,
});


const createBlog = async (req, res) => {
    try {
        const { title, content, summary, tags, images} = req.body;

        if (!title || !summary || !content) {
            return res.status(400).json({ message:"Fill all the fields"});
        }
    
        // extract user id from req.user
        const userId = req.user.user._id;
        const blog = await Blog.create({
            title,
            author: userId,
            content,
            summary,
            tags,
            images,
        });
        
        if(!blog) {
            return res.status(404).json({message: "Error while storing blog"});
        }
        return res.status(201).json(blog);
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

// const getAllBlogs = async (req, res) => {
//     try {
//         const blogs = await Blog.find().populate('author', 'username');
//         return res.status(200).json(blogs)
//     } catch (error) {
//         return res.status(500).json({ message: "Server error", error: error.message})
//     }
// }

const getBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id)
        .populate('author', 'username email')
        .populate('comments.author', 'username');
        if(!blog) {
            return res.status(404).json({message: "Blog not found"});
        }
        return res.status(200).json(blog);
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message})
    }

}

const searchBlog = async(req, res) => {
    try{
        const {query} = req.query;
        // construct query string
        const searchQuery = {
            title: { $regex: query, $options: 'i'} // Case-insensitive search
        }
        // execute the search query to find matching blogs
        const blogs = await Blog.find(searchQuery).populate('author', 'username');
        return res.status(200).json(blogs)
    }
    catch(error){
        return res.status(500).json({ message: "Server error", error: error.message})
    }
}


const editBlog = async (req, res) => {
    try {
        const { blogId } = req.params;
        const { title, content, summary, tags, images } = req.body;

        // console.log("tags: ", tags)

        if (!title || !content || !summary) {
            return res.status(400).json({ message: "All fields are required" });
        }
        // Convert tags from a comma-separated string to an array of strings
        // const tagsArray = tags.split(',').map(tag => tag.trim());
        const userId = req.user.user._id;
        const blog = await Blog.findById(blogId);
        
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        if(userId.toString() !== blog.author.toString()){
            return res.status(403).json({ message: "User not authorized to edit this blog" });
        }
        const updatedBlog = await Blog.findByIdAndUpdate(blogId, {
            title,
            content,
            summary,
            tags,
            images,
        }, { new: true }).populate('author', 'username');

        return res.status(200).json(updatedBlog);
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
    }


    const deleteBlog = async(req, res) => {
        try {
            const { blogId } = req.params;
            const userId = req.user.user._id;
            const blog = await Blog.findById(blogId);
            if (!blog) {
                return res.status(404).json({ message: "Blog not found" });
            }
            if (userId.toString() !== blog.author.toString()) {
                return res.status(403).json({ message: "User not authorized to delete this blog" });
            }
            await Blog.findByIdAndDelete(blogId);
            return res.status(200).json({ message: "Blog deleted successfully" });
        } catch (error) {
            return res.status(500).json({ message: "Server error", error: error.message });
        }
    }


    const blogsByTags = async(req, res) => {
        try{
            const { tags } = req.query;
            // console.log(tags)
            // converting tags into array, splitting by comma
            // and $in operator is used to find documents where tags field matches any of tags in the array
            const query = tags ? {tags: { $in: tags.split(',')}} : {};
            // console.log('query: ',query)
            const blogs = await Blog.find(query).populate('author', 'username');
            // console.log('blogs: ', blogs)
            return res.json(blogs)
        } catch (error) {
            return res.status(500).json({ message: "Server error", error: error.message });
        }
    }

    const myBlogs = async(req, res) => {
        try {
            const userId = req.user.user._id;
            const blogs = await Blog.find({author: userId}).populate('author', 'username')
            if(blogs) {
                return res.status(200).json(blogs);
            }
            else {
                return res.status(404).json({message: "No blogs found"});
            }
        } catch (error) {
            return res.status(500).json({ message: "Server error", error: error.message });
        }
    }
    

const addComment = async (req, res) => {
    try {
        const { comment } = req.body;
        const userId = req.user.user._id;
        const blogId = req.params.blogId;


        // Find the blog by ID
        const blog = await Blog.findById(blogId).populate('author', 'username');
        // console.log('Populated blog:', blog); // Log the populated blog object

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        // crete a new comment object
        const newComment = {
            author: userId,
            comment: comment
        }

        // Add the new comment to the comments array
        blog.comments.push(newComment)

        // save the blog
        const updatedBlog = await blog.save();
        
        return res.status(201).json(updatedBlog);
    } catch(err) {
        return res.status(500).json({message: "Internal server error"})
    }
}

const editComment = async (req, res) => {
    try {
        const { comment } = req.body;  
        const { blogId, commentIndex } = req.params;

        const blog = await Blog.findById(blogId);
        if(!blog) {
            return res.status(404).json({message: "Blog not found"})
        }
        
        
        if (commentIndex < 0 || commentIndex >= blog.comments.length) {
            return res.status(404).json({ message: "Invalid comment index" });
        }


        blog.comments[commentIndex].comment = comment;
        const updatedBlog = await blog.save();
        return res.status(200).json(updatedBlog);
    } catch (error) {
        return res.status(501).json({message: "Internal Server error: ", error})
    }
}

const deleteComment = async (req, res) => {
    try {
        let { blogId, commentIndex } = req.params;

        const blog = await Blog.findById(blogId);
        if(!blog) {
            return res.status(404).json({message: "Blog not found"})
        } 
        
        if (commentIndex < 0 || commentIndex >= blog.comments.length) {
            return res.status(404).json({ message: "Invalid comment index" });
        }
        //delete comment from the array of objects os comments
        blog.comments.splice(commentIndex, 1);
        await blog.save();
        return res.status(200).json({message: "blog deleted successfully"});
    } catch (error) {
        return res.status(501).json({message: "Internal Server error: ", error})
    }
}

const handleLikeBlog = async (req, res) => {
    try {
        const { blogId } = req.params;
        const userId = req.user.user._id;
        const blog = await Blog.findById(blogId);
        if(!blog){
            return res.status(404).json({message: "blog not found"})
        }
        const userLiked = blog.likes.includes(userId);
        const userDisLiked = blog.dislikes.includes(userId);
        if(userLiked){
            blog.likes.pull(userId); //Remove like
        } else {
            if(userDisLiked){
                blog.dislikes.pull(userId); //Remove dis-like
            } 
            blog.likes.push(userId); //Add like
        }
        const updatedBlog = await blog.save();
        return res.status(201).json(updatedBlog)
    } catch (error) {
        return res.status(501).json({message: "Internal Server error: ", error})
    }
}


const handleDisLikeBlog = async (req, res) => {
    try {
        const {blogId} = req.params;
        const userId = req.user.user._id;
        const blog = await Blog.findById(blogId);
        if(!blog){
            return res.status(404).json({message: "blog not found"})
        }
        const userLiked = blog.likes.includes(userId);
        const userDisLiked = blog.dislikes.includes(userId);
        if(userDisLiked){
            blog.dislikes.pull(userId); //Remove dis-like
        } else {
            if(userLiked){
                blog.likes.pull(userId); //Remove like
            }
            blog.dislikes.push(userId); //Add dis-like
        }
        const updatedBlog = await blog.save();
        return res.status(201).json(updatedBlog)
    } catch (error) {
        return res.status(501).json({message: "Internal Server error: ", error})
    }
}

module.exports = { createBlog, getBlog, editBlog, deleteBlog, searchBlog, blogsByTags, myBlogs, addComment, editComment, deleteComment, handleLikeBlog, handleDisLikeBlog}