import {IUser} from './modules/user';

declare global {
    namespace Express {
        export interface Request {
            currentUser?: IUser;
        }
    }
}