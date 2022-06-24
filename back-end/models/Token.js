const mongoose = require("mongoose");

const TokenSchema = new mongoose.Schema(
{
    userId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "User",
		unique: true,
	},
	isAdmin: {type: Boolean},
	token: { type: String, required: true },
},
{ timestamps: true }
);

module.exports = mongoose.model("Token", TokenSchema);