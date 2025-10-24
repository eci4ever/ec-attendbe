import { Context } from "hono";
import { auth } from "../lib/auth.js";

type AuthContext = Context<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
}>;

// Authentication middleware helper
// Usage: isAuthenticated(c, next)
export const isAuthenticated = async (
  c: AuthContext,
  next: () => Promise<void>
) => {
  try {
    const session = await auth.api.getSession({ headers: c.req.raw.headers });

    if (!session) {
      c.set("user", null);
      c.set("session", null);
      return c.json(
        {
          success: false,
          error: "Authentication required",
          message: "Please log in to access this resource",
        },
        401
      );
    }

    c.set("user", session.user);
    c.set("session", session.session);

    await next();
  } catch (error) {
    console.error("Authentication error:", error);
    return c.json(
      {
        success: false,
        error: "Authentication failed",
        message: "Invalid session",
      },
      401
    );
  }
};

// Role middleware helper
// Usage: requireRole("admin", "manager", "user")
export const requireRole = (roles: string[] | string) => {
  return async (c: AuthContext, next: () => Promise<void>) => {
    const user = c.get("user");
    if (!user) {
      return c.json({ success: false, error: "Authentication required" }, 401);
    }
    if (!roles.includes(user.role as string)) {
      return c.json({ success: false, error: "Insufficient role" }, 403);
    }
    await next();
  };
};

// Permission middleware helper
// Usage: requirePermission("attendance", "create")
export const requirePermission = (resource: string, action: string) => {
  return async (c: AuthContext, next: () => Promise<void>) => {
    const user = c.get("user");

    if (!user) {
      return c.json({ success: false, error: "Authentication required" }, 401);
    }

    const res = await auth.api.userHasPermission({
      body: {
        userId: user.id,
        permission: {
          [resource]: [action],
        },
      },
      headers: c.req.raw.headers,
    });

    if (!res.success) {
      return c.json(
        {
          success: false,
          error: "Insufficient permissions",
        },
        403
      );
    }

    await next();
  };
};
