import {Router} from 'express';
import {sendAllSchools, createNewSchool} from './school.middlewares';
const router = Router();

router.route('/')
    .get(sendAllSchools)
    .post(createNewSchool);


export default router;
