import express, { Express, NextFunction, Request, Response } from "express";
import adminAuthRouter from "./routes/admin.auth.route";
import employeeAuthRouter from "./routes/employee.auth.routes";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import departmentRouter from './routes/department.routes'
import { errorHandler } from "./middleware/errorhandler.middleware";
import { CustomError } from "./middleware/errorhandler.middleware";
import { verify } from "./middleware/verify.middleware";
export const app: Express = express();
dotenv.config();

const port: number = parseInt(process.env.PORT as string, 10) || 6006;

app.use(express.json(), bodyParser.json());

app.all("/", (req: Request, res: Response) => {
  res.send({
    status: true,
    message: "Welcome to HR-app api!",
  });
});

app.use("/api/admin", adminAuthRouter);
app.use("/api/employee", employeeAuthRouter);
app.use('/api/department', verify, departmentRouter)

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const error = new CustomError("Not found", 404);
  next(error);
});
app.use(errorHandler);
app.listen(port, () => {
  console.log(`Server running on port ${port} `);
});
