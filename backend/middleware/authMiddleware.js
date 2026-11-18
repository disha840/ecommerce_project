
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    
    try {
        let token = null;

        if (req.cookies.clientToken) {
            token = req.cookies.clientToken;
        } else {
            token = req.cookies.token;
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Please login first"
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

    
        req.user = {
            id: decoded.id,
            role: decoded.role,
            permissions: decoded.permissions
        };

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};

module.exports = authMiddleware;