module.exports = {
    development: {
        username: 'postgres',
        password: 'postgres',
        database: 'emoji_mood_tracker_dev',
        host: 'localhost',
        dialect: 'postgres',
    },
    jwt_secret: 'mood-tracker'
    // Add configurations for other environments (e.g., production) as needed
};