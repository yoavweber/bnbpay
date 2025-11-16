// scripts/deploy.js
const hre = require("hardhat");

async function main() {
  console.log(" Starting deployment to BNB Testnet...\n");

  // Get deployer account
  const { ethers } = require("hardhat");
  const [deployer] = await ethers.getSigners();
  console.log(" Deploying from:", deployer.address);
  
  const balance = await deployer.getBalance();
  console.log(" Balance:", hre.ethers.utils.formatEther(balance), "BNB\n");

  // Check if sufficient balance
  if (balance.lt(hre.ethers.utils.parseEther("0.01"))) {
    console.log("  Low balance! Get testnet BNB from:");
    console.log("   https://testnet.bnbchain.org/faucet-smart\n");
  }

  // Deploy PaymentProcessor
  console.log(" Deploying PaymentProcessor...");
  const PaymentProcessor = await hre.ethers.getContractFactory("PaymentProcessor");
  const processor = await PaymentProcessor.deploy();
  await processor.deployed();
  console.log(" PaymentProcessor deployed to:", processor.address);

  // Deploy SubscriptionManager
  console.log("\n Deploying SubscriptionManager...");
  const SubscriptionManager = await hre.ethers.getContractFactory("SubscriptionManager");
  const subscriptionManager = await SubscriptionManager.deploy();
  await subscriptionManager.deployed();
  console.log(" SubscriptionManager deployed to:", subscriptionManager.address);

  // Save addresses
  console.log("\n" + "=".repeat(60));
  console.log(" DEPLOYMENT SUMMARY");
  console.log("=".repeat(60));
  console.log("Network: BNB Smart Chain Testnet");
  console.log("Chain ID: 97");
  console.log("Deployer:", deployer.address);
  console.log("\nContract Addresses:");
  console.log("PaymentProcessor:", processor.address);
  console.log("SubscriptionManager:", subscriptionManager.address);
  console.log("=".repeat(60));
  
  console.log("\n View on BscScan:");
  console.log(`https://testnet.bscscan.com/address/${processor.address}`);
  console.log(`https://testnet.bscscan.com/address/${subscriptionManager.address}`);
  
  console.log("\n Deployment complete! Save these addresses for frontend!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
