const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("CreditSystem", (m) => {
  const mockToken = m.contract("MockToken", ["USD Coin", "USDC"]);
  const paymentLogger = m.contract("PaymentLogger");

  return { mockToken, paymentLogger };
});
