import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

export const statement = {
  ...defaultStatements,
  attendance: ["create", "view", "update", "delete"],
} as const;

export const ac = createAccessControl(statement);

export const admin = ac.newRole({
  attendance: ["create", "view", "update", "delete"],
  ...adminAc.statements,
});

export const manager = ac.newRole({
  attendance: ["create", "view", "update"],
});

export const user = ac.newRole({
  attendance: ["view"],
});
