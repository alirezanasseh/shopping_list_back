import {Request, Response} from 'express';
import {randomBytes} from 'crypto';
import argon2 from 'argon2';
import {IUser, User} from '../user';
import {generateToken} from './index';
import {Router} from 'express';

export default function authRoutes (app: Router) {
    const route = Router();
    app.use('/auth', route);

    route.post('/register', async (req: Request, res: Response) => {
        // req.body : {name, email, password}
        let {name, email, password} = req.body;
        // Checking for repeated email
        const user = await User.find({email}).lean(); // {email: email}
        if (user && user.length > 0) {
            res.status(400).json({error: {message: 'Email is already registered'}});
        } else {
            // Hashing password
            const argonSalt = randomBytes(32);
            password = await argon2.hash(password, {salt: argonSalt});
            const salt = argonSalt.toString('hex');

            // Creating user
            const newUser = await User.create({name, email, password, salt});

            if (newUser) {
                res.json({status: true, id: newUser._id});
            } else {
                res.status(500).json({error: {message: 'User not created'}});
            }
        }
    });

    route.post('/login', async (req: Request, res: Response) => {
        // req.body : {email, password}
        const {email, password} = req.body;
        const user = await User.findOne({email}).lean();
        if (user) {
            if (await argon2.verify(user.password, password)) {
                const returnUser: Partial<IUser> = {...user};
                delete returnUser.password;
                delete returnUser.salt;
                const token = generateToken(user);
                res.cookie('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production'
                }).json({user: returnUser});
            } else {
                res.status(401).json({error: {message: 'Invalid credentials'}});
            }
        } else {
            res.status(401).json({error: {message: 'Invalid credentials'}});
        }
    });
}
