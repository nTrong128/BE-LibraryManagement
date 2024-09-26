import type {Response} from "express";

export const sendResponse = (res: Response, statusCode: number, message?: string, data?: any) => {
  if (statusCode === 204) {
    // No Content response should not send a body
    return res.status(204).send();
  }

  return res.status(statusCode).json({
    status: statusCode >= 400 ? "error" : "success",
    statusCode,
    message,
    ...(data && {data}), // Include data only if it exists
  });
};
