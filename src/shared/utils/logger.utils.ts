import morgan from "morgan";
import { Request } from "express";

morgan.token("body", (req: Request) => {
  return JSON.stringify(req.body);
});

export const logger = morgan(
  ":method :url :status - :response-time ms :body",
  {
    stream: {
      write: (message: string) => console.log(message.trim()),
    },
  }
);