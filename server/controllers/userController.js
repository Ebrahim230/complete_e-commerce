const userModel = require("../models/userModel");
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//Generate token: 
const createToken = (id,options={}) => {
    return jwt.sign({ id }, process.env.JWT_SECRET,options);
}

//User Login controller:
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.json({
                success: false,
                message: "All fields are required."
            });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({
                success: false,
                message: "User doesn't exist."
            });
        }

        const matchPass = await bcrypt.compare(password, user.password);

        if (!matchPass) {
            return res.json({
                success: false,
                message: "Password doesn't match."
            });
        }

        const token = createToken(user._id,{expiresIn: '30m'});

        return res.json({
            success: true,
            message: 'Logged in successfully.',
            token
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Server error. Please try again later."
        });
    }
};

//Register controller:
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existUser = await userModel.findOne({ email });
        if (existUser) {
            return res.json({
                success: false,
                message: 'User already exists.'
            })
        }
        if (!validator.isEmail(email)) {
            return res.json({
                success: false,
                message: 'Please enter a valid email.'
            })
        }
        if (password.length < 8) {
            return res.json({
                success: false,
                message: 'Please enter a strong password.'
            })
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        });
        const user = await newUser.save();
        res.json({
            success: true,
            message:'Registered Successfully. Now you can log in.'
        })
    } catch (err) {
        console.log(err);
        res.json({
            success: false,
            message: err.message
        })
    }
}

//Admin login:
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASS) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET);
            res.json({
                success: true,
                token
            })
        } else {
            res.json({
                success: false,
                message: 'Invalid credentials.'
            })
        }
    } catch (err) {
        console.log(err);
        res.json({
            success: false,
            message: err.message
        })
    }
}

module.exports = { loginUser, registerUser, adminLogin };