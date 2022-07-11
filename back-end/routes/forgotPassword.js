const router = require("express").Router();
const User = require("../models/User");
const Token = require("../models/Token");
const sendEmail = require("../utils/sendEmail");
const { passwordValidation } = require('./middlewares')
const CryptoJS = require("crypto-js");


// send password link
router.post("/password-reset", async (req, res) => {
	try {
		const email = req.body.email
		let user = await User.findOne({ email });
		!user && res.status(409).json({ message: "No user with given email!" });

		let token = await Token.findOne({ userId: user._id });
		if (!token) {
			token = await new Token({
				userId: user._id,
				token: crypto.randomBytes(32).toString("hex"),
			}).save();
		}

		const url = `https://beauty-commerce.herokuapp.com/password-reset/${user._id}/${token.token}/`;
		await sendEmail(user.email, "Password Reset", url);

		res.status(200).json({ message: "Password reset link sent to your email account", url });
	} catch (error) {
		res.status(500).json({ message: "Internal Server Error" });
	}
});

// verify password reset link
router.get("/password-reset/:id/:token", async (req, res) => {
	try {
		const user = await User.findOne({ _id: req.params.id });
		if (!user) return res.status(400).json({ message: "Invalid link" });

		const token = await Token.findOne({
			userId: user._id,
			token: req.params.token,
		});
		if (!token) return res.status(400).json({ message: "Invalid link" });

		res.status(200).json({msg: "Valid Url"});
	} catch (error) {
		res.status(500).json({ message: "Internal Server Error" });
	}
});

//set new password
router.post("/password-reset/:id/:token", passwordValidation, async (req, res) => {
	try {

		const user = await User.findOne({ _id: req.params.id });
		if (!user) return res.status(400).json({ message: "Invalid link" });

		const token = await Token.findOne({
			userId: user._id,
			token: req.params.token,
		});
		if (!token) return res.status(400).json({ message: "Invalid link" });

		if (!user.verified) user.verified = true;

		const hashPassword = CryptoJS.AES.encrypt(
            req.body.password, 
            process.env.PASSWORD_SECRET
            ).toString()

		user.password = hashPassword;
		
		await user.save();

		res.status(200).json({ message: "Password reset successfully" });
	} catch (error) {
		res.status(500).json({ message: "Internal Server Error" });
	}
});

module.exports = router;
