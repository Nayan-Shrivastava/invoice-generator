const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, generatePassword } = require('../utils/utils');
const Role = require('../auth/role.enum');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            trim: true,
            required: true,
            lowercase: true,
            unique: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error('Email is invalid');
                }
            }
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
            trim: true,
            validate(value) {
                if (value.toLowerCase().includes('password')) {
                    throw new Error('Password cannot contain "password"');
                }
            }
        },
        gender: {
            type: String,
            trim: true
        },
        mobile: {
            type: String,
            trim: true,
            minlength: 10,
            maxlength: 10
        },
        branch: {
            type: String,
            trim: true
        },
        changedDefaultPassword: {
            type: Boolean,
            default: false
        },
        role: {
            type: String,
            required: true,
            enum: [Role.admin, Role.Superadmin, Role.Cashier]
        },
        tokens: [
            {
                token: {
                    type: String,
                    required: true
                }
            }
        ]
    },
    {
        timestamps: true
    }
);

userSchema.virtual('invoices', {
    ref: 'Invoice',
    localField: '_id',
    foreignField: 'cashier'
});


userSchema.statics.findByCredentials = async (userId, password) => {
    const user = await User.findById(userId);

    if (!user) {
        throw new Error('invalid creds');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error('invalid creds');
    }

    return user;
};


userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign(
        { _id: user._id.toString() },
        process.env.JWT_SECRET
    );

    user.tokens = user.tokens.concat({ token });
    await user.save();

    return token;
};


userSchema.methods.toJSON = function () {
    return toJSON(this);
};


userSchema.statics.initialCheck = async () => {
    //await User.deleteMany();
    const superadmins = await User.find({ role: Role.Superadmin });
    if (superadmins.length == 0) {
        console.log('-- No Superadmin Found --');
        console.log('\nCreating a default Superadmin...');
        const password = generatePassword();
        const superadmin = new User({
            name: process.env.SA_NAME,
            email: process.env.SA_EMAIL,
            password,
            role: Role.Superadmin
        });
        try {
            await superadmin.save();

            console.log('\n-- Default Superadmin created --');
            console.log('\nID :', superadmin._id);
            console.log('Password :', password);
            console.log('\nUse these credentials to Reset Password\n');
        } catch (err) {
            console.log(err);
        }
    }
};


userSchema.pre('save', async function (next) {
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
});


const User = mongoose.model('User', userSchema);

module.exports = User;
