// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title DonationCampaign
 * @notice Transparent donation campaign that accepts ERC20 stablecoins.
 *         All donations and withdrawals are stored on-chain for public auditability.
 */
contract DonationCampaign is ReentrancyGuard {
    struct Donation {
        address donor;
        uint256 amount;
        uint256 timestamp;
    }

    struct Withdrawal {
        uint256 amount;
        string purpose;
        string proofIpfsHash;
        uint256 timestamp;
    }

    string public campaignTitle;
    string public campaignDescription;
    uint256 public goalAmount;
    uint256 public totalRaised;
    address public owner;
    address public stablecoinToken;
    Donation[] public donations;
    Withdrawal[] public withdrawals;
    string public campaignMetadataIpfsHash;

    event DonationReceived(address donor, uint256 amount, uint256 timestamp);
    event WithdrawalMade(uint256 amount, string purpose, string proofIpfsHash, uint256 timestamp);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    constructor(
        string memory title,
        string memory description,
        uint256 _goalAmount,
        address _stablecoinToken,
        string memory metadataIpfsHash
    ) {
        require(_stablecoinToken != address(0), "Stablecoin required");
        campaignTitle = title;
        campaignDescription = description;
        goalAmount = _goalAmount;
        stablecoinToken = _stablecoinToken;
        campaignMetadataIpfsHash = metadataIpfsHash;
        owner = msg.sender;
    }

    function donate(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be > 0");
        IERC20 token = IERC20(stablecoinToken);
        require(token.transferFrom(msg.sender, address(this), amount), "Transfer failed");

        donations.push(Donation({
            donor: msg.sender,
            amount: amount,
            timestamp: block.timestamp
        }));

        totalRaised += amount;
        emit DonationReceived(msg.sender, amount, block.timestamp);
    }

    function withdraw(
        uint256 amount,
        string memory purpose,
        string memory proofIpfsHash
    ) external onlyOwner nonReentrant {
        require(amount > 0, "Amount must be > 0");
        require(bytes(purpose).length > 0, "Purpose required");
        require(bytes(proofIpfsHash).length > 0, "Proof hash required");

        IERC20 token = IERC20(stablecoinToken);
        uint256 balance = token.balanceOf(address(this));
        require(amount <= balance, "Insufficient balance");

        withdrawals.push(Withdrawal({
            amount: amount,
            purpose: purpose,
            proofIpfsHash: proofIpfsHash,
            timestamp: block.timestamp
        }));

        require(token.transfer(owner, amount), "Withdraw transfer failed");
        emit WithdrawalMade(amount, purpose, proofIpfsHash, block.timestamp);
    }

    function getDonations() external view returns (Donation[] memory) {
        return donations;
    }

    function getWithdrawals() external view returns (Withdrawal[] memory) {
        return withdrawals;
    }

    function getSummary()
        external
        view
        returns (
            string memory,
            string memory,
            uint256,
            uint256,
            uint256,
            uint256
        )
    {
        return (
            campaignTitle,
            campaignDescription,
            goalAmount,
            totalRaised,
            donations.length,
            withdrawals.length
        );
    }
}