import express, { Express, Request, Response } from 'express';

interface IList {
    id: string;
    name: string;
    order?: number;
}

interface IItem {
    id: string;
    list_id: string;
    title: string;
    description?: string;
    bought: boolean;
}

let lists: Array<IList> = [];
let items: Array<IItem> = [];
let listId = 1;
let itemId = 1;

const app: Express = express();
const port = 8000;
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.get('/', (req: Request, res: Response) => {
    res.json({status: 1});
});

app.get('/lists', (req: Request, res: Response) => {
    res.json(lists);
});

app.get('/lists/:id', (req: Request, res: Response) => {
    res.json(lists.find(list => list.id.toString() === req.params.id.toString()));
});

app.post('/lists', (req: Request, res: Response) => {
    lists.push({
        id: listId++,
        ...req.body
    });
    res.json({status: 1});
});

// A route to update a list
app.put('/lists/:id', (req: Request, res: Response) => {
    const list = lists.find(list => list.id.toString() === req.params.id.toString());
    if (list) {
        list.name = req.body.name;
        list.order = req.body.order;
    }
    res.json({status: 1});
});

// A route to delete a list
app.delete('/lists/:id', (req: Request, res: Response) => {
    lists = lists.filter(list => list.id.toString() !== req.params.id.toString());
    res.json({status: 1});
});

// A route to get all items of a list
app.get('/lists/:id/items', (req: Request, res: Response) => {
    res.json(items.filter(item => item.list_id.toString() === req.params.id.toString()));
});

    // A route to get a specific item of a list
app.get('/lists/:id/items/:itemId', (req: Request, res: Response) => {
    res.json(items.find(item => item.id.toString() === req.params.itemId.toString()));
});

    // A route to create a new item
app.post('/lists/:id/items', (req: Request, res: Response) => {
    items.push({
        id: itemId++,
        list_id: req.params.id,
        ...req.body
    });
    res.json({status: 1});
});

    // A route to update an item
app.put('/lists/:id/items/:itemId', (req: Request, res: Response) => {
    const item = items.find(item => item.id.toString() === req.params.itemId.toString());
    if (item) {
        item.title = req.body.title;
        item.description = req.body.description;
        item.bought = req.body.bought;
    }
    res.json({status: 1});
});

    // A route to delete an item
app.delete('/lists/:id/items/:itemId', (req: Request, res: Response) => {
    items = items.filter(item => item.id.toString() !== req.params.itemId.toString());
    res.json({status: 1});
});

    // A route to delete all items of a list
app.delete('/lists/:id/items', (req: Request, res: Response) => {
    items = items.filter(item => item.list_id.toString() !== req.params.id.toString());
    res.json({status: 1});
});

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});