import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

export const validate =
  (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body); // Validate the request body
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((err) => err.message);
        res.status(400).json({ message: errors });
      }
      next(error);
    }
  };
