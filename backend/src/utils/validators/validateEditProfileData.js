
const { throwValidationError } = require('../customErrors');
const validator = require('validator');

const validateEditProfileData = (body) => {
    // 1. The Safe List (Email aur Password generic edit route se update nahi hone chahiye for security)
    const ALLOWED_UPDATES = ["firstName", "lastName", "age", "gender", "photoUrl", "about", "skills"];

    // 2. Extract incoming keys (Agar body = { age: 24, role: "admin" } aayi)
    const incomingFields = Object.keys(body);

    // 3. Strict Check: Kya incoming fields ALLOWED_UPDATES me hain?
    const isEditAllowed = incomingFields.every((field) => ALLOWED_UPDATES.includes(field));

    if (!isEditAllowed) {
        throwValidationError("Invalid edit request. Unapproved fields detected!");
    }

    // 4. Constructing the Clean Dynamic Object
    const cleanUpdates = {};

    // 5. Conditional Validation (Sirf wo validate karo jo request me aaya hai)
    if (body.firstName !== undefined) {
        if (typeof body.firstName !== 'string' ) throwValidationError("First Name must be text.")
        const fn = body.firstName.trim();
        if (fn.length < 2 || fn.length > 50 || !validator.isAlpha(fn, 'en-US', { ignore: ' ' }))
            throwValidationError("Invalid First Name");
        cleanUpdates.firstName = fn;
    }

    if (body.age !== undefined) {
        const parsedAge = Number(body.age);
        if (isNaN(parsedAge) || parsedAge < 18 || parsedAge > 100)
            throwValidationError("Age must be a valid number between 18 and 100.");
        cleanUpdates.age = parsedAge;
    }

    if (body.about !== undefined) {
        if (typeof body.about !== 'string' ) throwValidationError("About must be text.")
        const ab = body.about.trim();
        if (ab.length > 500) throwValidationError('About section cannot exceed 500 characters.');
        cleanUpdates.about = validator.escape(ab); // XSS Protection
    }

    if (body.lastName !== undefined) {
        if (typeof body.lastName !== 'string' ) throwValidationError("Last Name must be text.")
        const lastName = body.lastName.trim();
        if (lastName.length > 50 || !validator.isAlpha(lastName, 'en-US', { ignore: ' ' })) {
            throwValidationError("Invalid Last Name");
        }
        cleanUpdates.lastName = lastName;

    }

    if (body.gender !== undefined) {
        if (typeof body.gender !== 'string' ) throwValidationError("Gender must be text.")
        const gender = body.gender.trim().toLowerCase();
        const allowedGenders = ['male', 'female', 'other'];
        if (!allowedGenders.includes(gender)) {
            throwValidationError("Gender must be male, female, or other.");
        }
        cleanUpdates.gender = gender;
    }

    if (body.photoUrl !== undefined) {
        if (typeof body.photoUrl !== 'string' ) throwValidationError("Invalid Photo URL")
        const photoUrl = body.photoUrl.trim();
        if (photoUrl.length > 1000 || !validator.isURL(photoUrl, { require_protocol: true })) {
            throwValidationError('Invalid Photo URL');
        }
        cleanUpdates.photoUrl = photoUrl;
    }

    if (body.skills !== undefined){
        const skills = body.skills;
        if (!Array.isArray(skills)) throwValidationError("Skills must be an array.");
        if (skills.length > 15 || !skills.every(e => typeof e === 'string' && e.length <= 30)) {
            throwValidationError('Skill array is invalid or too big!');
        }
        cleanUpdates.skills = skills;
    }

    // 6. Return the perfectly sanitized, dynamic object
    return cleanUpdates;
};



module.exports = validateEditProfileData;