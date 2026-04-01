# Transparent Donation Platform

End-to-end decentralized “glass box” donation system. Donations and withdrawals are recorded on-chain with ERC20 stablecoins, public audit trails, and IPFS proofs viewable in the React frontend.

## Stack
- Solidity (Hardhat + OpenZeppelin)
- ERC20 stablecoins (USDC/DAI or any IERC20)
- React + ethers.js (v6)
- IPFS uploads via `ipfs-http-client`

## Quickstart
```bash
cp .env.example .env        # fill RPC URLs, PRIVATE_KEY, STABLECOIN_ADDRESS, etc.
npm install                 # root deps
npx hardhat compile
npx hardhat run scripts/deploy-campaign.js --network sepolia
cd donation-frontend
npm install
npm start
```

## Environment (.env)
```
PRIVATE_KEY=0x...
SEPOLIA_RPC_URL=https://...
POLYGON_RPC_URL=https://...
MUMBAI_RPC_URL=https://...
STABLECOIN_ADDRESS=0xStableCoin
STABLECOIN_DECIMALS=6
CAMPAIGN_TITLE=Transparent Relief
CAMPAIGN_DESCRIPTION=Public and auditable donations
CAMPAIGN_GOAL=1000
CAMPAIGN_METADATA_IPFS_HASH=ipfs://...
TARGET_CONTRACT_ADDRESS=0xDeployedCampaign
INFURA_PROJECT_ID=...
INFURA_SECRET=...
```

## Key Scripts
- `scripts/deploy-campaign.js` – deploys `DonationCampaign`
- `scripts/deploy-simple.js` – deploys `SimpleDonation`
- `scripts/check-balance.js` – checks stablecoin balance for a deployed contract
- `scripts/check-pool.js` – reads summary, donations, withdrawals
- `scripts/deploy-check.js` – validates deployer/network readiness

## Testing
```
npx hardhat test
```

## Frontend
Located in `donation-frontend/` with components for creating campaigns, donating, withdrawing with IPFS proof, and a live audit trail of all on-chain events.
