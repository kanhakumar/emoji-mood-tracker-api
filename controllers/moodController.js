const { Op } = require("sequelize");
const shortid = require("shortid");
const { MoodEntryTable, SharedLinkTable, convertDateToSequelizeDateOnly, UserTable } = require("../db");
const { EmojiEnums } = require("../models/moodEntry");
const ErrorMessage = require("../utils/errorMessages");
const frequentlyUsedEmoji = require("../utils/dataProcessor");


module.exports = {
    logMood: (req, res, next) => {
        try {
            const userId = req.auth_user.userId;
            const { emoji, note } = req.body;
            if (!EmojiEnums.includes(emoji)) {
                return res.status(400).send({ success: false, message: ErrorMessage.INVALID_EMOJI });
            }
            MoodEntryTable.create({ emoji, note, userId }).then((mood) => {
                return res.status(200).send({ success: true, mood });
            }).catch((err) => {
                if (err.name === 'SequelizeUniqueConstraintError') {
                    return res.status(409).send({ success: false, message: ErrorMessage.MOOD_EXISTS });
                }
                return next(err);
            })

        } catch (e) {
            return next(e);
        }
    },
    updateMood: (req, res, next) => {
        try {
            const userId = req.auth_user.userId;
            const { emoji, note, date } = req.body;
            if (!date) {
                return res.status(400).send({ success: false, message: ErrorMessage.DATE_MISSING });
            }
            const sequelizedDateOnly = convertDateToSequelizeDateOnly(date);
            const updateMood = {};
            if (emoji) {
                if (!EmojiEnums.includes(emoji)) {
                    return res.status(400).send({ success: false, message: ErrorMessage.INVALID_EMOJI });
                }
                updateMood.emoji = emoji;
            }
            if (note) {
                updateMood.note = note;
            }

            MoodEntryTable.update(
                { emoji: updateMood.emoji, note: updateMood.note },
                { returning: true, where: { userId, date: sequelizedDateOnly.val } }
            ).then(([_, [mood]]) => {
                if (!mood) {
                    return res.status(404).send({ success: false, message: ErrorMessage.MOOD_NOT_FOUND });
                }
                return res.status(200).send({ success: true, mood });
            }).catch(next);

        } catch (e) {
            return next(e);
        }
    },
    deleteMood: (req, res, next) => {
        try {
            const userId = req.auth_user.userId;
            const date = convertDateToSequelizeDateOnly(req.headers.date).val;

            MoodEntryTable.destroy({ where: { userId, date } })
                .then(() => {
                    return res.status(200).send({ success: true });
                }).catch(next);

        } catch (e) {
            return next(e);
        }
    },
    monthlySummary: (req, res, next) => {
        try {
            const userId = req.auth_user.userId;
            const { targetMonth, targetYear } = req.body;

            const startDate = new Date(targetYear, targetMonth - 1, 1);
            const endDate = new Date(targetYear, targetMonth, 0);

            MoodEntryTable.findAll({
                where: {
                    userId,
                    date: {
                        [Op.between]: [startDate, endDate],
                    },
                }
            }).then((moodEntries) => {
                const frequentlyUsedMood = frequentlyUsedEmoji(moodEntries)[0][1];
                delete frequentlyUsedMood.frequency;
                return res.status(200).send({ success: true, moodEntries, frequentlyUsedMood });
            }).catch(next);
        } catch (e) {
            return next(e);
        }
    },
    emojiStatistics: (req, res, next) => {
        try {
            const { emoji, startDate, endDate } = req.body;

            if (startDate) {
                startDate = convertDateToSequelizeDateOnly(startDate).val;
            }
            if (endDate) {
                endDate = convertDateToSequelizeDateOnly(endDate).val;
            }

            const whereCondition = {
                emoji,
                date: {},
            };

            if (startDate && endDate) {
                whereCondition.date[Op.between] = [startDate, endDate];
            } else if (startDate) {
                whereCondition.date[Op.gte] = startDate;
            } else if (endDate) {
                whereCondition.date[Op.lte] = endDate;
            }

            MoodEntryTable.findAll({
                where: whereCondition,
            }).then((moodEntries) => {
                const frequentlyUsedMood = frequentlyUsedEmoji(moodEntries)[0][1];
                return res.status(200).send({ success: true, emoji, emojiFrequency: frequentlyUsedMood.frequency });
            }).catch(next);
        } catch (e) {
            return next(e);
        }
    },
    retriveMoods: (req, res, next) => {
        try {
            const userId = req.auth_user.userId;
            const { startDate, endDate } = req.body;
            if (startDate) {
                startDate = convertDateToSequelizeDateOnly(startDate).val;
            }
            if (endDate) {
                endDate = convertDateToSequelizeDateOnly(endDate).val;
            }

            const whereCondition = {
                userId,
                date: {},
            };

            if (startDate && endDate) {
                whereCondition.date[Op.between] = [startDate, endDate];
            } else if (startDate) {
                whereCondition.date[Op.gte] = startDate;
            } else if (endDate) {
                whereCondition.date[Op.lte] = endDate;
            }

            MoodEntryTable.findAll({
                where: whereCondition,
            }).then((moodEntries) => {
                return res.status(200).send({ success: true, moodEntries });
            }).catch(next);

        } catch (e) {
            return next(e);
        }
    },
    publicMoods: (req, res, next) => {
        try {
            MoodEntryTable.findAll().then((moodEntries) => {
                const processedMoods = frequentlyUsedEmoji(moodEntries);
                return res.status(200).send({ success: true, processedMoods });
            })
        } catch (e) {
            return next(e);
        }
    },
    shareLink: (req, res, next) => {
        try {
            const userId = req.auth_user.userId;
            const { startDate, endDate } = req.body;
            const linkId = shortid.generate();
            SharedLinkTable.create({ linkId, userId, startDate, endDate }).then(() => {
                return res.status(200).send({ success: true, linkId });
            }).catch((err) => {
                if (err.name == 'SequelizeUniqueConstraintError') {
                    return res.status(500).send({ success: false, err });
                }
                return next(err);
            });
        } catch (e) {
            return next(e);
        }
    },
    getSharedMoodData: (req, res, next) => {
        try {
            const linkId = req.params.linkId;
            SharedLinkTable.findOne({ where: { linkId } }).then((sharedLink) => {
                if (!sharedLink) {
                    return res.status(404).send({ success: false, message: ErrorMessage.LINK_NOT_FOUND });
                }
                UserTable.findByPk(sharedLink.userId).then((user) => {
                    if (!user.sharinglink) {
                        return res.status(403).send({ success: false, message: ErrorMessage.USER_FORBIDDEN });
                    }
                    const { startDate, endDate } = sharedLink;
                    if (startDate) {
                        startDate = convertDateToSequelizeDateOnly(startDate).val;
                    }
                    if (endDate) {
                        endDate = convertDateToSequelizeDateOnly(endDate).val;
                    }

                    const whereCondition = {
                        userId: sharedLink.userId,
                        date: {},
                    };

                    if (startDate && endDate) {
                        whereCondition.date[Op.between] = [startDate, endDate];
                    } else if (startDate) {
                        whereCondition.date[Op.gte] = startDate;
                    } else if (endDate) {
                        whereCondition.date[Op.lte] = endDate;
                    }

                    MoodEntryTable.findAll({
                        where: whereCondition,
                    }).then((moodEntries) => {
                        return res.status(200).send({ success: true, moodEntries });
                    }).catch(next);
                }).catch(next);
            }).catch(next);
        } catch (e) {
            return next(e);
        }
    }
}