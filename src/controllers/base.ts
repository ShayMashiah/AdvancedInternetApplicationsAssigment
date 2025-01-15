import { Request, Response } from "express";
import Comment from "../models/commentModels"; // Adjust the import path as necessary
import Post from "../models/postModels"; // Adjust the import path as necessary
import { Model } from "mongoose";

class BaseController<T> {
    model: Model<T>;
    constructor(model: Model<T>) {
        this.model = model;
    }
    GetAll = async (req: Request, res: Response) =>{
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
    GetById = async (req: Request, res: Response) => {
        const id = req.params.id;
        try {
            const item = await this.model.findById(id);
            if (!item) {
                const items = await this.model.find({ PostId: id });
                if (items.length > 0) {
                    res.status(200).json(items);
                }
                else{
                res.status(404).json('Item not found');
                }
            }else{
            res.status(200).json(item);
            }
        } catch (error) {
            res.status(400).json('Error finding item: ' + error);
        }
    }   
    Create = async (req: Request, res: Response) => {
        if(req.body.PostId){
            const postExist = await Post.findById(req.body.PostId);
            if(!postExist){
                res.status(404).json('Post not found');
                return;
            }
        }
        const item = req.body;
        try {
            const savedItem = await this.model.create(item);
            res.status(201).json(savedItem);
        } catch (error) {
            res.status(400).json('Error creating item: ' + error);
        }
    }
    Update = async (req: Request, res: Response) => {
        const id = req.params.id;
        try {
            const updatedItem = await this.model.findByIdAndUpdate(id, req.body, { new: true });
            if (!updatedItem) {
                res.status(404).json('Item not found');
            }else {
                res.status(200).json(updatedItem);
            }
        } catch (error) {
            res.status(400).json('Error updating item: ' + error);
        }
    }
    Delete = async (req: Request, res: Response) => {
        const id = req.params.id;
        try {
            await Comment.deleteMany({ PostId: id });

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