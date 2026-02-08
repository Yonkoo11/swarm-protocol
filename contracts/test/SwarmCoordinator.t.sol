// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {SwarmCoordinator} from "../src/SwarmCoordinator.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @dev Mock USDC for testing (6 decimals like real USDC)
contract MockUSDC is ERC20 {
    constructor() ERC20("USD Coin", "USDC") {}

    function decimals() public pure override returns (uint8) {
        return 6;
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}

contract SwarmCoordinatorTest is Test {
    SwarmCoordinator public escrow;
    MockUSDC public usdc;

    address public treasury = makeAddr("treasury");
    address public alice = makeAddr("alice");     // Task creator
    address public bob = makeAddr("bob");         // Task assignee
    address public juror1 = makeAddr("juror1");
    address public juror2 = makeAddr("juror2");
    address public juror3 = makeAddr("juror3");

    uint256 constant REWARD = 10e6;    // 10 USDC
    uint256 constant BOND = 2e6;       // 2 USDC
    uint256 constant ONE_DAY = 1 days;

    function setUp() public {
        usdc = new MockUSDC();
        escrow = new SwarmCoordinator(address(usdc), treasury);

        // Fund agents
        usdc.mint(alice, 100e6);
        usdc.mint(bob, 100e6);

        // Approve escrow
        vm.prank(alice);
        usdc.approve(address(escrow), type(uint256).max);
        vm.prank(bob);
        usdc.approve(address(escrow), type(uint256).max);
    }

    // --- Happy Path ---

    function test_createTask() public {
        vm.prank(alice);
        uint256 taskId = escrow.createTask(REWARD, BOND, "ipfs://task1", block.timestamp + ONE_DAY, 0);

        assertEq(taskId, 1);
        assertEq(usdc.balanceOf(address(escrow)), REWARD);

        SwarmCoordinator.Task memory task = escrow.getTask(taskId);
        assertEq(task.creator, alice);
        assertEq(task.reward, REWARD);
        assertEq(task.bondAmount, BOND);
        assertEq(uint8(task.status), uint8(SwarmCoordinator.TaskStatus.Open));
    }

    function test_claimTask() public {
        vm.prank(alice);
        uint256 taskId = escrow.createTask(REWARD, BOND, "ipfs://task1", block.timestamp + ONE_DAY, 0);

        vm.prank(bob);
        escrow.claimTask(taskId);

        assertEq(usdc.balanceOf(address(escrow)), REWARD + BOND);

        SwarmCoordinator.Task memory task = escrow.getTask(taskId);
        assertEq(task.assignee, bob);
        assertEq(uint8(task.status), uint8(SwarmCoordinator.TaskStatus.Claimed));
    }

    function test_submitWork() public {
        vm.prank(alice);
        uint256 taskId = escrow.createTask(REWARD, BOND, "ipfs://task1", block.timestamp + ONE_DAY, 0);

        vm.prank(bob);
        escrow.claimTask(taskId);

        vm.prank(bob);
        escrow.submitWork(taskId, "ipfs://proof1");

        SwarmCoordinator.Task memory task = escrow.getTask(taskId);
        assertEq(uint8(task.status), uint8(SwarmCoordinator.TaskStatus.Submitted));
    }

    function test_approveWork() public {
        vm.prank(alice);
        uint256 taskId = escrow.createTask(REWARD, BOND, "ipfs://task1", block.timestamp + ONE_DAY, 0);

        vm.prank(bob);
        escrow.claimTask(taskId);

        vm.prank(bob);
        escrow.submitWork(taskId, "ipfs://proof1");

        uint256 bobBalanceBefore = usdc.balanceOf(bob);

        vm.prank(alice);
        escrow.approveWork(taskId);

        SwarmCoordinator.Task memory task = escrow.getTask(taskId);
        assertEq(uint8(task.status), uint8(SwarmCoordinator.TaskStatus.Completed));

        // Bob gets reward - 1% platform fee + bond back
        uint256 platformFee = (REWARD * 100) / 10000; // 1% = 0.1 USDC
        uint256 expectedPayout = REWARD - platformFee + BOND;
        assertEq(usdc.balanceOf(bob), bobBalanceBefore + expectedPayout);

        // Treasury gets platform fee
        assertEq(usdc.balanceOf(treasury), platformFee);

        // Escrow should be empty
        assertEq(usdc.balanceOf(address(escrow)), 0);
    }

    function test_cancelTask() public {
        uint256 aliceBalanceBefore = usdc.balanceOf(alice);

        vm.prank(alice);
        uint256 taskId = escrow.createTask(REWARD, BOND, "ipfs://task1", block.timestamp + ONE_DAY, 0);

        assertEq(usdc.balanceOf(alice), aliceBalanceBefore - REWARD);

        vm.prank(alice);
        escrow.cancelTask(taskId);

        // Full refund
        assertEq(usdc.balanceOf(alice), aliceBalanceBefore);

        SwarmCoordinator.Task memory task = escrow.getTask(taskId);
        assertEq(uint8(task.status), uint8(SwarmCoordinator.TaskStatus.Cancelled));
    }

    // --- Dispute Resolution ---

    function test_disputeFlow_assigneeWins() public {
        _registerJurors();

        vm.prank(alice);
        uint256 taskId = escrow.createTask(REWARD, BOND, "ipfs://task1", block.timestamp + ONE_DAY, 0);

        vm.prank(bob);
        escrow.claimTask(taskId);

        vm.prank(bob);
        escrow.submitWork(taskId, "ipfs://proof1");

        // Alice opens dispute
        vm.prank(alice);
        escrow.openDispute(taskId);

        uint256 bobBalanceBefore = usdc.balanceOf(bob);

        // All 3 jurors vote in favor of assignee
        vm.prank(juror1);
        escrow.castVote(1, true);
        vm.prank(juror2);
        escrow.castVote(1, true);
        vm.prank(juror3);
        escrow.castVote(1, false);

        // Bob wins (2/3 majority)
        SwarmCoordinator.Task memory task = escrow.getTask(taskId);
        assertEq(uint8(task.status), uint8(SwarmCoordinator.TaskStatus.Completed));

        // Bob gets reward - jury fee + bond back
        uint256 juryFee = (REWARD * 200) / 10000; // 2%
        uint256 expectedPayout = REWARD - juryFee + BOND;
        assertEq(usdc.balanceOf(bob), bobBalanceBefore + expectedPayout);
    }

    function test_disputeFlow_creatorWins() public {
        _registerJurors();

        vm.prank(alice);
        uint256 taskId = escrow.createTask(REWARD, BOND, "ipfs://task1", block.timestamp + ONE_DAY, 0);

        vm.prank(bob);
        escrow.claimTask(taskId);

        vm.prank(bob);
        escrow.submitWork(taskId, "ipfs://proof1");

        vm.prank(alice);
        escrow.openDispute(taskId);

        uint256 aliceBalanceBefore = usdc.balanceOf(alice);

        // 2 of 3 jurors vote against assignee
        vm.prank(juror1);
        escrow.castVote(1, false);
        vm.prank(juror2);
        escrow.castVote(1, false);
        vm.prank(juror3);
        escrow.castVote(1, true);

        // Alice gets reward + bond back - jury fee from bond
        uint256 juryFee = (BOND * 200) / 10000; // 2% of bond
        uint256 expectedRefund = REWARD + BOND - juryFee;
        assertEq(usdc.balanceOf(alice), aliceBalanceBefore + expectedRefund);
    }

    function test_revert_doubleVote() public {
        _registerJurors();

        vm.prank(alice);
        uint256 taskId = escrow.createTask(REWARD, BOND, "ipfs://task1", block.timestamp + ONE_DAY, 0);

        vm.prank(bob);
        escrow.claimTask(taskId);

        vm.prank(bob);
        escrow.submitWork(taskId, "ipfs://proof1");

        vm.prank(alice);
        escrow.openDispute(taskId);

        // Juror votes once
        vm.prank(juror1);
        escrow.castVote(1, true);

        // Same juror tries to vote again - should revert
        vm.prank(juror1);
        vm.expectRevert(SwarmCoordinator.AlreadyVoted.selector);
        escrow.castVote(1, false);
    }

    function test_revert_claimWhenNotOpen() public {
        vm.prank(alice);
        uint256 taskId = escrow.createTask(REWARD, BOND, "ipfs://task1", block.timestamp + ONE_DAY, 0);

        // Bob claims
        vm.prank(bob);
        escrow.claimTask(taskId);

        // Charlie tries to claim the already-claimed task
        address charlie = makeAddr("charlie");
        usdc.mint(charlie, 100e6);
        vm.prank(charlie);
        usdc.approve(address(escrow), type(uint256).max);

        vm.prank(charlie);
        vm.expectRevert(SwarmCoordinator.TaskNotOpen.selector);
        escrow.claimTask(taskId);
    }

    function test_revert_submitWithoutClaim() public {
        vm.prank(alice);
        uint256 taskId = escrow.createTask(REWARD, BOND, "ipfs://task1", block.timestamp + ONE_DAY, 0);

        // Try to submit on an unclaimed (Open) task
        vm.prank(bob);
        vm.expectRevert(SwarmCoordinator.TaskNotClaimed.selector);
        escrow.submitWork(taskId, "ipfs://proof1");
    }

    function test_revert_disputeInsufficientJurors() public {
        // Only register 2 jurors (need 3)
        vm.prank(juror1);
        escrow.registerJuror();
        vm.prank(juror2);
        escrow.registerJuror();

        vm.prank(alice);
        uint256 taskId = escrow.createTask(REWARD, BOND, "ipfs://task1", block.timestamp + ONE_DAY, 0);

        vm.prank(bob);
        escrow.claimTask(taskId);

        vm.prank(bob);
        escrow.submitWork(taskId, "ipfs://proof1");

        vm.prank(alice);
        vm.expectRevert(SwarmCoordinator.InsufficientJurors.selector);
        escrow.openDispute(taskId);
    }

    // --- Access Control ---

    function test_revert_claimOwnTask() public {
        vm.prank(alice);
        uint256 taskId = escrow.createTask(REWARD, BOND, "ipfs://task1", block.timestamp + ONE_DAY, 0);

        vm.prank(alice);
        vm.expectRevert(SwarmCoordinator.CannotClaimOwnTask.selector);
        escrow.claimTask(taskId);
    }

    function test_revert_approveByNonCreator() public {
        vm.prank(alice);
        uint256 taskId = escrow.createTask(REWARD, BOND, "ipfs://task1", block.timestamp + ONE_DAY, 0);

        vm.prank(bob);
        escrow.claimTask(taskId);

        vm.prank(bob);
        escrow.submitWork(taskId, "ipfs://proof1");

        vm.prank(bob);
        vm.expectRevert(SwarmCoordinator.NotTaskCreator.selector);
        escrow.approveWork(taskId);
    }

    function test_revert_submitByNonAssignee() public {
        vm.prank(alice);
        uint256 taskId = escrow.createTask(REWARD, BOND, "ipfs://task1", block.timestamp + ONE_DAY, 0);

        vm.prank(bob);
        escrow.claimTask(taskId);

        vm.prank(alice);
        vm.expectRevert(SwarmCoordinator.NotTaskAssignee.selector);
        escrow.submitWork(taskId, "ipfs://proof1");
    }

    function test_revert_claimAfterDeadline() public {
        vm.prank(alice);
        uint256 taskId = escrow.createTask(REWARD, BOND, "ipfs://task1", block.timestamp + ONE_DAY, 0);

        vm.warp(block.timestamp + ONE_DAY + 1);

        vm.prank(bob);
        vm.expectRevert(SwarmCoordinator.DeadlinePassed.selector);
        escrow.claimTask(taskId);
    }

    function test_revert_rewardTooLow() public {
        vm.prank(alice);
        vm.expectRevert(SwarmCoordinator.InvalidReward.selector);
        escrow.createTask(0, 0, "ipfs://task1", block.timestamp + ONE_DAY, 0);
    }

    // --- Task Trees ---

    function test_taskDecomposition() public {
        // Alice creates a root task for 10 USDC
        vm.prank(alice);
        uint256 parentId = escrow.createTask(REWARD, BOND, "ipfs://parent", block.timestamp + ONE_DAY, 0);

        // Bob claims the root task
        vm.prank(bob);
        escrow.claimTask(parentId);

        // Bob decomposes into 2 sub-tasks (4 USDC each, keeps 2 USDC as coordination fee)
        // For sub-tasks, bob needs USDC to fund them
        vm.startPrank(bob);
        uint256 child1 = escrow.createTask(4e6, 1e6, "ipfs://child1", block.timestamp + ONE_DAY, parentId);
        uint256 child2 = escrow.createTask(4e6, 1e6, "ipfs://child2", block.timestamp + ONE_DAY, parentId);
        vm.stopPrank();

        SwarmCoordinator.Task memory parent = escrow.getTask(parentId);
        assertEq(parent.childCount, 2);
        assertEq(child1, 2);
        assertEq(child2, 3);
    }

    // --- Helpers ---

    function _registerJurors() internal {
        vm.prank(juror1);
        escrow.registerJuror();
        vm.prank(juror2);
        escrow.registerJuror();
        vm.prank(juror3);
        escrow.registerJuror();
    }
}
