const hre = require("hardhat");
require("dotenv").config();

async function main() {
  const { TARGET_CONTRACT_ADDRESS, STABLECOIN_ADDRESS, STABLECOIN_DECIMALS } = process.env;
  if (!TARGET_CONTRACT_ADDRESS || !STABLECOIN_ADDRESS) {
    throw new Error("Set TARGET_CONTRACT_ADDRESS and STABLECOIN_ADDRESS in .env");
  }

  const erc20Abi = [
    "function balanceOf(address owner) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)",
  ];
  const token = new hre.ethers.Contract(STABLECOIN_ADDRESS, erc20Abi, hre.ethers.provider);
  const balance = await token.balanceOf(TARGET_CONTRACT_ADDRESS);
  let decimals = Number(STABLECOIN_DECIMALS || 6);
  try {
    decimals = await token.decimals();
  } catch (e) {
    // fallback to env/default
  }
  let symbol = "TOKEN";
  try {
    symbol = await token.symbol();
  } catch (e) {
    // ignore
  }

  console.log("🔍 Stablecoin balance for donation contract");
  console.log("Contract:", TARGET_CONTRACT_ADDRESS);
  console.log("Stablecoin:", STABLECOIN_ADDRESS);
  console.log("Balance (raw):", balance.toString());
  console.log("Balance (formatted):", hre.ethers.formatUnits(balance, decimals), symbol);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
