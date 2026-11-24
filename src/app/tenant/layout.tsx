import { requireRole } from "@/lib/auth";
import { BottomNav } from "@/components/BottomNav";

export default async function TenantLayout({ children }: { children: React.ReactNode }) {
  await requireRole("tenant");
  return (
    <div className="pb-24">
      {children}
      <BottomNav role="tenant" />
    </div>
  );
}