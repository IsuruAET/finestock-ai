import { Request } from "express";
import { IUser } from "./models";

export interface AuthenticatedRequest extends Request {
  user?: IUser | null;
}

