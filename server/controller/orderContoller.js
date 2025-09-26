const Order = require('../models/orderModel')

exports.createOrder = async (req,res)=>{
    const {orderName,orderPrice} = req.body
    try{
        const order = await Order.create({
            orderName,
            orderPrice
        })
        return res.status(200).json({
            responseCode:"00",
            responseMessage:"Order created successfully",
            responseData: order

        })
    }catch (e) {
        console.log("Error fetching data", e)
    }

}

