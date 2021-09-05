import * as express from "express";
import * as mongoose from "mongoose";
import * as path from "path";
import * as methodOverride from 'method-override';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import webRouter from './routes/web';
import apiRuter from './routes/api';
import { IDBConnect } from "./interfaces/Database";
import flash = require("connect-flash");
import Config from "./config";
import { ApiMiddleware } from "./middleware/ApiMiddleware";

class App {
  public app: express.Application;

  constructor() {
    this.app = express();

    this.initializeDatabase();
    this.initializeMiddlewares();
    this.initializeRoutes();
    mongoose.connection.on("error", () => {
      console.log("database not connedted!");
    });
    mongoose.connection.on("open", () => {
      console.log("database connected!");
    });
  }

  public async listen() {
    this.app.listen(process.env.PORT, () => {
      console.log(`App listening on the port ${process.env.PORT}`);
    });
  }

  public getServer() {
    return this.app;
  }

  private initializeMiddlewares() {
    this.app.use(express.urlencoded({ extended: true }));
    this.app.set("views", path.join(__dirname, "../views"));
    this.app.set("view engine", "ejs");
    this.app.use(
      session({
        secret: "53cR3t",
        resave: false,
        saveUninitialized: true,
        cookie: {
          maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
        },
      })
    );
    this.app.use(flash());
    this.app.use(express.json());
    this.app.use(cookieParser());
    this.app.use(methodOverride("_method"));
    this.app.use("/adminlte", express.static(path.join(__dirname, "../node_modules/admin-lte/")));
    this.app.use(express.static(path.join(__dirname, "../public")));
  }

  private initializeRoutes() {
    this.app.use("/", webRouter);
    this.app.use(
      `/${Config.apiPrefix}/${Config.apiVersion}`, 
      ApiMiddleware,
      apiRuter
    );
  }

  private async initializeDatabase(): Promise<void> {
    const mongoOpt: IDBConnect = {
      useFindAndModify: false,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useNewUrlParser: true
    };

    await mongoose.connect(Config.DB.dbUrl, mongoOpt);
  }
}

export default App;