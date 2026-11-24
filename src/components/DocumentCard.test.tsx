import { render, screen } from "@testing-library/react";
import { DocumentCard } from "./DocumentCard";

const pdf = {
  id: "1",
  file_name: "agreement.pdf",
  file_size: 245 * 1024,
  mime_type: "application/pdf",
  type: "agreement",
  visibility: "shared",
  created_at: "2026-11-12T10:00:00Z",
};

describe("DocumentCard", () => {
  it("shows the name, kind and size", () => {
    render(<DocumentCard doc={pdf} url="https://example.com/a.pdf" />);
    expect(screen.getByText("agreement.pdf")).toBeInTheDocument();
    expect(screen.getByText("PDF · 245 KB")).toBeInTheDocument();
  });

  it("opens the file in a new tab", () => {
    render(<DocumentCard doc={pdf} url="https://example.com/a.pdf" />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "https://example.com/a.pdf");
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("shows a thumbnail for photos", () => {
    render(
      <DocumentCard
        doc={{ ...pdf, file_name: "room.jpg", mime_type: "image/jpeg", type: "photo" }}
        url="https://example.com/room.jpg"
      />,
    );
    expect(screen.getByRole("img", { name: "room.jpg" })).toBeInTheDocument();
  });

  it("marks landlord-only files when asked to", () => {
    render(
      <DocumentCard doc={{ ...pdf, visibility: "landlord_only" }} url="https://example.com/a.pdf" showVisibility />,
    );
    expect(screen.getByText("Only me")).toBeInTheDocument();
  });

  it("does not mark landlord-only files when not asked to", () => {
    render(<DocumentCard doc={{ ...pdf, visibility: "landlord_only" }} url="https://example.com/a.pdf" />);
    expect(screen.queryByText("Only me")).not.toBeInTheDocument();
  });
});
