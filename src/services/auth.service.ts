import jwt from "jsonwebtoken"

export async function createToken (payload: string){
    try {
        return jwt.sign({id: payload}, String(process.env.TOKEN_SECRET), {expiresIn: '10d'})
    } catch (error:any) {
        throw new Error(error)
    }
}