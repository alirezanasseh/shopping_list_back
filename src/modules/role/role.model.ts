import mongoose from 'mongoose';
import {IRole} from '.';

const RoleSchema = new mongoose.Schema<IRole>({
    name: {
        type: 'String',
        required: true
    }
}, {
    timestamps: true
});
export const Role = mongoose.model<IRole>('Role', RoleSchema);