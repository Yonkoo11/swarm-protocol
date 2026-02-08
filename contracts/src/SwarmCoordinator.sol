// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title SwarmCoordinator - Decentralized Agent Task Coordination Protocol
/// @notice Agents post USDC-funded tasks, other agents complete them, smart contract handles escrow.
/// @dev Supports task trees (decomposition), quality bonds, and basic dispute resolution.
contract SwarmCoordinator is ReentrancyGuard {
    using SafeERC20 for IERC20;

    // --- Types ---

    enum TaskStatus {
        Open,       // Posted, awaiting claim
        Claimed,    // Assigned to an agent
        Submitted,  // Work submitted, awaiting approval
        Disputed,   // In dispute resolution
        Completed,  // Done, payment released
        Cancelled   // Creator cancelled (before claim)
    }

    struct Task {
        uint256 id;
        address creator;
        address assignee;
        uint256 reward;         // USDC amount (6 decimals)
        uint256 bondAmount;     // Required quality bond from assignee
        uint256 parentTaskId;   // 0 = root task
        TaskStatus status;
        string descriptionHash; // IPFS hash or Moltbook post ID
        string proofHash;       // Submitted proof of work
        uint256 deadline;       // Completion deadline (timestamp)
        uint256 createdAt;
        uint256 childCount;     // Number of sub-tasks
        uint256 childCompleted; // Number of completed sub-tasks
    }

    struct Dispute {
        uint256 taskId;
        address[3] jurors;
        bool[3] votes;          // true = in favor of assignee
        uint8 voteCount;
        bool resolved;
    }

    // --- State ---

    IERC20 public immutable usdc;
    address public treasury;
    uint256 public taskCount;
    uint256 public disputeCount;

    uint256 public constant PLATFORM_FEE_BPS = 100; // 1%
    uint256 public constant JURY_FEE_BPS = 200;     // 2%
    uint256 public constant BPS_DENOMINATOR = 10000;
    uint256 public constant MIN_REWARD = 1e6;        // 1 USDC minimum

    mapping(uint256 => Task) public tasks;
    mapping(uint256 => Dispute) public disputes;
    mapping(address => bool) public registeredJurors;
    address[] public jurorPool;
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    // --- Events ---

    event TaskCreated(uint256 indexed taskId, address indexed creator, uint256 reward, uint256 parentTaskId, string descriptionHash);
    event TaskClaimed(uint256 indexed taskId, address indexed assignee, uint256 bondAmount);
    event WorkSubmitted(uint256 indexed taskId, string proofHash);
    event WorkApproved(uint256 indexed taskId, uint256 payout);
    event DisputeOpened(uint256 indexed taskId, uint256 indexed disputeId);
    event DisputeVoteCast(uint256 indexed disputeId, address indexed juror, bool inFavorOfAssignee);
    event DisputeResolved(uint256 indexed disputeId, uint256 indexed taskId, bool inFavorOfAssignee);
    event TaskCancelled(uint256 indexed taskId, uint256 refund);
    event JurorRegistered(address indexed juror);
    event JurorUnregistered(address indexed juror);

    // --- Errors ---

    error InvalidReward();
    error InvalidDeadline();
    error TaskNotOpen();
    error TaskNotSubmitted();
    error TaskNotClaimed();
    error TaskNotDisputed();
    error NotTaskCreator();
    error NotTaskAssignee();
    error CannotClaimOwnTask();
    error DeadlinePassed();
    error AlreadyRegisteredJuror();
    error NotRegisteredJuror();
    error InsufficientJurors();
    error JurorIsParty();
    error AlreadyVoted();
    error DisputeAlreadyResolved();
    error ChildTasksIncomplete();
    error ParentRewardExceeded();

    // --- Constructor ---

    constructor(address _usdc, address _treasury) {
        usdc = IERC20(_usdc);
        treasury = _treasury;
    }

    // --- Task Lifecycle ---

    /// @notice Create a new task with USDC reward deposited into escrow
    /// @param reward USDC amount for the task (6 decimals)
    /// @param bondRequired Quality bond the assignee must stake
    /// @param descriptionHash IPFS hash or Moltbook post ID describing the task
    /// @param deadline Timestamp by which work must be submitted
    /// @param parentTaskId Parent task ID (0 for root tasks)
    function createTask(
        uint256 reward,
        uint256 bondRequired,
        string calldata descriptionHash,
        uint256 deadline,
        uint256 parentTaskId
    ) external nonReentrant returns (uint256 taskId) {
        if (reward < MIN_REWARD) revert InvalidReward();
        if (deadline <= block.timestamp) revert InvalidDeadline();

        // If this is a sub-task, validate parent
        if (parentTaskId > 0) {
            Task storage parent = tasks[parentTaskId];
            if (parent.assignee != msg.sender) revert NotTaskAssignee();
            if (parent.status != TaskStatus.Claimed) revert TaskNotClaimed();

            // Check that sub-task rewards don't exceed parent reward
            uint256 allocatedReward = _getAllocatedChildReward(parentTaskId) + reward;
            if (allocatedReward > parent.reward) revert ParentRewardExceeded();

            parent.childCount++;
        }

        // Transfer USDC from creator to escrow
        usdc.safeTransferFrom(msg.sender, address(this), reward);

        taskCount++;
        taskId = taskCount;

        tasks[taskId] = Task({
            id: taskId,
            creator: msg.sender,
            assignee: address(0),
            reward: reward,
            bondAmount: bondRequired,
            parentTaskId: parentTaskId,
            status: TaskStatus.Open,
            descriptionHash: descriptionHash,
            proofHash: "",
            deadline: deadline,
            createdAt: block.timestamp,
            childCount: 0,
            childCompleted: 0
        });

        emit TaskCreated(taskId, msg.sender, reward, parentTaskId, descriptionHash);
    }

    /// @notice Claim an open task and stake quality bond
    function claimTask(uint256 taskId) external nonReentrant {
        Task storage task = tasks[taskId];
        if (task.status != TaskStatus.Open) revert TaskNotOpen();
        if (task.creator == msg.sender) revert CannotClaimOwnTask();
        if (block.timestamp >= task.deadline) revert DeadlinePassed();

        // Transfer bond from assignee to escrow
        if (task.bondAmount > 0) {
            usdc.safeTransferFrom(msg.sender, address(this), task.bondAmount);
        }

        task.assignee = msg.sender;
        task.status = TaskStatus.Claimed;

        emit TaskClaimed(taskId, msg.sender, task.bondAmount);
    }

    /// @notice Submit proof of completed work
    function submitWork(uint256 taskId, string calldata proofHash) external {
        Task storage task = tasks[taskId];
        if (task.status != TaskStatus.Claimed) revert TaskNotClaimed();
        if (task.assignee != msg.sender) revert NotTaskAssignee();
        if (task.childCount > 0 && task.childCompleted < task.childCount) revert ChildTasksIncomplete();

        task.proofHash = proofHash;
        task.status = TaskStatus.Submitted;

        emit WorkSubmitted(taskId, proofHash);
    }

    /// @notice Creator approves the submitted work, releasing payment
    function approveWork(uint256 taskId) external nonReentrant {
        Task storage task = tasks[taskId];
        if (task.status != TaskStatus.Submitted) revert TaskNotSubmitted();
        if (task.creator != msg.sender) revert NotTaskCreator();

        _completeTask(taskId);
    }

    /// @notice Cancel a task before it's claimed, refunding the creator
    function cancelTask(uint256 taskId) external nonReentrant {
        Task storage task = tasks[taskId];
        if (task.status != TaskStatus.Open) revert TaskNotOpen();
        if (task.creator != msg.sender) revert NotTaskCreator();

        task.status = TaskStatus.Cancelled;

        // Refund reward to creator
        usdc.safeTransfer(task.creator, task.reward);

        emit TaskCancelled(taskId, task.reward);
    }

    // --- Dispute Resolution ---

    /// @notice Creator opens a dispute on submitted work
    function openDispute(uint256 taskId) external nonReentrant {
        Task storage task = tasks[taskId];
        if (task.status != TaskStatus.Submitted) revert TaskNotSubmitted();
        if (task.creator != msg.sender) revert NotTaskCreator();
        if (jurorPool.length < 3) revert InsufficientJurors();

        task.status = TaskStatus.Disputed;

        disputeCount++;
        uint256 disputeId = disputeCount;

        // Select 3 pseudo-random jurors (not production-grade, adequate for testnet demo)
        address[3] memory selectedJurors = _selectJurors(task.creator, task.assignee, taskId);

        disputes[disputeId] = Dispute({
            taskId: taskId,
            jurors: selectedJurors,
            votes: [false, false, false],
            voteCount: 0,
            resolved: false
        });

        emit DisputeOpened(taskId, disputeId);
    }

    /// @notice Juror casts their vote on a dispute
    function castVote(uint256 disputeId, bool inFavorOfAssignee) external {
        Dispute storage dispute = disputes[disputeId];
        if (dispute.resolved) revert DisputeAlreadyResolved();

        // Find juror index
        uint8 jurorIndex = type(uint8).max;
        for (uint8 i = 0; i < 3; i++) {
            if (dispute.jurors[i] == msg.sender) {
                jurorIndex = i;
                break;
            }
        }
        if (jurorIndex == type(uint8).max) revert NotRegisteredJuror();
        if (hasVoted[disputeId][msg.sender]) revert AlreadyVoted();

        hasVoted[disputeId][msg.sender] = true;
        dispute.votes[jurorIndex] = inFavorOfAssignee;
        dispute.voteCount++;

        emit DisputeVoteCast(disputeId, msg.sender, inFavorOfAssignee);

        // Auto-resolve when all 3 votes are in
        if (dispute.voteCount == 3) {
            _resolveDispute(disputeId);
        }
    }

    // --- Juror Registry ---

    /// @notice Register as a juror
    function registerJuror() external {
        if (registeredJurors[msg.sender]) revert AlreadyRegisteredJuror();
        registeredJurors[msg.sender] = true;
        jurorPool.push(msg.sender);
        emit JurorRegistered(msg.sender);
    }

    // --- View Functions ---

    function getTask(uint256 taskId) external view returns (Task memory) {
        return tasks[taskId];
    }

    function getDispute(uint256 disputeId) external view returns (Dispute memory) {
        return disputes[disputeId];
    }

    function getJurorPoolSize() external view returns (uint256) {
        return jurorPool.length;
    }

    // --- Internal ---

    function _completeTask(uint256 taskId) internal {
        Task storage task = tasks[taskId];
        task.status = TaskStatus.Completed;

        // Calculate fees
        uint256 platformFee = (task.reward * PLATFORM_FEE_BPS) / BPS_DENOMINATOR;
        uint256 payout = task.reward - platformFee;

        // Pay assignee: reward - fee + bond return
        usdc.safeTransfer(task.assignee, payout + task.bondAmount);

        // Pay platform fee to treasury
        if (platformFee > 0) {
            usdc.safeTransfer(treasury, platformFee);
        }

        // Update parent if this is a sub-task
        if (task.parentTaskId > 0) {
            tasks[task.parentTaskId].childCompleted++;
        }

        emit WorkApproved(taskId, payout);
    }

    function _resolveDispute(uint256 disputeId) internal {
        Dispute storage dispute = disputes[disputeId];
        dispute.resolved = true;

        uint256 taskId = dispute.taskId;
        Task storage task = tasks[taskId];

        // Count votes in favor of assignee
        uint8 yesVotes = 0;
        for (uint8 i = 0; i < 3; i++) {
            if (dispute.votes[i]) yesVotes++;
        }

        bool inFavorOfAssignee = yesVotes >= 2;

        if (inFavorOfAssignee) {
            // Assignee wins: gets reward + bond back (minus jury fee)
            uint256 juryFee = (task.reward * JURY_FEE_BPS) / BPS_DENOMINATOR;
            uint256 payout = task.reward - juryFee;
            usdc.safeTransfer(task.assignee, payout + task.bondAmount);

            // Split jury fee among 3 jurors, remainder to treasury
            uint256 perJuror = juryFee / 3;
            uint256 remainder = juryFee - (perJuror * 3);
            for (uint8 i = 0; i < 3; i++) {
                if (perJuror > 0) {
                    usdc.safeTransfer(dispute.jurors[i], perJuror);
                }
            }
            if (remainder > 0) {
                usdc.safeTransfer(treasury, remainder);
            }
        } else {
            // Creator wins: gets reward back + assignee's bond (minus jury fee)
            uint256 juryFee = (task.bondAmount * JURY_FEE_BPS) / BPS_DENOMINATOR;
            uint256 creatorRefund = task.reward + task.bondAmount - juryFee;
            usdc.safeTransfer(task.creator, creatorRefund);

            // Split jury fee among 3 jurors, remainder to treasury
            uint256 perJuror = juryFee / 3;
            uint256 remainder = juryFee - (perJuror * 3);
            for (uint8 i = 0; i < 3; i++) {
                if (perJuror > 0) {
                    usdc.safeTransfer(dispute.jurors[i], perJuror);
                }
            }
            if (remainder > 0) {
                usdc.safeTransfer(treasury, remainder);
            }
        }

        // Update parent if this is a sub-task
        if (task.parentTaskId > 0) {
            tasks[task.parentTaskId].childCompleted++;
        }

        task.status = TaskStatus.Completed;

        emit DisputeResolved(disputeId, taskId, inFavorOfAssignee);
    }

    function _selectJurors(address creator, address assignee, uint256 taskId) internal view returns (address[3] memory selected) {
        uint256 poolSize = jurorPool.length;
        uint256 found = 0;
        uint256 seed = uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, taskId)));

        for (uint256 i = 0; i < poolSize && found < 3; i++) {
            uint256 idx = (seed + i) % poolSize;
            address candidate = jurorPool[idx];

            // Skip if candidate is a party to the task
            if (candidate == creator || candidate == assignee) continue;

            // Skip if already selected
            bool alreadySelected = false;
            for (uint256 j = 0; j < found; j++) {
                if (selected[j] == candidate) {
                    alreadySelected = true;
                    break;
                }
            }
            if (alreadySelected) continue;

            selected[found] = candidate;
            found++;
        }

        if (found < 3) revert InsufficientJurors();
    }

    function _getAllocatedChildReward(uint256 parentTaskId) internal view returns (uint256 total) {
        for (uint256 i = 1; i <= taskCount; i++) {
            if (tasks[i].parentTaskId == parentTaskId && tasks[i].status != TaskStatus.Cancelled) {
                total += tasks[i].reward;
            }
        }
    }
}
