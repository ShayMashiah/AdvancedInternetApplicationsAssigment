const commentModel = require('../models/commentModels');

const CreateComment = async (req, res) => {
    // we need to check if the post has already existed before creating a new comment
    const comment = req.body;
    try {
        const savedComment = await commentModel.create(comment);
        res.status(200).json(savedComment);
    } catch (error) {
        res.status(400).json('Error creating comment');
    }
}

module.exports = {CreateComment};