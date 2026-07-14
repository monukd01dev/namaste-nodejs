const { throwValidationError } = require('../customErrors');
const validator = require('validator');

const signupValidator = (body) => {
    // 1. Pehle sirf raw data extract kar (bina kisi function ke)
    const { firstName, lastName, gender, about, emailId, photoUrl, age, password, skills } = body;

    const cleanUpdates = {};

    // --- REQUIRED STRING FIELDS ---

    // firstName
    if (!firstName || typeof firstName !== 'string') {
        throwValidationError("First Name is required and must be text!");
    }
    const fn = firstName.trim();
    if (fn.length < 2 || fn.length > 50 || !validator.isAlpha(fn, 'en-US', { ignore: ' ' })) {
        throwValidationError("Invalid First Name");
    }
    cleanUpdates.firstName = fn;

    // emailId
    if (!emailId || typeof emailId !== 'string') {
        throwValidationError('Email is required and must be text!');
    }
    const eid = emailId.trim();
    if (eid.length > 100 || !validator.isEmail(eid)) {
        throwValidationError("Invalid Email!");
    }
    cleanUpdates.emailId = eid;

    // password (ise trim nahi karte)
    if (!password || typeof password !== 'string') {
        throwValidationError("Password is required and must be text!");
    }
    if (!validator.isStrongPassword(password)) {
        throwValidationError('Weak Password!');
    }
    cleanUpdates.password = password;

    // gender
    if (!gender || typeof gender !== 'string') {
        throwValidationError("Gender is required and must be text!");
    }
    const g = gender.trim().toLowerCase();
    const allowedGenders = ['male', 'female', 'other'];
    if (!allowedGenders.includes(g)) {
        throwValidationError("Gender must be male, female, or other.");
    }
    cleanUpdates.gender = g;


    // --- REQUIRED NUMBER FIELD ---

    // age
    if (age === undefined || age === null || age === '') {
        throwValidationError("Age is required!");
    }
    const parsedAge = Number(age);
    if (isNaN(parsedAge) || parsedAge < 18 || parsedAge > 100) {
        throwValidationError("Age must be a valid number between 18 and 100.");
    }
    cleanUpdates.age = parsedAge;


    // --- OPTIONAL FIELDS (Pehle existence check, phir type check) ---

    // lastName
    if (lastName !== undefined) {
        if (typeof lastName !== 'string') throwValidationError("Last Name must be text.");
        const ln = lastName.trim();
        if (ln.length > 50 || !validator.isAlpha(ln, 'en-US', { ignore: ' ' })) {
            throwValidationError("Invalid Last Name");
        }
        cleanUpdates.lastName = ln;
    }

    // about
    if (about !== undefined) {
        if (typeof about !== 'string') throwValidationError("About must be text.");
        const ab = about.trim();
        if (ab.length > 500) throwValidationError('About section cannot exceed 500 characters.');
        cleanUpdates.about = validator.escape(ab); // XSS Protection
    }

    // photoUrl
    if (photoUrl !== undefined) {
        if (typeof photoUrl !== 'string') throwValidationError("Photo URL must be text.");
        const pu = photoUrl.trim();
        if (pu.length > 1000 || !validator.isURL(pu, { require_protocol: true })) {
            throwValidationError('Invalid Photo URL');
        }
        cleanUpdates.photoUrl = pu;
    }

    // skills
    if (skills !== undefined) {
        if (!Array.isArray(skills)) throwValidationError("Skills must be an array.");
        if (skills.length > 15 || !skills.every(e => typeof e === 'string' && e.length <= 30)) {
            throwValidationError('Skill array is invalid or too big!');
        }
        cleanUpdates.skills = skills;
    }

    // 2. Return strictly constructed object
    return cleanUpdates;
};

module.exports = signupValidator;