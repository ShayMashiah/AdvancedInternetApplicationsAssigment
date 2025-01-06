import userModel from '../models/userModel'; // Import the comment model
import { Request, Response } from "express";

const GetUsers = async (req: Request, res: Response) => {
    try {
        const users = await userModel.find();
        res.status(200).json(users);
        return;
    } catch (error) {
        res.status(400).json('Error getting users: ' + error);
        return;
    }
}


const Register = async (req : Request, res : Response) => {
    const user = req.body;
    try {
        const savedUser = await userModel.create(user);
        res.status(201).json(savedUser);
        return;
    } catch (error) {
        res.status(400).json('Error creating user: ' + error);
        return;
    }
}

export default {GetUsers,Register};