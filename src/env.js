export let host = '';
if (process.env.NODE_ENV === 'production') {
    host = 'https://fifa.sauravmh.me';
} else {
    host = `http://localhost:${process.env.PORT}`;
}

export const API_PORT = 3003;
export const API_KEY = 'example-secret-here';
export const DB_URL = 'mongodb://localhost:27017/fifa';
export const ROOM_ID_RX = /^#([A-Z0-9]){6}$/;

export const corsOptions = (req, res) => {
    const headers = {
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Origin': host, // Or the specific origin you want to give access to,
        'Access-Control-Allow-Credentials': true
    };
    res.writeHead(200, headers);
    res.end();
};
