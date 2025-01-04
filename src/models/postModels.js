const mongoose = require('mongoose');

// Define the schema for a Post
const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
});

// Create the model from the schema and export it
const Post = mongoose.model('Post', postSchema);
module.exports = Post;