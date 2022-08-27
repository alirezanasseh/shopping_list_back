import mongoose from 'mongoose';
import {IList} from './index';

const ListSchema = new mongoose.Schema<IList>({
    name: {
        type: 'String',
        required: true
    },
    order: Number,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});
export const List = mongoose.model<IList>('List', ListSchema);