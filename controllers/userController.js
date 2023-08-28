const { UserTable } = require("../db");
const { setPassword, validPassword, getToken } = require("../utils/authUtils");
const ErrorMessage = require("../utils/errorMessages");

module.exports = {
    addUser: async (req, res, next) => {
        try {
            const { username, password } = req.body;
            const { salt, hash } = setPassword(password);
            UserTable.create({ username, salt, hash }).then((user) => {
                const addedUser = user.toJSON();
                delete addedUser.salt;
                delete addedUser.hash;
                return res.status(200).send({ success: true, addedUser });
            }).catch((err) => {
                if (err.name === 'SequelizeUniqueConstraintError') {
                    return res.status(409).send({ success: false, message: ErrorMessage.USER_EXISTS });
                }
                return next(e);
            });
        } catch (e) {
            return next(e);
        }
    },
    updateSharingOption: (req, res, next) => {
        try {
            const id = req.auth_user.userId;
            const { sharinglink } = req.body;
            UserTable.update(
                { sharinglink },
                { returning: true, where: { id } }
            ).then(([_, [updatedUserDetails]]) => {
                if (!updatedUserDetails) {
                    return res.status(404).send({ success: false, message: ErrorMessage.USER_NOT_FOUND });
                }
                updatedUserDetails = updatedUserDetails.toJSON();
                delete updatedUserDetails.salt;
                delete updatedUserDetails.hash;
                return res.status(200).send({ success: true, updatedUserDetails });
            }).catch(next);
        } catch (e) {
            return next(e);
        }
    },
    login: async (req, res, next) => {
        try {
            const { username, password } = req.body;
            UserTable.findOne({ where: { username } }).then((user) => {
                if (!user) {
                    return res.status(404).send({ success: false, message: ErrorMessage.USER_NOT_FOUND });
                }
                const isValidCredentials = validPassword(password, user.salt, user.hash);
                if (!isValidCredentials) {
                    return res.status(401).send({ success: false, message: ErrorMessage.INVALID_PASSWORD });
                }
                const token = getToken(username, user.id);
                return res.status(200).send({ token, username });
            }).catch(next);
        } catch (e) {
            return next(e);
        }
    }
};