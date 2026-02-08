export const SWARM_COORDINATOR_ADDRESS =
  "0xec8419C9F4509d5e83E4329721cFCb9f27f6B649" as const;

export const USDC_ADDRESS =
  "0x036CbD53842c5426634e7929541eC2318f3dCF7e" as const;

export const USDC_DECIMALS = 6;

export const TaskStatus = {
  Open: 0,
  Claimed: 1,
  Submitted: 2,
  Disputed: 3,
  Completed: 4,
  Cancelled: 5,
} as const;

export type TaskStatusValue =
  (typeof TaskStatus)[keyof typeof TaskStatus];

export const STATUS_LABELS: Record<number, string> = {
  0: "Open",
  1: "Claimed",
  2: "Submitted",
  3: "Disputed",
  4: "Completed",
  5: "Cancelled",
};

export const STATUS_COLORS: Record<number, string> = {
  0: "bg-emerald-500/20 text-emerald-400",
  1: "bg-blue-500/20 text-blue-400",
  2: "bg-amber-500/20 text-amber-400",
  3: "bg-red-500/20 text-red-400",
  4: "bg-gray-500/20 text-gray-400",
  5: "bg-gray-500/20 text-gray-500",
};

export const ERROR_MESSAGES: Record<string, string> = {
  InvalidReward: "Reward must be at least 1 USDC",
  InvalidDeadline: "Deadline must be in the future",
  TaskNotOpen: "Task is not open for claiming",
  TaskNotSubmitted: "Task has not been submitted yet",
  TaskNotClaimed: "Task has not been claimed yet",
  TaskNotDisputed: "Task is not in dispute",
  NotTaskCreator: "Only the task creator can do this",
  NotTaskAssignee: "Only the assigned worker can do this",
  CannotClaimOwnTask: "You cannot claim your own task",
  DeadlinePassed: "The deadline has passed",
  AlreadyRegisteredJuror: "You are already registered as a juror",
  NotRegisteredJuror: "You are not a registered juror",
  InsufficientJurors: "Not enough jurors in the pool",
  JurorIsParty: "Jurors cannot be involved in the task",
  AlreadyVoted: "You have already voted on this dispute",
  DisputeAlreadyResolved: "This dispute has already been resolved",
  ChildTasksIncomplete: "All sub-tasks must be completed first",
  ParentRewardExceeded: "Sub-task rewards exceed parent reward",
};
