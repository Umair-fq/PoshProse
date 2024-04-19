const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BlogSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    summary: {
        type: String
    },
    tags: [{
        type: String,
    }],
    images: [{
        type: String, //Urls to the images
    }],
    publishDate: {
        type: Date,
        default: Date.now,
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    dislikes: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    comments: [{
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        comment: {
            type: String,
            required: true,
        },
        date: {
            type: Date,
            default: Date.now
        }
    }]
})

const Blog = mongoose.model('Blog', BlogSchema);
module.exports = Blog;