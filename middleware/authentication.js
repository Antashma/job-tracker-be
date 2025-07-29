const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");

const auth = async function(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new UnauthenticatedError("No valid token provided.")
    }

    const token = authHeader.split(" ")[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
            userId: payload.id, 
            email: payload.email,
            name: payload.displayName
        }
        next();

    } catch (err) {
        throw new UnauthenticatedError("No valid token provided.");
    }
}




module.exports = auth;