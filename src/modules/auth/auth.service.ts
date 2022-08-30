import jwt from 'jsonwebtoken';
import {IUser, User} from '../user';
import {IRegisterProps, ILoginProps, ILoginResult} from '.';
import {randomBytes} from 'crypto';
import argon2 from 'argon2';
import {ISAdded, IServiceReturn} from '../../interfaces';

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

export async function register_service (props: IRegisterProps): Promise<IServiceReturn<ISAdded>> {
    try {
        const {
            name,
            email,
            password
        } = props;
        // Checking for repeated email
        const user = await User.find({email}).lean(); // {email: email}
        if (user && user.length > 0) {
            return {code: 400, error: 'Email is already registered'};
        } else {
            // Hashing password
            const argonSalt = randomBytes(32);
            const hashed_password = await argon2.hash(password, {salt: argonSalt});
            const salt = argonSalt.toString('hex');

            // Creating user
            const newUser = await User.create({name, email, password: hashed_password, salt});

            if (newUser) {
                return {code: 201, result: {id: newUser._id}};
            } else {
                return {code: 500, error: 'User not created'}
            }
        }
    } catch (e) {
        console.log(e);
        throw e;
    }
}

export async function login_service (props: ILoginProps): Promise<IServiceReturn<ILoginResult>> {
    try {
        const {email, password} = props;
        const user = await User.findOne({email}).lean();
        if (user) {
            if (await argon2.verify(user.password, password)) {
                const returnUser: Partial<IUser> = {

                };
                delete returnUser.password;
                delete returnUser.salt;
                const token = generateToken(user);
                return {
                    code: 200,
                    result: {
                        token,
                        user: returnUser
                    }
                }
            } else {
                return {
                    code: 401,
                    error: 'Invalid credentials'
                }
                // res.status(401).json({error: {message: 'Invalid credentials'}});
            }
        } else {
            return {
                code: 401,
                error: 'Invalid credentials'
            }
            // res.status(401).json({error: {message: 'Invalid credentials'}});
        }
    } catch (e) {
        console.log(e);
        throw e;
    }
}