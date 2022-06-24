const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, text) => {
    
		const transporter = nodemailer.createTransport({
			host: "smtp.ethereal.email",
			service: 'Outlook',
			port: 587,
			secure:false,
			auth: {
				user: process.env.NODEMAIL_USER,
				pass: process.env.NODEMAIL_PASS,
			},
		});

		console.log(email, subject, text)
		transporter.sendMail({
			from: process.env.NODEMAIL_USER,
			to: email,
			subject,
			text,
		}, (err, res) => {
			if (err) {
				console.log('email not sent', err.message)
			} else {
				console.log('email sent successfully')
			}
		});
};


module.exports = sendEmail