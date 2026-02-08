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
        <Link to="/tasks" className="text-sm text-[var(--text-secondary)] no-underline hover:text-[var(--accent)]">
          &larr; Back to tasks
        </Link>
        <p className="text-red-400">Invalid task ID.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Link
        to="/tasks"
        className="text-sm text-[var(--text-secondary)] no-underline hover:text-[var(--accent)]"
      >
        &larr; Back to tasks
      </Link>
      <TaskDetail taskId={taskId} />
    </div>
  );
}
