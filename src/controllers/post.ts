import postModel,{IPost} from '../models/postModels'; // Import the post model
import BaseController from './base';

const Post = new BaseController<IPost>(postModel);

export default Post;
