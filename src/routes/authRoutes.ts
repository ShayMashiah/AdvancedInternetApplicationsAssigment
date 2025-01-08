import express from 'express';
const router = express.Router();
import User from '../controllers/auth';

router.get('/', User.GetUsers);

router.post('/register', User.Register);

router.post('/login', User.Login);

export default router;
