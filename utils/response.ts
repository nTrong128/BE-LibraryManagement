import type {Response} from "express";

export const sendResponse = (
  res: Response,
  statusCode: number,
  message?: string,
  data?: any,
  meta?: any // New meta argument
) => {
  if (statusCode === 204) {
    return res.status(204).send();
  }

  return res.status(statusCode).json({
    status: statusCode >= 400 ? "error" : "success",
    statusCode,
    message,
    ...(data && {data}), // Include data only if it exists
    ...(meta && {meta}), // Include meta only if it exists
  });
};
