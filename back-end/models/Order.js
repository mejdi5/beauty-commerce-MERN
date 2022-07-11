const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
{
    userId: { type: String, required: true },
    products: { type: Array, required: true },
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, default: "unpaid" },
},
{ timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);