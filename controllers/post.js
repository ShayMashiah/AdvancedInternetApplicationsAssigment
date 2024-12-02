const e = require('express');
const postModel = require('../models/postModels'); // Import the post model


const CreateNewPost = async (req,res) => {
    const post = req.body;   // Get the new post from the request body
    try {
        const newPost = await postModel.create(post); // Create a new post
        res.status(200).send(newPost);
    }
    catch{
        res.status(400).send('Error creating post');
    }
}

module.exports = {CreateNewPost}; // Export the CreateNewPost function to be used in the routes file