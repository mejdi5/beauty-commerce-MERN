const { validate } = require('deep-email-validator');
const { validationResult } = require('express-validator');
const jwt = require("jsonwebtoken");
const User = require("../models/User");


const nameValidation = (req, res, next) => {
    if (req.body.firstName.length === 0) {
        res.status(400).json({msg: 'First Name is required'})
    } else {
        next()
    }
}

const emailValidation = async (req, res, next) => {
    const emailValidator = await validate(req.body.email)
    const isValid = emailValidator.valid
    let user = await User.findOne({ email: req.body.email });  
    if (!isValid) {
        res.status(400).json({msg: 'Email is not valid'})
    } else if (user) {
        res.status(400).json({ msg: 'this email already exists' });
    } else {
        next()
    }
}

const passwordValidation =  (req, res, next) => {
    if (req.body.password.length < 6) {
        res.status(400).json({msg: "Password must have at least 6 characters"})
    } else {
        next()
    }
}

const validator = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array().map((err) => ({
            msg: err.msg,
            })),
    });
    }
    next();
};


module.exports = { 
    nameValidation, 
    emailValidation, 
    passwordValidation,
    validator,
};
