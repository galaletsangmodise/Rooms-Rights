import { formatRand } from "./format";

describe("formatRand", () => {
  it("formats whole amounts with a comma and R prefix", () => {
    expect(formatRand(1200)).toBe("R1,200");
  });

  it("formats zero", () => {
    expect(formatRand(0)).toBe("R0");
  });
});
