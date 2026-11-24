export type Role = "landlord" | "tenant" | "admin";
export type SignupRole = "landlord" | "tenant";

export function isRole(value: unknown): value is Role {
  return value === "landlord" || value === "tenant" || value === "admin";
}

export function isSignupRole(value: unknown): value is SignupRole {
  return value === "landlord" || value === "tenant";
}

export function homePathForRole(role: Role): string {
  switch (role) {
    case "landlord":
      return "/landlord";
    case "tenant":
      return "/tenant";
    case "admin":
      return "/admin";
  }
}