import type {Request, Response, NextFunction} from "express";
import {ZodError} from "zod";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  // Handle Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      status: "error",
      statusCode: 400,
      message: "Validation failed",
      errors: err.errors, // Zod provides a detailed `errors` array
    });
  }

  console.error(err.stack); // Log the error stack for debugging

  res.status(err.status || 500).json({
    status: "error",

    message: err.message || "Internal Server Error",
    error: {
      code: err.code || "INTERNAL_ERROR",
      details: err.details || "An unexpected error occurred.",
    },
  });
};
