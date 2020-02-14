import TokenService from "../services/TokenService";

export default function tokenRoutes(routes: any) {
  routes.get("/token/:token", TokenService.validate);
}
