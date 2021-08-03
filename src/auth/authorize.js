const hasRole = (roles = []) => {
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return (req, res, next) => {
        if (roles.length && !roles.includes(req.user.role)) {
            // user's role is not authorized
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // authentication and authorization successful
        next();
    };
};

module.exports = hasRole;
