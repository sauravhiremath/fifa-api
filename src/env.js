import dotenv from 'dotenv';
dotenv.config();

export let host = '';
export let TURN_INTERVAL = 0;
if (process.env.NODE_ENV === 'production') {
    host = 'https://fifa.sauravmh.me';
    TURN_INTERVAL = 30 * 1000;
} else {
    host = 'http://localhost:3000';
    TURN_INTERVAL = 10 * 1000;
}

export const API_PORT = 3003;
export const API_KEY = 'example-secret-here';
export const SALT_ROUNDS = 10;
export const DB_URL = 'mongodb://localhost:27017/fifa';
export const ROOM_ID_RX = /^([A-Z0-9]){6}$/;
// Export const ALGOLIA_ID = 'latency';
// export const ALGOLIA_SEARCH_API_KEY = '6be0576ff61c053d5f9a3225e2a90f76';
// export const ALGOLIA_INDEX_NAME = 'bestbuy';

export const { ALGOLIA_ID, ALGOLIA_SEARCH_API_KEY, ALGOLIA_INDEX_NAME } = process.env;
export const ATTRIBUTES_TO_RETRIEVE = ['name', 'positions', 'Overall Rating', 'Skill Moves', 'objectID', 'photo_url'];

// Export const corsOptions = (req, res) => {
//     const headers = {
//         'Access-Control-Allow-Headers': 'Content-Type, Authorization',
//         'Access-Control-Allow-Origin': '*', // Or the specific origin you want to give access to,
//         'Access-Control-Allow-Credentials': true
//     };
//     res.writeHead(200, headers);
//     res.end();
// };
