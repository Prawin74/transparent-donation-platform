const { ethers } = require("ethers");

async function main() {
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
    const LOGGER_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
    const LOGGER_ABI = [
        "event FiatDeposit(string paymentId, uint256 fiatAmount, uint256 conversionRate, uint256 cryptoAmount, address indexed userAddress, uint256 timestamp)"
    ];

    const contract = new ethers.Contract(LOGGER_ADDRESS, LOGGER_ABI, provider);

    console.log("Querying logs...");
    const events = await contract.queryFilter("FiatDeposit");

    if (events.length === 0) {
        console.log("No logs found.");
    } else {
        const lastEvent = events[events.length - 1];
        console.log("Last Deposit Log:");
        console.log("Payment ID:", lastEvent.args.paymentId);
        console.log("Fiat Amount:", ethers.formatUnits(lastEvent.args.fiatAmount, 18));
        console.log("Crypto Amount:", ethers.formatUnits(lastEvent.args.cryptoAmount, 18));
        console.log("User:", lastEvent.args.userAddress);
    }
}

main().catch(console.error);
