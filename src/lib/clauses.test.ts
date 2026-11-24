import { clauseSchema } from "./clauses";

describe("clauseSchema", () => {
  it("accepts a normal clause", () => {
    expect(
      clauseSchema.safeParse({ title: "Pets", body: "No pets without written permission." }).success,
    ).toBe(true);
  });

  it("rejects a title that is too short", () => {
    expect(clauseSchema.safeParse({ title: "Hi", body: "Some text that is long enough" }).success).toBe(false);
  });

  it("rejects a body that is too short or too long", () => {
    expect(clauseSchema.safeParse({ title: "Pets", body: "Short" }).success).toBe(false);
    expect(clauseSchema.safeParse({ title: "Pets", body: "x".repeat(1001) }).success).toBe(false);
  });

  it("trims spaces", () => {
    const result = clauseSchema.safeParse({ title: "  Pets  ", body: "  No pets allowed here.  " });
    expect(result.success && result.data.title).toBe("Pets");
  });
});
