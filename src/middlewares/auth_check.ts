import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import {IJWTPayload} from '../modules/auth';
import {config} from '../config';
import {User} from '../modules/user';

export async function AuthCheckMiddleware (req: Request, res: Response, next: NextFunction) {
    try {
        if (req.cookies && req.cookies.token) {
            const decoded = jwt.verify(req.cookies.token, config.secret, {
                algorithms: ['HS256']
            }) as IJWTPayload;
            if (decoded.exp < Date.now()) {
                res.clearCookie('token', {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production'
                }).status(403).json({error: {message: 'Access denied'}});
            } else {
                const user = await User.findById(decoded._id).lean();
                if (user) {
                    req.currentUser = user;
                    next();
                } else {
                    res.clearCookie('token', {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production'
                    }).status(403).json({error: {message: 'Access denied'}});
                }
            }
        } else {
            res.status(403).json({error: {message: 'Access denied'}});
        }
    } catch (e) {
        return next(e);
    }
}