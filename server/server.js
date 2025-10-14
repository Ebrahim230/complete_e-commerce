const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const port = process.env.PORT || 4000;
const connectDB = require('./config/db');
const connectCloudinary = require('./config/cloudinary');
const userRouter = require('./routes/userRoutes');
const productRouter = require('./routes/productRoute');
const cartRouter = require('./routes/cartRoutes');
const orderRouter = require('./routes/orderRoutes');
connectDB();
connectCloudinary();

//middlewares:
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cors());

//API endpoints:
app.use('/api/user', userRouter);
app.use('/api/product',productRouter);
app.use('/api/cart',cartRouter);
app.use('/api/order',orderRouter);

app.listen(port,()=>{
    console.log(`Server running on: ${port}`);
});