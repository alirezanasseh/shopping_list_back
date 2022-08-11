import express, {Express} from 'express';
import cookieParser from 'cookie-parser';
import auth from '../auth/auth.route';

const app: Express = express();
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(cookieParser());
auth(app);

export default app;