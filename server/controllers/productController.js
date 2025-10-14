const productModel = require('../models/productModel');
const cloudinary = require('cloudinary').v2;

//Function for adding product:
const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, subCategory, bestSeller, sizes } = req.body;
        if (!name || !price || !category || !subCategory) return res.status(400).json({ success: false, message: 'Required fields missing' });
        if (!req.files || Object.keys(req.files).length === 0) return res.status(400).json({ success: false, message: 'No images uploaded' });
        const image1 = req.files.image1 && req.files.image1[0];
        const image2 = req.files.image2 && req.files.image2[0];
        const image3 = req.files.image3 && req.files.image3[0];
        const image4 = req.files.image4 && req.files.image4[0];
        const images = [image1, image2, image3, image4].filter(Boolean);
        const imageUrl = await Promise.all(images.map(async i => {
            const result = await cloudinary.uploader.upload(i.path, { resource_type: 'image' });
            return result.secure_url;
        }));
        let parsedSizes = sizes;
        if (typeof parsedSizes === 'string') {
            try { parsedSizes = JSON.parse(parsedSizes); } catch { parsedSizes = [parsedSizes]; }
        }
        if (!Array.isArray(parsedSizes)) parsedSizes = [parsedSizes];
        const productData = { name, description, category, subCategory, price: Number(price), bestSeller, sizes: parsedSizes, image: imageUrl, date: Date.now() };
        const product = new productModel(productData);
        await product.save();
        res.json({ success: true, message: 'Product added successfully'});
    } catch (err) {
        console.error('Add Product Error:', err);
        res.status(500).json({ success: false, message: err.message });
    }
};

//Function for listing product:
const listProduct = async (req, res) => {
    try {
        const products = await productModel.find({});
        res.json({
            success: true,
            products
        })
    } catch (err) {
        console.log(err);
        res.json({
            success: false,
            message: err.message
        })
    }
}

//Function for removing product:
const removeProduct = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.body.id);
        res.json({
            success: true,
            message: 'Product removed'
        })
    } catch (err) {
        console.log(err);
        res.json({
            success: false,
            message: err.message
        })
    }
}

//Function for single product info:
const singleProduct = async (req, res) => {
    try {
        const { productId } = req.body;
        const product = await productModel.findById(productId);
        res.json({
            success: true,
            product
        })
    } catch (err) {
        console.log(err);
        res.json({
            success: false,
            message: err.message
        })
    }
}

module.exports = {
    addProduct,
    listProduct,
    removeProduct,
    singleProduct
}