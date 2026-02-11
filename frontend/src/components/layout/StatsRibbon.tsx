import { useEffect, useRef } from "react";
import { useTaskCount, useAllTasks } from "../../hooks/useSwarmCoordinator";
import { formatUsdc } from "../../lib/formatters";
import { TaskStatus } from "../../lib/constants";

export function StatsRibbon() {
  const { data: taskCount } = useTaskCount();
  const { tasks } = useAllTasks();

  const totalPool = tasks.reduce((sum, t) => {
    if (t.status <= TaskStatus.Submitted) return sum + t.reward;
    return sum;
  }, 0n);

  const activeWorkers = new Set(
    tasks
      .filter(t => t.status === TaskStatus.Claimed || t.status === TaskStatus.Submitted)
      .map(t => t.assignee)
  ).size;

  return (
    <div className="stats-ribbon">
      <div className="stat-item">
        <CountUp value={Number(taskCount ?? 0n)} />
        <span className="stat-label">Tasks</span>
      </div>
      <div className="stat-item">
        <CountUp value={Math.round(Number(formatUsdc(totalPool)))} prefix="$" className="amber" />
        <span className="stat-label">Pool</span>
      </div>
      <div className="stat-item">
        <CountUp value={activeWorkers} />
        <span className="stat-label">Workers</span>
      </div>
    </div>
  );
}

function CountUp({ value, prefix = "", className = "" }: { value: number; prefix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const prevValue = useRef(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const start = prevValue.current;
    const end = value;
    prevValue.current = value;

    if (start === end) {
      el.textContent = prefix + end.toLocaleString();
      return;
    }

    const duration = 800;
    const startTime = performance.now();

    function update(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (end - start) * eased);
      el!.textContent = prefix + current.toLocaleString();
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }, [value, prefix]);

  return (
    <span ref={ref} className={`stat-value ${className}`}>
      {prefix}0
    </span>
  );
}
