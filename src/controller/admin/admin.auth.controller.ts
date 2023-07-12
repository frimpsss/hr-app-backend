import { Request, Response } from "express";
import { IAdmin } from "../../utils/@types";
import { admin } from "../../services/validator.service";
// import { prisma } from "../../../prisma";
import { PrismaClient } from "@prisma/client";
import {z} from "zod"
const prisma = new PrismaClient()
export async function register(req:Request, res:Response){
    try {
        const {
            email, 
            password
        }:IAdmin = req.body


        admin.parse({
            email, 
            password
        })

        const foundUser = await prisma.manager.findUnique({
            where: {
                email
            }
        })

        if(foundUser){
            return res.status(409).send({
                status: false, 
                message: 'Manager already exists.'
            })
        }
        
        const createdManager = await prisma.manager.create({
            data: {
                email, 
                password
            }
        })

        res.status(200).send({
            status: true,
            message: "Manager created", 
            data: createdManager
        })

    } catch (error:any) {
        if (error instanceof z.ZodError) {
            return res.send({
              status: false,
              message: "validation error",
              data: error.errors,
            });
          }
        res.status(500).send({
            status: false, 
            message: error
        })
    }
}