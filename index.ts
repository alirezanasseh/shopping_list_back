import express, {Express, Request, Response} from 'express';
import mongoose from 'mongoose';
import {randomBytes} from 'crypto';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

mongoose.connect('mongodb://localhost:27017/shopping_list').then();

interface IUser {
    _id: string;
    name: string;
    email: string;
    password: string;
    salt: string;
}

interface IList {
    _id: string;
    name: string;
    order?: number;
    user: string | IUser;
}

interface IItem {
    _id: string;
    list: string | IList;
    title: string;
    description?: string;
    bought: boolean;
}

interface IJWTPayload {
    _id: string;
    name: string;
    exp: number;
}

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
const User = mongoose.model<IUser>('User', UserSchema);

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
const List = mongoose.model<IList>('List', ListSchema);

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
const Item = mongoose.model<IItem>('Item', ItemSchema);

const app: Express = express();
const port = 8000;
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(cookieParser());

app.get('/', (req: Request, res: Response) => {
    res.json({status: 1});
});

app.get('/lists', async (req: Request, res: Response) => {
    const lists = await List.find({});
    res.json(lists);
});

app.get('/lists/:id', async (req: Request, res: Response) => {
    const list = await List.findById(req.params.id.toString());
    let statusCode = 200;
    if (!list) statusCode = 404;
    res.status(statusCode).json(list);
});

app.post('/lists', async (req: Request, res: Response) => {
    const newList = await List.create(req.body);
    res.json({status: !!newList});
});

// A route to update a list
app.put('/lists/:id', async (req: Request, res: Response) => {
    const result = await List.updateOne({_id: req.params.id.toString()}, req.body);
    res.json({status: result.modifiedCount === 1});
});

// A route to delete a list
app.delete('/lists/:id', async (req: Request, res: Response) => {
    const result = await List.deleteOne({_id: req.params.id.toString()});
    res.json(result);
});

app.get('/lists/:listId/items', async (req: Request, res: Response) => {
    try {
        if (req.cookies && req.cookies.token) {
            console.log('req.cookies && req.cookies.token')
            const decoded = jwt.verify(req.cookies.token, process.env.SECRET || '', {
                algorithms: ['HS256']
            }) as IJWTPayload;
            if (decoded.exp < Date.now()) {
                res.clearCookie('token', {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production'
                }).status(403).json({error: {message: 'Access denied'}});
            } else {
                const listId = req.params.listId;
                if (listId) {
                    const items = await Item.find({list: listId.toString()});
                    res.json(items);
                } else {
                    res.json({error: {message: 'List id should be provided'}});
                }
            }
        } else {
            res.status(403).json({error: {message: 'Access denied'}});
        }
    } catch (e) {
        res.status(403).json({error: {message: 'Access denied'}});
    }
});

app.post('/lists/:listId/items', async (req: Request, res: Response) => {
    const listId = req.params.listId;
    if (listId) {
        const list = await List.findById(listId).lean();
        if (list) {
            const result = await Item.create({
                list: listId,
                ...req.body
            });
            res.json({status: !!result});
        } else {
            res.status(404).json({error: {message: 'List not found'}});
        }
    } else {
        res.json({error: {message: 'List id should be provided'}});
    }
});

app.post('/auth/register', async (req: Request, res: Response) => {
    // req.body : {name, email, password}
    let {name, email, password} = req.body;
    // Checking for repeated email
    const user = await User.find({email}).lean(); // {email: email}
    if (user && user.length > 0) {
        res.status(400).json({error: {message: 'Email is already registered'}});
    } else {
        // Hashing password
        const argonSalt = randomBytes(32);
        password = await argon2.hash(password, {salt: argonSalt});
        const salt = argonSalt.toString('hex');

        // Creating user
        const newUser = await User.create({name, email, password, salt});

        if (newUser) {
            res.json({status: true, id: newUser._id});
        } else {
            res.status(500).json({error: {message: 'User not created'}});
        }
    }
});

app.post('/auth/login', async (req: Request, res: Response) => {
    // req.body : {email, password}
    const {email, password} = req.body;
    const user = await User.findOne({email}).lean();
    if (user) {
        if (await argon2.verify(user.password, password)) {
            const returnUser: Partial<IUser> = {...user};
            delete returnUser.password;
            delete returnUser.salt;
            const token = generateToken(user);
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production'
            }).json({user: returnUser});
        } else {
            res.status(401).json({error: {message: 'Invalid credentials'}});
        }
    } else {
        res.status(401).json({error: {message: 'Invalid credentials'}});
    }
});

function generateToken(user: IUser) {
    // Set token expiration date to 60 days
    const exp = Date.now() + 60 * 24 * 3600 * 1000;

    return jwt.sign({
        _id: user._id,
        name: user.name.trim(),
        exp
    }, process.env.SECRET || '', {
        algorithm: 'HS256'
    });
}

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});