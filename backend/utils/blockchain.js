// utils/blockchain.js
const { ethers } = require('ethers');
const { CONTRACTS, PROCESSOR_ABI, SUBSCRIPTION_ABI, BLOCKCHAIN_CONFIG } = require('../config/contracts');
require('dotenv').config();

// Initialize provider and signer
const provider = new ethers.providers.JsonRpcProvider(BLOCKCHAIN_CONFIG.rpcUrl);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

/**
 * Get Payment Processor contract (read-only)
 */
function getProcessorContract() {
  return new ethers.Contract(CONTRACTS.processor, PROCESSOR_ABI, provider);
}

/**
 * Get Subscription Manager contract (read-only)
 */
function getSubscriptionContract() {
  return new ethers.Contract(CONTRACTS.subscriptionManager, SUBSCRIPTION_ABI, provider);
}

/**
 * Get Subscription Manager contract (with signer for transactions)
 */
function getSubscriptionContractWithSigner() {
  return new ethers.Contract(CONTRACTS.subscriptionManager, SUBSCRIPTION_ABI, signer);
}

/**
 * Get payment details from blockchain
 */
async function getPaymentDetails(paymentId) {
  try {
    const contract = getProcessorContract();
    const payment = await contract.getPaymentDetails(paymentId);
    
    return {
      from: payment.from,
      to: payment.to,
      amount: ethers.utils.formatEther(payment.amount),
      token: payment.token,
      label: payment.label,
      memo: payment.memo,
      timestamp: payment.timestamp.toNumber(),
      processed: payment.processed,
    };
  } catch (error) {
    console.error('Error fetching payment details:', error);
    return null;
  }
}

/**
 * Get subscription details from blockchain
 */
async function getSubscriptionDetails(subId) {
  try {
    const contract = getSubscriptionContract();
    const sub = await contract.getSubscription(subId);
    
    return {
      id: sub.id,
      subscriber: sub.subscriber,
      recipient: sub.recipient,
      amountPerPeriod: ethers.utils.formatEther(sub.amountPerPeriod),
      intervalSeconds: sub.intervalSeconds.toNumber(),
      token: sub.token,
      startTimestamp: sub.startTimestamp.toNumber(),
      lastPaymentTimestamp: sub.lastPaymentTimestamp.toNumber(),
      nextPaymentTimestamp: sub.nextPaymentTimestamp.toNumber(),
      totalPaymentsMade: sub.totalPaymentsMade.toNumber(),
      active: sub.active,
    };
  } catch (error) {
    console.error('Error fetching subscription details:', error);
    return null;
  }
}

/**
 * Verify transaction on blockchain
 */
async function verifyTransaction(txHash) {
  try {
    const tx = await provider.getTransaction(txHash);
    if (!tx) return { valid: false, error: 'Transaction not found' };
    
    const receipt = await provider.getTransactionReceipt(txHash);
    if (!receipt) return { valid: false, error: 'Transaction not confirmed' };
    
    return {
      valid: true,
      status: receipt.status === 1 ? 'success' : 'failed',
      blockNumber: receipt.blockNumber,
      from: receipt.from,
      to: receipt.to,
      gasUsed: receipt.gasUsed.toString(),
    };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}

/**
 * Create a new subscription on the blockchain
 */
async function createSubscription(recipient, amountPerPeriod, intervalDays) {
  try {
    const contract = getSubscriptionContractWithSigner();
    const amountInWei = ethers.utils.parseEther(amountPerPeriod.toString());
    
    console.log(`Creating subscription on-chain:`);
    console.log(`  Recipient: ${recipient}`);
    console.log(`  Amount: ${amountPerPeriod} BNB`);
    console.log(`  Interval: ${intervalDays} days`);
    
    // For BNB subscriptions, send the first payment with the transaction
    const tx = await contract.createSubscription(
      recipient,
      amountInWei,
      intervalDays,
      ethers.constants.AddressZero, // address(0) for BNB
      { value: amountInWei } // Send first payment
    );
    
    const receipt = await tx.wait();
    console.log('✅ Subscription created successfully!');
    console.log('   Tx hash:', tx.hash);
    
    // Extract subscription ID from events
    const event = receipt.events?.find(e => e.event === 'SubscriptionCreated');
    const subscriptionId = event?.args?.subscriptionId;
    
    return {
      success: true,
      transactionHash: tx.hash,
      subscriptionId: subscriptionId
    };
  } catch (error) {
    console.error('❌ Error creating subscription on-chain:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

module.exports = {
  getProcessorContract,
  getSubscriptionContract,
  getSubscriptionContractWithSigner,
  getPaymentDetails,
  getSubscriptionDetails,
  createSubscription,
  verifyTransaction,
};
