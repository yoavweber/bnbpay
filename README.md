# BNBPay

Receive cryptocurrency payments effortlessly. Zero complicated setup, zero hidden charges. Experience swift, protected, and dependable blockchain transactions.

## Run
Please run the frontend and the bakckend in seperate process.
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
