// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/MonffyBadge.sol";
import "../src/MicroMarket.sol";
import "../src/ClawLog.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);

        // Deploy MonffyBadge
        string memory baseUri = "https://api.monffy.xyz/metadata/badges/";
        MonffyBadge badge = new MonffyBadge(baseUri);
        console.log("MonffyBadge deployed at:", address(badge));

        // Deploy MicroMarket
        // Pyth on Monad: https://docs.pyth.network/price-feeds/contract-addresses/evm
        address pythOracle = 0x2880aB155794e7179c9eE2e38200202908C17B43; // Pyth on Monad
        MicroMarket market = new MicroMarket(pythOracle);
        console.log("MicroMarket deployed at:", address(market));

        // Deploy ClawLog (agent activity log)
        ClawLog clawLog = new ClawLog();
        console.log("ClawLog deployed at:", address(clawLog));

        // Add MicroMarket as badge minter (for achievement badges)
        badge.addMinter(address(market));

        vm.stopBroadcast();
    }
}
