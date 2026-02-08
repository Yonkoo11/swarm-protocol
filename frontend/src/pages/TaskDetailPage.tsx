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
        <Breadcrumb id={id} />
        <hr className="rule" />
        <div className="flex flex-col items-center gap-3 border border-dashed border-[var(--border-primary)] py-12 text-center">
          <p className="m-0 text-sm text-[var(--danger)]">Invalid task ID.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Breadcrumb id={id} />
      <hr className="rule" />
      <TaskDetail taskId={taskId} />
    </div>
  );
}

function Breadcrumb({ id }: { id: string | undefined }) {
  return (
    <nav className="breadcrumb">
      <Link to="/tasks">Marketplace</Link>
      <span className="separator">/</span>
      <span>Task #{id ?? "?"}</span>
    </nav>
  );
}
