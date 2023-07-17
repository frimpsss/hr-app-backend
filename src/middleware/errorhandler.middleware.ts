import { Request, Response, NextFunction } from "express";

// Custom error class to represent application-specific errors
export class CustomError extends Error {
  constructor(public message: string, public statusCode: number) {
    super(message);
    this.name = "CustomError";
  }
}

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (error instanceof CustomError) {
    // If the error is of type CustomError, handle it
    const { message, statusCode } = error;
    res.status(statusCode).json({ status: false, message: message });
  } else {
    // If it's not a CustomError, handle other types of errors
    console.error("Unhandled Error:", error);
    res.status(500).json({ status: false, message: "Something went wrong" });
  }
}
