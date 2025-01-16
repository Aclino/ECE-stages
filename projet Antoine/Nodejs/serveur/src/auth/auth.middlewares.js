import passport from "passport";
import {generateJwtAndReturnObjectToSend} from './auth';

export function ensureAuthenticated(req, res, next) {
    passport.authenticate(
        'jwt',
        {session: false}
    )(req, res, next);
}

export function ensureAdmin(req, res, next) {
    if (req.user && req.user.admin !== undefined && req.user.admin === true) {
        return next();
    }
    return next(403);
}

export function ensureOwnerOrAdmin(req, res, next) {
    if (req.user && ((req.user.isOwnerOfRessource !== undefined && req.user.isOwnerOfRessource === true) || (req.user.admin !== undefined && req.user.admin === true))) {
        return next();
    }
    return next(403);
}

export function logUserInUsingEmailAndPassword(req, res, next) {
    passport.authenticate(
        'local',
        {session: false},
        (error, user) => {
            if (error || !user) {
                return next({
                    status: 400,
                    error
                });
            }
            res.send(generateJwtAndReturnObjectToSend(user));
        },
    )(req, res, next);
}
