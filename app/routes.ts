import { type RouteConfig, layout, route } from "@react-router/dev/routes";

export default [
  // Root layout routes
  route("/", "./routes/root/home.tsx"),
  route("/sign-in", "./routes/root/sign-in.tsx"),

  // Admin layout routes
  layout("./routes/admin/admin-layout.tsx", [
    route("dashboard", "./routes/admin/dashboard.tsx"),
    route("users", "./routes/admin/users.tsx"),
    route("trips/create", "./routes/admin/create-trip.tsx"),
    route("trips", "./routes/admin/trips.tsx"),
  ]),

  // API route
  route("/api/create-trip", "./routes/api/create-trip.ts"),
] satisfies RouteConfig;
