import commentModel, {IComment} from '../models/commentModels'; // Import the comment model
import BaseController from './base';

const Comment = new BaseController<IComment>(commentModel);

export default Comment;