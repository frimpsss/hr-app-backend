import jwt from "jsonwebtoken"
import { tokenPayload } from "../utils/@types"


export async function createToken (payload: tokenPayload){
    try {
        return jwt.sign(payload, process.env.TOKEN_SECRET as string, {expiresIn: '10d'})
    } catch (error:any) {
        throw new Error(error)
    }
}