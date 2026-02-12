// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title MicroMarket
 * @notice Micro prediction market for short-term price predictions
 * @dev Uses Pyth oracle for price resolution
 */
contract MicroMarket is Ownable, ReentrancyGuard {
    // Pyth oracle interface (simplified)
    address public pythOracle;

    // Market struct
    struct Market {
        bytes32 priceId;        // Pyth price feed ID
        int64 strikePrice;      // Price at market creation (scaled by 10^8)
        uint64 createdAt;
        uint64 expiresAt;
        uint64 resolvedAt;
        bool resolved;
        bool outcome;           // true = price went up
        uint256 upPool;         // Total MON bet on UP
        uint256 downPool;       // Total MON bet on DOWN
    }

    // User position
    struct Position {
        uint256 upAmount;
        uint256 downAmount;
        bool claimed;
    }

    // State
    uint256 public marketCount;
    uint256 public protocolFee = 100; // 1% = 100 basis points
    uint256 public constant FEE_DENOMINATOR = 10000;

    mapping(uint256 => Market) public markets;
    mapping(uint256 => mapping(address => Position)) public positions;

    // Events
    event MarketCreated(uint256 indexed marketId, bytes32 priceId, int64 strikePrice, uint64 expiresAt);
    event PositionOpened(uint256 indexed marketId, address indexed user, bool isUp, uint256 amount);
    event MarketResolved(uint256 indexed marketId, bool outcome, int64 finalPrice);
    event WinningsClaimed(uint256 indexed marketId, address indexed user, uint256 amount);

    constructor(address _pythOracle) Ownable(msg.sender) {
        pythOracle = _pythOracle;
    }

    /**
     * @notice Create a new micro prediction market
     * @param priceId Pyth price feed ID (e.g., MON/USD)
     * @param strikePrice Current price at market creation
     * @param duration Market duration in seconds (e.g., 300 for 5min)
     */
    function createMarket(
        bytes32 priceId,
        int64 strikePrice,
        uint64 duration
    ) external onlyOwner returns (uint256 marketId) {
        marketId = marketCount++;

        markets[marketId] = Market({
            priceId: priceId,
            strikePrice: strikePrice,
            createdAt: uint64(block.timestamp),
            expiresAt: uint64(block.timestamp) + duration,
            resolvedAt: 0,
            resolved: false,
            outcome: false,
            upPool: 0,
            downPool: 0
        });

        emit MarketCreated(marketId, priceId, strikePrice, uint64(block.timestamp) + duration);
    }

    /**
     * @notice Place a prediction on a market
     * @param marketId Market ID
     * @param isUp true for UP prediction, false for DOWN
     */
    function predict(uint256 marketId, bool isUp) external payable nonReentrant {
        Market storage market = markets[marketId];
        require(block.timestamp < market.expiresAt, "Market expired");
        require(!market.resolved, "Market resolved");
        require(msg.value > 0, "Must send MON");

        Position storage pos = positions[marketId][msg.sender];

        if (isUp) {
            pos.upAmount += msg.value;
            market.upPool += msg.value;
        } else {
            pos.downAmount += msg.value;
            market.downPool += msg.value;
        }

        emit PositionOpened(marketId, msg.sender, isUp, msg.value);
    }

    /**
     * @notice Resolve a market with Pyth oracle price
     * @param marketId Market ID
     * @param finalPrice Final price from Pyth oracle
     */
    function resolveMarket(uint256 marketId, int64 finalPrice) external onlyOwner {
        Market storage market = markets[marketId];
        require(block.timestamp >= market.expiresAt, "Market not expired");
        require(!market.resolved, "Already resolved");

        market.resolved = true;
        market.resolvedAt = uint64(block.timestamp);
        market.outcome = finalPrice > market.strikePrice;

        emit MarketResolved(marketId, market.outcome, finalPrice);
    }

    /**
     * @notice Claim winnings from a resolved market
     * @param marketId Market ID
     */
    function claim(uint256 marketId) external nonReentrant {
        Market storage market = markets[marketId];
        require(market.resolved, "Not resolved");

        Position storage pos = positions[marketId][msg.sender];
        require(!pos.claimed, "Already claimed");

        uint256 userStake = market.outcome ? pos.upAmount : pos.downAmount;
        require(userStake > 0, "No winning position");

        pos.claimed = true;

        uint256 winningPool = market.outcome ? market.upPool : market.downPool;
        uint256 losingPool = market.outcome ? market.downPool : market.upPool;
        uint256 totalPool = winningPool + losingPool;

        // Calculate winnings: stake + proportional share of losing pool (minus fee)
        uint256 grossWinnings = (userStake * totalPool) / winningPool;
        uint256 fee = (grossWinnings * protocolFee) / FEE_DENOMINATOR;
        uint256 netWinnings = grossWinnings - fee;

        (bool success, ) = msg.sender.call{value: netWinnings}("");
        require(success, "Transfer failed");

        emit WinningsClaimed(marketId, msg.sender, netWinnings);
    }

    /**
     * @notice Withdraw protocol fees
     */
    function withdrawFees() external onlyOwner {
        (bool success, ) = owner().call{value: address(this).balance}("");
        require(success, "Withdraw failed");
    }

    /**
     * @notice Update protocol fee
     * @param newFee New fee in basis points (max 500 = 5%)
     */
    function setProtocolFee(uint256 newFee) external onlyOwner {
        require(newFee <= 500, "Fee too high");
        protocolFee = newFee;
    }

    /**
     * @notice Update Pyth oracle address
     */
    function setPythOracle(address _pythOracle) external onlyOwner {
        pythOracle = _pythOracle;
    }

    receive() external payable {}
}
