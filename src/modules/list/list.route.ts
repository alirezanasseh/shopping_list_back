import {Request, Response, Router} from 'express';
import {List} from './index';
import {Item} from '../item';
import {AuthCheckMiddleware} from '../../middlewares/auth_check';

export default function listRoutes (app: Router) {
    const route = Router();
    app.use('/lists', route);

    route.get('/', async (req: Request, res: Response) => {
        const lists = await List.find({});
        res.json(lists);
    });

    route.get('/:id', async (req: Request, res: Response) => {
        const list = await List.findById(req.params.id.toString());
        let statusCode = 200;
        if (!list) statusCode = 404;
        res.status(statusCode).json(list);
    });

    route.post('/', async (req: Request, res: Response) => {
        const newList = await List.create(req.body);
        res.json({status: !!newList});
    });

    route.put('/:id', async (req: Request, res: Response) => {
        const result = await List.updateOne({_id: req.params.id.toString()}, req.body);
        res.json({status: result.modifiedCount === 1});
    });

    route.delete('/:id', async (req: Request, res: Response) => {
        const result = await List.deleteOne({_id: req.params.id.toString()});
        res.json(result);
    });

    route.get('/:listId/items', AuthCheckMiddleware, async (req: Request, res: Response) => {
        try {
            const listId = req.params.listId;
            if (listId) {
                const items = await Item.find({list: listId.toString()});
                res.json(items);
            } else {
                res.json({error: {message: 'List id should be provided'}});
            }
        } catch (e) {
            res.status(403).json({error: {message: 'Access denied'}});
        }
    });

    route.post('/:listId/items', async (req: Request, res: Response) => {
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
}
