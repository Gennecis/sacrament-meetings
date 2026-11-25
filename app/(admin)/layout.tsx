export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <p className="rounded-md border border-accent-dark bg-accent px-4 py-2 text-sm font-medium text-brand">
        Bishopric tools. Sign-in for this area is added in Week 05.
      </p>
      {children}
    </div>
  );
}
