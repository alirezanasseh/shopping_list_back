import expressLoader from './express.loader';
import mongooseLoader from './mongoose.loader';
import {Application} from 'express';

export default async function loader (app: Application) {
    try {
        await expressLoader(app);
        await mongooseLoader();
    } catch (e) {
        throw e;
    }
}