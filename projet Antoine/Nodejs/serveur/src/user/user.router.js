import {Router} from 'express';
import {sendAllUsers, createNewUser, loadUser, deleteUser} from './user.middlewares';
import {ensureAdmin, ensureAuthenticated, ensureOwnerOrAdmin} from '../auth/auth.middlewares';

const router = Router();

router.param('userId', loadUser);

router.route('/')
    .get(sendAllUsers)
    .post(createNewUser);

router.route('/:userId')
    .delete(ensureAuthenticated, ensureOwnerOrAdmin, deleteUser);

export default router;
