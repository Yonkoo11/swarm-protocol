import { STATUS_LABELS, STATUS_COLORS } from "../../lib/constants";

export function StatusBadge({ status }: { status: number }) {
  return (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${STATUS_COLORS[status] ?? "border border-[#999] text-[#999]"}`}
    >
      {STATUS_LABELS[status] ?? "Unknown"}
    </span>
  );
}
