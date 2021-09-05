import { Session } from "express-session";
import { AuthData } from "../interfaces/Session";

declare module "express-session" {
  interface Session {
    auth: AuthData;
  }
}
