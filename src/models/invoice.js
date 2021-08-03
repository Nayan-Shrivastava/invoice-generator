const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON } = require('../utils/utils');
const Role = require('../auth/role.enum');

const invoiceSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            trim: true,
            required: true,
            lowercase: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error('Email is invalid');
                }
            }
        },
        gender: {
            type: String,
            trim: true
        },
        mobile: {
            type: String,
            trim: true,
            minlength: 10,
            maxlength: 10
        },
        shippingAddress: {
            type: String,
            trim: true,
            maxlength: 250
        },
        products: [
            {
                productId: {
                    type: String,
                    required: true,
                    trim: true
                },
                title: {
                    type: String,
                    required: true,
                    trim: true
                },
                quantity: {
                    type: Number,
                    required: true
                },
                price: {
                    type: Number,
                    required: true
                },
                tax: {
                    type: Number,
                    required: true
                }
            }
        ],
        cashier: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        }
    },
    {
        timestamps: true
    }
);

const Invoice = mongoose.model('Invoice', invoiceSchema);

module.exports = Invoice;
