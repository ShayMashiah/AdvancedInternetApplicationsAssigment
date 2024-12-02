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

const GetAllPosts = async (req,res) => {
    const authoFilter = req.query.author;
    try {
        if(authoFilter){
            const authorPosts = await postModel.find({author: authoFilter}) // Find all posts by the author
            res.status(200).send(authorPosts);
        } else {  
            const allPosts = await postModel.find(); // Find all posts
            res.status(200).send(allPosts);
        }
    }
    catch{
        res.status(400).send('Error retrieving posts');
    }
}

const PostByID = async (req,res) => {
    const id = req.params.id; // Get the post ID from the request parameters
    try {
        const post = await postModel.findById(id); // Find the post by ID
        res.status(200).send(post);
    }
    catch{
        res.status(400).send('Error retrieving post');
    }
}

module.exports = {CreateNewPost, GetAllPosts, PostByID}; // Export the CreateNewPost function to be used in the routes file