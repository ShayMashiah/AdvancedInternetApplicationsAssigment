import postModel from '../models/postModels'; // Import the post model
import commentModel from '../models/commentModels'; // Import the comment model
import { Request, Response } from "express";

const CreateNewPost = async (req : Request,res : Response) => {
    const post = req.body;   // Get the new post from the request body
    try {
        const newPost = await postModel.create(post); // Create a new post
        res.status(201).send(newPost);
    }
    catch (error) {
        res.status(400).send('Error creating post: ' + error);
    }
}

const GetAllPosts = async (req : Request,res : Response) => {
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
    catch (error) {
        res.status(404).send('Error retrieving posts: ' + error);
    }
}

const PostByID = async (req : Request,res : Response) => {
    const id = req.params.id; // Get the post ID from the request parameters
    try {
        const post = await postModel.findById(id); // Find the post by ID
        res.status(200).send(post);
    }
    catch (error) {
        res.status(404).send('Error retrieving post: ' + error);
    }
}

const PostUpdate = async (req : Request,res : Response) => {
    const PostID = req.params.id; // Get the post to update from the id
    try{
        const updatedPost = await postModel.findByIdAndUpdate(PostID, req.body, {new: true}); // Update the post
        res.status(200).send(updatedPost);
    }
    catch (error) {
        res.status(404).send('Error updating post: '+ PostID +' The error is: ' + error);
    }
}


const PostDelete = async (req : Request,res : Response) => {
    const PostID = req.params.id; // Get the post to delete from the id
    try {
        if (PostID) {
            await commentModel.deleteMany({PostId: PostID});  
        } 
        const deletedPost = await postModel.findByIdAndDelete(PostID); // Delete the post
        res.status(200).send(deletedPost);
    }
    catch (error) {
        res.status(400).send('Error deleting post: ' + PostID + ' The error is' + error);
    }
}
export default {CreateNewPost, GetAllPosts, PostByID, PostUpdate, PostDelete}; // Export the CreateNewPost function to be used in the routes file