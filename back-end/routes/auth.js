const router = require("express").Router();
const User = require("../models/User");
const Token = require("../models/Token");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const CryptoJS = require("crypto-js");
const crypto = require("crypto");
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
        const newToken = await new Token({
			userId: savedUser._id,
            isAdmin: savedUser.isAdmin,
			token: crypto.randomBytes(32).toString("hex"),
		}).save();
        //send activation email
        const url = `http://localhost:3000/verify/${savedUser._id}/${newToken.token}`;
		await sendEmail(savedUser.email, "Account Activation", url);
        res.status(201).json({ msg: 'Registred with success, Check you email to activate your account', savedUser, token: newToken });
    } catch (error) {
        res.status(500).json({msg: "server error", error: error.message});
    }
})

//email activation
router.get("/verify/:_id/:token", async (req, res) => {

	try {
		const user = await User.findOne({ _id: req.params._id });
		if (!user) res.status(400).json({ msg: "Invalid link" });

        const token = await Token.findOne({
			userId: user._id,
			token: req.params.token,
		});
        if (!token) res.status(400).json({ msg: "Invalid link" });

		const verifiedUser = await User.findByIdAndUpdate(req.params._id, { verified: true });
		return res.status(200).json({ msg: "Email verified successfully", user: verifiedUser });

	} catch (error) {
		res.status(500).json({ msg: error.message });
	}
});

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

        const { password, ...otherProperties } = user._doc;

        if (user && !user.verified) {
            let token = await Token.findOne({ userId: user._id });
			if (!token) {
				token = await new Token({
					userId: user._id,
					token: crypto.randomBytes(32).toString("hex"),
				}).save();
			}
            //send activation email
            const url = `http://localhost:3000/verify/${user._id}/${token.token}`;
            await sendEmail(user.email, "Account Activation", url);
			return res.status(200).send({ 
                msg: "Logged with success, An Email sent to your account please verify", 
                user: {...otherProperties}, 
                token: token.token 
            });
        }

        const token = jwt.sign({ _id: user._id, isAdmin: user.isAdmin }, process.env.SECRET_JWT, {
            expiresIn: "7d",
        });
        
        res.status(200).json({ msg: 'Logged with success', user: {...otherProperties}, token });
    } catch (error) {
        res.status(500).json({msg: "server error", error: error.message});
    }
})



module.exports = router;
