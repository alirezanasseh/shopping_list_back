import mongoose from 'mongoose';
import {config} from '../config';

mongoose.connect(config.database_url).then();

export default mongoose;