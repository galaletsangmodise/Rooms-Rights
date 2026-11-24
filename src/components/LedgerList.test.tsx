import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { LedgerList } from "./LedgerList";

vi.mock("@/app/actions/payments", () => ({
  voidPayment: vi.fn(),
  recordPayment: vi.fn(),
}));

const rent = {
  id: "p1",
  kind: "rent" as const,
  amount: 1200,
  period: "2026-11-01",
  paid_on: "2026-11-05",
  method: "cash",
  note: null,
  receipt_no: "RR-2611-0001",
  voided_at: null,
  void_reason: null,
};

describe("LedgerList", () => {
  it("shows an empty message when there are no payments", () => {
    render(<LedgerList payments={[]} receiptBase="/landlord/receipts" canVoid />);
    expect(screen.getByText("No payments yet")).toBeInTheDocument();
  });

  it("shows the amount, the month and a receipt link", () => {
    render(<LedgerList payments={[rent]} receiptBase="/landlord/receipts" canVoid={false} />);
    expect(screen.getByText("R1,200")).toBeInTheDocument();
    expect(screen.getByText(/November 2026/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /RR-2611-0001/ })).toHaveAttribute(
      "href",
      "/landlord/receipts/p1",
    );
  });

  it("marks voided payments", () => {
    render(
      <LedgerList
        payments={[{ ...rent, voided_at: "2026-11-06T00:00:00Z", void_reason: "Typo" }]}
        receiptBase="/landlord/receipts"
        canVoid
      />,
    );
    expect(screen.getByText("Voided")).toBeInTheDocument();
  });

  it("offers voiding only to the landlord", () => {
    const { rerender } = render(
      <LedgerList payments={[rent]} receiptBase="/landlord/receipts" canVoid />,
    );
    expect(screen.getByText("Void this payment")).toBeInTheDocument();

    rerender(<LedgerList payments={[rent]} receiptBase="/tenant/receipts" canVoid={false} />);
    expect(screen.queryByText("Void this payment")).not.toBeInTheDocument();
  });
});
