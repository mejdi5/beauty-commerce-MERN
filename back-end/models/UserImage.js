const mongoose = require('mongoose');

const userImageSchema = new  mongoose.Schema({
    userId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "User",
	},
    path: {type: String, default: ""}
}, 
{timestamp: true}
);

module.exports = UserImage = mongoose.model('UserImage', userImageSchema)