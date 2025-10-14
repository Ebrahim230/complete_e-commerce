const express = require('express');
const { allOrders, updateStatus, placeOrder, placeOrderStripe, userOrders } = require('../controllers/orderController');
const adminAuth = require('../middlewares/adminAuth');
const userAuth = require('../middlewares/authMiddleware');
const router = express.Router();

//Admin features:
router.post('/list',adminAuth,allOrders);
router.post('/status',adminAuth,updateStatus);

//Payment features:
router.post('/place',userAuth,placeOrder);
router.post('/stripe',userAuth,placeOrderStripe);

//User features:
router.post('/userorders',userAuth,userOrders);

module.exports = router;