const express = require('express');
const { getUserCart, addToCart, updateCart } = require('../controllers/cartController');
const authUser = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/get',authUser,getUserCart);
router.post('/add',authUser,addToCart);
router.post('/update',authUser,updateCart);

module.exports = router;