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

module.exports = {CreateNewPost, GetAllPosts}; // Export the CreateNewPost function to be used in the routes file