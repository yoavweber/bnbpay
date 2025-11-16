// routes/payment.js
const express = require('express');
const router = express.Router();
const { ethers } = require('ethers');
const { generateQRCode } = require('../utils/qrcode');
const { verifyTransaction, getPaymentDetails } = require('../utils/blockchain');
const { CONTRACTS, BLOCKCHAIN_CONFIG, TOKENS } = require('../config/contracts');

// In-memory storage (replace with database in production)
const payments = new Map();

/**
 * POST /api/payment/create
 * Create payment link and QR code
 */
router.post('/create', async (req, res) => {
  try {
    const { recipient, amount, token = 'BNB', label = 'Payment', memo = '' } = req.body;
    
    // Validation
    if (!recipient || !amount) {
      return res.status(400).json({ 
        success: false, 
        error: 'Recipient and amount are required' 
      });
    }
    
    if (!ethers.utils.isAddress(recipient)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid recipient address' 
      });
    }
    
    // Generate unique payment ID
    const paymentId = `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Get token info
    const tokenInfo = TOKENS[token] || TOKENS.BNB;
    
    // Payment data
    const paymentData = {
      id: paymentId,
      recipient,
      amount,
      token: token,
      tokenAddress: tokenInfo.address,
      label,
      memo,
      chainId: BLOCKCHAIN_CONFIG.chainId,
      contracts: {
        processor: CONTRACTS.processor,
      },
      status: 'pending',
      createdAt: new Date().toISOString(),
      txHash: null,
    };
    
    // Store payment
    payments.set(paymentId, paymentData);
    
    // Generate payment link
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const paymentLink = `${frontendUrl}/pay/${paymentId}`;
    
    // Generate QR code
    const qrCode = await generateQRCode(paymentLink);
    
    res.json({
      success: true,
      paymentId,
      paymentLink,
      qrCode,
      paymentData,
    });
    
  } catch (error) {
    console.error('Payment creation error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

/**
 * GET /api/payment/:id
 * Get payment details
 */
router.get('/:id', (req, res) => {
  const payment = payments.get(req.params.id);
  
  if (!payment) {
    return res.status(404).json({ 
      success: false, 
      error: 'Payment not found' 
    });
  }
  
  res.json({ success: true, payment });
});

/**
 * POST /api/payment/:id/confirm
 * Confirm payment after blockchain transaction
 */
router.post('/:id/confirm', async (req, res) => {
  try {
    const { txHash } = req.body;
    const payment = payments.get(req.params.id);
    
    if (!payment) {
      return res.status(404).json({ 
        success: false, 
        error: 'Payment not found' 
      });
    }
    
    // Verify transaction on blockchain
    const verification = await verifyTransaction(txHash);
    
    if (!verification.valid) {
      return res.status(400).json({ 
        success: false, 
        error: verification.error 
      });
    }
    
    // Update payment
    payment.status = verification.status === 'success' ? 'completed' : 'failed';
    payment.txHash = txHash;
    payment.completedAt = new Date().toISOString();
    payment.blockNumber = verification.blockNumber;
    
    payments.set(req.params.id, payment);
    
    res.json({ 
      success: true, 
      payment,
      verification 
    });
    
  } catch (error) {
    console.error('Payment confirmation error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

/**
 * GET /api/merchant/:address/payments
 * Get all payments for a merchant
 */
router.get('/merchant/:address', (req, res) => {
  try {
    const address = req.params.address.toLowerCase();
    
    const merchantPayments = Array.from(payments.values())
      .filter(p => p.recipient.toLowerCase() === address)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json({ 
      success: true, 
      payments: merchantPayments,
      total: merchantPayments.length 
    });
    
  } catch (error) {
    console.error('Merchant payments fetch error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

module.exports = router;
