const express = require('express');
const moment = require('moment');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const router = new express.Router();
const auth = require('../auth/authenticate');
const hasRole = require('../auth/authorize');
const Role = require('../auth/role.enum');
const Invoice = require('../models/invoice');
const { sendInvoicePDF } = require('../emails/account');
const { pdfHandler } = require('../emails/pdfHandler');
const {
    processProductsArray,
    processInvoice
} = require('../utils/invoiceHelper');
const { logger } = require("../logger/logger");
const {
    errorResponses,
    messageResponses,
    responseHandler
} = require('../utils/responseHandler');

router.post(
    '/create',
    auth,
    hasRole([Role.Superadmin, Role.Admin, Role.Cashier]),
    async (req, res) => {

        try {
            req.body.products = processProductsArray(req.body.products);
            const invoice = new Invoice({
                ...req.body,
                cashier: req.user._id
            });

            await invoice.save();

            responseHandler(req, res, 201, null, {
                invoice: processInvoice(invoice)
            });
        } catch (e) {
            responseHandler(req, res, 400, e);
        }
    }
);

// Get /invoice?cashier=id
// Get /invoice?limit=10&skip=20
// Get /invoice?previous= today || lastwek
router.get(
    '/get',
    auth,
    hasRole([Role.Superadmin, Role.Admin, Role.Cashier]),
    async (req, res) => {
        const match = {};
        const createdAt = {};

        if (req.user.role === Role.Cashier) req.query.cashier = req.user._id;
        if (req.query.date) {
            if (req.query.date === 'today') {
                createdAt['$gte'] = moment().startOf('day');
                createdAt['$lte'] = moment().endOf('day');
                match.createdAt = createdAt;
            } else if (req.query.date === 'lastweek') {
                createdAt['$gte'] = moment().startOf('week');
                createdAt['$lte'] = moment().endOf('week');
                match.createdAt = createdAt;
            } else {
                responseHandler(
                    req,
                    res,
                    400,
                    'Query date can be today or lastweek only'
                );
            }
        }

        if (req.query.cashier) {
            if (mongoose.Types.ObjectId.isValid(req.query.cashier)) {
                match.cashier = req.query.cashier;
            } else {
                responseHandler(req, res, 400, 'invalid cashier id');
                return;
            }
        }

        const sort = {
            createdAt: -1
        };

        try {
            var invoices = await Invoice.find(match)
                .sort(sort)
                .skip(parseInt(req.query.skip))
                .limit(parseInt(req.query.limit));

            if (!invoices) responseHandler(req, res, 404);

            invoices = JSON.parse(JSON.stringify(invoices));
            let totalTax = 0;
            let totalPrice = 0;
            let totalAmount = 0;
            invoices = invoices.map((invoice) => {
                invoice = processInvoice(invoice);
                totalTax += invoice.totalTax;
                totalPrice += invoice.totalPrice;
                totalAmount = invoice.totalAmount;
                return invoice;
            });

            responseHandler(req, res, 201, null, {
                invoices,
                totalTax,
                totalPrice,
                totalAmount
            });
        } catch (e) {
            
            responseHandler(req, res, 500);
        }
    }
);

router.get('/get/:id', auth, hasRole([]), async (req, res) => {
    //console.log(req);
    try {
        const id = req.params.id;
        const invoice = await Invoice.findById(id);

        if (!invoice) responseHandler(req, res, 404);

        if (req.user.role === Role.Cashier && invoice.cashier !== req.user.role)
            responseHandler(req, res, 403);

        responseHandler(req, res, 201, null, {
            invoice: processInvoice(invoice)
        });
    } catch (e) {
        responseHandler(req, res, 400,'invalid invoice Id');
    }
});

router.post('/send-invoice-email', auth, hasRole([]), async (req, res) => {
    try {
        const id = req.body.invoiceId;
        const invoice = await Invoice.findById(id);

        if (!invoice) responseHandler(req, res, 404);

        if (req.user.role === Role.Cashier && invoice.cashier !== req.user.role)
            responseHandler(req, res, 403);

        pdfHandler(processInvoice(invoice));
        responseHandler(req, res, 201, null, {
            invoice: processInvoice(invoice)
        });
    } catch (e) {
        responseHandler(req, res, 400, e);
    }
});

module.exports = router;
