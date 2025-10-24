import { Hono } from "hono";
import userRoute from "./routes/user-route.js";

const app = new Hono();

// Welcome route
app.get("/", (c) => {
  return c.json({
    message: "Welcome to EC Attend Backend API",
    version: "1.0.0",
    endpoints: {
      users: "/api/users",
      health: "/health",
    },
  });
});

// Health check endpoint
app.get("/health", (c) => {
  return c.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

// Mount user routes
app.route("/api/users", userRoute);

export default app;
