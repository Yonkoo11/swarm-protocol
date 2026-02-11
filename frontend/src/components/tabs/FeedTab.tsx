import { useAllTasks } from "../../hooks/useSwarmCoordinator";
import { TaskCard } from "../tasks/TaskCard";
import type { Task } from "../../lib/types";

interface FeedTabProps {
  onSelectTask: (task: Task) => void;
}

export function FeedTab({ onSelectTask }: FeedTabProps) {
  const { tasks, isLoading } = useAllTasks();

  if (isLoading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {[1, 2, 3].map(i => (
          <div key={i} className="skeleton" style={{ height: 80, borderRadius: 8 }} />
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <svg className="empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L22 7V17L12 22L2 17V7Z"/>
          <path d="M12 2V12M22 7L12 12M2 7L12 12"/>
        </svg>
        <span className="empty-state-text">No tasks yet</span>
        <span className="empty-state-hint">Post the first task to the hive</span>
      </div>
    );
  }

  const sorted = [...tasks].sort((a, b) => Number(b.id - a.id));

  return (
    <>
      {sorted.map((task, index) => (
        <TaskCard
          key={task.id.toString()}
          task={task}
          index={index}
          onClick={() => onSelectTask(task)}
        />
      ))}
    </>
  );
}
