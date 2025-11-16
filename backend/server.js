// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const paymentRoutes = require('./routes/payment');
const subscriptionRoutes = require('./routes/subscription');
const { BLOCKCHAIN_CONFIG, CONTRACTS } = require('./config/contracts');
const { scheduleDailyTask } = require('./utils/cron');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    blockchain: BLOCKCHAIN_CONFIG,
    contracts: CONTRACTS,
  });
});

// Routes
app.use('/api/payment', paymentRoutes);
app.use('/api/subscription', subscriptionRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    error: 'Endpoint not found' 
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    success: false, 
    error: 'Internal server error' 
  });
});

// Start server
const PORT = process.env.PORT || 5000;

const runDailySubscriptionJob = async () => {
  console.log(`[cron] Running daily subscription reconciliation at ${new Date().toISOString()}`);
  // TODO: add logic to evaluate subscriptions, trigger renewals, etc.
};

const cancelDailyJob = scheduleDailyTask(runDailySubscriptionJob, {
  atHour: 0,
  atMinute: 0,
  atSecond: 0,
});

process.on('SIGINT', () => {
  cancelDailyJob();
  process.exit(0);
});

process.on('SIGTERM', () => {
  cancelDailyJob();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log('\n BNBPay Backend Server Started!');
  console.log(` Server: http://localhost:${PORT}`);
  console.log(`  Chain ID: ${BLOCKCHAIN_CONFIG.chainId}`);
  console.log(` Payment Processor: ${CONTRACTS.processor}`);
  console.log(` Subscription Manager: ${CONTRACTS.subscriptionManager}`);
  console.log('\n Ready to accept requests!\n');
});
