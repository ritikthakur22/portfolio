"use client";

import { OPEN_RESUME_EVENT } from "./resume-dialog";

export function ResumeLink({ className }: { className?: string }) {
  return (
    <button type="button" onClick={() => dispatchEvent(new Event(OPEN_RESUME_EVENT))} className={className}>
      Get the full resume by email
    </button>
  );
}
