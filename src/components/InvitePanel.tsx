import { MessageCircle } from "lucide-react";
import { formatDate } from "@/lib/format";
import { btnOutline, btnPrimary, cardCls } from "@/lib/ui";
import { createInvite, revokeInvite } from "@/app/landlord/agreements/invite-actions";

type ActiveInvite = {
  code: string;
  link: string;
  qrDataUrl: string;
  expiresAt: string;
  whatsappUrl: string;
};

export function InvitePanel({
  agreementId,
  tenancyId,
  invite,
}: {
  agreementId: string;
  tenancyId: string;
  invite: ActiveInvite | null;
}) {
  if (!invite) {
    return (
      <div className={cardCls}>
        <h2 className="text-lg font-bold">Invite your tenant</h2>
        <p className="mt-1 mb-4 text-ink-soft">
          Create a code. Your tenant uses it to join the room, review the agreement and accept it.
        </p>
        <form action={createInvite.bind(null, agreementId)}>
          <button type="submit" className={btnPrimary}>
            Create invite
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className={`${cardCls} text-center`}>
      <h2 className="text-lg font-bold">Invite your tenant</h2>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={invite.qrDataUrl} alt="QR code for the invite link" width={220} height={220} className="mx-auto mt-4" />

      <p className="mt-2 text-sm text-ink-soft">Or enter this code</p>
      <p className="text-4xl font-extrabold tracking-widest">{invite.code}</p>
      <p className="mt-2 break-all text-xs text-ink-soft">{invite.link}</p>
      <p className="mt-2 text-sm text-ink-soft">
        This code works once and expires on {formatDate(invite.expiresAt)}.
      </p>

      <div className="mt-5 space-y-3">
        <a href={invite.whatsappUrl} target="_blank" rel="noreferrer" className={btnPrimary}>
          <MessageCircle size={20} /> Share on WhatsApp
        </a>
        <form action={createInvite.bind(null, agreementId)}>
          <button type="submit" className={btnOutline}>
            Make a new code
          </button>
        </form>
        <form action={revokeInvite.bind(null, tenancyId, agreementId)}>
          <button type="submit" className="text-sm font-semibold text-orange underline">
            Cancel this invite
          </button>
        </form>
      </div>
    </div>
  );
}
