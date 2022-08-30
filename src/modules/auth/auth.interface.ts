import {IUser} from '../user';

export interface IJWTPayload {
    _id: string;
    name: string;
    exp: number;
}

export interface IRegisterProps {
    name: string;
    email: string;
    password: string;
}

export interface ILoginProps {
    email: string;
    password: string;
}

export interface ILoginResult {
    token: string;
    user: Partial<IUser>;
}