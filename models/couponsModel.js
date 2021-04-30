const mongoose = require("mongoose");

const couponsSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        code: {
            type: String,
            required: true
        },
        discountPercent: {
            type: String,
            required: true
        },
        limitUsage: {
            type: String,
            required: true
        },
        isActive: {
            type: Boolean,
            required: true
        },
    },
    {
        timestamps: true,
    }
);

exports.Coupons = mongoose.model("Coupons", couponsSchema);
