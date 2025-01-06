// import postModel from '../models/postModels'; // Import the post model
import commentModel, {IComment} from '../models/commentModels'; // Import the comment model
// import { Request, Response } from "express";
import BaseController from './base';

const Comment = new BaseController<IComment>(commentModel);

export default Comment;


// const CreateComment = async (req : Request, res : Response) => {
//     const postId = req.body.PostId;
//     try{
//         const post = await postModel.findById(postId);
//         if(!post){
//             res.status(404).json('Post not found');
//             return;
//         }
//     }
//     catch (error) {
//         res.status(400).json('Error finding post: ' + error);
//         return;
//     }
//     const comment = req.body;
//     try {
//         const savedComment = await commentModel.create(comment);
//         res.status(200).json(savedComment);
//     } catch (error) {
//         res.status(400).json('Error creating comment: ' + error);
//     }
// }

// const GetAllComments = async (req : Request, res : Response) => {
//     try {
//         const comment = await commentModel.find();
//         res.status(200).json(comment);
//     } catch (error) {
//         res.status(400).json('Error retrieving comments: ' + error);
//     }
// }


// const CommentByPostID = async (req : Request, res : Response) => {
//     const id = req.params.id;
//     try{
//         const post = await postModel.findById(id);
//         if(!post){
//             res.status(404).json('Post not found');
//             return;
//         }
//     }
//     catch (error) {
//         res.status(404).json('Error finding post: ' + error);
//         return;
//     }

//     try {
//         const comment = await commentModel.find({PostId: id});
//         if (comment.length === 0) {
//             res.status(404).json('No comments found for this post ID');
//             return;
//         }
//         else{
//             res.status(200).json(comment);
//         }
//     } catch (error) {
//         res.status(400).json('Error retrieving comments: ' + error);
//     }
// }

// const CommentUpdate = async (req : Request, res : Response) => {
//     const CommentId  = req.params.id;
//     try {
//         const updatedComment = await commentModel.findByIdAndUpdate(CommentId,req.body, {new: true});
//         res.status(200).json(updatedComment);
//     }
//     catch (error) {
//         res.status(404).json('Error updating comment: ' + CommentId + ' The error is: ' + error);
//     }
// }

// const CommentDelete = async (req : Request, res : Response) => {
//     const CommentId = req.params.id;
//     try {
//         const deletedComment = await commentModel.findByIdAndDelete(CommentId);
//         res.status(200).json(deletedComment);
//     }
//     catch (error) {
//         res.status(404).json('Error finding comment: ' + CommentId + ' The error is: ' + error);
//     }
// }
// export default {CreateComment, GetAllComments, CommentByPostID, CommentUpdate, CommentDelete};