# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.js
```

## BNB-Pay Backend Services

The backend lives under `backend/` and provides both the API server and a standalone cron service that keeps subscription data in sync with the blockchain.

### API Server

```bash
cd backend
pnpm install # or npm install
pnpm dev     # or npm run dev / npm start
```

### Subscription Cron Service

The cron service is completely independent from the API server so it can be supervised separately (e.g., by PM2, Docker, or systemd). It loads the same environment variables defined in `backend/.env`.

```bash
cd backend
node service/subscriptionCronService.js
```

This process runs indefinitely and logs every time the cron check is executed. Stop it with `CTRL+C` or your process manager of choice.

# BNB-Pay
