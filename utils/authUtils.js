const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const config = require("../config");
const ErrorMessage = require("./errorMessages");

//to encrypt the password into salt and hash to store it into database
const setPassword = (password) => {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);
    return { salt, hash };
}

//to check if the password is correct
const validPassword = (password, salt, hash) => {
    return hash === crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);
}

//to create a jsonwebtoken after successful login storing username and userid to retrieve when required
const getToken = (username, userId) => {
    if (!username || !userId) {
        throw Error('username missing');
    }
    var authKey = jwt.sign({
        username,
        userId,
        date: new Date()
    }, config.jwt_secret, {
        expiresIn: "1h"
    });
    return authKey;
}

//validating the token
const authenticateUser = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(498).send({ success: false, message: ErrorMessage.TOKEN_MISSING });
    }
    jwt.verify(token, config.jwt_secret, function (err, decoded) {
        if (err) {
            return res.status(498).send({ success: false, message: ErrorMessage.TOKEN_INVALID });
        } else {
            req.auth_user = decoded;
            next();
        }
    });
}

module.exports = { setPassword, validPassword, getToken, authenticateUser };