import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"), // "/" → Auth wrapper
  route("/auth", "routes/auth.tsx"), // "/auth" → Auth page
  route("/signup", "routes/signup.tsx"),
  route("/upload", "routes/upload.tsx"),
  route("/resume/:id", "routes/resume.tsx"),
  route("/wipe", "routes/wipe.tsx"),
] satisfies RouteConfig;
