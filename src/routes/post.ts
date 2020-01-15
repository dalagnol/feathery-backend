import PostService from "../services/PostService";

export default function postRoutes(routes: any) {
  routes.post("/post", PostService.create);
  routes.get("/posts", PostService.getPosts);
  routes.get("/post", PostService.getPost);
  routes.delete("/post/:id", PostService.delete);
  routes.put("/post", PostService.update);
}
