import algoliasearch from 'algoliasearch/lite.js';
import consola from 'consola';

import { config } from '../config.js';

const searchController = {
  search: async (request, response) => {
    const { requests } = request.body;

    const client = algoliasearch(config.ALGOLIA_ID, config.ALGOLIA_SEARCH_API_KEY);

    try {
      const results = await client.search(requests);
      response.status(200).send(results);
    } catch (error) {
      consola.error({
        custom: {
          message: 'Algolia Error. Kindly check Algolia API keys!',
          ALGOLIA_ID: config.ALGOLIA_ID,
          ALGOLIA_SEARCH_API_KEY: config.ALGOLIA_SEARCH_API_KEY,
        },
        error,
      });
    }
  },
};

export default searchController;
