import { Hono } from "hono";
import { eq } from "drizzle-orm";
import db from "../db/index.js";
import { user } from "../db/schema.js";
import {
  isAuthenticated,
  requirePermission,
  requireRole,
} from "../proxy/auth-proxy.js";

const userRoute = new Hono();

// Mock data for testing
const mockUsers = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    emailVerified: true,
    image: "https://via.placeholder.com/150",
    role: "admin",
    banned: false,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    emailVerified: true,
    image: "https://via.placeholder.com/150",
    role: "manager",
    banned: false,
    createdAt: new Date("2024-01-16"),
    updatedAt: new Date("2024-01-16"),
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    emailVerified: false,
    image: null,
    role: "user",
    banned: false,
    createdAt: new Date("2024-01-17"),
    updatedAt: new Date("2024-01-17"),
  },
  {
    id: "4",
    name: "Alice Brown",
    email: "alice@example.com",
    emailVerified: true,
    image: "https://via.placeholder.com/150",
    role: "user",
    banned: true,
    banReason: "Violation of terms",
    banExpires: new Date("2024-12-31"),
    createdAt: new Date("2024-01-18"),
    updatedAt: new Date("2024-01-18"),
  },
  {
    id: "5",
    name: "Charlie Wilson",
    email: "charlie@example.com",
    emailVerified: true,
    image: "https://via.placeholder.com/150",
    role: "manager",
    banned: false,
    createdAt: new Date("2024-01-19"),
    updatedAt: new Date("2024-01-19"),
  },
];

// GET /users - Get all users (with mock data fallback)
userRoute.get("/", isAuthenticated, async (c) => {
  try {
    // Try to get users from database first
    const users = await db.select().from(user);
    return c.json({ success: true, data: users });
  } catch (error) {
    // Fallback to mock data if database fails
    console.log("Database error, using mock data:", error);
    return c.json({ success: true, data: mockUsers, mock: true });
  }
});

// GET /users/:id - Get user by ID (with mock data fallback)
userRoute.get("/:id", requirePermission("attendance", "create"), async (c) => {
  try {
    const id = c.req.param("id");

    // Try database first
    const dbUser = await db.select().from(user).where(eq(user.id, id));

    if (dbUser.length > 0) {
      return c.json({ success: true, data: dbUser[0] });
    }

    // Fallback to mock data
    const mockUser = mockUsers.find((u) => u.id === id);

    if (!mockUser) {
      return c.json({ success: false, error: "User not found" }, 404);
    }

    return c.json({ success: true, data: mockUser, mock: true });
  } catch (error) {
    // Fallback to mock data on error
    const id = c.req.param("id");
    const mockUser = mockUsers.find((u) => u.id === id);

    if (!mockUser) {
      return c.json({ success: false, error: "User not found" }, 404);
    }

    return c.json({ success: true, data: mockUser, mock: true });
  }
});

// POST /users - Create new user (mock data validation)
userRoute.post("/", async (c) => {
  try {
    const body = await c.req.json();
    const { name, email, role = "user" } = body;

    // Basic validation
    if (!name || !email) {
      return c.json(
        {
          success: false,
          error: "Missing required fields: name, email",
        },
        400
      );
    }

    // Check if email already exists in mock data
    const existingUser = mockUsers.find((u) => u.email === email);
    if (existingUser) {
      return c.json(
        {
          success: false,
          error: "Email already exists",
        },
        409
      );
    }

    // Create new mock user
    const newUser = {
      id: (mockUsers.length + 1).toString(),
      name,
      email,
      emailVerified: false,
      image: null,
      role,
      banned: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Add to mock data
    mockUsers.push(newUser);

    return c.json({ success: true, data: newUser, mock: true }, 201);
  } catch (error) {
    return c.json({ success: false, error: "Failed to create user" }, 500);
  }
});

// PUT /users/:id - Update user (mock data)
userRoute.put("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const { name, email, role } = body;

    // Find user in mock data
    const userIndex = mockUsers.findIndex((u) => u.id === id);

    if (userIndex === -1) {
      return c.json({ success: false, error: "User not found" }, 404);
    }

    // Check email uniqueness if email is being updated
    if (email && email !== mockUsers[userIndex].email) {
      const emailExists = mockUsers.find((u) => u.email === email);
      if (emailExists) {
        return c.json(
          {
            success: false,
            error: "Email already exists",
          },
          409
        );
      }
    }

    // Update user
    const updatedUser = {
      ...mockUsers[userIndex],
      ...(name && { name }),
      ...(email && { email }),
      ...(role && { role }),
      updatedAt: new Date(),
    };

    mockUsers[userIndex] = updatedUser;

    return c.json({ success: true, data: updatedUser, mock: true });
  } catch (error) {
    return c.json({ success: false, error: "Failed to update user" }, 500);
  }
});

// DELETE /users/:id - Delete user (mock data)
userRoute.delete("/:id", async (c) => {
  try {
    const id = c.req.param("id");

    // Find user in mock data
    const userIndex = mockUsers.findIndex((u) => u.id === id);

    if (userIndex === -1) {
      return c.json({ success: false, error: "User not found" }, 404);
    }

    // Remove from mock data
    mockUsers.splice(userIndex, 1);

    return c.json({
      success: true,
      message: "User deleted successfully",
      mock: true,
    });
  } catch (error) {
    return c.json({ success: false, error: "Failed to delete user" }, 500);
  }
});

// Additional endpoint to get mock data info
userRoute.get("/mock/info", async (c) => {
  return c.json({
    success: true,
    info: {
      totalUsers: mockUsers.length,
      roles: [...new Set(mockUsers.map((u) => u.role))],
      verifiedUsers: mockUsers.filter((u) => u.emailVerified).length,
      bannedUsers: mockUsers.filter((u) => u.banned).length,
    },
    mock: true,
  });
});

export default userRoute;
