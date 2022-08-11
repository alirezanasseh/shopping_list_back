import mongoose from 'mongoose';
import {IItem} from '.';

const ItemSchema = new mongoose.Schema<IItem>({
    title: {
        type: 'String',
        required: true
    },
    description: String,
    bought: {
        type: 'Boolean',
        required: true,
        default: false
    },
    list: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'List'
    }
});
export const Item = mongoose.model<IItem>('Item', ItemSchema);