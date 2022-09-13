import {Request, Response, NextFunction} from 'express';
import * as RoleService from './role.service';

export async function role_create_controller (req: Request, res: Response, next: NextFunction) {
    try {
        const result = await RoleService.role_create_service(req.body);
        if (result.result) {
            res.status(result.code).json(result.result);
        } else if (result.error) {
            res.status(result.code).json({message: result.error});
        }
    } catch (e) {
        return next(e);
    }
}