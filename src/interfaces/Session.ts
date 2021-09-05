import { SessionData } from "express-session";

export interface AuthData {
  name: String | string;
  email: String | string;
  status: "Y" | "N";
}

export interface AuthSession extends SessionData {
  auth: AuthData
}