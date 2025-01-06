import express from 'express';
const router = express.Router();
import User from '../controllers/auth';

router.get('/', User.GetUsers);

router.post('/register', User.Register);

export default router;
