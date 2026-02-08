import { CreateTaskForm } from "../components/tasks/CreateTaskForm";

export function CreateTaskPage() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="m-0 text-2xl font-bold">Create Task</h2>
      <p className="m-0 text-sm text-[var(--text-secondary)]">
        Post a task with a USDC reward. Workers bond USDC to claim it.
      </p>
      <CreateTaskForm />
    </div>
  );
}
