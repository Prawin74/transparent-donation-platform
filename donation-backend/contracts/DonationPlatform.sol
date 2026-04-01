// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title DonationPlatform
 * @dev Central smart contract to route donations to campaign wallets and emit events for the backend.
 */
contract DonationPlatform is ReentrancyGuard {
    // Event emitted when a donation is made
    event DonationReceived(
        address indexed donor,
        string campaignId,
        uint256 amount,
        address indexed recipient,
        uint256 timestamp
    );

    /**
     * @notice Donate to a specific campaign.
     * @dev Funds are transferred directly to the campaign's wallet address.
     * @param campaignId The unique identifier of the campaign (from DB).
     * @param recipient The wallet address of the campaign owner/beneficiary.
     */
    function donate(string memory campaignId, address payable recipient) public payable nonReentrant {
        require(msg.value > 0, "Donation amount must be greater than 0");
        require(recipient != address(0), "Invalid recipient address");

        // Transfer funds to the campaign wallet
        recipient.transfer(msg.value);

        // Emit event for backend listener
        emit DonationReceived(msg.sender, campaignId, msg.value, recipient, block.timestamp);
    }
}
