const postModel = require('../models/postModels'); // Import the post model
const commentModel = require('../models/commentModels'); // Import the comment model


const CreateNewPost = async (req,res) => {
    const post = req.body;   // Get the new post from the request body
    try {
        const newPost = await postModel.create(post); // Create a new post
        res.status(201).send(newPost);
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
        res.status(404).send('Error retrieving posts');
    }
}

const PostByID = async (req,res) => {
    const id = req.params.id; // Get the post ID from the request parameters
    try {
        const post = await postModel.findById(id); // Find the post by ID
        res.status(200).send(post);
    }
    catch{
        res.status(404).send('Error retrieving post');
    }
}

const PostUpdate = async (req,res) => {
    const PostID = req.params.id; // Get the post to update from the id
    try{
        const updatedPost = await postModel.findByIdAndUpdate(PostID, req.body, {new: true}); // Update the post
        res.status(200).send(updatedPost);
    }
    catch{
        res.status(404).send('Error updating post');
    }
}


const PostDelete = async (req,res) => {
    const PostID = req.params.id; // Get the post to delete from the id
    try {
        if (PostID) {
            await commentModel.deleteMany({PostId: PostID});  
        } 
        const deletedPost = await postModel.findByIdAndDelete(PostID); // Delete the post
        res.status(200).send(deletedPost);
    }
    catch{
        res.status(400).send('Error deleting post' + PostID);
    }
}
module.exports = {CreateNewPost, GetAllPosts, PostByID, PostUpdate, PostDelete}; // Export the CreateNewPost function to be used in the routes file