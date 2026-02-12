// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ClawLog
 * @notice Minimal on-chain log for MONFFY Claw Agent autonomous actions
 * @dev Emits events only - no storage, minimal gas cost
 */
contract ClawLog is Ownable {
    // Action types
    uint8 public constant ACTION_MARKET_CREATED = 1;
    uint8 public constant ACTION_PREDICTION_MADE = 2;
    uint8 public constant ACTION_MARKET_RESOLVED = 3;
    uint8 public constant ACTION_NARRATIVE_POSTED = 4;

    uint256 public actionCount;

    event AgentAction(
        uint256 indexed actionId,
        uint8 indexed actionType,
        bytes32 dataHash,
        uint64 timestamp
    );

    constructor() Ownable(msg.sender) {}

    /**
     * @notice Log an autonomous agent action on-chain
     * @param actionType Type of action (1-4)
     * @param dataHash Keccak256 hash of action data (for verifiability)
     */
    function log(uint8 actionType, bytes32 dataHash) external onlyOwner {
        require(actionType >= 1 && actionType <= 4, "Invalid action type");

        uint256 actionId = actionCount++;

        emit AgentAction(
            actionId,
            actionType,
            dataHash,
            uint64(block.timestamp)
        );
    }

    /**
     * @notice Batch log multiple actions (gas efficient)
     * @param actionTypes Array of action types
     * @param dataHashes Array of data hashes
     */
    function logBatch(
        uint8[] calldata actionTypes,
        bytes32[] calldata dataHashes
    ) external onlyOwner {
        require(actionTypes.length == dataHashes.length, "Length mismatch");

        for (uint256 i = 0; i < actionTypes.length; i++) {
            require(
                actionTypes[i] >= 1 && actionTypes[i] <= 4,
                "Invalid action type"
            );
            uint256 actionId = actionCount++;
            emit AgentAction(
                actionId,
                actionTypes[i],
                dataHashes[i],
                uint64(block.timestamp)
            );
        }
    }
}
