import mongoose from 'mongoose';

export interface IComment {
    PostId: string;
    content: string;
    author: string;
}
// Define the schema for a Comment
const commentSchema = new mongoose.Schema<IComment>({
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
const Comment = mongoose.model<IComment>('Comment', commentSchema);
export default Comment;
