import TestService from "../services/TestService";

export default function testRoutes(routes: any) {
  routes.get("/ping", TestService.Ping);
}
