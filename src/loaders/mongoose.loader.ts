import mongoose from 'mongoose';
import {config} from '../config';

export default async function mongooseLoader () {
    try {
        console.log('db url : ' + config.database_url)
        await mongoose.connect(config.database_url);
    } catch (e) {
        throw e;
    }
}