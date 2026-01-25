declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"

export const authorizeUser = (...roles:string[])=>{
    return(req:Request,res:Response,next:NextFunction)=>{
        if(!req.user || !roles.includes(req.user.role)){
            return res.status(403).json({message:"You donot have permission to access the resource"})
        }
        next();
    }
}

export const authenticateUser = (req:Request,res:Response,next:NextFunction)=>{
    const token = req.headers?.authorization?.split(' ')[1] || "" ;

    if(!token){
        return res.status(401).json({message:"Missing Access Token"});
    }

    try{

        const decoded_token = jwt.verify(token,process.env.JWT_SECRET as string);
        req.user = decoded_token;
        next();
    }

    catch(error){
        return res.status(403).json({message:"Invalid or Expired Token"});
    }

}