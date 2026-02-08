import { CreateTaskForm } from "../components/tasks/CreateTaskForm";

export function CreateTaskPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="m-0 text-xl font-semibold">Create Task</h2>
        <p className="m-0 mt-1 text-sm text-[var(--text-tertiary)]">
          Post a task with a USDC reward. Workers stake a bond to claim it.
        </p>
      </div>
      <CreateTaskForm />
    </div>
  );
}
