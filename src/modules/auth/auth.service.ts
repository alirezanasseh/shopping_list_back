import jwt from 'jsonwebtoken';
import {IUser} from '../user';

export function generateToken(user: IUser) {
    // Set token expiration date to 60 days
    const exp = Date.now() + 60 * 24 * 3600 * 1000;

    return jwt.sign({
        _id: user._id,
        name: user.name.trim(),
        exp
    }, process.env.SECRET || '', {
        algorithm: 'HS256'
    });
}