import { MongooseOptions } from "mongoose";

export interface IDBConfig {
  dbUrl: string;
  dbName: string;
}

export interface IDBConnect extends MongooseOptions {
  useNewUrlParser?: boolean;
  useFindAndModify?: boolean;
  useUnifiedTopology?: boolean;
  useCreateIndex?: boolean;
}