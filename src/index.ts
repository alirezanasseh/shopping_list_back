import {Request, Response} from 'express';
import app from './loaders/express.loader';
import {config} from './config';

app.get('/', (req: Request, res: Response) => {
    res.json({status: 1});
});

app.listen(config.port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${config.port}`);
});