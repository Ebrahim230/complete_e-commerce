const orderModel = require("../models/orderModel");
const userModel = require("../models/userModel");

const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;
        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod: 'COD',
            payment: false,
            date: Date.now()
        }
        const newOrder = await orderModel(orderData);
        await newOrder.save();
        await userModel.findByIdAndUpdate(userId, { cartData: {} });
        res.json({
            success: true,
            message: 'Order placed.'
        })
    } catch (err) {
        console.log(err);
        res.json({
            success: false,
            message: err.message
        })
    }
}

const placeOrderStripe = async (req, res) => {

}

const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({
            success: true,
            orders
        })
    } catch (err) {
        console.log(err);
        res.json({
            success: false,
            message: err.message
        })
    }
}

const userOrders = async (req, res) => {
    try {
        const { userId } = req.body;
        const orders = await orderModel.find({ userId });
        res.json({
            success: true,
            orders
        })
    } catch (err) {
        console.log(err);
        res.json({
            success: false,
            message: err.message
        })
    }
}

const updateStatus = async (req, res) => {

}

module.exports = {
    placeOrder,
    placeOrderStripe,
    userOrders,
    updateStatus,
    allOrders
}