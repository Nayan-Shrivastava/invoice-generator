const {
    errorResponses,
    messageResponses,
    responseHandler
} = require('../utils/responseHandler');
const hasRole = (roles = []) => {
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return (req, res, next) => {
        if (roles.length && !roles.includes(req.user.role)) {
            // user's role is not authorized
            responseHandler(req, res, 401);
        }

        // authentication and authorization successful
        next();
    };
};

module.exports = hasRole;
