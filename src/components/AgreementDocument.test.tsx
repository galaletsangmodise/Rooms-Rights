import { render, screen } from "@testing-library/react";
import { AgreementDocument } from "./AgreementDocument";
import type { AgreementTerms } from "@/lib/agreement";

const terms: AgreementTerms = {
  landlord_name: "Mama Dineo",
  tenant_name: "Thandeka Dlamini",
  tenant_phone: "0821234567",
  property_name: "12 Mokoena Street",
  address: "12 Mokoena Street",
  suburb: "Soweto",
  room_label: "Room 1",
  start_date: "2026-12-01",
  notice_days: 30,
  rent_amount: 1200,
  rent_due_day: 1,
  deposit_amount: 1000,
  electricity: "prepaid_meter",
  water: "included",
  house_rules: "No loud music after 21:00",
  oral_notes: "",
};

describe("AgreementDocument", () => {
  it("shows the parties, rent, deposit and rules of a written agreement", () => {
    render(<AgreementDocument terms={terms} type="written" status="pending" />);

    expect(screen.getByText("Rental Agreement")).toBeInTheDocument();
    expect(screen.getByText("Mama Dineo")).toBeInTheDocument();
    expect(screen.getByText("Thandeka Dlamini")).toBeInTheDocument();
    expect(screen.getByText("R1,200 per month")).toBeInTheDocument();
    expect(screen.getByText("R1,000")).toBeInTheDocument();
    expect(screen.getByText("No loud music after 21:00")).toBeInTheDocument();
  });

  it("shows the recorded terms for an oral agreement", () => {
    render(
      <AgreementDocument
        terms={{ ...terms, oral_notes: "Rent is paid in cash on the 1st" }}
        type="oral"
        status="pending"
      />,
    );

    expect(screen.getByText("Record of Oral Agreement")).toBeInTheDocument();
    expect(screen.getByText("Rent is paid in cash on the 1st")).toBeInTheDocument();
  });

  it("shows when the agreement was accepted", () => {
    render(
      <AgreementDocument
        terms={terms}
        type="written"
        status="valid"
        acceptedAt="2026-11-24T08:00:00Z"
      />,
    );

    expect(screen.getByText(/Accepted by the tenant on 24 Nov 2026/)).toBeInTheDocument();
  });
});
