import { Request, Response } from "express";
import { Model } from "mongoose";

class BaseController<T> {
    model: Model<T>;

    constructor(model: Model<T>) {
        this.model = model;
    }

    async GetAll(req: Request, res: Response) {
        const filter = req.query.author;
        try {
            if (filter) {
                const items = await this.model.find({ author: filter });
                res.status(200).send(items);
            } else {
                const items = await this.model.find();
                res.status(200).send(items);
            }
        } catch (error) {
            res.status(400).json('Error getting data: ' + error);
        }
    }

    async GetById(req: Request, res: Response) {
        const id = req.params.id;
        try {
            const item = await this.model.findById(id);
            if (!item) {
                res.status(404).json('Item not found');
                return;
            }
            res.status(200).json(item);
        } catch (error) {
            res.status(400).json('Error finding item: ' + error);
        }
    }   

    async Create(req: Request, res: Response) {
        const item = req.body;
        try {
            const savedItem = await this.model.create(item);
            res.status(201).json(savedItem);
        } catch (error) {
            res.status(400).json('Error creating item: ' + error);
        }
    }

    async Update(req: Request, res: Response) {
        const id = req.params.id;
        try {
            const updatedItem = await this.model.findByIdAndUpdate(id, req.body, { new: true });
            res.status(200).json(updatedItem);
        } catch (error) {
            res.status(400).json('Error updating item: ' + error);
        }
    }

    async Delete(req: Request, res: Response) {
        const id = req.params.id;
        try {
            const item = await this.model.findByIdAndDelete(id);
            if (!item) {
                res.status(404).json('Item not found');
                return;
            }
            res.status(200).json(item);
        } catch (error) {
            res.status(400).json('Error deleting item: ' + error);
        }
    }
}

export default BaseController;