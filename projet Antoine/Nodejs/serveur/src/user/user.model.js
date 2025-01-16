import mongoose, {Schema} from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';

const UserSchema = new Schema({
    firstname: {
        type: String,
        trim: true,
        required: `Le prénom est requis.`
    },
    lastname: {
        type: String,
        trim: true,
        required: `Le nom est requis.`
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        index: true,
        dropDups: true, // delete duplicates
        unique: true,
        required: `L'adresse email est requise.`,
        validate: [validator.isEmail, `L'adresse email est invalide.`]
    },
    password: { // Hash
        type: String,
        select: false, // User.find().select('+password') pour avoir le mot de passe
        required: `Le mot de passe est requis.`,
    },
    admin: {
        type: Boolean
    }
    // Badges
    // Score (total et par langage)
    // Promotion (ING1)
    // Groupe (1B) - Sous-groupe
});


UserSchema.pre('save', function (next) {
    const user = this;
    if (user.isModified('password')) {
        bcrypt.hash(user.password, 10, function (err, hash) {
            user.password = hash;
            next();
        });
    } else {
        next();
    }
});

UserSchema.methods.comparePassword = function (password, done) {
    bcrypt.compare(password, this.password, function (err, isMatch) {
        done(err, isMatch);
    });
};

const User = mongoose.model('User', UserSchema);
export default User;
