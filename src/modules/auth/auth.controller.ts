import {Request, Response, NextFunction} from 'express';
import {register_service, login_service} from './auth.service';

export async function register (req: Request, res: Response, next: NextFunction) {
    try {
        const result = await register_service(req.body);
        if (result.result) {
            res.status(result.code).json(result.result);
        } else if (result.error) {
            res.status(result.code).json({message: result.error});
        }
    } catch (e) {
        return next(e);
    }
}

export async function login (req: Request, res: Response, next: NextFunction) {
    try {
        const result = await login_service(req.body);
        if (result.result) {
            res.cookie('token', result.result.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production'
            }).json({user: result.result.user});
        } else if (result.error) {
            res.status(result.code).json({message: result.error});
        }
    } catch (e) {
        return next(e);
    }
}