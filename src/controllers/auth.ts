import userModel from '../models/userModel'; // Import the comment model
import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const GetUsers = async (req: Request, res: Response) => {
    try {
        const users = await userModel.find();
        res.status(200).send(users);
        return;
    } catch (error) {
        res.status(400).send('Error getting users: ' + error);
        return;
    }
}


const Register = async (req : Request, res : Response) => {
    const user = req.body;
    if (!user.email || !user.password) {
        res.status(400).send('Username and password are required');
        return;
    }
    try {
        const alreadyExists = await userModel.findOne({'email': user.email});
        if (alreadyExists) {
            res.status(400).send('User already exists');
            return;
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        const newUser = {
            'email': user.email,
            'password': hashedPassword,
        };
        const savedUser = await userModel.create(newUser);
        res.status(201).send(savedUser);
        return;
    } catch (error) {
        res.status(400).send('Error creating user: ' + error);
        return;
    }
}

const Login = async (req : Request, res : Response) => {
    const user = req.body;
    console.log(user);
    if (!user.email || !user.password) {
        res.status(400).send('Username and password are required');
        return;
    }
    try {
        const existingUser = await userModel.findOne({'email': user.email});
        if (!existingUser) {
            res.status(404).send('User does not exist');
            return;
        }
        const validPassword = await bcrypt.compare(user.password, existingUser.password);
        if (!validPassword) {
            res.status(400).send('Invalid password');
            return;
        }
        const token = jwt.sign(
            {_id: user._id},
            process.env.TOKEN_SECRET,
            {expiresIn: process.env.TOKEN_EXPIRES_IN} 
        );
        res.status(200).send({
            email : user.email,
            _id : user._id,
            token : token
        });
        return;
    } catch (error) {
        res.status(400).send('Error logging in: ' + error);
        return;
    }
}

type Payload = {
    _id: string;
};

export const authMiddleware = async (req : Request, res : Response, next : NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        res.status(401).send('Access Denied');
        return;
    }
    jwt.verify(token, process.env.TOKEN_SECRET, (err,payload) => {
        if (err) {
            res.status(400).send('Invalid Token' + err);
            return;
        }
        req.query._id = (payload as Payload)._id;
        next();
    });
}

export default {GetUsers,Register,Login};