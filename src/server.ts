import express, { Application } from "express";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser, { urlencoded } from "body-parser";

import routes from "./routes";

import init from "./init";

const { APIV, MURI, DEBUG } = process.env;

export default new (class Server {
  public express: Application;

  public constructor() {
    this.express = express();
    this.middleware();
    this.database();
    this.routes();
    console.clear();
    init();
  }

  private middleware(): void {
    this.express.use(cors());
    this.express.use(bodyParser.json({ limit: "1024MB" }));
    this.express.use(urlencoded({ extended: true }));
  }

  private routes(): void {
    this.express.use(`/api/${APIV}`, routes);
  }

  private database(): void {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    };

    mongoose.connect(String(MURI), options, async (error: any) => {
      if (error) {
        DEBUG && console.log("Failed to connect to database\n", error);
      } else {
        DEBUG && console.log(`Connected to Database on ${MURI}`);
      }
    });
  }
})().express;
