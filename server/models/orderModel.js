const mongoose =require('mongoose')

const orderSchema = new mongoose.Schema(
    {
        orderName: {type: String, trim:true},
        orderPrice: {type: String, trim:true},
    }
)
const Order = mongoose.model("Order", orderSchema);
module.exports = {
    Order
}