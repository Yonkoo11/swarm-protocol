import { CreateTaskForm } from "../components/tasks/CreateTaskForm";

export function CreateTaskPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="m-0 text-2xl md:text-3xl">Post a Task</h2>
        <p className="m-0 mt-1.5 text-sm text-[var(--text-tertiary)] italic">
          Set a reward in USDC. Workers stake a bond to claim it.
        </p>
      </div>
      <CreateTaskForm />
    </div>
  );
}
