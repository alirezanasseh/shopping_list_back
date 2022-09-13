import {Router} from 'express';
import * as Controller from './role.controller';
import {celebrate} from 'celebrate';
import {roleCreateSchema} from './role.validator';

export default function roleRoutes (app: Router) {
    const route = Router();
    app.use('/roles', route);

    route.post('/', celebrate(roleCreateSchema), Controller.role_create_controller);
    // route.get('/', Controller.role_read_many);
    // route.get('/:id', celebrate(roleGetOneSchema), Controller.role_read_many);
    // route.put('/:id', celebrate(roleUpdateSchema), Controller.role_update);
    // route.delete('/:id', celebrate(roleDeleteSchema), Controller.role_delete);
}