import { formatDate, formatRand } from "./format";

describe("formatRand", () => {
  it("formats whole amounts with a comma and R prefix", () => {
    expect(formatRand(1200)).toBe("R1,200");
  });

  it("formats zero", () => {
    expect(formatRand(0)).toBe("R0");
  });
});

describe("formatDate", () => {
  it("formats a date as day, short month and year", () => {
    expect(formatDate("2026-11-12")).toBe("12 Nov 2026");
  });
});
