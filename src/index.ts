import express, { Express, Request, Response } from "express";
import adminAuthRouter from './routes/admin.auth.route'
import bodyParser from "body-parser";
import dotenv from 'dotenv'
export const app: Express = express();
dotenv.config()


const port: number = parseInt(process.env.PORT as string, 10) || 6006;


app.use(express.json(), bodyParser.json())
app.all('/', (req:Request, res:Response) =>{
    res.send({
        status: true, 
        message: "Welcome to HR-app api!"
    })
})

app.use('/api/admin', adminAuthRouter)

app.listen(port, () => {
  console.log(`Server running on port ${port} `);
});
