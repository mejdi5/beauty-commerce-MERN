const router = require("express").Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");
const { 
    nameValidation, 
    emailValidation, 
    passwordValidation,
    validator,
    isAuthenticated 
} = require('./middlewares')


//register 
router.post('/register', nameValidation, emailValidation, passwordValidation , validator, async (req, res) => {
    const newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(
            req.body.password, 
            process.env.PASSWORD_SECRET
            ).toString()
    })
    try {
        const savedUser = await newUser.save();
        res.status(201).json({ msg: 'User registred with success', savedUser });
    } catch (error) {
        res.status(500).json({msg: "server error", error: error.message});
    }
})

//login
router.post('/login', validator, async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        !user && res.status(401).json({msg: "Wrong email or password!"}); //wrong email
        
        const originalPassword = CryptoJS.AES.decrypt(
            user.password, 
            process.env.PASSWORD_SECRET
            ).toString(CryptoJS.enc.Utf8);

        originalPassword !== req.body.password &&
        res.status(401).json({msg: "Wrong email or password!"}); //wrong password

        const token = jwt.sign({
            id: user._id,
            isAdmin: user.isAdmin
        }, process.env.SECRET_JWT);
        const { password, ...otherProperties } = user._doc;
        res.status(200).json({ msg: 'Logged with success', user: {...otherProperties}, token });
    } catch (error) {
        res.status(500).json({msg: "server error", error: error.message});
    }
})
//GET CURRENT USER
router.get('/currentUser', /*isAuthenticated,*/ (req, res) => {
    res.status(200).json({ user: req.user });
});


module.exports = router;
