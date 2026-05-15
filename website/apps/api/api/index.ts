import { bootstrap } from '../src/main';

let cachedServer;

export default async (req, res) => {
    if (!cachedServer) {
          cachedServer = await bootstrap();
    }
    return cachedServer(req, res);
};

