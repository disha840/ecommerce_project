
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        // Cookie se token lena
        let token = null
        if(req.cookies.clientToken){
            token = req.cookies.clientToken
        }
        else{
            token = req.cookies.token
        }
// console.log("my token",token)
        // Token nahi mila
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Please login first"
            });
        }

        // Token verify karna
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Verified user ka data request mein rakhna
        req.user = decoded;

        // Agle middleware ya controller par jaana
        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};

module.exports = authMiddleware;
