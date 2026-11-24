const CODE_PATTERN = /^[0-9A-F]{8}$/;

export function normaliseCode(input: string): string {
  return input.replace(/[\s-]/g, "").toUpperCase();
}

export function isValidCode(code: string): boolean {
  return CODE_PATTERN.test(code);
}

export function joinLink(origin: string, code: string): string {
  return `${origin}/tenant/join?code=${code}`;
}

export function whatsappMessage(args: {
  tenantName: string;
  roomLabel: string;
  link: string;
  code: string;
}): string {
  return `Hi ${args.tenantName}, here is your rental agreement for ${args.roomLabel} on Rooms&Rights. Open ${args.link} to review and accept it. If the link does not work, log in as a tenant and enter this code: ${args.code}`;
}

export function whatsappUrl(message: string): string {
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}
