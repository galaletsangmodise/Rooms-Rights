import { requireRole } from "@/lib/auth";
import { ProfileCard } from "@/components/ProfileCard";

export default async function TenantProfile() {
  const profile = await requireRole("tenant");
  return <ProfileCard profile={profile} />;
}