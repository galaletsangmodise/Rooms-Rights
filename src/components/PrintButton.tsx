"use client";

import { Printer } from "lucide-react";
import { btnOutline } from "@/lib/ui";

export function PrintButton() {
  return (
    <button type="button" onClick={() => window.print()} className={`${btnOutline} print:hidden`}>
      <Printer size={20} /> Print or save as PDF
    </button>
  );
}
