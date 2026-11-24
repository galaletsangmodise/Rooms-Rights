"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import type { Clause } from "@/lib/clauses";
import { cardCls } from "@/lib/ui";

export function ClauseLibrary({ clauses }: { clauses: Clause[] }) {
  const [copied, setCopied] = useState<string | null>(null);

  async function copy(clause: Clause) {
    try {
      await navigator.clipboard.writeText(clause.body);
      setCopied(clause.id);
    } catch {
      setCopied(null);
    }
  }

  if (clauses.length === 0) {
    return (
      <div className={cardCls}>
        <p className="font-bold">No clauses yet</p>
        <p className="mt-1 text-ink-soft">Ready-made clauses will appear here.</p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {clauses.map((clause) => (
        <li key={clause.id} className={cardCls}>
          <p className="font-bold">{clause.title}</p>
          <p className="mt-1 text-ink-soft">{clause.body}</p>
          <button
            type="button"
            onClick={() => copy(clause)}
            aria-label={`Copy ${clause.title}`}
            className="mt-3 flex items-center gap-2 rounded-full border-2 border-maroon px-4 py-2 text-sm font-bold text-maroon"
          >
            {copied === clause.id ? (
              <>
                <Check size={16} /> Copied
              </>
            ) : (
              <>
                <Copy size={16} /> Copy clause
              </>
            )}
          </button>
        </li>
      ))}
    </ul>
  );
}
