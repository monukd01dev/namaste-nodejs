const { Schema,model } = require('mongoose');
const validator = require('validator');

const userSchema = new Schema({
    'firstName': {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 50,
        trim: true,
        validate(value) {
            if (!validator.isAlpha(value, 'en-US', { ignore: ' ' })) {
                throw new Error('First Name must only contain alphabets.')
            }
        }
    },
    'lastName': {
        type: String,
        trim: true,
        validate(value) {
            if(!value) return //varna "lastName" : "" , pe ye validation chala deta hai not required me ye sirf "lastName" : undefined he mangta hai 
            if (!validator.isAlpha(value, 'en-US', { ignore:  ' ' })) {
                throw new Error('Last Name must only contain alphabets.')
            }
        }
    },
    'emailId': {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Provide a valid email address.')
            }
        }

    },
    'password': {
        type: String,
        trim: true,
        required: true,
        validate(value) {
            if (!validator.isStrongPassword(value, {
                minLength: 8,
                minLowercase: 1,
                minUppercase: 1,
                minSymbols: 1,
                minNumbers: 1
            })) {
                throw new Error("Password is too weak.")
            }
        }

    },
    'age': {
        type: Number,
        min: [18, "You Must be 18+ to use this app cause some devs do penetration testing too."]

    },
    'gender': {
        type: String,
        lowercase: true,
        enum: {
            values: ['male', 'female', 'others'],
            // message: `{value} not allowed only male, female and others` value uppercase me likhna hota hai 
            message: `{VALUE} not allowed only male, female and others are allowed.`
        }
    }
}, {
    timestamps: true
})

const User = model('User',userSchema);
module.exports = User;