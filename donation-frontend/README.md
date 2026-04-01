# Transparent Donation Frontend

React UI for the glass-box donation platform. It connects to MetaMask, allows ERC20 stablecoin donations, owner withdrawals with IPFS receipts, and exposes a live audit trail of all on-chain donations/withdrawals.

## Quickstart
```bash
cd donation-frontend
npm install
REACT_APP_STABLECOIN_ADDRESS=0x... npm start
```

## Env (create `.env` here)
```
REACT_APP_STABLECOIN_ADDRESS=0xStableCoin
REACT_APP_STABLECOIN_DECIMALS=6
REACT_APP_STABLECOIN_SYMBOL=USDC
REACT_APP_CAMPAIGN_ADDRESS=0xDeployedDonationCampaign
REACT_APP_SIMPLE_ADDRESS=0xSimpleDonation
REACT_APP_INFURA_PROJECT_ID=...
REACT_APP_INFURA_PROJECT_SECRET=...
REACT_APP_EXPLORER_BASE=https://sepolia.etherscan.io
```

## Features
- Deploy `DonationCampaign` from the browser (IPFS metadata upload).
- Approve stablecoin & donate with one click.
- Owner-only withdrawals with IPFS proof attachments.
- Campaign summary with metadata, goal vs. raised.
- Full audit trail of donations and withdrawals with IPFS links.

## Scripts
- `npm start` – dev server on `:3000`
- `npm run build` – production build
