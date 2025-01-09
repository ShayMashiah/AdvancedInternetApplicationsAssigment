import express from 'express';
const router = express.Router();
import User from '../controllers/auth';

router.get('/', User.GetUsers);

router.post('/register', User.Register);

router.post('/login', User.Login);

router.post('/logout', User.Logout);

router.post('/refresh', User.Refresh);

export default router;
