const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
    errorResponses,
    messageResponses,
    responseHandler
} = require('../utils/responseHandler');
const authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({
            _id: decoded._id,
            'tokens.token': token
        });

        if (!user) {
            responseHandler(req, res, 404);
        }

        req.token = token;
        req.user = user;
        next();
    } catch (e) {
        responseHandler(req, res, 401);
    }
};

module.exports = authenticate;
