const { DataTypes } = require('sequelize');

const SharedLinkSchema = (UserTable) => ({
    linkId: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
    },
    startDate: {
        type: DataTypes.DATEONLY,
    },
    endDate: {
        type: DataTypes.DATEONLY,
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: UserTable,
            key: 'id',
        },
    },
});

module.exports = SharedLinkSchema;