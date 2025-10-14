const express = require('express');
const {addProduct,listProduct,removeProduct,singleProduct} = require('../controllers/productController');
const upload = require('../middlewares/multer');
const adminAuth = require('../middlewares/adminAuth');
const router = express.Router();

router.post('/add',adminAuth,upload.fields([{name:'image1',maxCount:1},{name:'image2',maxCount:1},{name:'image3',maxCount:1},{name:'image4',maxCount:1}]),addProduct);
router.get('/list',listProduct);
router.post('/remove',adminAuth,removeProduct);
router.post('/single',singleProduct);

module.exports = router;