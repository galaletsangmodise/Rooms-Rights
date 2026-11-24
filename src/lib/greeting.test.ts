import { greetingForHour } from "./greeting";

describe("greetingForHour", () => {
  it("says good morning before noon", () => {
    expect(greetingForHour(0)).toBe("Good morning");
    expect(greetingForHour(11)).toBe("Good morning");
  });

  it("says good afternoon from noon until 18:00", () => {
    expect(greetingForHour(12)).toBe("Good afternoon");
    expect(greetingForHour(17)).toBe("Good afternoon");
  });

  it("says good evening from 18:00", () => {
    expect(greetingForHour(18)).toBe("Good evening");
    expect(greetingForHour(23)).toBe("Good evening");
  });
});