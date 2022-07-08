const User = require('../models/User');
const jwt = require('jsonwebtoken')
const { UnauthenticatedError } = require('../errors')
const auth = async (req, res, next) => {
    // Check header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthenticatedError('Authentication invalid')
    }
    const token = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { userId: payload.userId, name: payload.name };
        // other way to stick the data to req obj
        // const user = await User.findById(payload.userId).select('-password')
        // req.user = user

        next()
    } catch (error) {
        throw new UnauthenticatedError('Authentication Invalid');
    }
}
module.exports = auth