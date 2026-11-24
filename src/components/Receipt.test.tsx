import { render, screen } from "@testing-library/react";
import { Receipt, type ReceiptData } from "./Receipt";

const data: ReceiptData = {
  receipt_no: "RR-2611-0001",
  kind: "rent",
  amount: 1200,
  period: "2026-11-01",
  paid_on: "2026-11-05",
  method: "cash",
  note: null,
  voided_at: null,
  void_reason: null,
  room_label: "Room 1",
  property_name: "House A",
  property_address: "1 Main Road",
  landlord_name: "Landlord One",
  tenant_name: "Tenant One",
};

describe("Receipt", () => {
  it("shows the receipt number, amount and both names", () => {
    render(<Receipt data={data} />);
    expect(screen.getByText("RR-2611-0001")).toBeInTheDocument();
    expect(screen.getByText("R1,200")).toBeInTheDocument();
    expect(screen.getByText("Landlord One")).toBeInTheDocument();
    expect(screen.getByText("Tenant One")).toBeInTheDocument();
  });

  it("shows the room and property", () => {
    render(<Receipt data={data} />);
    expect(screen.getByText(/Room 1/)).toBeInTheDocument();
    expect(screen.getByText(/1 Main Road/)).toBeInTheDocument();
  });

  it("shows what the payment is for", () => {
    render(<Receipt data={data} />);
    expect(screen.getByText("Rent for November 2026")).toBeInTheDocument();
  });

  it("shows a VOID notice with the reason", () => {
    render(<Receipt data={{ ...data, voided_at: "2026-11-06T00:00:00Z", void_reason: "Typo" }} />);
    expect(screen.getByText("VOID")).toBeInTheDocument();
    expect(screen.getByText(/Typo/)).toBeInTheDocument();
  });
});
