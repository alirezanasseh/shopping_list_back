import {IRole} from '../role';

export interface IUser {
    _id: string;
    name: string;
    email: string;
    password: string;
    salt: string;
    role: string | IRole;
}