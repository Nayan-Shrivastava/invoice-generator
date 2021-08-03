const User = require('../models/user');
const express = require('express');
const router = new express.Router();
const {
    errorResponses,
    messageResponses,
    responseHandler
} = require('../utils/responseHandler');
const auth = require('../auth/authenticate');
const hasRole = require('../auth/authorize');
const Role = require('../auth/role.enum');

router.post('/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(
            req.body.userId,
            req.body.password
        );
        if (!user.changedDefaultPassword) {
            responseHandler(
                req,
                res,
                401,
                'Please reset your password once to login'
            );
        } else {
            const token = await user.generateAuthToken();
            responseHandler(req, res, 200, undefined, { user, token });
        }
    } catch (e) {
        responseHandler(req, res, 400, e);
    }
});

router.post(
    '/create-user',
    auth,
    hasRole([Role.Superadmin, Role.Admin]),
    async (req, res) => {
        const user = new User(req.body);
        try {
            if (
                user.role === Role.Superadmin ||
                (user.role === Role.Admin && req.user.role !== Role.Superadmin)
            ) {
                responseHandler(req, res, 403);
            }
            user.changedDefaultPassword = false;
            await user.save();
            if (user.email) {
                //sendWelcomeEmail(user.email, user.name);
            }

            responseHandler(req, res, 201, undefined, { user });
        } catch (e) {
            responseHandler(req, res, 400, e);
        }
    }
);

router.post('/reset-password', async (req, res) => {
    try {
        const newPassword = req.body.newPassword;
        const user = await User.findByCredentials(
            req.body.userId,
            req.body.password
        );

        // reflecting that password has been reset once
        if (!user.changedDefaultPassword) {
            user.changedDefaultPassword = true;
        }
        user.password = newPassword;
        user.save();
        responseHandler(req, res, 200);
    } catch (e) {
        responseHandler(req, res, 400, e);
    }
});

router.get(
    '/get-user/:id',
    auth,
    hasRole([Role.Superadmin, Role.Admin]),
    async (req, res) => {
        try {
            const userId = req.params.id;
            const user = await User.findById(userId);

            if (!user) {
                responseHandler(req, res, 404);
            }

            if (
                user.role === Role.Superadmin ||
                (user.role === Role.Admin && req.user.role !== Role.Superadmin)
            ) {
                responseHandler(req, res, 403);
            }

            responseHandler(req, res, 200, undefined, { user });
        } catch (e) {
            responseHandler(req, res, 500);
        }
    }
);

router.patch(
    '/make-admin',
    auth,
    hasRole([Role.Superadmin]),
    async (req, res) => {
        try {
            const userId = req.body.userId;
            const user = await User.findById(userId);

            if (!user) {
                responseHandler(req, res, 404);
            }

            if (user.role === Role.Superadmin) {
                responseHandler(req, res, 403);
            }

            if (user.role === Role.Cashier) {
                user.role = Role.Admin;
                user.save();
            }
            responseHandler(req, res, 200);
        } catch (e) {
            responseHandler(req, res, 500);
        }
    }
);

// to remove admin rights cashier
router.patch(
    '/remove-admin',
    auth,
    hasRole([Role.Superadmin]),
    async (req, res) => {
        try {
            const userId = req.body.userId;
            const user = await User.findById(userId);

            if (!user) {
                responseHandler(req, res, 404);
            }

            if (user.role === Role.Superadmin) {
                responseHandler(req, res, 403);
            }

            if (user.role === Role.Admin) {
                user.role = Role.Cashier;
                user.save();
            }
            responseHandler(req, res, 200);
        } catch (e) {
            responseHandler(req, res, 500);
        }
    }
);

router.delete(
    '/delete-user/:id',
    auth,
    hasRole([Role.Superadmin, Role.Admin]),
    async (req, res) => {
        try {
            const userId = req.params.id;
            let user = await User.findById(userId);

            if (!user) {
                responseHandler(req, res, 404);
            }

            if (
                user.role === Role.Superadmin ||
                (user.role === Role.Admin && req.user.role !== Role.Superadmin)
            ) {
                responseHandler(req, res, 403);
            }

            user = await User.findOneAndDelete({ _id: userId });

            responseHandler(req, res, 200, undefined, { user });
        } catch (e) {
            responseHandler(req, res, 500, e);
        }
    }
);

module.exports = router;
