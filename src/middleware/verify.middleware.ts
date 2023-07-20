import { Response, NextFunction } from "express";
import { tokenPayload } from "../utils/@types";
import { IReq } from "../utils/@types";
import jwt from 'jsonwebtoken'


export async function verify(req: IReq, res: Response, next: NextFunction) {
    try {
      const header = req.headers["authorization"];
      const token = header ? header.split(" ")[1] : undefined;
      if (!token) {
        return res.status(401).send({
          status: false,
          message: "Unauthorized",
        });
      }
  
      const payload = jwt.verify(
        token,
        String(process.env.TOKEN_SECRET)
      ) as tokenPayload;
  
      req.userId = payload.id;
      req.role = payload.role
  
      next();
    } catch (error) {
      res.status(500).send({
        status: false,
        message: error,
      });
    }
  }