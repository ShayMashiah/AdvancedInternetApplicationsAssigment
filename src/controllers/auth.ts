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
        const random = Math.floor(Math.random() * 1000000);

        const accessToken = jwt.sign(
            {
                _id: existingUser._id,
                random: random
            },
            process.env.TOKEN_SECRET,
            {expiresIn: process.env.TOKEN_EXPIRES_IN} 
        );

        const refreshToken = jwt.sign(
            {
                _id: existingUser._id,
                random: random
            },
            process.env.TOKEN_SECRET,
            {expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN},

        );
        if (existingUser.refreshTokens == null) {
            existingUser.refreshTokens = [];
        }
        existingUser.refreshTokens.push(refreshToken);
        await existingUser.save();
        res.status(200).send({
            email : user.email,
            _id : user._id,
            accessToken : accessToken,
            refreshToken : refreshToken
        });
        return;
    } catch (error) {
        res.status(400).send('Error logging in: ' + error);
        return;
    }
}

const Logout = async (req : Request, res : Response) => {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) {
        res.status(400).send('Refresh token is required');
        return;
    }
    if (!process.env.TOKEN_SECRET) {
        res.status(400).send('Missing auth configuration');
        return;
    }
    jwt.verify(refreshToken, process.env.TOKEN_SECRET, async (err,data) => {
        if (err) {
            res.status(400).send('Invalid refresh token');
            return;
        }
        const payload = data as Payload;
     try{
        const user = await userModel.findOne({_id: payload._id});
        if (!user) {
            res.status(404).send('Invalid refresh token');
            return;
        }
        if(!user.refreshTokens || !user.refreshTokens.includes(refreshToken)){
            res.status(400).send('Invalid refresh token');
            user.refreshTokens = []
            await user.save();
            return;
        }
        user.refreshTokens = user.refreshTokens.filter((t) => t !== refreshToken);
        await user.save();
        res.status(200).send('Logged out');
    } catch (err) {
        res.status(400).send('Error logging out: ' + err);
        return;
        }
    });
}

const Refresh = async (req : Request, res : Response) => {
    const refreshToken = req.body.refreshToken;
    if (!refreshToken) {
        res.status(400).send('Refresh token is required');
        return;
    }
    if (!process.env.TOKEN_SECRET) {
        res.status(400).send('Missing auth configuration');
        return;
    }
    jwt.verify(refreshToken, process.env.TOKEN_SECRET, async (err,data) => {
        if (err) {
            res.status(400).send('Invalid refresh token');
            return;
        }
        const payload = data as Payload;
     try{
        const user = await userModel.findOne({_id: payload._id});
        if (!user) {
            res.status(404).send('Invalid refresh token');
            return;
        }
        if(!user.refreshTokens || !user.refreshTokens.includes(refreshToken)){
            user.refreshTokens = []
            await user.save();
            res.status(400).send('Invalid refresh token');
            return;
        }
        const random = Math.floor(Math.random() * 1000000);

        const newAccessToken = jwt.sign(
            {
                _id: user._id,
                random: random
            },
            process.env.TOKEN_SECRET,
            {expiresIn: process.env.TOKEN_EXPIRES_IN} 
        );
        if(!newAccessToken){
            user.refreshTokens = [];
            await user.save();
            res.status(400).send('Error creating access token');
            return;
        }
        const newRefreshToken = jwt.sign(
            {
                _id: user._id,
                random: random
            },
            process.env.TOKEN_SECRET,
            {expiresIn: process.env.TOKEN_EXPIRES_IN} 
        );
        if(!newRefreshToken){
            user.refreshTokens = [];
            await user.save();

            res.status(400).send('Error creating refresh token');
            return;
        }
        user.refreshTokens = user.refreshTokens.filter((t) => t !== refreshToken); 
        user.refreshTokens.push(newRefreshToken);
        await user.save();
        res.status(200).send({
            accessToken : newAccessToken,
            refreshToken : newRefreshToken
        });
    } catch (err) {
        res.status(400).send('Error refreshing token: ' + err);
        return;
        }
    });        
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

export default {GetUsers,Register,Login, Logout, Refresh};