import {Router} from 'express';
import {logUserInUsingEmailAndPassword} from './auth.middlewares';
const router = Router();

router.post('/login', logUserInUsingEmailAndPassword);

export default router;
