// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Script, console} from "forge-std/Script.sol";
import {GasSponsor} from "../src/GasSponsor.sol";

contract DeployGasSponsor is Script {
    function run() public {
        vm.startBroadcast();
        new GasSponsor();
        vm.stopBroadcast();
    }
}
