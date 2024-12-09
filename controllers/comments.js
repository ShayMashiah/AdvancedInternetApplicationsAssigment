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

module.exports = {CreateComment};