import authRoutes from './modules/auth/auth.route';
import listRoutes from './modules/list/list.route';
import {Application} from 'express';
import {errors} from 'celebrate';

export default function routes (app: Application) {
    authRoutes(app);
    listRoutes(app);

    app.use(errors());
}