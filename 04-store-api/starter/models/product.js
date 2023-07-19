const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Product must be provided"],
    },
    price: {
        type: Number,
        required: [true, "Price must be provided"],
    },
    featured: {
        type: Boolean,
        default: false,
    },
    ratings: {
        type: Number,
        default: 4.5,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    company: {
        type: String,
        enum: {
            values: ["ikea", "liddy", "caressa", "marcos", "concac"],
            message: "{VALUE} is not valid",
        },
    },
});

module.exports = mongoose.model("Product", productSchema);
