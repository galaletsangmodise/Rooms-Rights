import { signOut } from "@/app/auth/actions";
import type { Profile } from "@/lib/auth";
import { btnOutline, cardCls } from "@/lib/ui";

export function ProfileCard({ profile }: { profile: Profile }) {
  return (
    <div className="mx-auto max-w-3xl px-5 pt-8">
      <h1 className="text-3xl font-extrabold">Profile</h1>
      <div className={`${cardCls} mt-6`}>
        <p className="text-sm text-ink-soft">Name</p>
        <p className="font-bold">{profile.full_name || "Not set"}</p>
        <p className="mt-4 text-sm text-ink-soft">Role</p>
        <p className="font-bold capitalize">{profile.role}</p>
      </div>
      <form action={signOut} className="mt-6">
        <button type="submit" className={btnOutline}>
          Log out
        </button>
      </form>
    </div>
  );
}