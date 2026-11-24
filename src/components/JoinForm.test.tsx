import { render, screen } from "@testing-library/react";
import { JoinForm } from "./JoinForm";

describe("JoinForm", () => {
  it("shows the code field and a join button", () => {
    render(<JoinForm action={async () => undefined} />);
    expect(screen.getByLabelText("Invite code")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Join room" })).toBeInTheDocument();
  });

  it("fills in the code from the link", () => {
    render(<JoinForm action={async () => undefined} defaultCode="AB12CD34" />);
    expect(screen.getByLabelText("Invite code")).toHaveValue("AB12CD34");
  });
});
