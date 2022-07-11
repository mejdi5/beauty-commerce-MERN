const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
{
    userId: { type: String, required: true },
    cartProducts: { type: Array, default: [] },
    quantity: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
},
{ timestamps: true }
);

module.exports = mongoose.model("Cart", CartSchema);