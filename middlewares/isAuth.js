import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

export const isAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        console.log(req.headers);
            if (!authHeader){
            return res.status(403).json({
                message: 'Please login to access this resource'
            });
        }
        const token = authHeader.split(" ")[1];
        
        if (!token) {
            return res.status(403).json({
                message: 'Please login to access this resource',
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SEC);

        const user = await User.findById(decoded._id);

        if (!user) {
            return res.status(401).json({
                message: 'User not found',
            });
        }

        req.user = user;

        next();
    }catch (error) {
        console.error(error);

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                message: 'Invalid token',
            });
        }

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                message: 'Token expired',
            });
        }

        res.status(500).json({
            message:'Please login to access this resource',
        });
    }
};