const { Sequelize } = require('sequelize');
const config = require('../config');
const UserSchema = require('../models/user');
const { MoodEntrySchema } = require('../models/moodEntry');
const SharedLinkSchema = require('../models/sharedLinks');

const db = new Sequelize(config.development.database, config.development.username, config.development.password, {
    host: config.development.host,
    dialect: config.development.dialect,
    define: {
        timestamps: false,
    },
    logging: false
});

//converting the data into sequelize form
const convertDateToSequelizeDateOnly = (date) => {
    return db.literal(`${date}`);
}
const UserTable = db.define('user', UserSchema);
const MoodEntryTable = db.define('mood-entry', MoodEntrySchema(UserTable));
const SharedLinkTable = db.define('shared-link', SharedLinkSchema(UserTable));

UserTable.hasMany(MoodEntryTable);
UserTable.hasMany(SharedLinkTable);
MoodEntryTable.belongsTo(UserTable);
SharedLinkTable.belongsTo(UserTable);

module.exports = { db, UserTable, MoodEntryTable, SharedLinkTable, convertDateToSequelizeDateOnly };