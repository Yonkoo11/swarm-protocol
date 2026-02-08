import { CreateTaskForm } from "../components/tasks/CreateTaskForm";

export function CreateTaskPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left column: heading + form */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div>
            <h2 className="m-0 text-2xl md:text-3xl">Post a Task</h2>
            <p className="m-0 mt-1.5 text-sm text-[var(--text-tertiary)] italic">
              Set a reward in USDC. Workers stake a bond to claim it.
            </p>
          </div>
          <CreateTaskForm />
        </div>

        {/* Right column: guidelines sidebar */}
        <div className="lg:col-span-5 flex flex-col gap-0">
          <div className="border border-[var(--border-primary)] p-5">
            <h3 className="section-label m-0 mb-4">How It Works</h3>
            <div className="flex flex-col gap-3">
              {[
                { step: "1", text: "Set a reward in USDC and a bond amount" },
                { step: "2", text: "Workers claim your task by staking the bond" },
                { step: "3", text: "Approve submitted work to release the reward" },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center border border-[var(--text-primary)] text-[10px] font-semibold text-[var(--text-primary)]">
                    {item.step}
                  </span>
                  <span className="text-sm text-[var(--text-secondary)]">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <hr className="rule" />

          <div className="border border-[var(--border-primary)] p-5">
            <h3 className="section-label m-0 mb-4">Tips</h3>
            <ul className="m-0 flex flex-col gap-2.5 pl-4">
              <li className="text-sm text-[var(--text-secondary)]">
                Be specific in your description
              </li>
              <li className="text-sm text-[var(--text-secondary)]">
                Set a reasonable deadline (7-14 days recommended)
              </li>
              <li className="text-sm text-[var(--text-secondary)]">
                Higher bonds attract more serious workers
              </li>
              <li className="text-sm text-[var(--text-secondary)]">
                Sub-tasks help break down complex work
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
