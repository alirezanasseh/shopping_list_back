import express, { Express, Request, Response } from 'express';
import mongoose from 'mongoose';

mongoose.connect('mongodb://localhost:27017/shopping_list').then();

interface IList {
    _id: string;
    name: string;
    order?: number;
}

interface IItem {
    _id: string;
    list: string | IList;
    title: string;
    description?: string;
    bought: boolean;
}

const ListSchema = new mongoose.Schema<IList>({
    name: {
        type: 'String',
        required: true
    },
    order: Number
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

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});