// utils/blockchain.js
const { ethers } = require('ethers');
const { CONTRACTS, PROCESSOR_ABI, SUBSCRIPTION_ABI, BLOCKCHAIN_CONFIG } = require('../config/contracts');

// Initialize provider
const provider = new ethers.providers.JsonRpcProvider(BLOCKCHAIN_CONFIG.rpcUrl);

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

module.exports = {
  getProcessorContract,
  getSubscriptionContract,
  getPaymentDetails,
  getSubscriptionDetails,
  verifyTransaction,
};
