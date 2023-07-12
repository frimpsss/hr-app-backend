import bcrypt from 'bcrypt'

const saltrounds = 10

export async function hashPassword(pwd: string){
    try {
        const genSalt = await bcrypt.genSalt(saltrounds)
        const hashedPws = await bcrypt.hash(pwd, genSalt)

        return hashedPws
    } catch (error:any) {
        throw Error(error)
    }
}