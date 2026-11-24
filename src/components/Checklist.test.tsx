import { render, screen } from "@testing-library/react";
import { Checklist } from "./Checklist";

describe("Checklist", () => {
  const items = [
    { label: "Agreement documented", done: true, href: "/a" },
    { label: "Add emergency contact", done: false, href: "/b" },
  ];

  it("shows the title and every item as a link", () => {
    render(<Checklist title="Your rental checklist" items={items} />);
    expect(screen.getByText("Your rental checklist")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Agreement documented/ })).toHaveAttribute("href", "/a");
    expect(screen.getByRole("link", { name: /Add emergency contact/ })).toHaveAttribute("href", "/b");
  });

  it("tells screen readers which items are done", () => {
    render(<Checklist title="List" items={items} />);
    expect(screen.getByText("Done")).toBeInTheDocument();
    expect(screen.getByText("To do")).toBeInTheDocument();
  });
});
