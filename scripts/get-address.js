import hre from "hardhat";

async function main() {
  const [owner] = await hre.ethers.getSigners();
  console.log("👤 Your Wallet Address:", owner.address);
  console.log("📋 Copy this address to get MATIC from the faucet!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
