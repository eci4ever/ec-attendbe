// import { Hono } from "hono";
// import { eq } from "drizzle-orm";
// import db from "../db/index.js";
// import { usersTable } from "../db/schema.js";

// const userRoute = new Hono();

// // GET /users - Get all users
// userRoute.get("/", async (c) => {
//   try {
//     const users = await db.select().from(usersTable);
//     return c.json({ success: true, data: users });
//   } catch (error) {
//     return c.json({ success: false, error: "Failed to fetch users" }, 500);
//   }
// });

// // GET /users/:id - Get user by ID
// userRoute.get("/:id", async (c) => {
//   try {
//     const id = parseInt(c.req.param("id"));
//     if (isNaN(id)) {
//       return c.json({ success: false, error: "Invalid user ID" }, 400);
//     }

//     const user = await db
//       .select()
//       .from(usersTable)
//       .where(eq(usersTable.id, id));

//     if (user.length === 0) {
//       return c.json({ success: false, error: "User not found" }, 404);
//     }

//     return c.json({ success: true, data: user[0] });
//   } catch (error) {
//     return c.json({ success: false, error: "Failed to fetch user" }, 500);
//   }
// });

// // POST /users - Create new user
// userRoute.post("/", async (c) => {
//   try {
//     const body = await c.req.json();
//     const { name, age, email } = body;

//     // Basic validation
//     if (!name || !age || !email) {
//       return c.json(
//         {
//           success: false,
//           error: "Missing required fields: name, age, email",
//         },
//         400
//       );
//     }

//     if (typeof age !== "number" || age < 0) {
//       return c.json(
//         {
//           success: false,
//           error: "Age must be a positive number",
//         },
//         400
//       );
//     }

//     // Check if email already exists
//     const existingUser = await db
//       .select()
//       .from(usersTable)
//       .where(eq(usersTable.email, email));
//     if (existingUser.length > 0) {
//       return c.json(
//         {
//           success: false,
//           error: "Email already exists",
//         },
//         409
//       );
//     }

//     const newUser = await db
//       .insert(usersTable)
//       .values({
//         name,
//         age,
//         email,
//         isActive: true,
//       })
//       .returning();

//     return c.json({ success: true, data: newUser[0] }, 201);
//   } catch (error) {
//     return c.json({ success: false, error: "Failed to create user" }, 500);
//   }
// });

// // PUT /users/:id - Update user
// userRoute.put("/:id", async (c) => {
//   try {
//     const id = parseInt(c.req.param("id"));
//     if (isNaN(id)) {
//       return c.json({ success: false, error: "Invalid user ID" }, 400);
//     }

//     const body = await c.req.json();
//     const { name, age, email } = body;

//     // Check if user exists
//     const existingUser = await db
//       .select()
//       .from(usersTable)
//       .where(eq(usersTable.id, id));
//     if (existingUser.length === 0) {
//       return c.json({ success: false, error: "User not found" }, 404);
//     }

//     // If email is being updated, check for duplicates
//     if (email && email !== existingUser[0].email) {
//       const emailExists = await db
//         .select()
//         .from(usersTable)
//         .where(eq(usersTable.email, email));
//       if (emailExists.length > 0) {
//         return c.json(
//           {
//             success: false,
//             error: "Email already exists",
//           },
//           409
//         );
//       }
//     }

//     const updateData: any = {};
//     if (name) updateData.name = name;
//     if (age !== undefined) {
//       if (typeof age !== "number" || age < 0) {
//         return c.json(
//           {
//             success: false,
//             error: "Age must be a positive number",
//           },
//           400
//         );
//       }
//       updateData.age = age;
//     }
//     if (email) updateData.email = email;

//     // Always update the updatedAt timestamp
//     updateData.updatedAt = new Date();

//     const updatedUser = await db
//       .update(usersTable)
//       .set(updateData)
//       .where(eq(usersTable.id, id))
//       .returning();

//     return c.json({ success: true, data: updatedUser[0] });
//   } catch (error) {
//     return c.json({ success: false, error: "Failed to update user" }, 500);
//   }
// });

// // DELETE /users/:id - Delete user
// userRoute.delete("/:id", async (c) => {
//   try {
//     const id = parseInt(c.req.param("id"));
//     if (isNaN(id)) {
//       return c.json({ success: false, error: "Invalid user ID" }, 400);
//     }

//     // Check if user exists
//     const existingUser = await db
//       .select()
//       .from(usersTable)
//       .where(eq(usersTable.id, id));
//     if (existingUser.length === 0) {
//       return c.json({ success: false, error: "User not found" }, 404);
//     }

//     await db.delete(usersTable).where(eq(usersTable.id, id));

//     return c.json({ success: true, message: "User deleted successfully" });
//   } catch (error) {
//     return c.json({ success: false, error: "Failed to delete user" }, 500);
//   }
// });

// export default userRoute;
