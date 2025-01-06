import mongoose from 'mongoose';

interface IPost {
    PostId: string;
    title: string;
    content: string;
    author: string;
}
// Define the schema for a Post
const postSchema = new mongoose.Schema<IPost>({
    title: {
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
const Post = mongoose.model<IPost>('Post', postSchema);
export default Post;
