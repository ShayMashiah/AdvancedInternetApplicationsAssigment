const commentModel = require('../models/commentModels');
const postModel = require('../models/postModels');



const CreateComment = async (req, res) => {
    const postId = req.body.PostId;
    try{
        const post = await postModel.findById(postId);
        if(!post){
            res.status(404).json('Post not found');
            return;
        }
    }
    catch (error) {
        res.status(400).json('Error finding post');
        return;
    }
    const comment = req.body;
    try {
        const savedComment = await commentModel.create(comment);
        res.status(200).json(savedComment);
    } catch (error) {
        res.status(400).json('Error creating comment');
    }
}

const GetAllComments = async (req, res) => {
    try {
        const comment = await commentModel.find();
        res.status(200).json(comment);
    } catch (error) {
        res.status(400).json('Error retrieving comments');
    }
}


const CommentByPostID = async (req, res) => {
    const id = req.params.id;
    try{
        const post = await postModel.findById(id);
        if(!post){
            res.status(404).json('Post not found');
            return;
        }
    }
    catch (error) {
        res.status(400).json('Error finding post');
        return;
    }

    try {
        const comment = await commentModel.find({PostId: id});
        if (comment.length === 0) {
            return res.status(404).json('No comments found for this post ID');
        }
        else{
            res.status(200).json(comment);
        }
    } catch (error) {
        res.status(400).json('Error retrieving comments');
    }
}

const CommentUpdate = async (req, res) => {
    const CommentId  = req.params.id;
    try {
        const updatedComment = await commentModel.findByIdAndUpdate(CommentId,req.body, {new: true});
        res.status(200).json(updatedComment);
    }
    catch (error) {
        res.status(404).json('Error updating comment');
    }
}
module.exports = {CreateComment,GetAllComments, CommentByPostID, CommentUpdate};