import { Router } from "express";

import Detailer from "../middleware/Detailer";
import Auth from "../middleware/Auth";
import Delayer from "../middleware/Delayer";

import userRoutes from "./users";
import postRoutes from "./post";
import testRoutes from "./test";

const routes = Router();

routes.use(Detailer);
routes.use(Auth);
routes.use(Delayer);

testRoutes(routes);
userRoutes(routes);
postRoutes(routes);
testRoutes(routes);

export default routes;
