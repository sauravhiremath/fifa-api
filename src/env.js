import dotenv from 'dotenv';
dotenv.config();

export const {
    ALGOLIA_ID,
    ALGOLIA_SEARCH_API_KEY,
    ALGOLIA_INDEX_NAME,
    DB_NAME,
    MONGO_PASSWORD,
    API_PORT,
    API_KEY,
    SALT_ROUNDS
} = process.env;

export const DB_URL = `mongodb+srv://saurav:${MONGO_PASSWORD}@fifa.ejduy.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;

export let hosts = [];
export let MAX_TIMER_DEFAULT = 0;
if (process.env.NODE_ENV === 'production') {
    hosts = ['https://fifa.sauravmh.com', 'https://sauravmh.vercel.app'];
    MAX_TIMER_DEFAULT = 5 * 60 * 1000;
} else {
    hosts = ['http://localhost:3000'];
    MAX_TIMER_DEFAULT = 10 * 1000;
}

export const ROOM_ID_RX = /^([A-Z0-9]){6}$/;

export const ATTRIBUTES_TO_RETRIEVE = ['name', 'positions', 'Overall Rating', 'Skill Moves', 'objectID', 'photo_url'];
