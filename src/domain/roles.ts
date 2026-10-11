export const ROLES = ["super_admin", "content_admin", "examiner", "support_admin", "student"] as const;
export type Role = (typeof ROLES)[number];

export const ROLE_LABELS: Record<Role, string> = {
  super_admin: "Super Admin",
  content_admin: "Content Administrator",
  examiner: "Examiner / Reviewer",
  support_admin: "Support Administrator",
  student: "Student",
};

const PERMISSIONS = {
  "admin.access": ["super_admin", "content_admin", "examiner", "support_admin"],
  "exam.edit": ["super_admin", "content_admin"],
  "exam.review": ["super_admin", "content_admin", "examiner"],
  "exam.publish": ["super_admin", "content_admin"],
  "blueprint.confirm": ["super_admin", "content_admin"],
  "ai.generate": ["super_admin", "content_admin"],
  "audio.produce": ["super_admin", "content_admin"],
  "assessment.review": ["super_admin", "examiner"],
  "plans.edit": ["super_admin"],
  "users.view": ["super_admin", "support_admin"],
  "users.manage": ["super_admin"],
  "audit.view": ["super_admin", "support_admin"],
  "reports.view": ["super_admin", "content_admin", "support_admin"],
} as const satisfies Record<string, readonly Role[]>;

export type Permission = keyof typeof PERMISSIONS;

export function can(role: Role | undefined | null, permission: Permission): boolean {
  return !!role && (PERMISSIONS[permission] as readonly Role[]).includes(role);
}
