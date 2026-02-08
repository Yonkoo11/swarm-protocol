import { TaskList } from "../components/tasks/TaskList";
import { useTaskCount } from "../hooks/useSwarmCoordinator";

export function TasksPage() {
  const { data: taskCount } = useTaskCount();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-baseline gap-3">
        <h2 className="m-0 text-2xl font-bold">Tasks</h2>
        {taskCount != null && (
          <span className="text-sm text-[var(--text-secondary)]">
            {String(taskCount)} total
          </span>
        )}
      </div>
      <TaskList />
    </div>
  );
}
