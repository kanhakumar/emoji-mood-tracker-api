const { DataTypes } = require('sequelize');

const UserSchema = {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [3, 10]
        },
        unique: true
    },
    hash: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    salt: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    sharinglink: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
};

module.exports = UserSchema;