import {IUser} from '../user';

export interface IList {
    _id: string;
    name: string;
    order?: number;
    user: string | IUser;
}