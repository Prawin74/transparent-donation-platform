
# GlobalGive – Transparent Donation Platform
# Aim and Objectives (Elaborated)

---

**Project Title:** GlobalGive – Transparent Donation Platform  
**Document Type:** Aim and Objectives – Detailed Elaboration  
**Prepared:** April 2026  

---

## 4.1 Aim

To design, develop, and deploy a Web3-integrated transparent donation platform that leverages blockchain immutability to ensure complete accountability and real-time visibility of charitable fund flows for all stakeholders — including donors, non-governmental organisations (NGOs), and platform administrators — thereby restoring public trust in digital philanthropy through verifiable, tamper-proof technology.

---

## 4.2 Detailed Objectives

---

## Objective 1 – Establish an Immutable Donation Ledger

### Background and Context

The single most damaging problem in the charitable donation sector is the inability of donors to verify what happens to their money after they give. Traditional platforms maintain centralised databases that are controlled by the platform operators themselves. These databases are not only opaque to the public but can also be modified, selectively disclosed, or even wiped entirely in the event of a shutdown or scandal. Donors have no recourse and no independent means of verification.

Blockchain technology fundamentally changes this dynamic. When a financial record is written to a public blockchain, it becomes part of a distributed ledger replicated across thousands of nodes worldwide. It cannot be altered, overwritten, or deleted by any single party — not even the platform itself. This property, known as immutability, is the cornerstone of GlobalGive's trust model.

### What This Objective Entails

This objective involves the design, implementation, testing, and deployment of a **Solidity smart contract** named `DonationCampaign` on the **Polygon Amoy Testnet** — a public, EVM-compatible blockchain that offers low transaction fees and fast confirmation times, making it suitable for high-frequency donation activity.

The smart contract serves as a tamper-proof financial register for the platform. Every donation made through GlobalGive triggers a function call on this contract, which appends a new entry to an on-chain `Donation` array. This entry contains:

- **Donor Address** – The public wallet address of the contributor, providing pseudonymous accountability
- **Donation Amount** – The quantity of ERC-20 tokens (stablecoins) transferred, expressed in wei (the smallest token unit)
- **Block Timestamp** – The exact time at which the Polygon network confirmed the transaction

Every record is stored as a Solidity struct (`Donation`) and appended to a dynamic array on the contract, meaning the history grows with every transaction and is always publicly readable.

### Withdrawal Accountability

The ledger does not stop at recording incoming donations. Every time an NGO withdraws funds from the campaign, the smart contract's `withdraw()` function requires two mandatory parameters beyond the amount:

1. **Purpose** – A human-readable text string explaining why the funds are being withdrawn (e.g., "Procurement of 200 school kits for rural children in Tamil Nadu")
2. **IPFS Proof Hash** – A content-addressed hash pointing to a document stored on the InterPlanetary File System (IPFS), such as an invoice, receipt, photographs, or an official utilisation certificate

This design means that every withdrawal is anchored to verifiable evidence. The IPFS hash is immutably stored on-chain, making it impossible for an NGO to claim a purpose retroactively or after the fact. Both the purpose and the proof hash are stored in a `Withdrawal` struct and appended to a separate on-chain array, forming a complete and auditable fund-usage log.

### Events as the Audit Mechanism

Beyond storing data in arrays, the contract emits two types of blockchain events:

- `DonationReceived(address donor, uint256 amount, uint256 timestamp)` — emitted every time a donation is confirmed
- `WithdrawalMade(uint256 amount, string purpose, string proofIpfsHash, uint256 timestamp)` — emitted every time a withdrawal is executed

These events are the raw foundation of the platform's on-chain audit trail. They are captured by the backend's blockchain listener service and broadcasted in real time to all active frontend users. They also form the basis of the public Audit Trail page where any visitor can review every financial event on the platform.

### Technical Safeguards Implemented

- **ReentrancyGuard** from OpenZeppelin is inherited by the contract, wrapping both `donate()` and `withdraw()` with the `nonReentrant` modifier. This prevents a class of attacks where a malicious contract repeatedly calls back into the donation function before the previous execution completes, potentially draining funds.
- **onlyOwner modifier** restricts withdrawal to the original campaign creator, preventing any other address from pulling funds.
- **Amount validation (`require(amount > 0)`)** prevents zero-value spam transactions that would clutter the ledger.
- **ERC-20 interface compliance** ensures that only standard, verifiable token transfers are accepted, preventing any non-standard or malicious token injection.

### Significance of This Objective

This objective forms the trust foundation upon which every other feature of GlobalGive is built. Without an immutable ledger, every other transparency claim the platform makes would be hollow. Because this ledger is maintained by the Polygon blockchain — a global, decentralised network — no single actor, including GlobalGive itself, has the power to edit, suppress, or fabricate financial records. This is the ultimate accountability guarantee.

---

## Objective 2 – Implement Role-Based Multi-User System

### Background and Context

A donation platform serves radically different users with radically different capabilities and responsibilities. A donor's needs are fundamentally different from an NGO's operational requirements, and neither should have access to administrative controls. Without a carefully designed access control system, the platform would be both insecure and unusable — donors could accidentally access NGO management tools, and NGOs could manipulate administrative verifications.

GlobalGive implements a **Role-Based Access Control (RBAC)** architecture that governs both the backend API and the frontend routing layer. This is not a simple hide/show mechanism on the UI — it is a full-stack, cryptographically enforced access control system where every HTTP request and every page navigation is validated against the authenticated user's role.

### Three Distinct User Roles

**1. Donor**
The donor is the financial contributor of the platform. Donors register with their name, email, and password, and are automatically verified upon registration. Their access is limited to browsing campaigns, making donations, viewing their personal transaction history, and accessing the public audit trail. They cannot create campaigns, manage NGO operations, or access admin controls.

**2. NGO (Non-Governmental Organisation)**
NGOs are the campaign creators and fund recipients. They register with their organisation details and wait for admin approval (or are auto-approved in the current development phase). Once verified, they can create campaigns, manage their fundraising operations, monitor progress, and submit withdrawal requests. They have no access to the donor dashboard or administrative functions.

**3. Admin**
The admin role is not self-registered — admin accounts are created through a secure server-side script (`create_admin.js`) by the system operator. Admins can view and verify pending NGO accounts, monitor all platform campaigns, and maintain governance over the system. They cannot donate or create campaigns.

### Authentication Architecture

The authentication system is built around **JSON Web Tokens (JWT)**. When a user successfully logs in, the backend generates a signed JWT containing:

- `id` – The MongoDB ObjectId of the user document
- `role` – The user's assigned role ('donor', 'ngo', or 'admin')
- `isVerified` – The verification flag, relevant for NGO accounts
- Token expiry set to **24 hours** for security

This token is returned to the frontend where it is stored in `localStorage`. Every subsequent API call from the frontend includes this token in the `Authorization: Bearer <token>` HTTP header.

On the backend, the `authMiddleware` function intercepts every protected request, extracts the JWT from the header, verifies the signature using the server's `JWT_SECRET`, and attaches the decoded payload to `req.user`. Route handlers then read `req.user.role` to enforce role-specific logic.

### Password Security

Before any user credentials are stored, the password is processed through **bcryptjs** with a salt factor of 10. Salt is a randomly generated value that is mixed with the password before hashing, ensuring that two users with the same password produce entirely different hash values. This protects against rainbow table attacks. The bcrypt comparison algorithm is also time-constant, preventing timing-based brute force attacks.

### Frontend Route Guards

The React frontend enforces access control at the routing level through three custom wrapper components:

- **ProtectedRoute** – Wraps any route that requires authentication. If `isAuthenticated` is false, the user is redirected to `/login`.
- **RoleRoute** – Wraps routes that require a specific role. If the authenticated user's role does not match the required role, they are redirected to their own appropriate dashboard.
- **PublicRoute** – Prevents authenticated users from accessing login or signup pages. If they are already logged in, they are redirected to their role's dashboard.

### Significance of This Objective

This objective ensures that GlobalGive's multi-tenant architecture is secure and purposeful. Each user type gets a tailored experience that contains exactly the features they need and nothing more, reducing cognitive load, preventing accidental misuse, and enforcing the trust boundaries that make the platform safe for all parties.

---

## Objective 3 – Enable Seamless Web3 Wallet Integration

### Background and Context

The entire proposition of a blockchain-based donation platform depends on users being able to interact with the blockchain directly from their browser. Without a smooth, reliable wallet integration, donors cannot authorise token transfers, and the platform's transparency claims cannot be realised in practice. Wallet integration is therefore not just a feature — it is the user-facing gateway to the entire blockchain layer of GlobalGive.

The dominant Web3 wallet for browser-based blockchain interaction is **MetaMask**, a browser extension that manages Ethereum-compatible key pairs and signs transactions on behalf of the user. GlobalGive integrates MetaMask through the **Ethers.js v6** library, which provides a clean, promise-based abstraction over the raw MetaMask API.

### Technical Implementation

When the application initialises, it checks for the presence of `window.ethereum` — the global object injected by MetaMask. If detected, an `ethers.BrowserProvider` is created, wrapping the MetaMask provider and giving the application access to blockchain read and write operations.

When the donor clicks "Connect Wallet":
1. The application calls `provider.send('eth_requestAccounts', [])`, which triggers MetaMask to prompt the user for permission to connect their wallet to the site.
2. Once approved, a `Signer` object is retrieved using `provider.getSigner()`. The signer represents the user's authenticated identity on the blockchain — it can sign messages and authorise transactions.
3. The wallet address is retrieved using `signer.getAddress()` and stored in the application's Web3 context, making it available to any component on the frontend.
4. The current network is retrieved using `provider.getNetwork()` and displayed to the user as confirmation.

### ENS Resolution Safety

The Polygon Amoy testnet (Chain ID: 80002) does not support the Ethereum Name Service (ENS), a system that maps human-readable names like `alice.eth` to wallet addresses. Ethers.js v6 attempts ENS resolution by default for any address lookup, which causes an `UNSUPPORTED_OPERATION` error on Amoy. GlobalGive explicitly handles this by checking the chain ID after connection and setting `network.ensAddress = null` when Amoy is detected. This prevents the error from crashing the connection flow and is applied identically on both the frontend wallet connector and the backend blockchain listener provider.

### Live Event Listeners

Two runtime event listeners are registered on `window.ethereum` to handle dynamic wallet state changes:

- `accountsChanged` – Fired when the user switches MetaMask accounts. The application updates the stored wallet address instantly, ensuring the UI always reflects the currently connected account.
- `chainChanged` – Fired when the user switches networks in MetaMask. The application triggers a full page reload to reinitialise the provider and signer for the new network, preventing stale state from causing transaction errors.

### Web3 Context

The provider, signer, wallet address, network, and the `connectWallet` function are all stored in a `Web3Context` (React Context) and shared across the entire application. Any component — the Donate page, the dashboard, the audit trail — can access these values without prop-drilling, keeping the codebase clean and maintainable.

### Significance of This Objective

Wallet integration is the user's direct line to the blockchain. A seamless, error-free connection experience is critical for user retention — if connecting a wallet is confusing or error-prone, donors will abandon the platform. By handling edge cases like ENS incompatibility, network changes, and account switching, GlobalGive provides a professional, reliable Web3 experience that matches or exceeds the standard set by leading DeFi platforms.

---

## Objective 4 – Build a Real-Time Data Pipeline

### Background and Context

In a traditional web application, data is fetched when a page loads and remains static until the user manually refreshes. This model is entirely inadequate for a donation platform where the state of campaigns, donation totals, and transaction histories changes with every blockchain confirmation — potentially multiple times per minute during active fundraising events.

GlobalGive implements a multi-layer **real-time data pipeline** that ensures every confirmed blockchain event reaches the user interface within seconds, without any manual intervention from the user.

### Three Layers of the Pipeline

**Layer 1 – Blockchain to Backend (Event Listener)**

The `blockchainListener.js` service runs continuously alongside the Express server. Using `ethers.JsonRpcProvider`, it establishes a connection to the Polygon Amoy RPC endpoint and creates a contract instance bound to the deployed `DonationCampaign` smart contract address. It registers an event listener using the contract's `on()` method for the `DonationReceived` event.

When Polygon confirms a donation transaction and the event is emitted by the contract, the listener is triggered within seconds. It extracts the transaction hash, donor address, amount, campaign ID, and timestamp from the event, and proceeds through the following steps:

1. Checks for an existing record with the same transaction hash in MongoDB to prevent duplicate entries (important for handling blockchain reorganisations)
2. Saves a new `Donation` document to MongoDB with all transaction details
3. Updates the campaign's `raisedAmount` field by adding the new donation amount
4. Retrieves the Socket.IO instance and emits a `newDonation` event with the full transaction payload to all connected clients

**Layer 2 – Backend to Frontend (Socket.IO)**

Socket.IO is a WebSocket-based library that maintains persistent, bidirectional connections between the server and all active browser clients. The server is initialised in `socketService.js` and attached to the same HTTP server as Express, sharing the port.

On the frontend, `SocketContext` creates a single Socket.IO client connection during the application's lifecycle. This connection is maintained as long as the user has any tab open. When the backend emits a `newDonation` event, every connected client receives it simultaneously. React state updates are triggered from within the socket event handler, causing the dashboard to re-render with the new data.

**Layer 3 – Intra-Frontend (Custom Browser Events)**

For the real-time simulation flow used in demonstrations, a custom browser-level event (`gg:newDonation`) is dispatched by `useDonation.js` after the donation flow completes. The `useTransactionHistory.js` hook listens for this event using `window.addEventListener` and immediately prepends the new transaction to the existing history list, updating derived statistics simultaneously. This entire update happens within the browser with zero network round-trips, making the dashboard response feel instantaneous.

### Duplicate Prevention

The blockchain listener implements deduplication by querying MongoDB for an existing Donation document with the incoming transaction hash before inserting. If a record already exists (which can happen during network restarts or blockchain reorganisations), the function returns early without creating a duplicate.

### Significance of This Objective

Real-time data propagation is what makes GlobalGive feel alive and trustworthy. When donors can see their contribution appear in the campaign's progress bar immediately after confirmation, and when they receive instant feedback on their transaction history updating, the perceived transparency of the platform is dramatically enhanced. This objective transforms GlobalGive from a static information repository into a living, breathing financial dashboard.

---

## Objective 5 – Provide a Rich Donor Dashboard

### Background and Context

The donor is the most important user of the platform — without donors, no campaigns can be funded. Yet on most donation platforms, the donor's post-contribution experience is virtually nonexistent: a thank-you email, perhaps a progress bar, and silence thereafter. GlobalGive treats the donor's ongoing engagement as a core product feature, not an afterthought.

The Donor Dashboard is the donor's personalised command centre — a live view of their philanthropic activity, impact statistics, and real-time platform updates.

### Dashboard Components

**1. Impact Metrics Cards**
Three prominent summary cards are displayed at the top of the dashboard:
- **Total Donated** – The cumulative sum of all MATIC donated across all campaigns, updated in real time as new transactions are added
- **Active Campaigns** – The count of distinct campaigns the donor has contributed to, calculated as the number of unique campaign names in the transaction history
- **Verified Status** – A visual badge confirming the donor's account is verified and active on the platform

**2. Transaction History Table**
A full, scrollable table displays every donation the user has made, including:
- Campaign Name
- Amount in MATIC
- Date and Time of the transaction
- Transaction Hash — rendered as a shortened string (first and last 6 characters) with a clickable link to PolygonScan
- Status Badge — styled chip showing "Confirmed" in green

The table is sorted with the most recent transactions at the top for immediate visibility.

**3. Real-Time Highlight System**
When a new transaction is added to the dashboard — either from a Socket.IO event, a completed donation flow, or the automatic ticker — the new row is given a CSS highlight class that renders it with a bright green background. After 5 seconds, this class is removed with a smooth fade transition, drawing the donor's attention without being permanently disruptive.

**4. Real-Time Ticker**
A background interval (set at 25-second intervals via `setInterval`) automatically injects realistic dummy transactions into the history to simulate a busy platform environment during demonstrations. Each injected transaction is drawn from a pool of real campaign names and realistic MATIC amounts.

**5. Seed Data Merging**
If the donor's real transaction history from the API is sparse (e.g., a newly registered user), the hook merges the real data with a set of 12 pre-seeded transactions covering a variety of campaign types, MATIC amounts, and dates. This ensures the dashboard always looks populated and functional, improving the first-time user experience.

### Significance of This Objective

A rich, real-time dashboard transforms one-time donors into engaged community members. When donors can see their impact history at a glance, track their cumulative contributions, and watch the platform's live activity, they are more likely to return, donate again, and refer others. This objective directly serves the platform's growth and donor retention goals.

---

## Objective 6 – Create a Full NGO Campaign Management Portal

### Background and Context

NGOs are the supply side of the GlobalGive platform — they create the causes that donors fund. A poorly designed NGO experience directly undermines the platform's core mission: if NGOs find it difficult to create or manage campaigns, fewer campaigns will exist, fewer donations will occur, and the platform's impact will be limited.

GlobalGive provides a comprehensive, self-service NGO portal with four key functional sections, each accessible via a dedicated nested route within the `/ngo` path.

### NGO Dashboard (Overview Page)
The default landing page for NGOs after login is the NGO Dashboard, which presents:
- Summary statistics of all their campaigns (total raised, number of campaigns, active vs. completed)
- Quick-action cards linking to campaign creation, campaign management, and the withdrawal module
- Visual indicators of the NGO's verification status

### Campaign Creation (`/ngo/create`)
The campaign creation form allows NGOs to define every aspect of their fundraising initiative:
- **Title** – The campaign's public-facing name
- **Description** – A rich text description of the cause, context, and intended use of funds
- **Target Amount** – The fundraising goal in MATIC tokens
- **Deadline** – The campaign's expiry date, after which new donations may not be accepted
- **Category** – One of four predefined categories: Medical, Education, Disaster Relief, or Social Cause
- **Beneficiary Name** – The name of the individual, community, or organisation being helped
- **Wallet Address** – The Polygon wallet where donated funds will be received
- **Network** – The blockchain network (Ethereum, Polygon, or BSC)
- **Campaign Image** – An optional image representing the cause, stored as a URL or base64 string

On submission, the campaign is sent to the `/api/campaigns` backend endpoint where it is validated against the Mongoose schema and saved to MongoDB. The campaign is immediately live and visible to donors.

### Campaign Management (`/ngo/campaigns`)
The campaigns list provides NGOs with a sortable, filterable view of all their campaigns:
- Active / Ongoing campaigns with live progress indicators
- Completed campaigns that have reached their funding goal or deadline
- Expired campaigns that passed their deadline without reaching the goal
- Soft-deleted campaigns that have been removed from public view but retained for audit purposes

Each campaign card shows the title, amount raised, target amount, percentage funded, and the campaign's deadline. NGOs can view full campaign details and access the withdrawal form from this interface.

### Withdrawal Module (`/ngo/withdraw`)
When an NGO is ready to utilise collected funds, they submit a withdrawal request through the withdrawal form. This form requires:
- **Campaign Selection** – Which campaign's funds are being withdrawn
- **Amount** – The quantity of MATIC to withdraw
- **Purpose** – A written explanation of how the funds will be used
- **Proof Hash** – The IPFS content hash of the supporting document

Upon submission, the withdrawal is recorded both in the MongoDB database and on the blockchain smart contract, creating an immutable proof of fund utilisation that is visible to all donors on the audit trail.

### Significance of This Objective

The NGO portal empowers legitimate charitable organisations to operate professionally and transparently on the platform. By providing a full lifecycle from campaign creation to fund withdrawal, GlobalGive eliminates the need for NGOs to use basic spreadsheets or opaque manual processes, replacing them with a tracked, verifiable digital workflow.

---

## Objective 7 – Implement an On-Chain Audit Trail

### Background and Context

Even with a backend database storing transaction records, a savvy observer might still question whether the platform's own data could be manipulated. To address this concern at the deepest level, GlobalGive provides an **on-chain audit trail** — a page that reads financial records directly from the Polygon blockchain using Ethers.js, completely bypassing the platform's own MongoDB database.

### What the Audit Trail Displays

The audit trail page connects directly to the deployed smart contract using a read-only Ethers.js provider and calls the contract's public view functions:
- `getDonations()` – Returns the full array of Donation structs stored on-chain, including donor address, amount in wei, and block timestamp
- `getWithdrawals()` – Returns the full array of Withdrawal structs, including amount, purpose string, IPFS proof hash, and timestamp

These records are then formatted and displayed in a chronological table — donations and withdrawals interleaved — giving any viewer a complete, unabridged financial history of the campaign directly from the blockchain.

### Why This Is Different From a Database View

When data is read from MongoDB, users are trusting that the database has not been tampered with. The blockchain audit trail removes this trust dependency entirely. Because the Polygon blockchain is public and decentralised, the same records returned by the audit trail can be independently verified using any third-party blockchain explorer such as PolygonScan. The platform is not the source of truth — the blockchain is.

### Access and Visibility

The audit trail is accessible to all authenticated users (both donors and NGOs) as a shared protected route. This design choice reflects the platform's transparency commitment: financial records should not be hidden from any participant in the ecosystem. Anyone with a GlobalGive account can verify any campaign's fund flows at any time.

### Significance of This Objective

This objective is the ultimate expression of GlobalGive's transparency promise. It is the technical proof that backs up every marketing claim about accountability. By making on-chain audit readable directly within the application, GlobalGive removes the barrier of blockchain expertise from the transparency experience — users do not need to know how to use PolygonScan to verify the platform's integrity.

---

## Objective 8 – Ensure Platform Security

### Background and Context

A donation platform handles real financial transactions and stores sensitive user data. Any security vulnerability — from a compromised password database to a smart contract exploit — can destroy user trust permanently and cause real financial harm. Security is therefore not an optional enhancement; it is a core requirement that must be addressed at every layer of the stack.

### 8.1 Password Security (bcryptjs)
User passwords are never stored in plaintext. When a user registers, their password is processed through bcryptjs with a randomly generated salt and a computational cost factor of 10. The result is a 60-character hash that is stored in MongoDB. During login, bcryptjs re-hashes the provided password with the stored salt and compares the result to the stored hash using a constant-time comparison algorithm that prevents timing-based attacks.

### 8.2 Stateless JWT Authentication
The platform uses stateless, token-based authentication. After login, the client receives and stores a JWT. This token is self-contained — it carries the user's identity and role without requiring a server-side session. The `JWT_SECRET` used to sign and verify tokens is stored as an environment variable and never hardcoded in source code. Tokens expire after 24 hours, limiting the window of exposure if a token is compromised.

### 8.3 Input Validation
All API endpoints validate incoming request data before processing. Required fields are checked for presence and appropriate type. The role field during registration is validated against an explicit allowlist (`['donor', 'ngo']`) to prevent privilege escalation through crafted registration requests. Mongoose schema validation provides a second layer of defence, rejecting any document that does not conform to the defined schema before it reaches the database.

### 8.4 Role Enforcement Middleware
Every sensitive backend route is protected by both `authMiddleware` (verifies authentication) and role-checking logic (verifies the required role). The NGO verification endpoint, for example, explicitly checks `req.user.role !== 'admin'` and returns a 403 Forbidden response for any other role. This defence-in-depth approach ensures that frontend route guards cannot be bypassed by direct API calls.

### 8.5 Smart Contract Security (ReentrancyGuard)
The Solidity contract inherits from OpenZeppelin's `ReentrancyGuard` — one of the most battle-tested smart contract security libraries in the ecosystem. The `nonReentrant` modifier applied to `donate()` and `withdraw()` prevents reentrancy attacks, where a malicious contract calls back into the donation function during execution to drain funds or manipulate state. This is the same guard used by leading DeFi protocols like Uniswap and Aave.

### 8.6 Environment Variable Management
All sensitive configuration values — private keys, database URIs, JWT secrets, contract addresses — are stored in a `.env` file and accessed via `process.env`. The `.env` file is excluded from version control via `.gitignore`, ensuring secrets are never accidentally exposed in public repositories.

### Significance of This Objective

Security is what makes GlobalGive trustworthy not just in its transparency claims but in its technical execution. A transparent system is meaningless if it can be exploited or compromised. By implementing industry-standard security practices at every layer — from the database to the smart contract — GlobalGive ensures that the platform's financial and user data are protected against the most common categories of attack.

---

## Objective 9 – Design a Premium, Accessible User Interface

### Background and Context

A technically sophisticated platform will fail to achieve adoption if it is difficult to use or visually uninspiring. The user interface is the lens through which all of GlobalGive's technical capabilities are experienced. A poor UI makes donors hesitant, confuses NGOs, and erodes confidence in the platform's professionalism. Conversely, a polished, intuitive interface communicates credibility and encourages engagement.

GlobalGive's frontend is designed to the standard of a modern SaaS product — with a coherent design system, smooth animations, role-aware navigation, and complete responsiveness across devices.

### Design System
The application uses a custom CSS design system defined in `GlobalTheme.css`. All design tokens — colours, spacing, border radii, typography, shadow levels — are defined as CSS custom properties on the `:root` element. This creates a single source of truth for the visual language. When the theme switches from dark to light, only the CSS variable values change, and the entire UI updates instantly without any JavaScript re-rendering.

### Dark and Light Theme
A theme toggle button is embedded in the NavBar. The user's preference (`dark` or `light`) is stored in `localStorage` and applied on every page load. The `ThemeProvider` context applies the appropriate class name to the root `<body>` element, which cascades CSS variable overrides to every component. The transition between themes uses CSS `transition: all 0.3s ease`, creating a smooth visual crossfade rather than an abrupt switch.

### Responsive Navigation
The NavBar is the primary orientation element for all user types. It renders a completely different set of links based on the authenticated user's role — donors see donation-oriented links, NGOs see management-oriented links, and admins see governance links. On mobile devices, the navigation collapses into a hamburger menu. The NavBar is hidden entirely on the login and signup pages to give the authentication flow a clean, distraction-free appearance.

### Multi-Step Donation Animation
The donation flow UI provides visual feedback at every stage of the transaction simulation:
- Stage 1: "Checking address and network" — with a spinner
- Stage 2: "Fetching optimised gas fees"
- Stage 3: "Awaiting wallet signature" — with a highlighted warning to check MetaMask
- Stage 4: "Broadcasting transaction"
- Stage 5: "Confirmed on Polygon Amoy!" — with a celebration banner and the transaction hash

Each stage transitions with a CSS animation, making the multi-second wait feel purposeful and engaging rather than like a frozen loading screen.

### Transaction Row Highlights
When a new donation appears in the dashboard — from a real event or from the live ticker — the row is highlighted in green for five seconds using a CSS animation class, then fades back to normal. This micro-interaction communicates system activity without being permanently distracting.

### Significance of This Objective

Premium UI design is not vanity — it is a strategic investment in user trust. A platform that looks professional communicates that it has been built carefully and maintained responsibly. For a donation platform specifically, visual polish reduces friction at the point of giving, which can meaningfully increase conversion rates and average donation amounts.

---

## Objective 10 – Support Campaign Discovery for Donors

### Background and Context

The effectiveness of a donation platform depends on its ability to connect the right donor with the right cause at the right moment. If donors cannot easily find campaigns that resonate with them, they will disengage and seek alternatives. Campaign discovery is therefore a core functional requirement that sits at the intersection of user experience and platform impact.

GlobalGive provides a dedicated donation page where all active NGO campaigns are listed and searchable, giving donors a rich, informed browsing experience before they commit to a contribution.

### Campaign Listing
The Donate page (`/donate`) fetches all active campaigns from the `/api/campaigns` backend endpoint and renders them as visually rich campaign cards. Each card displays:
- **Campaign Title** – Bold, prominent
- **Category Badge** – Colour-coded chip (Medical, Education, Disaster Relief, Social Cause)
- **Campaign Image** – Representative photo uploaded by the NGO
- **Description** – A concise summary of the campaign's purpose
- **Beneficiary Name** – Who the funds are helping
- **Progress Bar** – A visual indicator showing the percentage of the funding goal reached (raisedAmount / targetAmount × 100)
- **Amount Raised vs. Goal** – Displayed as "X MATIC raised of Y MATIC goal"
- **Deadline** – The campaign's closing date, with days-remaining countdown
- **Donate Button** – Triggers the donation flow for the selected campaign

### Campaign Details Page
Each campaign card links to a full-detail view at `/campaign/:id`. This page provides the complete campaign information, including the NGO's extended description, all donor wallet addresses who have contributed (sourced from the on-chain ledger), total raised, and a direct link to the campaign's smart contract on PolygonScan for independent verification.

### Filtering and Categorisation
Campaigns are filterable by category, allowing donors to find causes aligned with their philanthropic priorities. A donor who specifically wishes to support education-focused NGOs can filter the campaign list to show only Education category campaigns.

### Campaign Lifecycle Management
Campaigns are managed across well-defined lifecycle stages enforced by the backend:
- **ONGOING** – Active fundraising, visible to all donors
- **Completed** – Funding goal has been reached, no longer accepting new donations
- **Expired** – Deadline has passed without reaching the goal
- **Deleted** – Soft-deleted by the NGO, invisible to donors but retained for audit

The donation page only displays ONGOING campaigns, ensuring donors are not presented with campaigns they cannot contribute to.

### Significance of This Objective

Campaign discovery is the point where the platform's transparency, credibility, and design converge. When donors can browse clearly presented, data-rich campaigns and make informed decisions about where to direct their funds, the entire platform achieves its mission. This objective ensures that GlobalGive is not just a transaction processor but a genuine discovery and impact platform that matches donor intent with NGO need, maximising both the volume and the purposefulness of charitable giving.

---

## Summary of Objectives

| # | Objective | Core Technology |
|---|---|---|
| 1 | Immutable Donation Ledger | Solidity, Polygon Blockchain |
| 2 | Role-Based Multi-User System | JWT, bcryptjs, Express Middleware |
| 3 | Web3 Wallet Integration | MetaMask, Ethers.js v6 |
| 4 | Real-Time Data Pipeline | Socket.IO, Blockchain Event Listener |
| 5 | Rich Donor Dashboard | React, useTransactionHistory Hook |
| 6 | NGO Campaign Management Portal | React Router, Mongoose, Express API |
| 7 | On-Chain Audit Trail | Ethers.js Read-Only Provider, Polygon |
| 8 | Platform Security | bcryptjs, JWT, ReentrancyGuard, dotenv |
| 9 | Premium User Interface | React Context, CSS Variables, Animations |
| 10 | Campaign Discovery | REST API, React Component, MongoDB Queries |

---

*Document: GlobalGive – Aim and Objectives (Elaborated)*  
*Prepared: April 2026*  
*Total Pages: ~10*

---
