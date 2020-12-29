import dotenv from 'dotenv';
dotenv.config();

export const {
    ALGOLIA_ID,
    ALGOLIA_SEARCH_API_KEY,
    ALGOLIA_INDEX_NAME,
    DB_URL,
    API_PORT,
    API_KEY,
    SALT_ROUNDS
} = process.env;

export const DB_URL_DEV = 'mongodb://localhost:27017/fifa.db';
export const MAX_TIMER_DEFAULT = 120 * 1000;
export const MAX_PLAYERS_DEFAULT = 14;

export let hosts = [];
if (process.env.NODE_ENV === 'production') {
    hosts = ['https://fifa.sauravmh.com', 'https://sauravmh.vercel.app'];
} else {
    hosts = ['http://localhost:3000'];
}

export const ROOM_ID_RX = /^([A-Z0-9]){6}$/;

export const ATTRIBUTES_TO_RETRIEVE = ['name', 'positions', 'Overall Rating', 'Skill Moves', 'objectID', 'photo_url'];
