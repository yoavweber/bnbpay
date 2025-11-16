#  BNBPay - Instant Payment Links on BNB Chain

 BNBPay is the easiest way for merchants & creators to accept crypto payments with just a link, supporting one-time payments, subscriptions, and direct integration with online stores.

**Live Demo:** https://v0-bnb-theme-redesign.vercel.app  
**Contracts:** [BscScan Testnet](https://testnet.bscscan.com/address/0x100D63C951d5c3f0EAc725a739a4e858F55ccf1b) [BscScan Testnet](https://testnet.bscscan.com/address/0x12c979f3B10c627909F722953839818DF4090F47)

---

##  Why BNBPay?

**Problem:** Traditional payments = High Platform fees + slow settlements  
**Solution:** BNBPay = 0.5% fees + instant settlements on BNB Chain

Merchants generate shareable payment links → Customers click & pay → Funds arrive instantly.

---

##  Features

-  **Payment Links:** Generate & share instantly
-  **QR Codes:** Accept in-person payments
-  **Multi-Token:** BNB, USDT, USDC support
-  **Subscriptions:** Recurring payments on-chain
-  **Instant Settlement:** Direct to your wallet
-  **Transparent:** All txns on BscScan

---

##  User Journey

MERCHANT FLOW:
Connect Wallet → Create Payment → Get Link/QR → Share → Receive Funds 

CUSTOMER FLOW:
Click Link → View Details → Connect Wallet → Pay → Done 

text

**Example Link:**
https://bnbpay.vercel.app/send?to=0x742d...&amount=0.1&token=BNB&label=Coffee

---

##  Architecture
    Customer                Smart Contract              Merchant
       │                          │                        │
       │─── Pay 100 USDT ────────▶│                        │
       │                          │                        │
       │                          │── Deduct 0.5% Fee     │
       │                          │   (0.5 USDT)          │
       │                          │                        │
       │                          │── Transfer 99.5 USDT ─▶│
       │                          │                        │
       │◀── Confirmation ─────────│                        │
       │                          │                        │
       │                          │                        │
    ✅ Done                    ✅ Done                  ✅ Paid


**Key Innovation:** Payment data encoded in URL 

---

##  Smart Contracts

| Contract | Address | Chain |
|----------|---------|-------|
| **PaymentProcessor** | `0x100D63C951d5c3f0EAc725a739a4e858F55ccf1b` | BNB Testnet (97) |
| **SubscriptionManager** | `0x12c979f3B10c627909F722953839818DF4090F47` | BNB Testnet (97) |

**Core Functions:**
// Process BNB payment
function processPayment(address to, string label, string memo) payable;

// Process token payment
function processTokenPayment(address to, address token, uint256 amount, string label, string memo);

// Create subscription
function createSubscription(address recipient, uint256 amount, uint256 days, address token) payable;


---

##  Tech Stack

**Frontend:** Next.js 16, TypeScript, RainbowKit, Wagmi 2, Viem, Tailwind CSS  
**Smart Contracts:** Solidity 0.8.28, Hardhat 2.22  
**Backend:** Node.js, Express  
**Deployment:** Vercel + BNB Testnet

---

##  Quick Start

### Deploy Contracts:
git clone https://github.com/yoavweber/bnbpay
cd BNBPay
npm install
npx hardhat compile
npx hardhat run scripts/deploy.js --network bscTestnet

### Run Frontend:
cd frontend
npm install
npm run dev

Visit http://localhost:3000
text

### Environment Variables:
.env.local
NEXT_PUBLIC_PROCESSOR_ADDRESS=
NEXT_PUBLIC_SUBSCRIPTION_ADDRESS=
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id

text

---



##  Usage Example

// Generate payment link
const link = ${baseUrl}/send?to=${recipient}&amount=0.1&token=BNB&label=Coffee;

// Customer pays via smart contract
await processPayment(to, amount, label, memo);

// Done! Instant settlement 

---

## 🎯 Roadmap

- [x] Payment links & QR codes
- [x] Multi-token support
- [x] Subscriptions
- [ ] Mainnet launch
- [ ] Mobile app
- [ ] Fiat on-ramp
- [ ] Multi-chain support


# BNB-Pay Images
### Main page
<img width="2910" height="1632" alt="image" src="https://github.com/user-attachments/assets/cc6fe03b-f0f8-415e-8ac7-37af9240b440" />

### User List Page
<img width="1467" height="773" alt="Screenshot 2025-11-16 at 12 01 46" src="https://github.com/user-attachments/assets/113a556a-db34-430e-a6f9-2e9c523c4070" />

### Single User Page
<img width="1467" height="773" alt="Screenshot 2025-11-16 at 12 02 12" src="https://github.com/user-attachments/assets/fac8f82f-cce4-4704-94f6-89f738313f11" />

### Create Subscription
<img width="1467" height="773" alt="Screenshot 2025-11-16 at 12 02 57" src="https://github.com/user-attachments/assets/9781ed11-bf40-476f-b777-41ab132f42b9" />

### Client Link Page
<img width="1467" height="773" alt="Screenshot 2025-11-16 at 12 03 27" src="https://github.com/user-attachments/assets/61b815ce-5076-498f-b1f6-ff53b8d1659e" />
<img width="1467" height="773" alt="Screenshot 2025-11-16 at 12 03 45" src="https://github.com/user-attachments/assets/571d6cac-1944-4c84-998c-392f301f7166" />


### Payment Confirmation
<img width="1467" height="773" alt="Screenshot 2025-11-16 at 12 01 02" src="https://github.com/user-attachments/assets/1dc69a61-2d37-4f0b-beb7-92e1d9827a33" />
