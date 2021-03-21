import dotenv from 'dotenv';
import axios from 'axios';
import consola from 'consola';
dotenv.config();

export const {
    ALGOLIA_ID,
    ALGOLIA_SEARCH_API_KEY,
    ALGOLIA_INDEX_NAME,
    DB_URL_PROD,
    API_KEY,
    API_PORT,
    SOCKET_PORT,
    REDIS_PORT
} = process.env;

export const SALT_ROUNDS = 6;
export const DB_URL_DEV = 'mongodb://localhost:27017/fifa-db';
export const MAX_TIMER_DEFAULT = 120 * 1000;
export const MAX_PLAYERS_DEFAULT = 14;
export const REDIS_HOST = 'localhost';

export let hosts = [];
export let DB_URL;
if (process.env.NODE_ENV === 'production') {
    hosts = ['https://fifa.sauravmh.com', 'https://sauravmh.vercel.app'];
    DB_URL = DB_URL_PROD;
} else {
    hosts = ['http://localhost:3000'];
    DB_URL = DB_URL_DEV;
}

export const ROOM_ID_RX = /^([A-Z0-9]){6}$/;

export const ATTRIBUTES_TO_RETRIEVE = ['name', 'positions', 'Overall Rating', 'Skill Moves', 'objectID', 'photo_url'];

// In order to use websockets on App Engine, you need to connect directly to
// application instance using the instance's public external IP. This IP can
// be obtained from the metadata server.
const METADATA_NETWORK_INTERFACE_URL =
    'http://metadata/computeMetadata/v1/instance/network-interfaces/0/access-configs/0/external-ip';

export const getExternalIp = async () => {
    const options = {
        headers: {
            'Metadata-Flavor': 'Google'
        }
    };

    try {
        const res = await axios.get(METADATA_NETWORK_INTERFACE_URL, options);
        if (res.status !== 200) {
            consola.warn('Error while talking to metadata server, assuming localhost');
            return 'localhost';
        }

        return res.data.body;
    } catch (error) {
        consola.error(error, 'Error while talking to metadata server, assuming localhost');
        return 'localhost';
    }
};
