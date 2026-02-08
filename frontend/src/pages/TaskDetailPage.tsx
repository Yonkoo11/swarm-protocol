import { useParams, Link } from "react-router-dom";
import { TaskDetail } from "../components/tasks/TaskDetail";

export function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();

  let taskId: bigint;
  try {
    taskId = BigInt(id ?? "0");
  } catch {
    return (
      <div className="flex flex-col gap-4">
        <BackLink />
        <div className="flex flex-col items-center gap-3 rounded-[var(--radius-lg)] border border-dashed border-[var(--border-primary)] py-12 text-center">
          <p className="m-0 text-sm text-[var(--danger)]">Invalid task ID.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <BackLink />
      <TaskDetail taskId={taskId} />
    </div>
  );
}

function BackLink() {
  return (
    <Link
      to="/tasks"
      className="btn-press inline-flex w-fit items-center gap-1 px-2 py-1 text-sm text-[var(--text-tertiary)] no-underline hover:text-[var(--text-primary)]"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="19" y1="12" x2="5" y2="12" />
        <polyline points="12 19 5 12 12 5" />
      </svg>
      Back to tasks
    </Link>
  );
}
