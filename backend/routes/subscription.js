// routes/subscription.js
const express = require('express');
const router = express.Router();
const { generateQRCode } = require('../utils/qrcode');
const { getSubscriptionDetails, createSubscription } = require('../utils/blockchain');
const { CONTRACTS, BLOCKCHAIN_CONFIG, TOKENS } = require('../config/contracts');

// In-memory storage
const subscriptions = new Map();

/**
 * POST /api/subscription/create
 * Create subscription link
 */
router.post('/create', async (req, res) => {
  try {
    const { 
      recipient, 
      amountPerPeriod, 
      intervalDays = 30, 
      token = 'BNB',
      label = 'Subscription' 
    } = req.body;
    
    // Validation
    if (!recipient || !amountPerPeriod) {
      return res.status(400).json({ 
        success: false, 
        error: 'Recipient and amount are required' 
      });
    }
    
    // Generate subscription ID
    const subId = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Subscription data
    const subData = {
      id: subId,
      recipient,
      amountPerPeriod,
      intervalDays,
      token,
      label,
      chainId: BLOCKCHAIN_CONFIG.chainId,
      contracts: {
        subscriptionManager: CONTRACTS.subscriptionManager,
      },
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    // Create on-chain
    const onChainResult = await createSubscription(
      recipient,
      amountPerPeriod,
      intervalDays
    );

    if (!onChainResult.success) {
      return res.status(500).json({
        success: false,
        error: 'Failed to create subscription on-chain',
        details: onChainResult.error,
      });
    }

    // Use the subscription ID from the blockchain event
    const blockchainSubId = onChainResult.subscriptionId;
    
    subData.status = 'active';
    subData.transactionHash = onChainResult.transactionHash;
    subData.blockchainId = blockchainSubId; // Store the actual on-chain ID
    
    subscriptions.set(subId, subData);
    
// Generate link
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
const subscriptionLink = `${frontendUrl}/send?to=${recipient}&amount=${amountPerPeriod}&token=${token}&label=${encodeURIComponent(label)}`;
    
    // Generate QR
    const qrCode = await generateQRCode(subscriptionLink);
    
    res.json({
      success: true,
      subscriptionId: subId,
      subscriptionLink,
      qrCode,
      subscriptionData: subData,
    });
    
  } catch (error) {
    console.error('Subscription creation error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

/**
 * GET /api/subscription/:id
 * Get subscription details
 */
router.get('/:id', async (req, res) => {
  try {
    const sub = subscriptions.get(req.params.id);
    
    if (!sub) {
      return res.status(404).json({ 
        success: false, 
        error: 'Subscription not found' 
      });
    }
    
    res.json({ success: true, subscription: sub });
    
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

module.exports = router;
