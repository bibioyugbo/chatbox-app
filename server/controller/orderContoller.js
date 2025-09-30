const Order = require('../models/orderModel')

exports.createOrder = async (req,res)=>{
    const sessionId = req.cookies.sessionId
    if (!sessionId) {
        return res.status(400).json({ message: "No session ID found" })
    }
    const {orderName,orderPrice} = req.body
    try{
        const order = await Order.create({
            sessionId,
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

exports.getCurrentOrder = async (req, res) => {
    try {
        const sessionId = req.cookies.sessionId
        if (!sessionId) {
            return res.status(400).json({ message: "No session ID found" })
        }

        // ✅ get all orders for this session
        const orders = await Order.find({ sessionId }).sort({ createdAt: -1 })

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: "No current orders found" })
        }

        return res.status(200).json({
            responseCode: "00",
            responseMessage: "Orders fetched successfully",
            responseData: orders, // ✅ now returns an array
        })
    } catch (e) {
        console.error("Error fetching current orders:", e)
        return res.status(500).json({ message: "Server error" })
    }
}


// Order History (all orders by session)
exports.getOrderHistory = async (req, res) => {
    try {
        const { sessionId } = req.query;
        if (!sessionId) return res.status(400).json({ message: "sessionId required" });

        const orders = await Order.find({ sessionId }).sort({ createdAt: -1 });

        if (!orders.length) {
            return res.status(404).json({ message: "No order history found" });
        }

        const history = orders.map(order => ({
            orderId: order._id,
            date: order.createdAt,
            totalItems: order.items.length,
        }));

        res.json(history);
    } catch (err) {
        res.status(500).json({ message: "Error fetching order history", error: err });
    }
};

exports.initPayment = async (req, res) => {
    const { sessionId } = req.body;

    try {
        const response = await axios.post(
            "https://api.paystack.co/transaction/initialize",
            {
                email,
                amount, // Paystack expects amount in kobo
                metadata: { sessionId },
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        return res.status(200).json({
            responseCode: "00",
            responseMessage: "Payment initialized",
            responseData: response.data.data, // contains authorization_url
        });
    } catch (error) {
        console.error("Paystack init error:", error.response?.data || error.message);
        return res.status(500).json({ message: "Payment initialization failed" });
    }
};

exports.paystackWebhook = async (req, res) => {
    const event = req.body;

    if (event.event === "charge.success") {
        const sessionId = event.data.metadata.sessionId;

        // Update order status in DB
        await Order.updateMany({ sessionId, status: "pending" }, { status: "paid" });

        console.log(`Payment successful for session: ${sessionId}`);
    }

    res.sendStatus(200);
};