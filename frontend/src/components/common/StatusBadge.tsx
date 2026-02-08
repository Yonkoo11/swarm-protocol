import { STATUS_LABELS, STATUS_COLORS } from "../../lib/constants";

export function StatusBadge({ status }: { status: number }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[status] ?? "bg-gray-500/20 text-gray-400"}`}
    >
      {STATUS_LABELS[status] ?? "Unknown"}
    </span>
  );
}
