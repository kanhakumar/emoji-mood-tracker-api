const { Sequelize } = require('sequelize');
const config = require('../config');
const UserSchema = require('../models/user');
const { MoodEntrySchema } = require('../models/moodEntry');

const db = new Sequelize(config.development.database, config.development.username, config.development.password, {
    host: config.development.host,
    dialect: config.development.dialect, // You can choose a different database dialect (e.g., postgres, sqlite)
    define: {
        timestamps: false, // Disable Sequelize's automatic timestamp fields (createdAt, updatedAt)
    },
    logging: false
});

const convertDateToSequelizeDateOnly = (date) => {
    return db.literal(`${date}`);
}
const UserTable = db.define('user', UserSchema);
const MoodEntryTable = db.define('mood-entry', MoodEntrySchema(UserTable));

UserTable.hasMany(MoodEntryTable);
MoodEntryTable.belongsTo(UserTable);

module.exports = { db, UserTable, MoodEntryTable, convertDateToSequelizeDateOnly };