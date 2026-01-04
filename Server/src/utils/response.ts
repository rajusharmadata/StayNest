// response utils
export const sendResponse = (res: any, statusCode: number, data: any) => {
  res.status(statusCode).json(data);
};

export const sendError = (res: any, statusCode: number, message: string) => {
  res.status(statusCode).json({ message });
};
