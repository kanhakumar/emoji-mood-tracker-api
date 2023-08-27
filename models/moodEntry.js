const { DataTypes } = require('sequelize');

const EmojiEnums = ['happy', 'sad', 'angry'];

const MoodEntrySchema = (UserTable) => ({
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        primaryKey: true
    },
    emoji: {
        type: DataTypes.ENUM,
        values: EmojiEnums,
        allowNull: false,
    },
    note: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: UserTable,
            key: 'id',
        },
        primaryKey: true
    },
});

module.exports = { MoodEntrySchema, EmojiEnums };