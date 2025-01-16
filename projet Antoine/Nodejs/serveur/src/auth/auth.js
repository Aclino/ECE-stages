const JWT_SECRET_TOKEN = process.env.JWT_SECRET_TOKEN || 'inventer-une-clé-secrete-ici';

import passport from 'passport';
import moment from 'moment';
import PassportLocal from 'passport-local';
import PassportJWT from 'passport-jwt';
import User from '../user/user.model';
import jwt from "jsonwebtoken";

const JWTStrategy = PassportJWT.Strategy;
const LocalStrategy = PassportLocal.Strategy;

export function generateJwtAndReturnObjectToSend(user) {
    const jwtPayload = {
        sub: user._id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        iat: moment().unix(), // Issued At
        exp: moment().add(30, 'hours').unix(),
    };
    if (user.admin) {
        jwtPayload.admin = user.admin;
    }
    return {
        id: user._id,
        token: jwt.sign(JSON.stringify(jwtPayload), JWT_SECRET_TOKEN),
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
    };
}

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
}, async (email, password, done) => {
    try {
        const user = await User
            .findOne({email})
            .select('+password')
            .exec();
        if (!user) {
            return done('Identifiants de connexion incorrects.');
        }
        user.comparePassword(password, function (err, isMatch) {
            if (!isMatch) {
                return done('Identifiants de connexion incorrects.');
            }
            return done(null, user);
        });
    } catch (error) {
        done(error);
    }
}));

passport.use(new JWTStrategy({
        jwtFromRequest: req => {
            const bearerHeader = req.headers['authorization'];
            if (typeof bearerHeader !== 'undefined') {
                return bearerHeader.split(' ')[1];
            }
            return null;
        },
        secretOrKey: JWT_SECRET_TOKEN,
    },
    (jwtPayload, done) => {
        if (moment().unix() > jwtPayload.exp) {
            return done({status: 498, message: 'Token de connexion expiré.'});
        }
        return done(null, jwtPayload);
    }
));
