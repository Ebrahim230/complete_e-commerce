const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    description:{
        type:String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    image:{
        type: Array,
        required: true
    },
    category:{
        type: String,
        required: true
    },
    subCategory:{
        type: String,
        required: true
    },
    sizes:{
        type: Array,
        required: true
    },
    bestSeller:{
        type: Boolean
    },
    date:{
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('Product',productSchema);