import mongoose from 'mongoose';
import {IUser} from '.';

const UserSchema = new mongoose.Schema<IUser>({
    name: {
        type: 'String',
        required: true
    },
    email: {
        type: 'String',
        required: true
    },
    password: {
        type: 'String',
        required: true
    },
    salt: {
        type: 'String',
        required: true
    },
}, {
    timestamps: true
});
export const User = mongoose.model<IUser>('User', UserSchema);
