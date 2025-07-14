const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Coin packages
const COIN_PACKAGES = [
  { id: 'small', coins: 100, price: 4.99, name: 'Small Pack' },
  { id: 'medium', coins: 250, coins_bonus: 25, price: 9.99, name: 'Medium Pack' },
  { id: 'large', coins: 500, coins_bonus: 75, price: 19.99, name: 'Large Pack' },
  { id: 'mega', coins: 1000, coins_bonus: 200, price: 39.99, name: 'Mega Pack' },
  { id: 'ultimate', coins: 2500, coins_bonus: 750, price: 99.99, name: 'Ultimate Pack' }
];

// @route   GET /api/coins/packages
// @desc    Get available coin packages
// @access  Public
router.get('/packages', (req, res) => {
  res.json({
    success: true,
    data: COIN_PACKAGES
  });
});

// @route   POST /api/coins/purchase
// @desc    Purchase coins
// @access  Private
router.post('/purchase', auth, [
  body('packageId')
    .isIn(COIN_PACKAGES.map(p => p.id))
    .withMessage('Invalid package ID')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { packageId } = req.body;
    const selectedPackage = COIN_PACKAGES.find(p => p.id === packageId);

    if (!selectedPackage) {
      return res.status(400).json({
        success: false,
        error: 'Package not found'
      });
    }

    // Calculate total coins (base + bonus)
    const totalCoins = selectedPackage.coins + (selectedPackage.coins_bonus || 0);

    // In a real implementation, you would integrate with Stripe here
    // For now, we'll simulate a successful purchase
    
    // Update user coin balance
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { coinBalance: totalCoins }
    });

    // Get updated user
    const updatedUser = await User.findById(req.user._id);

    res.json({
      success: true,
      data: {
        package: selectedPackage,
        coinsAdded: totalCoins,
        newBalance: updatedUser.coinBalance,
        transaction: {
          id: `txn_${Date.now()}`, // In real app, this would be from payment processor
          amount: selectedPackage.price,
          status: 'completed',
          timestamp: new Date()
        }
      },
      message: `Successfully purchased ${totalCoins} coins`
    });
  } catch (error) {
    console.error('Purchase coins error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during purchase'
    });
  }
});

// @route   GET /api/coins/balance
// @desc    Get user coin balance (alias for /api/users/coins/balance)
// @access  Private
router.get('/balance', auth, (req, res) => {
  res.json({
    success: true,
    data: {
      balance: req.user.coinBalance
    }
  });
});

// @route   POST /api/coins/transfer
// @desc    Transfer coins to another user
// @access  Private
router.post('/transfer', auth, [
  body('recipientUsername')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Invalid recipient username'),
  body('amount')
    .isInt({ min: 1 })
    .withMessage('Amount must be a positive integer')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { recipientUsername, amount } = req.body;

    // Check if user has enough coins
    if (req.user.coinBalance < amount) {
      return res.status(400).json({
        success: false,
        error: 'Insufficient coin balance'
      });
    }

    // Find recipient
    const recipient = await User.findOne({ username: recipientUsername });
    if (!recipient) {
      return res.status(404).json({
        success: false,
        error: 'Recipient not found'
      });
    }

    // Check if trying to transfer to self
    if (recipient._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        error: 'Cannot transfer coins to yourself'
      });
    }

    // Perform transfer
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { coinBalance: -amount }
    });

    await User.findByIdAndUpdate(recipient._id, {
      $inc: { coinBalance: amount }
    });

    // Get updated balances
    const updatedSender = await User.findById(req.user._id);

    res.json({
      success: true,
      data: {
        amount,
        recipient: recipient.username,
        newBalance: updatedSender.coinBalance,
        transaction: {
          id: `transfer_${Date.now()}`,
          type: 'transfer',
          amount,
          timestamp: new Date()
        }
      },
      message: `Successfully transferred ${amount} coins to ${recipient.username}`
    });
  } catch (error) {
    console.error('Transfer coins error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during transfer'
    });
  }
});

module.exports = router;
