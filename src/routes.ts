import authRoutes from './modules/auth/auth.route';
import listRoutes from './modules/list/list.route';
import {Application} from 'express';

export default function routes (app: Application) {
    authRoutes(app);
    listRoutes(app);
}