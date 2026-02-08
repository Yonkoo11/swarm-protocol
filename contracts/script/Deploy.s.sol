// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {SwarmCoordinator} from "../src/SwarmCoordinator.sol";

contract DeployScript is Script {
    // Base Sepolia USDC
    address constant USDC = 0x036CbD53842c5426634e7929541eC2318f3dCF7e;

    function run() public {
        uint256 deployerKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerKey);

        console.log("Deployer:", deployer);
        console.log("USDC:", USDC);

        vm.startBroadcast(deployerKey);

        // Treasury = deployer for testnet
        SwarmCoordinator escrow = new SwarmCoordinator(USDC, deployer);

        console.log("SwarmCoordinator deployed at:", address(escrow));

        vm.stopBroadcast();
    }
}
