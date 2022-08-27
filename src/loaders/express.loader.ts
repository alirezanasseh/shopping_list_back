import express, {Application} from 'express';
import cookieParser from 'cookie-parser';
import routes from '../routes';

export default function expressLoader (app: Application) {
    app.use(express.json());
    app.use(express.urlencoded({
        extended: true
    }));
    app.use(cookieParser());
    routes(app);
}