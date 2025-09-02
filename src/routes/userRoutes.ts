import {Router} from 'express';
import { createUser, loginUser,getUser } from '../controller/userController.ts';
import { verifyToken } from '../token.ts';
const router = Router();

router.post('/signup',createUser);
router.post('/login',loginUser);
router.get('/',verifyToken, getUser);

export default router;