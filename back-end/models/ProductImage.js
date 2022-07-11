const mongoose = require('mongoose');

const productImageSchema = new  mongoose.Schema({
    productId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "Product",
	},
    path: {type: String, default: ""}
}, 
{timestamp: true}
);

module.exports = ProductImage = mongoose.model('ProductImage', productImageSchema)