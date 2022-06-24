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

const isAuthenticated = (req, res, next) => {
    const token = req.headers.token
    console.log("token", token)
    if (!token) {
        res.status(401).json({ msg: 'No Token!! You are not authenticated' });
    } else {
        jwt.verify(token, process.env.SECRET_JWT, async (error, response) => {
            const user = await User.findById(response.id);
            if (error) res.status(403).json({msg: "Token is not valid!! You are not authenticated"});
            req.user = user;
            next();
        })
    }
}

const isAuthorized = (req, res, next) => {
    isAuthenticated(req, res, () => {
        if (req.user.id === req.params.userId || req.user.isAdmin) {
            next()
        } else {
            res.status(403).json({msg: "You are not alowed to do that!"});
        }
    })
}

const adminAuthorization = (req, res, next) => {
    isAuthenticated(req, res, () => {
        if (req.user.isAdmin) {
            next()
        } else {
            res.status(403).json({msg: "Only admin is alowed to do that!"});
        }
    })
}

module.exports = { 
    nameValidation, 
    emailValidation, 
    passwordValidation,
    validator,
    isAuthenticated,
    isAuthorized,
    adminAuthorization 
};
