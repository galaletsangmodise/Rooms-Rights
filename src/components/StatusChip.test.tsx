import { render, screen } from "@testing-library/react";
import { StatusChip } from "./StatusChip";

describe("StatusChip", () => {
  it("shows its text", () => {
    render(<StatusChip tone="green">Active</StatusChip>);
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("uses the green style for the green tone", () => {
    render(<StatusChip tone="green">Valid</StatusChip>);
    expect(screen.getByText("Valid")).toHaveClass("bg-forest-pale");
  });

  it("uses the orange style for the orange tone", () => {
    render(<StatusChip tone="orange">Pending</StatusChip>);
    expect(screen.getByText("Pending")).toHaveClass("bg-orange-pale");
  });
});