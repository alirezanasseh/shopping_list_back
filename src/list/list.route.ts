import {Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import {List} from '.';
import app from '../loaders/express.loader';
import {IJWTPayload} from '../auth';
import {Item} from '../item';

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
