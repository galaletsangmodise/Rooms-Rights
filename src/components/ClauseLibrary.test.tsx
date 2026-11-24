import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ClauseLibrary } from "./ClauseLibrary";

const clauses = [
  { id: "1", title: "Visitors", body: "Visitors are welcome during the day." },
  { id: "2", title: "Quiet hours", body: "Keep noise down at night." },
];

describe("ClauseLibrary", () => {
  it("shows every clause", () => {
    render(<ClauseLibrary clauses={clauses} />);
    expect(screen.getByText("Visitors")).toBeInTheDocument();
    expect(screen.getByText("Quiet hours")).toBeInTheDocument();
  });

  it("shows a message when the library is empty", () => {
    render(<ClauseLibrary clauses={[]} />);
    expect(screen.getByText("No clauses yet")).toBeInTheDocument();
  });

  it("copies a clause to the clipboard", async () => {
    const user = userEvent.setup();
    render(<ClauseLibrary clauses={clauses} />);

    await user.click(screen.getAllByRole("button", { name: /copy/i })[0]);

    expect(await navigator.clipboard.readText()).toBe("Visitors are welcome during the day.");
    expect(screen.getByText("Copied")).toBeInTheDocument();
  });
});
