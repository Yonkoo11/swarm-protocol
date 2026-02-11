import { useAccount } from "wagmi";
import { useAllTasks } from "../../hooks/useSwarmCoordinator";
import { TaskStatus } from "../../lib/constants";
import { formatUsdc, formatDeadline } from "../../lib/formatters";
import type { Task } from "../../lib/types";

interface MineTabProps {
  onSelectTask: (task: Task) => void;
}

export function MineTab({ onSelectTask }: MineTabProps) {
  const { address } = useAccount();
  const { tasks } = useAllTasks();

  if (!address) {
    return (
      <div className="empty-state">
        <svg className="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L22 7V17L12 22L2 17V7Z"/>
          <circle cx="12" cy="10" r="3"/>
          <path d="M7 18c0-3 2.5-4.5 5-4.5s5 1.5 5 4.5"/>
        </svg>
        <span className="empty-state-text">Connect wallet to see your tasks</span>
      </div>
    );
  }

  const myCreated = tasks.filter(t => t.creator.toLowerCase() === address.toLowerCase());
  const myClaimed = tasks.filter(t => t.assignee.toLowerCase() === address.toLowerCase());

  const activeTasks = myClaimed.filter(t =>
    t.status === TaskStatus.Claimed || t.status === TaskStatus.Submitted
  );
  const completedTasks = myClaimed.filter(t => t.status === TaskStatus.Completed);
  const postedTasks = myCreated.filter(t => t.status === TaskStatus.Open);

  const totalEarned = completedTasks.reduce((sum, t) => sum + t.reward, 0n);

  return (
    <>
      <div className="earnings-card">
        <div className="earnings-label">Total Earned</div>
        <div className="earnings-amount">
          {formatUsdc(totalEarned)}<span className="currency">USDC</span>
        </div>
        <div className="earnings-stats">
          <div className="earnings-stat">
            <span className="earnings-stat-value">{completedTasks.length}</span>
            <span className="earnings-stat-label">Completed</span>
          </div>
          <div className="earnings-stat">
            <span className="earnings-stat-value">{activeTasks.length}</span>
            <span className="earnings-stat-label">Active</span>
          </div>
          <div className="earnings-stat">
            <span className="earnings-stat-value">{postedTasks.length}</span>
            <span className="earnings-stat-label">Posted</span>
          </div>
        </div>
      </div>

      {activeTasks.length > 0 && (
        <>
          <div className="section-header">Active ({activeTasks.length})</div>
          {activeTasks.map(task => (
            <div key={task.id.toString()} className="mine-task" onClick={() => onSelectTask(task)}>
              <div className="mine-task-info">
                <div className="mine-task-title">{task.descriptionHash || `Task #${task.id.toString()}`}</div>
                <div className="mine-task-meta">{formatDeadline(task.deadline)}</div>
              </div>
              <span className="mine-task-amount">${formatUsdc(task.reward)}</span>
            </div>
          ))}
        </>
      )}

      {completedTasks.length > 0 && (
        <>
          <div className={`section-header${activeTasks.length > 0 ? " mt-16" : ""}`}>
            Completed ({completedTasks.length})
          </div>
          {completedTasks.map(task => (
            <div key={task.id.toString()} className="mine-task" onClick={() => onSelectTask(task)}>
              <div className="mine-task-info">
                <div className="mine-task-title">{task.descriptionHash || `Task #${task.id.toString()}`}</div>
                <div className="mine-task-meta">Paid</div>
              </div>
              <span className="mine-task-amount">${formatUsdc(task.reward)}</span>
            </div>
          ))}
        </>
      )}

      {postedTasks.length > 0 && (
        <>
          <div className="section-header mt-16">My Posted Tasks ({postedTasks.length})</div>
          {postedTasks.map(task => (
            <div key={task.id.toString()} className="mine-task" onClick={() => onSelectTask(task)}>
              <div className="mine-task-info">
                <div className="mine-task-title">{task.descriptionHash || `Task #${task.id.toString()}`}</div>
                <div className="mine-task-meta">Open</div>
              </div>
              <span className="mine-task-amount">${formatUsdc(task.reward)}</span>
            </div>
          ))}
        </>
      )}

      {activeTasks.length === 0 && completedTasks.length === 0 && postedTasks.length === 0 && (
        <div className="empty-state">
          <span className="empty-state-text">No tasks yet</span>
          <span className="empty-state-hint">Claim a task from the Feed or post your own</span>
        </div>
      )}
    </>
  );
}
