const Blog = require('../Models/BlogModel')

const createBlog = async (req, res) => {
    try {
        const { title, content, summary, tags} = req.body;
        // console.log(`req body: ${req.body}`)
        if (!title || !summary || !content) {
            return res.status(400).json({ message:"Fill all the fields"});
        }
    
        // extract user id from req.user
        const userId = req.user.user._id; // Adjust based on actual payload structure
        const blog = await Blog.create({
            title,
            author: userId,
            content,
            summary,
            tags
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
        const blog = await Blog.findById(req.params.id).populate('author', 'username email');
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
        const { title, content, summary, tags } = req.body;

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

        // console.log('tags: ', tags)

        if(userId.toString() !== blog.author.toString()){
            return res.status(403).json({ message: "User not authorized to edit this blog" });
        }
        const updatedBlog = await Blog.findByIdAndUpdate(blogId, {
            title,
            content,
            summary,
            tags,
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
    

    // middleware for checking that the current user and the blog owner
const checkBlogOwner = async (req, res, next) => {
    try {
        const blog = await Blog.find(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found"})
        }
        if (blog.author.toString() !== req.user.user._id.toString()) {
            return res.status(404).json({ message: "User not authorized"})
        }
        next();
    } catch(err) {
        return res.status(500).json({message: "Server error", error: err.message})
    }
}

module.exports = { createBlog, getBlog, editBlog, deleteBlog, searchBlog, blogsByTags, myBlogs, checkBlogOwner}