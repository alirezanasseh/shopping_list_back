import authRoutes from './modules/auth/auth.route';
import listRoutes from './modules/list/list.route';
import roleRoutes from './modules/role/role.route';
import {Application} from 'express';
import {errors} from 'celebrate';

export default function routes (app: Application) {
    authRoutes(app);
    listRoutes(app);
    roleRoutes(app);

    app.use(errors());
}