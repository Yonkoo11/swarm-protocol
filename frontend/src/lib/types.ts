export interface Task {
  id: bigint;
  creator: `0x${string}`;
  assignee: `0x${string}`;
  reward: bigint;
  bondAmount: bigint;
  parentTaskId: bigint;
  status: number;
  descriptionHash: string;
  proofHash: string;
  deadline: bigint;
  createdAt: bigint;
  childCount: bigint;
  childCompleted: bigint;
}

export interface Dispute {
  taskId: bigint;
  jurors: readonly [`0x${string}`, `0x${string}`, `0x${string}`];
  votes: readonly [boolean, boolean, boolean];
  voteCount: number;
  resolved: boolean;
}
