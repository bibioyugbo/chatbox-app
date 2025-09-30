const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema(
    {
        sessionId: { type: String, required: true },
        orderName: {type: String, trim:true},
        orderPrice: {type: String, trim:true},
    },
    { timestamps: true }
)
const Order = mongoose.model("Order", orderSchema);

module.exports = Order
