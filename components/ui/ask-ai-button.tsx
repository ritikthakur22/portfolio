"use client";

export function AskAiButton({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <button type="button" onClick={() => dispatchEvent(new Event("open-chat"))} className={className}>
      {children}
    </button>
  );
}
