import {Router} from 'express';
import {ensureAuthenticated} from '../auth/auth.middlewares';
const router = Router();

router.get('/', ensureAuthenticated, (req, res) => {
    if(req.user.admin === true) {
        res.send({
            schools: []
        });
    }
    else {

    }

});

export default router;
