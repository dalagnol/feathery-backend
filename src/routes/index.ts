import { Router } from "express";

import Detailer from "../middleware/Detailer";
import Auth from "../middleware/Auth";
import Delayer from "../middleware/Delayer";

import userRoutes from "./users";
import postRoutes from "./post";
import testRoutes from "./test";
import tokenRoutes from "./token";

const routes = Router();

routes.use(Detailer);
routes.use(Auth);
routes.use(Delayer);

testRoutes(routes);
userRoutes(routes);
postRoutes(routes);
testRoutes(routes);
tokenRoutes(routes);

export default routes;
