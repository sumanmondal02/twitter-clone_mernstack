import jwt from "jsonwebtoken";
import {config} from "dotenv";
import {UserModel} from "../models/UserModel.js";
config();

export const verifyToken = async(req,res,next)=>{
    try{
    const token=req.cookies?.token;
    if(!token){
        return res.status(401).json({message:"Authentication failed: No token provided"});
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await UserModel.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(403).json({
        message: "Authentication failed: User not found",
      });
    }
    if (user.isBlocked) {
      return res.status(403).json({
        message: "Authentication failed: User is blocked",
      });
    }
    if (user.isDeactivated) {
      return res.status(403).json({
        message: "Authentication failed: User is not active",
      });
    }
    req.user = user;
    next();
    } catch(err){
        next(err);
    }
}

export const verifyAdmin = (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }
    if (!req.user.isAdmin) {
      return res.status(403).json({
        message: "Access denied: Admin only",
      });
    }
    next();
};

export const errorHandler = (err, req, res, next) => {
    if (process.env.NODE_ENV === "development") {
        console.error(err);
    }
    // validation error
    if (err.name === "ValidationError") {
        return res.status(400).json({ 
            message: "Validation error occurred", 
            error: err.message 
        });
    }
    // cast error
    if (err.name === "CastError") {
        return res.status(400).json({ 
            message: "Cast error occurred", 
            error: `Invalid ${err.path}: ${err.value}` 
        });
    }
    // JWT errors
    if (err.name === "JsonWebTokenError") {
        return res.status(401).json({
        message: "Invalid token"
        });
    }
    if (err.name === "TokenExpiredError") {
        return res.status(401).json({
        message: "Token expired"
        });
    }
    // duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        const value = err.keyValue[field];
        return res.status(409).json({ 
            message: "Duplicate key error occurred", 
            error: `${field} "${value}" already exists` 
        });
    }
    // send server error
    res.status(500).json({ 
        message: "Server side error occurred", 
        error: "Server side error" 
    });
};