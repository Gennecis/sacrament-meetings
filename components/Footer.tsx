import { WARD_NAME } from "./Header";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-line bg-surface print:hidden">
      <div className="mx-auto max-w-5xl px-4 py-6 text-sm text-muted">
        <p>{WARD_NAME} Sacrament Meeting Planner</p>
        <p>WDD 430 project by Pascal Okezie</p>
      </div>
    </footer>
  );
}
