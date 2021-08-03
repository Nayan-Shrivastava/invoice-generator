const express = require('express');
const router = new express.Router();
const auth = require('../auth/authenticate');
const hasRole = require('../auth/authorize');
const Role = require('../auth/role.enum');
const Invoice = require('../models/invoice');
const {
    processProductsArray,
    processInvoice
} = require('../utils/invoiceHelper');
const {
    errorResponses,
    messageResponses,
    responseHandler
} = require('../utils/responseHandler');

router.post(
    '/create',
    auth,
    hasRole([Role.Superadmin, Role.Admin]),
    async (req, res) => {
        try {
            req.body.products = processProductsArray(req.body.products);
            const invoice = new Invoice({
                ...req.body,
                cashier: req.user._id
            });

            await invoice.save();
            
            responseHandler(req, res, 201, null, { processInvoice(invoice) });
        } catch (e) {
            responseHandler(req, res, 400, e);
        }
    }
);

router.get(
    '/:id',
    auth,
    hasRole([Role.Superadmin, Role.Admin]),
    async (req, res) => {
        try {
            const id = req.params.id;
            const invoice = await Invoice.findById(id);

            if (!invoice) responseHandler(req, res, 404);

            responseHandler(req, res, 201, null, { invoice });
        } catch (e) {
            responseHandler(req, res, 400, e);
        }
    }
);

module.exports = router;
