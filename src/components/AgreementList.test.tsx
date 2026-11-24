import { render, screen } from "@testing-library/react";
import { AgreementList } from "./AgreementList";

const rows = [
  {
    id: "1",
    type: "written" as const,
    status: "valid" as const,
    created_at: "2026-11-12T10:00:00Z",
    terms: { room_label: "Room 01", tenant_name: "Thandeka", landlord_name: "Mama Dineo" },
  },
  {
    id: "2",
    type: "oral" as const,
    status: "pending" as const,
    created_at: "2026-11-13T10:00:00Z",
    terms: { room_label: "Room 02", tenant_name: "Thabo", landlord_name: "Mama Dineo" },
  },
];

describe("AgreementList", () => {
  it("shows each agreement with its status", () => {
    render(
      <AgreementList agreements={rows} basePath="/landlord/agreements" counterpart="tenant" emptyMessage="None" />,
    );

    expect(screen.getByText("Room 01 Agreement")).toBeInTheDocument();
    expect(screen.getByText("Valid")).toBeInTheDocument();
    expect(screen.getByText("Room 02 Agreement")).toBeInTheDocument();
    expect(screen.getByText("Pending")).toBeInTheDocument();
  });

  it("links each agreement to its page", () => {
    render(
      <AgreementList agreements={rows} basePath="/landlord/agreements" counterpart="tenant" emptyMessage="None" />,
    );

    expect(screen.getByRole("link", { name: /Room 01 Agreement/ })).toHaveAttribute(
      "href",
      "/landlord/agreements/1",
    );
  });

  it("shows the empty message when there are no agreements", () => {
    render(
      <AgreementList
        agreements={[]}
        basePath="/landlord/agreements"
        counterpart="tenant"
        emptyMessage="No agreements yet"
      />,
    );

    expect(screen.getByText("No agreements yet")).toBeInTheDocument();
  });
});
