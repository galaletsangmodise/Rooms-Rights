import { render, screen } from "@testing-library/react";
import { MoneySummary } from "./MoneySummary";

const ledger = {
  monthsDue: 3,
  expected: 3600,
  paidRent: 2400,
  arrears: 1200,
  depositPaid: 1200,
  currentMonthPaid: false,
};

describe("MoneySummary", () => {
  it("shows the monthly rent and what is owing", () => {
    render(<MoneySummary rent={1200} ledger={ledger} />);
    expect(screen.getByText("R1,200 a month")).toBeInTheDocument();
    expect(screen.getByText("R1,200 owing")).toBeInTheDocument();
  });

  it("shows rent due this month when this month is unpaid", () => {
    render(<MoneySummary rent={1200} ledger={ledger} />);
    expect(screen.getByText("Rent due this month")).toBeInTheDocument();
  });

  it("shows paid and up to date when nothing is owed", () => {
    render(
      <MoneySummary
        rent={1200}
        ledger={{ ...ledger, arrears: 0, paidRent: 3600, currentMonthPaid: true }}
      />,
    );
    expect(screen.getByText("Paid this month")).toBeInTheDocument();
    expect(screen.getByText("Up to date")).toBeInTheDocument();
  });

  it("shows the deposit paid", () => {
    render(<MoneySummary rent={1200} ledger={ledger} />);
    expect(screen.getByText("Deposit paid: R1,200")).toBeInTheDocument();
  });
});
