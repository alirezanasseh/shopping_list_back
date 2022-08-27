import express from 'express';
import loader from './loaders';
import {config} from './config';

async function startServer () {
    const app = express();
    await loader(app);

    app.listen(config.port, () => {
        console.log(`Server is running on port ${config.port}`);
    }).on('error', () => {
        process.exit(1);
    });
}

startServer().then();