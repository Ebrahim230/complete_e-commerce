const orderModel = require("../models/orderModel");
const userModel = require("../models/userModel");
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const currency = "usd";
const deliveryCharge = 10;

const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;
        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "COD",
            payment: false,
            status: "Order Placed",
            date: Date.now(),
        };
        const newOrder = new orderModel(orderData);
        await newOrder.save();
        await userModel.findByIdAndUpdate(userId, { cartData: {} });
        res.json({ success: true, message: "Order placed." });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
};

const placeOrderStripe = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;
        const origin = req.headers.origin || process.env.CLIENT_URL;
        if (!items || !Array.isArray(items) || items.length === 0)
            return res.json({ success: false, message: "No items provided for checkout." });
        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: "Stripe",
            payment: false,
            date: Date.now(),
        };
        const newOrder = new orderModel(orderData);
        await newOrder.save();
        const line_items = items.map((i) => ({
            price_data: {
                currency,
                product_data: { name: i.name },
                unit_amount: Math.round(i.price * 100),
            },
            quantity: i.quantity || 1,
        }));
        line_items.push({
            price_data: {
                currency,
                product_data: { name: "Delivery Charge" },
                unit_amount: deliveryCharge * 100,
            },
            quantity: 1,
        });
        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode: "payment",
        });
        res.json({ success: true, session_url: session.url });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
};

const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, orders });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
};

const userOrders = async (req, res) => {
  try {
    const { userId } = req.body
    if (!userId) return res.json({ success: false, message: "User ID required" })
    const orders = await orderModel.find({ userId }).lean()
    orders.forEach(o => o.status = o.status?.trim())
    res.json({ success: true, orders })
  } catch (err) {
    res.json({ success: false, message: err.message })
  }
}

const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        await orderModel.findByIdAndUpdate(orderId, { status });
        res.json({ success: true, message: "Status updated successfully" });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
};

const verifyStripe = async (req, res) => {
    const { orderId, success, userId } = req.body;
    try {
        if (success === 'true') {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            await userModel.findByIdAndUpdate(userId, { cartData: {} });
            res.json({ success: true });
        } else {
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false });
        }
    } catch (err) {
        console.log(err);
        res.json({
            success: false,
            message: err.message
        })
    }
}

const cancelOrder = async (req, res) => {
    try {
        const { orderId, userId, role } = req.body;
        const order = await orderModel.findById(orderId);
        if (!order) return res.json({ success: false, message: "Order not found." });

        if (role === "user") {
            if (order.userId.toString() !== userId) return res.json({ success: false, message: "Unauthorized." });
            if (order.status !== "Order Placed") return res.json({ success: false, message: "Cannot cancel this order." });
            await orderModel.findByIdAndUpdate(orderId, { status: "Cancelled" });
            return res.json({ success: true, message: "Order cancelled successfully." });
        }

        if (role === "admin") {
            await orderModel.findByIdAndUpdate(orderId, { status: "Cancelled" });
            return res.json({ success: true, message: "Order cancelled by admin." });
        }

        return res.json({ success: false, message: "Invalid role." });
    } catch (err) {
        res.json({ success: false, message: err.message });
    }
};

module.exports = { placeOrder, placeOrderStripe, userOrders, updateStatus, allOrders, verifyStripe, cancelOrder };