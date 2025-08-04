// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Script, console} from "forge-std/Script.sol";
import {NonceTracker} from "../src/NonceTracker.sol";

contract DeployNonceTracker is Script {
    function run() public {
        vm.startBroadcast();
        new NonceTracker();
        vm.stopBroadcast();
    }
}