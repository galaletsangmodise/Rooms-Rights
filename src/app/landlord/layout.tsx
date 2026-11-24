import { requireRole } from "@/lib/auth";
import { BottomNav } from "@/components/BottomNav";

export default async function LandlordLayout({ children }: { children: React.ReactNode }) {
  await requireRole("landlord");
  return (
    <div className="pb-24">
      {children}
      <BottomNav role="landlord" />
    </div>
  );
}