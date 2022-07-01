const router = require("express").Router();
const User = require("../models/User");
const Token = require("../models/Token");
const CryptoJS = require("crypto-js");
const crypto = require('crypto')
const { validate } = require('deep-email-validator');
const { 
    nameValidation, 
    emailValidation, 
    passwordValidation,
    validator,
} = require('./middlewares')


//GET USERS STATISTICS
router.get("/stats", async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
    try {
        const usersStats = await User.aggregate([
        { $match: { createdAt: { $gte: lastYear } } },
        {
            $project: {
            month: { $month: "$createdAt" },
            },
        },
        {
            $group: {
            _id: "$month",
            total: { $sum: 1 },
            },
        },
        ]);
        res.status(200).json(usersStats)
    } catch (error) {
    res.status(500).json(error);
    }
});

//POST NEW User (for admin)
router.post("/", nameValidation, emailValidation, passwordValidation , validator, async (req, res) => {
    const newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        image: req.body.image,
        isAdmin: req.body.isAdmin,
        verified: true,
        password: CryptoJS.AES.encrypt(
            req.body.password, 
            process.env.PASSWORD_SECRET
            ).toString()
    });

    try {
        const savedUser = await newUser.save();
        const newToken = await new Token({
            userId: savedUser._id,
            isAdmin: savedUser.isAdmin,
            token: crypto.randomBytes(32).toString("hex"),
        }).save();
        res.status(200).json({savedUser, token: newToken, msg: `${savedUser.firstName} ${savedUser.lastName} is registered in database`});
    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }
});

//EDIT USER
router.put('/:userId', validator, async (req, res) => {
    if (req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(
            req.body.password,
            process.env.PASSWORD_SECRET
        ).toString();
    }
    try {
        if(req.body.email) {
            const emailValidator = await validate(req.body.email)
            const isValid = emailValidator.valid
            let existingUser = await User.findOne({ email: req.body.email });
            !isValid && 
                res.status(400).json({msg: 'Email is not valid'})
            (existingUser && existingUser._id !== req.params.userId) && 
                res.status(400).json({ msg: 'this email already exists' });
        }
        if (req.body.firstName && req.body.firstName.length === 0) {
            res.status(400).json({msg: 'First Name is required'})
        }
        if (req.body.password && req.body.password.length < 6) {
            res.status(400).json({msg: "Password must have at least 6 characters"})
        }
        const editedUser = await User.findByIdAndUpdate(
            req.params.userId, 
            {$set: req.body}, 
            { new: true }
        )
        res.status(200).json({msg: "User edited..", editedUser});
    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }
})

//DELETE USER
router.delete("/:userId", async (req, res) => {
    try {
        const deletedUser = await User.findOneAndDelete({_id: req.params.userId});
            res.status(200).json({msg:`${deletedUser.firstName} ${deletedUser.lastName} has been deleted...`, deletedUser});
    } catch (error) {
        res.status(500).json(error);
    }
});

//GET ONE USER
router.get("/:userId", async (req, res) => {
    try {
        const user = await User.findOne({_id: req.params.userId});
        const { password, ...otherProperties } = user._doc;
        res.status(200).json(otherProperties);
    } catch (error) {
        res.status(500).json(error);
    }
});

//GET ALL USERS
router.get("/", async (req, res) => {
    const query = req.query.new;
    try {
        const users = query
        ? await User.find().sort({ createdAt: -1 }).limit(5)
        : await User.find().sort({ createdAt: -1 })
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json(error);
    }
});


module.exports = router;
