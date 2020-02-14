import UserService from "../services/UserService";

export default function userRoutes(routes: any) {
  routes.post("/login", UserService.authenticate);
  routes.post("/user", UserService.signUp);
  routes.put("/user/:id", UserService.update);
  routes.delete("/user/:id", UserService.delete);
  routes.post("/user/mail", UserService.mailResetPsw);
  routes.put("/user/password/:token", UserService.resetPsw);
}
