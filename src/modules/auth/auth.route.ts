import {Router} from 'express';
import * as Controller from './auth.controller';

export default function authRoutes (app: Router) {
    const route = Router();
    app.use('/auth', route);

    route.post('/register', Controller.register);

    route.post('/login', Controller.login);
}
