
ABSTRACT

Charitable giving has grown into a global activity, yet the lack of transparency in how donated funds are managed continues to undermine donor trust. Many contributors find it difficult to verify whether their donations have reached the intended beneficiaries or have been used for the stated purpose. To address this problem, the GlobalGive platform is designed to bring complete accountability to the donation lifecycle using blockchain technology. The system operates by allowing donors to connect a Web3 wallet, browse verified fundraising campaigns created by non-governmental organisations, and contribute MATIC tokens directly to campaigns on the Polygon blockchain. Every donation and every withdrawal made by an NGO is recorded permanently on a Solidity smart contract deployed on-chain, creating an immutable ledger that no party can edit or delete. The backend, built on Node.js and Express, maintains a real-time data pipeline using Socket.IO and a blockchain event listener that detects on-chain donation events and broadcasts them instantly to the React frontend. Users are presented with a live donor dashboard that shows their complete transaction history, total donated amount, and active campaigns supported, updating in real time with each confirmed transaction. Role-based access control using JSON Web Tokens ensures that donors, NGOs, and platform administrators each have access only to the features relevant to their role. GlobalGive aims to restore public confidence in digital philanthropy by replacing the opacity of traditional charity platforms with a verifiable, always-accessible, blockchain-backed audit trail. This project demonstrates how full-stack web development and decentralised blockchain infrastructure can be combined to build a trustworthy, scalable, and socially impactful donation platform.


1. COMPREHENSIVE PROJECT OVERVIEW

1.1 The Charitable Giving Landscape and the Trust Problem

The act of charitable giving is as old as human civilisation. From ancient religious institutions collecting alms to modern crowdfunding platforms, the desire to help others has always been a central part of human social behaviour. However, the scale, speed, and complexity of modern philanthropy have introduced a fundamental challenge that did not exist in simpler times: the inability of donors to verify what happens to their money after it leaves their hands.

In the era of digital transactions, donations are processed instantaneously across borders and time zones. A donor in one city can contribute to a flood relief campaign in another part of the country within seconds. While this speed and accessibility are remarkable achievements, they have also widened the gap between contributor and cause. Once a payment is processed on a traditional donation platform, the donor receives a confirmation email and then, in most cases, silence. There is no mechanism to independently verify that the funds were used for the stated purpose, that they reached the beneficiary, or that they were not diverted to other uses.

This opacity has led to a series of high-profile cases of NGO fraud and mismanagement that have damaged public confidence in charitable organisations globally. In India alone, several donation drives have ended in controversy, with donors demanding accountability and organisations unable to provide verifiable records. The result is a trust deficit that discourages genuine donors and allows fraudulent actors to exploit goodwill.

GlobalGive is designed specifically to solve this problem. By anchoring all financial records to the Polygon blockchain — a public, decentralised, and immutable ledger — the platform ensures that every rupee or token can be traced from the donor's wallet to the campaign, and every withdrawal can be matched against a verifiable proof of purpose. This is not a claim made by the platform itself; it is a technical guarantee enforced by cryptography and decentralised consensus.

1.2 Types of Donation Fraud and Accountability Failures

Understanding the specific ways in which charitable giving goes wrong is essential to designing an effective solution. Donation fraud and accountability failures occur across a spectrum of intent, scale, and mechanism.

1. Misappropriation of Funds
The most straightforward form of fraud involves collecting donations under a legitimate-sounding cause and diverting the funds to personal or unrelated uses. This is made possible on traditional platforms because the financial records are maintained in private, centralised databases controlled by the platform operator, not accessible to donors.

2. Fabricated Campaigns
Fraudulent actors create convincing campaign pages — complete with photographs, compelling narratives, and inflated urgency — to collect donations for causes that do not exist or are vastly exaggerated. Without a verification mechanism for NGO identity and legitimacy, platforms become breeding grounds for these fraudulent campaigns.

3. Opaque Fund Utilization
Even among legitimate NGOs, the absence of mandatory reporting standards means that donors rarely learn how funds were spent in detail. An NGO might genuinely use the money for the right purpose but fail to communicate this clearly, eroding donor confidence through neglect rather than malice.

4. Delayed or Incomplete Disbursement
In some cases, collected funds are not disbursed to the intended beneficiaries in a timely manner, or only a portion is disbursed while the remainder is retained for administrative overheads that are not disclosed to donors. Without transaction-level transparency, donors cannot distinguish between legitimate operational costs and misuse.

5. Lack of Verification Mechanisms
Traditional platforms perform minimal verification of NGO credentials before allowing campaigns to go live. This creates a permissive environment where both genuine and fraudulent organisations operate side by side, leaving donors unable to distinguish between them.

GlobalGive addresses each of these failure modes through its blockchain ledger, NGO verification system, mandatory withdrawal proof requirement, and public audit trail.

1.3 Societal Impact of Donation Fraud

The consequences of donation fraud extend well beyond the financial loss experienced by individual donors. They ripple through society in ways that damage communities, undermine institutions, and discourage future generosity.

1. Reduction in Charitable Giving
Every time a high-profile case of donation fraud is exposed, the ripple effect is a measurable decline in charitable giving. People who have been defrauded or who witness others being defrauded become reluctant to donate in the future, even to legitimate and deserving causes. This withdrawal of philanthropic capital has real consequences for the communities and individuals who depend on charitable support.

2. Damage to Legitimate NGOs
The actions of fraudulent actors tarnish the reputation of honest, well-run non-governmental organisations. Legitimate NGOs must work harder to establish credibility and often face increased scrutiny, administrative burden, and donor skepticism that diverts resources away from their actual mission.

3. Erosion of Public Trust in Digital Commerce
Beyond philanthropy, widespread donation fraud contributes to a broader erosion of trust in digital financial transactions. Users who have been deceived on a donation platform are less likely to engage confidently with other forms of online financial activity.

4. Social Impact on Beneficiary Communities
When fraudulent campaigns collect funds intended for a real cause — disaster relief, medical treatment, education — the actual beneficiaries are denied the support they require. This is perhaps the most direct and harmful consequence of donation fraud, affecting the most vulnerable members of society.

5. Regulatory and Legal Challenges
Donation fraud across digital platforms creates complex legal and regulatory challenges. Cross-border cases are especially difficult to prosecute, and the absence of verifiable transaction records makes it nearly impossible to establish a clear chain of evidence.

1.4 Need for a Blockchain-Based Transparency Platform

The limitations of existing donation platforms point clearly to the need for a new approach — one that does not simply add a layer of reporting on top of an opaque system, but fundamentally restructures how financial records are created and maintained. Blockchain technology provides exactly this capability.

Limitations of Existing Platforms
- Private databases controlled by platform operators offer no independent verification
- No mandatory proof of fund utilization required from NGOs
- Minimal or superficial NGO verification processes
- No real-time visibility into campaign fund movements
- Donor access to transaction data is entirely dependent on platform willingness to disclose

Why Blockchain Solves These Problems
A blockchain is a distributed ledger replicated across thousands of independent nodes worldwide. When a record is written to the blockchain, it is simultaneously validated by this network and added to an immutable chain of prior records. No single party — not even the original creator of the record — can alter or delete it after confirmation.

For a donation platform, this means:
- Every donation is permanently recorded the moment it is made
- Every withdrawal is permanently recorded with its stated purpose and proof
- These records are readable by anyone, at any time, using any blockchain explorer
- The platform itself is not the source of truth — the blockchain network is

By building GlobalGive on this foundation, the platform converts trust from a claim into a technical guarantee.

1.5 GlobalGive Design Philosophy

The design of GlobalGive is guided by three fundamental principles: transparency, accessibility, and security.

1. Transparency
Every financial operation on the platform — donation and withdrawal alike — is recorded on the Polygon blockchain and made publicly readable through the platform's on-chain audit trail. Transparency is not an optional reporting feature; it is structurally enforced by the smart contract design. NGOs cannot withdraw funds without a stated purpose and an IPFS-linked proof document, both of which are written to the blockchain immutably.

2. Accessibility
Blockchain technology is powerful but historically inaccessible to non-technical users. GlobalGive bridges this gap by providing a polished, intuitive web interface that abstracts the complexity of wallet connectivity, token transfers, and smart contract interaction behind familiar UI patterns. Donors connect their MetaMask wallet with a single click, browse campaigns, and donate as easily as they would on any conventional platform.

3. Security
Security is embedded at every layer of the stack. Passwords are hashed using bcryptjs before storage. All API endpoints are protected by JWT authentication middleware. Smart contract functions are protected by OpenZeppelin's ReentrancyGuard. Sensitive configuration values are stored in environment variables. Role-based access control prevents any user from accessing features outside their designated role.

User-Centric Design Approach
GlobalGive prioritises the user experience by providing:
- An intuitive campaign discovery interface for donors
- A comprehensive campaign management portal for NGOs
- A clean, role-aware administrative dashboard for platform governance
- A live, real-time transaction feed that makes platform activity visible
- A dark and light theme system that adapts to user preferences

1.6 Technology Overview

1. Solidity and Smart Contracts
The core transparency engine of GlobalGive is the DonationCampaign Solidity smart contract deployed on the Polygon Amoy testnet. This contract permanently records all donations in a Donation struct array and all withdrawals in a Withdrawal struct array. It emits events (DonationReceived and WithdrawalMade) that serve as the raw data feed for the platform's real-time event system. OpenZeppelin's ReentrancyGuard library protects financial functions from double-spend attacks.

2. Ethers.js
Ethers.js v6 is used on both the frontend and backend to interact with the Polygon blockchain. On the frontend, it wraps the MetaMask BrowserProvider to enable wallet connectivity and transaction signing. On the backend, it powers the JsonRpcProvider used by the blockchain event listener to subscribe to smart contract events directly from the Polygon network.

3. Node.js, Express.js, and Socket.IO
The backend is built on Node.js with the Express framework handling REST API routing for authentication, campaign management, and transaction recording. Socket.IO is attached to the same HTTP server, maintaining persistent WebSocket connections with all active frontend clients. When the blockchain listener detects a donation event, it emits a real-time Socket.IO message to every connected browser session simultaneously.

4. React JS and Context API
The frontend is a React application with client-side routing via React Router v6. Context API manages global state for authentication, theme, socket connection, and Web3 wallet state. Custom hooks (useDonation, useTransactionHistory) encapsulate complex asynchronous donation and history-fetching logic in a clean, reusable form.

5. MongoDB and Mongoose
MongoDB provides flexible, document-oriented storage for user accounts, campaign records, and donation transactions. Mongoose adds schema definition, validation, and referential integrity. The donation schema links each transaction to a campaign document and stores the blockchain transaction hash as a unique identifier, enabling deduplication in the event listener.

6. JSON Web Tokens and bcryptjs
JWT provides stateless, scalable authentication. Each token encodes the user's identity and role with a 24-hour expiry. bcryptjs with a salt factor of 10 ensures that passwords stored in the database cannot be reversed even if the database is compromised.

1.7 System Architecture

The GlobalGive platform follows a four-tier architecture that separates concerns across the presentation, application, data, and blockchain layers.

1. Presentation Layer (React Frontend)
- Implemented as a React web application running on port 3000
- Provides role-specific dashboards for donors, NGOs, and admins
- Connects to MetaMask for wallet management and transaction signing
- Subscribes to real-time Socket.IO events for live dashboard updates

2. Application Layer (Node.js Backend)
- Built with Express.js running on port 3001
- Hosts REST API endpoints for authentication, campaigns, and transactions
- Runs Socket.IO server for real-time event broadcasting
- Hosts the blockchain listener service that subscribes to Polygon contract events

3. Data Layer (MongoDB)
- Stores Users, Campaigns, and Donation collections
- Enforces schema validation through Mongoose
- Provides deduplication support for blockchain event processing

4. Blockchain Layer (Polygon Smart Contract)
- DonationCampaign.sol deployed on Polygon Amoy Testnet
- Permanently records all donations and withdrawals on-chain
- Emits events consumed by the backend listener
- Provides public read access via getDonations() and getWithdrawals() view functions

System Workflow
1. NGO registers, creates a campaign with wallet address and funding goal
2. Admin verifies the NGO account
3. Donor connects MetaMask wallet and browses active campaigns
4. Donor initiates a donation — the transaction is signed and broadcast to Polygon
5. Smart contract records the donation and emits DonationReceived event
6. Blockchain listener detects the event, saves it to MongoDB, broadcasts via Socket.IO
7. Donor dashboard updates in real time with new transaction
8. NGO submits withdrawal request with purpose and IPFS proof hash
9. Withdrawal is recorded on-chain and logged to MongoDB
10. Audit trail page displays all on-chain events for public verification

Advantages of This Architecture
- End-to-end transparency enforced by blockchain
- Real-time data propagation via WebSocket event system
- Modular, independently testable components
- Scalable to increased user load and transaction volume
- Public auditability without requiring trust in the platform operator


2. COMPREHENSIVE PROJECT OBJECTIVES

The development of GlobalGive – Transparent Donation Platform is guided by a structured set of objectives that ensure the system is technically robust, user-accessible, securely designed, and socially impactful. These objectives are categorised into Primary Technical Objectives, Secondary Engineering Objectives, and Societal Objectives, each addressing distinct aspects of the system's design, implementation, and real-world application.

2.1 Primary Technical Objectives

The primary technical objectives define the core functional capabilities that the system must deliver to fulfil its transparency mission.

2.1.1 Blockchain-Based Donation Ledger

The central objective of GlobalGive is to create an immutable, publicly verifiable record of all financial transactions on the platform using the Polygon blockchain.

1. Deploying the DonationCampaign Smart Contract: The system requires a Solidity smart contract to be written, tested, and deployed to the Polygon Amoy Testnet using Hardhat. The contract must accept ERC-20 token donations, record each donation as a struct containing the donor address, amount, and timestamp, and maintain a running total of funds raised for the campaign.

2. Enforcing Withdrawal Accountability: Every withdrawal from the smart contract must require a human-readable purpose string and an IPFS content hash linking to a verification document. Both are stored immutably on-chain. This design means that fund usage cannot be retroactively justified — the reason for every withdrawal is permanently anchored to a verifiable evidence chain at the moment of execution.

3. Minimising Smart Contract Vulnerabilities: The contract must implement OpenZeppelin's ReentrancyGuard on all fund-transfer functions. The onlyOwner modifier must restrict withdrawals to the campaign creator. Amount validation guards must prevent zero-value transactions. These protections must be verified through automated unit testing using Hardhat's testing framework before deployment.

2.1.2 Real-Time Blockchain Event Pipeline

The platform must not only record transactions on the blockchain but also propagate those events to the user interface within seconds of on-chain confirmation, without manual page refresh.

- Blockchain Event Listener: A background service must subscribe to the DonationReceived event emitted by the deployed smart contract using an Ethers.js JsonRpcProvider connected to the Polygon Amoy RPC endpoint. On event detection, the service must validate the transaction, prevent duplicate records using transaction hash lookup, update campaign totals in MongoDB, and broadcast a Socket.IO event to all connected clients.

- Socket.IO Real-Time Server: The Socket.IO server must maintain persistent WebSocket connections with all active browser sessions. When a donation event arrives from the blockchain listener, the server must emit it to every connected client simultaneously, ensuring that all active dashboard views update in real time.

- Custom Event Dispatch for Demo Flow: The donation hook must dispatch a browser-level custom event (gg:newDonation) on transaction completion, enabling immediate dashboard updates without waiting for Socket.IO round-trips, which is especially valuable for demonstrating the system's responsiveness in controlled environments.

2.1.3 User Interface and Experience

The system must deliver a polished, intuitive interface that makes complex blockchain interactions accessible to non-technical users.

- MetaMask Wallet Integration: The frontend must detect the MetaMask browser extension, create an Ethers.js BrowserProvider from the injected provider, and guide the user through wallet connection. ENS resolution must be explicitly disabled when connected to the Polygon Amoy testnet to prevent provider errors. Wallet address, network, and connection status must be displayed prominently in the interface.

- Role-Specific Dashboards: Each user role must receive a completely tailored dashboard experience. The donor dashboard must show transaction history, impact statistics, and a live feed. The NGO dashboard must show campaign management tools, withdrawal facilities, and progress tracking. The admin dashboard must show pending NGO verifications and platform governance tools.

- Multi-Step Donation Animation: The donation flow must provide visual feedback at every stage of the transaction lifecycle — from address verification through gas fee estimation, signature collection, broadcasting, and confirmation — using animated status indicators with descriptive labels at each step.

2.2 Secondary Engineering Objectives

Secondary objectives focus on backend architecture, performance, security, and output quality.

2.2.1 Backend API Development

- RESTful API Design: The Express backend must expose clearly structured REST endpoints grouped by resource type: /api/auth for authentication operations, /api/campaigns for campaign management, and /api/transactions for donation recording. Each endpoint must follow REST conventions, return appropriate HTTP status codes, and include validation of all incoming request data.

- JWT Middleware Implementation: An authMiddleware function must intercept all protected requests, extract the token from the Authorization header, verify its signature using the server's JWT_SECRET, and attach the decoded user payload to the request object. Route handlers must read from req.user to enforce role-specific access logic without repeating authentication code across handlers.

- Concurrent Request Handling: The Node.js event loop naturally supports non-blocking, concurrent request handling. The system must be designed to take full advantage of this through asynchronous database operations (async/await with Mongoose), non-blocking Socket.IO event emission, and lightweight request handlers that delegate processing to service modules.

2.2.2 Performance Optimisation

- Minimising API Response Latency: Campaign listing, donation history retrieval, and authentication endpoints must respond within acceptable limits. Database queries must use indexed fields (email for users, transactionHash for donations) to avoid full collection scans. The blockchain listener must use staticNetwork optimisation on the Ethers.js provider to avoid repeated network detection calls.

- Model Loading Efficiency: The blockchain listener and smart contract instance must be initialised once at server startup rather than per-request. Contract ABIs and provider instances must be cached in module scope to avoid repeated construction.

- Seed Data Merging: The frontend transaction history hook must merge API-fetched real transactions with a pre-defined seed dataset, ensuring the dashboard always appears populated regardless of actual transaction volume. This is essential for demonstration environments where real blockchain transactions may be limited.

2.2.3 Output Quality and Interpretability

- Donor Dashboard Statistics: The system must calculate and display meaningful aggregate metrics from the transaction history in real time: total MATIC donated (sum of all transaction amounts), number of distinct campaigns supported (count of unique campaign names), and account verification status. These statistics must recalculate automatically whenever the transaction list is updated.

- Campaign Progress Indicators: Each campaign card in the donation discovery interface must display a progress bar calculated as (raisedAmount / targetAmount × 100), allowing donors to immediately assess how close a campaign is to its funding goal without reading raw numbers.

- Transaction Hash Traceability: Every transaction record in the donor dashboard must render the blockchain transaction hash as a shortened display (first and last 6 characters) with a clickable hyperlink to the corresponding PolygonScan transaction detail page, enabling donors to independently verify any transaction on the public blockchain explorer.

2.3 Societal Objectives

Beyond technical implementation, GlobalGive is designed to contribute positively to society by addressing systemic failures in charitable accountability.

2.3.1 Restoration of Donor Confidence

The primary societal objective of GlobalGive is to rebuild trust between donors and charitable organisations through verified, blockchain-anchored transparency.

- Every transaction recorded on the platform is independently verifiable on the Polygon blockchain, removing the need for donors to trust the platform operator's claims
- The mandatory IPFS proof requirement for withdrawals creates a binding accountability mechanism that discourages misuse of collected funds
- The public audit trail page allows any donor or third-party observer to verify fund flows at any time, even after the campaign has ended
- By demonstrating that blockchain-based transparency is technically feasible and user-accessible at the same time, GlobalGive creates a new standard for what donation platforms should offer

2.3.2 Empowerment of Legitimate NGOs

A secondary societal objective is to provide genuine non-governmental organisations with a platform that enhances their credibility and operational capabilities.

- Verified NGO profiles, campaign management tools, and structured withdrawal workflows allow NGOs to demonstrate their legitimacy through consistent, transparent action rather than through self-reported credentials alone
- The blockchain-recorded transaction history serves as a permanently accessible proof of an NGO's fundraising and operational history, useful for future funding applications, regulatory filings, and donor relations
- By removing the administrative burden of manually produced transparency reports, GlobalGive allows NGO staff to focus more time on their core mission

2.3.3 Future Expansion and Enhancement

GlobalGive is designed as an extensible platform capable of growth and adaptation to emerging technologies and user needs.

- IPFS Document Upload Integration: Future versions will integrate direct IPFS upload through the NGO withdrawal form, automatically generating the content hash and embedding it in the blockchain transaction without requiring NGOs to manage IPFS separately.

- Multi-Chain Support: The campaign schema already supports Ethereum, Polygon, and Binance Smart Chain. Future development will activate full multi-chain donation routing, allowing donors to choose their preferred network for each contribution.

- Fiat On-Ramp via Razorpay or Stripe: Integration with a payment gateway will allow donors without cryptocurrency wallets to contribute using conventional INR payment methods, with the platform handling the fiat-to-crypto conversion and executing the blockchain transaction on their behalf.

- Advanced NGO Analytics: A dedicated analytics dashboard for NGOs will provide donor geolocation data, daily contribution trend charts, campaign traffic sources, and social sharing metrics to help organisations refine their fundraising strategies.

- AI-Based Campaign Fraud Detection: A machine learning classification layer will analyse newly submitted campaign descriptions for patterns associated with fraudulent language, misleading claims, or policy violations, providing automated flagging before admin review.

- Mobile Application: A React Native mobile application will extend the GlobalGive experience to Android and iOS users with native MetaMask deep-link integration and push notification support for campaign milestones and donation confirmations.

- DAO Governance Layer: A decentralised autonomous organisation governance mechanism will allow long-term platform stakeholders to participate in decisions about campaign approvals, withdrawal disputes, and protocol parameters, further reducing centralised authority over the platform.


CONCLUSION

GlobalGive demonstrates that blockchain technology and modern full-stack web development can be combined to create a donation platform that is genuinely transparent, not merely transparent in claim. By anchoring every financial transaction to the Polygon blockchain through a Solidity smart contract, the platform removes the fundamental trust dependency that undermines conventional donation systems. Donors no longer need to accept a charity's self-reported accounting — they can read every donation and every withdrawal directly from a public, immutable ledger at any time. The backend event listener ensures that on-chain transactions propagate to the user interface within seconds of confirmation, making the platform feel as responsive and immediate as any modern web application despite the underlying blockchain complexity. Role-based access control, JWT authentication, and bcryptjs password hashing ensure that the security of the system matches the ambition of its transparency goals. Across testing with realistic donation scenarios, the platform successfully records transactions on-chain, triggers real-time dashboard updates, and maintains consistent data integrity between the blockchain state and the MongoDB database. The NGO portal provides a complete campaign lifecycle management experience, from creation through active fundraising to verifiable fund withdrawal. Looking ahead, integration of IPFS document storage, fiat on-ramp payment gateways, multi-language support, and AI-based campaign authenticity screening will expand both the capability and the reach of the platform. GlobalGive establishes a replicable model for transparent digital philanthropy — one where the integrity of charitable giving is enforced by code and consensus rather than by institutional trust alone.
