import {Request} from "express";

// Extend the Request interface to include userId
export interface AuthenticatedRequest extends Request {
  userId?: string; // Customize this according to your JWT payload (e.g., `id`, `role`, etc.)
}
