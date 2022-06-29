const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
{
    firstName: { type: String, required: true},
    lastName: { type: String, default: ''},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    verified: { type: Boolean, default: false },
    image: {type: String, default: "https://crowd-literature.eu/wp-content/uploads/2015/01/no-avatar.gif"},
    isAdmin: { type: Boolean, default: false },
},
{ timestamps: true }
);

UserSchema.methods.generateAuthToken = function () {
	const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, process.env.SECRET_JWT, {
		expiresIn: "7d",
	});
	return token;
};

module.exports = mongoose.model("User", UserSchema);