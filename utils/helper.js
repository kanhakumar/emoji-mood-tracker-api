const { convertDateToSequelizeDateOnly } = require("../db");

//query filter for date
const createFilterQueryForDate = (startDate, endDate) => {
    if (startDate) {
        startDate = convertDateToSequelizeDateOnly(startDate).val;
    }
    if (endDate) {
        endDate = convertDateToSequelizeDateOnly(endDate).val;
    }

    const whereCondition = {
        date: {},
    };

    if (startDate && endDate) {
        whereCondition.date[Op.between] = [startDate, endDate];
    } else if (startDate) {
        whereCondition.date[Op.gte] = startDate;
    } else if (endDate) {
        whereCondition.date[Op.lte] = endDate;
    }
    return whereCondition;
}

module.exports = createFilterQueryForDate;