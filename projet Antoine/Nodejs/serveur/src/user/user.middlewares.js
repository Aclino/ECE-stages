import User from './user.model';
import bcrypt from "bcrypt";
import {generateJwtAndReturnObjectToSend} from '../auth/auth';

export async function sendAllUsers(req, res, next) {
    try {
        res.send(await User.find().exec());
    } catch (error) {
        next(error);
    }
}

export function loadUser(req, res, next, id) {
    User.find({_id: id})
        .limit(1)
        .exec(function (err, user) {
            if (err) {
                return next(err)
            }

            if (user) {
                req.data.user = user;
                /*if (req.user._id.equals(user._id)) {
                    req.data.isOwnerOfRessource = true;
                }*/
                next()
            } else {
                next({
                    status: 404,
                    message: 'Utilisateur introuvable.'
                });
            }
        })
}

export function deleteUser(req, res, next) {
    User.deleteOne({_id: req.data.user._id}, function (err, response) {
        if (err) {
            return next(err)
        }
        res.send(response);
    })
}

export async function createNewUser(req, res, next) {
    const {email, password, firstname, lastname} = req.body;
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = new User({
            email,
            firstname,
            lastname,
            password: passwordHash
        });
        const userSaved = await newUser.save();
        res.send(generateJwtAndReturnObjectToSend(userSaved));
    } catch (error) {
        next({
            message: `Erreur lors de la création de l'utilisateur.`
        });
    }
}
