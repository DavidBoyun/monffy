// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title MonffyBadge
 * @notice ERC-1155 badge collection for MONFFY achievements
 * @dev Soulbound (non-transferable) badges for streaks, predictions, and milestones
 */
contract MonffyBadge is ERC1155, Ownable {
    using Strings for uint256;

    // Badge type IDs
    uint256 public constant STREAK_3 = 1;
    uint256 public constant STREAK_7 = 2;
    uint256 public constant STREAK_14 = 3;
    uint256 public constant STREAK_30 = 4;
    uint256 public constant FIRST_PREDICTION = 10;
    uint256 public constant PREDICTION_MASTER = 11;
    uint256 public constant EARLY_ADOPTER = 100;

    // Authorized minters (backend service)
    mapping(address => bool) public minters;

    // Track minted badges per user (for soulbound)
    mapping(address => mapping(uint256 => bool)) public hasBadge;

    // Badge metadata
    mapping(uint256 => string) public badgeNames;

    // Events
    event MinterAdded(address indexed minter);
    event MinterRemoved(address indexed minter);
    event BadgeMinted(address indexed to, uint256 indexed badgeId, string badgeName);

    constructor(string memory baseUri) ERC1155(baseUri) Ownable(msg.sender) {
        // Initialize badge names
        badgeNames[STREAK_3] = "3-Day Streak";
        badgeNames[STREAK_7] = "Weekly Warrior";
        badgeNames[STREAK_14] = "Fortnight Fighter";
        badgeNames[STREAK_30] = "Monthly Master";
        badgeNames[FIRST_PREDICTION] = "First Prediction";
        badgeNames[PREDICTION_MASTER] = "Prediction Master";
        badgeNames[EARLY_ADOPTER] = "Early Adopter";
    }

    modifier onlyMinter() {
        require(minters[msg.sender] || msg.sender == owner(), "Not authorized minter");
        _;
    }

    /**
     * @notice Add a new minter address
     * @param minter Address to grant minting rights
     */
    function addMinter(address minter) external onlyOwner {
        minters[minter] = true;
        emit MinterAdded(minter);
    }

    /**
     * @notice Remove a minter address
     * @param minter Address to revoke minting rights
     */
    function removeMinter(address minter) external onlyOwner {
        minters[minter] = false;
        emit MinterRemoved(minter);
    }

    /**
     * @notice Mint a badge to a user (soulbound - only once per badge type)
     * @param to Recipient address
     * @param badgeId Badge type ID
     */
    function mint(address to, uint256 badgeId) external onlyMinter {
        require(!hasBadge[to][badgeId], "Badge already owned");
        require(bytes(badgeNames[badgeId]).length > 0, "Invalid badge type");

        hasBadge[to][badgeId] = true;
        _mint(to, badgeId, 1, "");

        emit BadgeMinted(to, badgeId, badgeNames[badgeId]);
    }

    /**
     * @notice Batch mint multiple badges
     * @param to Recipient address
     * @param badgeIds Array of badge type IDs
     */
    function mintBatch(address to, uint256[] calldata badgeIds) external onlyMinter {
        uint256[] memory amounts = new uint256[](badgeIds.length);

        for (uint256 i = 0; i < badgeIds.length; i++) {
            require(!hasBadge[to][badgeIds[i]], "Badge already owned");
            require(bytes(badgeNames[badgeIds[i]]).length > 0, "Invalid badge type");
            hasBadge[to][badgeIds[i]] = true;
            amounts[i] = 1;
        }

        _mintBatch(to, badgeIds, amounts, "");
    }

    /**
     * @notice Update base URI for metadata
     * @param newUri New base URI
     */
    function setURI(string memory newUri) external onlyOwner {
        _setURI(newUri);
    }

    /**
     * @notice Get URI for a specific badge
     * @param badgeId Badge type ID
     */
    function uri(uint256 badgeId) public view override returns (string memory) {
        return string(abi.encodePacked(super.uri(badgeId), badgeId.toString(), ".json"));
    }

    // ========== SOULBOUND OVERRIDES ==========
    // Disable transfers to make badges soulbound

    function safeTransferFrom(
        address,
        address,
        uint256,
        uint256,
        bytes memory
    ) public pure override {
        revert("Soulbound: transfers disabled");
    }

    function safeBatchTransferFrom(
        address,
        address,
        uint256[] memory,
        uint256[] memory,
        bytes memory
    ) public pure override {
        revert("Soulbound: transfers disabled");
    }

    function setApprovalForAll(address, bool) public pure override {
        revert("Soulbound: approvals disabled");
    }
}
