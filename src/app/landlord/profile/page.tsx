import { requireRole } from "@/lib/auth";
import { ProfileCard } from "@/components/ProfileCard";

export default async function LandlordProfile() {
  const profile = await requireRole("landlord");
  return <ProfileCard profile={profile} />;
}