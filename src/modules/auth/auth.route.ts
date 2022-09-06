import {Router} from 'express';
import * as Controller from './auth.controller';
import {celebrate} from 'celebrate';
import {authLoginSchema, authRegisterSchema} from './auth.validator';

export default function authRoutes (app: Router) {
    const route = Router();
    app.use('/auth', route);

    route.post('/register', celebrate(authRegisterSchema), Controller.register);

    route.post('/login', celebrate(authLoginSchema), Controller.login);
}
