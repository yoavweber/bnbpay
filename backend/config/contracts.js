// config/contracts.js
require('dotenv').config();

// Contract Addresses
const CONTRACTS = {
  processor: process.env.PAYMENT_PROCESSOR_ADDRESS,
  subscriptionManager: process.env.SUBSCRIPTION_MANAGER_ADDRESS,
};

// Minimal ABIs (just what we need)
const PROCESSOR_ABI = [
  "function processPayment(address to, string label, string memo) payable returns (bytes32)",
  "function processTokenPayment(address to, address token, uint256 amount, string label, string memo) returns (bytes32)",
  "function getPaymentDetails(bytes32 paymentId) view returns (tuple(address from, address to, uint256 amount, address token, string label, string memo, uint256 timestamp, bool processed))",
  "function getTotalPayments() view returns (uint256)",
  "function feePercentage() view returns (uint256)",
  "event PaymentProcessed(bytes32 indexed paymentId, address indexed from, address indexed to, uint256 amount, address token, string label, uint256 timestamp)"
];

const SUBSCRIPTION_ABI = [
  "function createSubscription(address recipient, uint256 amountPerPeriod, uint256 intervalDays, address token) payable returns (bytes32)",
  "function getSubscription(bytes32 subId) view returns (tuple(bytes32 id, address subscriber, address recipient, uint256 amountPerPeriod, uint256 intervalSeconds, address token, uint256 startTimestamp, uint256 lastPaymentTimestamp, uint256 nextPaymentTimestamp, uint256 totalPaymentsMade, bool active))",
  "function getUserSubscriptions(address user) view returns (bytes32[])",
  "function getRecipientSubscriptions(address recipient) view returns (bytes32[])",
  "function isPaymentDue(bytes32 subId) view returns (bool)",
  "function processSubscriptionPayment(bytes32 subId)",
  "function cancelSubscription(bytes32 subId)",
  "event SubscriptionCreated(bytes32 indexed subscriptionId, address indexed subscriber, address indexed recipient, uint256 amountPerPeriod, uint256 intervalSeconds, address token, uint256 timestamp)"
];

// Blockchain Configuration
const BLOCKCHAIN_CONFIG = {
  chainId: parseInt(process.env.CHAIN_ID),
  rpcUrl: process.env.RPC_URL,
  explorerUrl: process.env.EXPLORER_URL,
};

// Supported Tokens
const TOKENS = {
  BNB: {
    address: '0x0000000000000000000000000000000000000000',
    symbol: 'BNB',
    decimals: 18,
  },
  USDT: {
    address: '0x337610d27c682E347C9cD60BD4b3b107C9d34dDd',
    symbol: 'USDT',
    decimals: 18,
  },
  USDC: {
    address: '0x64544969ed7EBf5f083679233325356EbE738930',
    symbol: 'USDC',
    decimals: 18,
  },
};

module.exports = {
  CONTRACTS,
  PROCESSOR_ABI,
  SUBSCRIPTION_ABI,
  BLOCKCHAIN_CONFIG,
  TOKENS,
};
