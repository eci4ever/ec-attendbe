import { Hono } from "hono";
import { cors } from "hono/cors";
import { auth } from "./lib/auth.js";
import userRoute from "./routes/user-route.js";

const app = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
}>();

app.use("*", cors(), async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) {
    c.set("user", null);
    c.set("session", null);
    return next();
  }
  c.set("user", session.user);
  c.set("session", session.session);
  return next();
});

// Welcome route
app.get("/", (c) => {
  return c.json({
    message: "Welcome to E Attend Backend API",
    version: "1.0.0",
    endpoints: {
      health: "/health",
    },
  });
});

app.get("/health", (c) => {
  return c.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

app.route("/api/users", userRoute);

export default app;
