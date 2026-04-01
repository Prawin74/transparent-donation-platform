// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title SimpleDonation
 * @notice Lightweight stablecoin donation pool used for quick testing.
 */
contract SimpleDonation {
    string public name;
    address public owner;
    address public stablecoinToken;
    uint256 public totalRaised;

    event DonationReceived(address donor, uint256 amount, uint256 timestamp);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    constructor(string memory _name, address _stablecoinToken) {
        require(_stablecoinToken != address(0), "Stablecoin required");
        name = _name;
        owner = msg.sender;
        stablecoinToken = _stablecoinToken;
    }

    function donate(uint256 amount) external {
        require(amount > 0, "Amount must be > 0");
        IERC20 token = IERC20(stablecoinToken);
        require(token.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        totalRaised += amount;
        emit DonationReceived(msg.sender, amount, block.timestamp);
    }

    function sweep(address to, uint256 amount) external onlyOwner {
        IERC20 token = IERC20(stablecoinToken);
        require(amount > 0, "Amount must be > 0");
        uint256 balance = token.balanceOf(address(this));
        require(amount <= balance, "Insufficient balance");
        require(token.transfer(to, amount), "Transfer failed");
    }
}
