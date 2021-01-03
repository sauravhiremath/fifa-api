import dotenv from 'dotenv';
import axios from 'axios';
import consola from 'consola';
dotenv.config();

export const { ALGOLIA_ID, ALGOLIA_SEARCH_API_KEY, ALGOLIA_INDEX_NAME, DB_URL, API_KEY, SALT_ROUNDS } = process.env;

export const API_PORT = 8080;
export const SOCKET_PORT = 65080;
export const DB_URL_DEV = 'mongodb://localhost:27017/fifa.db';
export const MAX_TIMER_DEFAULT = 120 * 1000;
export const MAX_PLAYERS_DEFAULT = 14;

export let hosts = [];
if (process.env.NODE_ENV === 'production') {
    hosts = ['https://fifa.sauravmh.com', 'https://sauravmh.vercel.app'];
} else {
    hosts = ['http://localhost:8080'];
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
        consola.warn(error, 'Error while talking to metadata server, assuming localhost');
        return 'localhost';
    }
};
