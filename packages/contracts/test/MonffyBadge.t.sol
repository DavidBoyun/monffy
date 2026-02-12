// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/MonffyBadge.sol";

contract MonffyBadgeTest is Test {
    MonffyBadge public badge;
    address public owner = address(1);
    address public minter = address(2);
    address public user = address(3);

    function setUp() public {
        vm.prank(owner);
        badge = new MonffyBadge("https://api.monffy.xyz/metadata/badges/");
    }

    function test_InitialState() public view {
        assertEq(badge.owner(), owner);
        assertEq(badge.badgeNames(badge.STREAK_3()), "3-Day Streak");
        assertEq(badge.badgeNames(badge.EARLY_ADOPTER()), "Early Adopter");
    }

    function test_AddMinter() public {
        vm.prank(owner);
        badge.addMinter(minter);
        assertTrue(badge.minters(minter));
    }

    function test_MintBadge() public {
        vm.prank(owner);
        badge.addMinter(minter);

        vm.prank(minter);
        badge.mint(user, badge.STREAK_3());

        assertEq(badge.balanceOf(user, badge.STREAK_3()), 1);
        assertTrue(badge.hasBadge(user, badge.STREAK_3()));
    }

    function test_RevertDoubleMint() public {
        vm.prank(owner);
        badge.addMinter(minter);

        vm.prank(minter);
        badge.mint(user, badge.STREAK_3());

        vm.prank(minter);
        vm.expectRevert("Badge already owned");
        badge.mint(user, badge.STREAK_3());
    }

    function test_SoulboundTransferReverts() public {
        vm.prank(owner);
        badge.mint(user, badge.STREAK_3());

        vm.prank(user);
        vm.expectRevert("Soulbound: transfers disabled");
        badge.safeTransferFrom(user, address(4), badge.STREAK_3(), 1, "");
    }

    function test_SoulboundApprovalReverts() public {
        vm.prank(user);
        vm.expectRevert("Soulbound: approvals disabled");
        badge.setApprovalForAll(minter, true);
    }

    function test_BatchMint() public {
        vm.prank(owner);
        badge.addMinter(minter);

        uint256[] memory badgeIds = new uint256[](3);
        badgeIds[0] = badge.STREAK_3();
        badgeIds[1] = badge.STREAK_7();
        badgeIds[2] = badge.FIRST_PREDICTION();

        vm.prank(minter);
        badge.mintBatch(user, badgeIds);

        assertEq(badge.balanceOf(user, badge.STREAK_3()), 1);
        assertEq(badge.balanceOf(user, badge.STREAK_7()), 1);
        assertEq(badge.balanceOf(user, badge.FIRST_PREDICTION()), 1);
    }
}
