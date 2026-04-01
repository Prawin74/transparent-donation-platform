// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract PaymentLogger {
    event FiatDeposit(
        string paymentId,
        uint256 fiatAmount,
        uint256 conversionRate,
        uint256 cryptoAmount,
        address indexed userAddress,
        uint256 timestamp
    );

    function logDeposit(
        string memory paymentId,
        uint256 fiatAmount,
        uint256 conversionRate,
        uint256 cryptoAmount,
        address userAddress
    ) external {
        emit FiatDeposit(paymentId, fiatAmount, conversionRate, cryptoAmount, userAddress, block.timestamp);
    }
}
