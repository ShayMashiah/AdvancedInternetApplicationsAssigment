const mongoose = require('mongoose');

// Define the schema for a Comment
const commentSchema = new mongoose.Schema({
    PostId: {
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
const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;