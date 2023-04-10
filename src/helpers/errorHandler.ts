import { Request, Response, NextFunction } from "express";

export interface IErrorDetails {
  message: string;
  status_code: number;
}
export class ValidationError {
  message: IErrorDetails["message"];
  status_code: IErrorDetails["status_code"];
  constructor(message: string) {
    this.message = message;
    this.status_code = 400;
  }
}

export class NotFoundError {
  message: IErrorDetails["message"];
  status_code: IErrorDetails["status_code"];
  constructor(message: string) {
    this.message = message;
    this.status_code = 404;
  }
}

export class InternalServerError {
  message: IErrorDetails["message"];
  status_code: IErrorDetails["status_code"];
  constructor(message: string) {
    this.message = message;
    this.status_code = 500;
  }
}

export const errorHandler = (
  error: IErrorDetails,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  response.status(error?.status_code || 500).json({ message: error.message });
  next();
};
