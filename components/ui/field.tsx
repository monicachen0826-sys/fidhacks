export function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <label className="mb-1.5 block text-sm font-medium">{label}</label>
      {hint && <p className="mb-1.5 text-xs text-muted">{hint}</p>}
      {children}
    </div>
  );
}
