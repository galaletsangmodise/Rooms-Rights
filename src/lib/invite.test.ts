import { isValidCode, joinLink, normaliseCode, whatsappMessage, whatsappUrl } from "./invite";

describe("normaliseCode", () => {
  it("removes spaces and dashes and uppercases", () => {
    expect(normaliseCode(" ab12 cd34 ")).toBe("AB12CD34");
    expect(normaliseCode("ab12-cd34")).toBe("AB12CD34");
  });
});

describe("isValidCode", () => {
  it("accepts 8 hexadecimal characters", () => {
    expect(isValidCode("AB12CD34")).toBe(true);
  });

  it("rejects short codes and non-hex letters", () => {
    expect(isValidCode("AB12")).toBe(false);
    expect(isValidCode("ZZZZZZZZ")).toBe(false);
    expect(isValidCode("")).toBe(false);
  });
});

describe("joinLink", () => {
  it("builds the link a tenant opens", () => {
    expect(joinLink("https://rooms.example.com", "AB12CD34")).toBe(
      "https://rooms.example.com/tenant/join?code=AB12CD34",
    );
  });
});

describe("whatsapp sharing", () => {
  const message = whatsappMessage({
    tenantName: "Thandeka",
    roomLabel: "Room 1",
    link: "https://rooms.example.com/tenant/join?code=AB12CD34",
    code: "AB12CD34",
  });

  it("includes the tenant, room, link and code in the message", () => {
    expect(message).toContain("Thandeka");
    expect(message).toContain("Room 1");
    expect(message).toContain("https://rooms.example.com/tenant/join?code=AB12CD34");
    expect(message).toContain("AB12CD34");
  });

  it("builds a WhatsApp link with the message encoded", () => {
    const url = whatsappUrl(message);
    expect(url.startsWith("https://wa.me/?text=")).toBe(true);
    expect(url).not.toContain(" ");
  });
});
