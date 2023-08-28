const { EmojiEnums } = require("../models/moodEntry");

//helper function to map the mood log data into emoji enums we have to calculate the frequency of that emoji
const frequentlyUsedEmoji = (moodEntries) => {
    const emojiMap = new Map();
    EmojiEnums.forEach((emoji) => {
        const emojiObject = {};
        emojiObject.emoji = emoji;
        emojiObject.frequency = 0;
        emojiObject.note = "";
        emojiMap.set(emoji, emojiObject);
    });
    moodEntries.forEach((mood) => {
        const temp = emojiMap.get(mood.emoji);
        temp.frequency += 1;
        temp.note = mood.note;
    })
    const emojiList = Array.from(emojiMap);
    emojiList.sort((a, b) => b[1].frequency - a[1].frequency);
    return emojiList;
}

module.exports = frequentlyUsedEmoji;