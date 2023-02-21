require('dotenv').config();

// config.js
module.exports = {
    app: {
        port: process.env.DEV_APP_PORT || 3000,
        appName: process.env.APP_NAME || 'iLrn',
        env: process.env.NODE_ENV || 'development',
    },
    db: {
        port: process.env.DB_PORT || 5432,
        database: process.env.DB_DATABASE,
        password: process.env.DB_PASSWORD,
        username: process.env.DB_USERNAME,
        host: process.env.DB_HOST,
        dialect: 'postgres',
        logging: true,
    },
    auth: {
        jwt_secret: process.env.JWT_SECRET,
        jwt_expiresin: process.env.JWT_EXPIRES_IN || '1d',
        saltRounds: process.env.SALT_ROUND || 10,
        refresh_token_secret: process.env.REFRESH_TOKEN_SECRET || 'VmVyeVBvd2VyZnVsbFNlY3JldA==',
        refresh_token_expiresin: process.env.REFRESH_TOKEN_EXPIRES_IN || '2d', // 2 days
    },
};
