import { homePathForRole, isRole, isSignupRole } from "./roles";

describe("roles", () => {
  it("accepts the three valid roles", () => {
    expect(isRole("landlord")).toBe(true);
    expect(isRole("tenant")).toBe(true);
    expect(isRole("admin")).toBe(true);
  });

  it("rejects anything else", () => {
    expect(isRole("superuser")).toBe(false);
    expect(isRole(undefined)).toBe(false);
  });

  it("only allows landlord and tenant at sign up", () => {
    expect(isSignupRole("landlord")).toBe(true);
    expect(isSignupRole("tenant")).toBe(true);
    expect(isSignupRole("admin")).toBe(false);
  });

  it("sends each role to its own home", () => {
    expect(homePathForRole("landlord")).toBe("/landlord");
    expect(homePathForRole("tenant")).toBe("/tenant");
    expect(homePathForRole("admin")).toBe("/admin");
  });
});