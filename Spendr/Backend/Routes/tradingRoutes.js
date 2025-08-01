const express = require('express');
const router = express.Router();
const User = require('../Models/User');
const yahooFinance = require('yahoo-finance2').default;
const { protect } = require('../Middleware/auth');

// NSE stock symbols mapping (same as in stockRoutes)
const NSE_STOCKS = {
  'RELIANCE': { name: 'Reliance Industries Ltd.', symbol: 'RELIANCE.NS' },
  'TCS': { name: 'Tata Consultancy Services Ltd.', symbol: 'TCS.NS' },
  'HDFCBANK': { name: 'HDFC Bank Ltd.', symbol: 'HDFCBANK.NS' },
  'INFY': { name: 'Infosys Ltd.', symbol: 'INFY.NS' },
  'HINDUNILVR': { name: 'Hindustan Unilever Ltd.', symbol: 'HINDUNILVR.NS' },
  'ICICIBANK': { name: 'ICICI Bank Ltd.', symbol: 'ICICIBANK.NS' },
  'SBIN': { name: 'State Bank of India', symbol: 'SBIN.NS' },
  'BHARTIARTL': { name: 'Bharti Airtel Ltd.', symbol: 'BHARTIARTL.NS' },
  'ITC': { name: 'ITC Ltd.', symbol: 'ITC.NS' },
  'KOTAKBANK': { name: 'Kotak Mahindra Bank Ltd.', symbol: 'KOTAKBANK.NS' },
  'LT': { name: 'Larsen & Toubro Ltd.', symbol: 'LT.NS' },
  'HCLTECH': { name: 'HCL Technologies Ltd.', symbol: 'HCLTECH.NS' },
  'AXISBANK': { name: 'Axis Bank Ltd.', symbol: 'AXISBANK.NS' },
  'ASIANPAINT': { name: 'Asian Paints Ltd.', symbol: 'ASIANPAINT.NS' },
  'MARUTI': { name: 'Maruti Suzuki India Ltd.', symbol: 'MARUTI.NS' },
  'BAJFINANCE': { name: 'Bajaj Finance Ltd.', symbol: 'BAJFINANCE.NS' },
  'WIPRO': { name: 'Wipro Ltd.', symbol: 'WIPRO.NS' },
  'NESTLEIND': { name: 'Nestle India Ltd.', symbol: 'NESTLEIND.NS' },
  'ULTRACEMCO': { name: 'UltraTech Cement Ltd.', symbol: 'ULTRACEMCO.NS' },
  'TITAN': { name: 'Titan Company Ltd.', symbol: 'TITAN.NS' }
};

// Helper function to get current stock price
const getCurrentPrice = async (symbol) => {
  const nseSymbol = NSE_STOCKS[symbol]?.symbol || `${symbol}.NS`;
  const quote = await yahooFinance.quote(nseSymbol);
  return quote.regularMarketPrice;
};

// Buy stock
router.post('/buy', protect, async (req, res) => {
  try {
    const { symbol, quantity } = req.body;
    const userId = req.user.id;
    
    // Validation
    if (!symbol || !quantity || quantity <= 0) {
      return res.status(400).json({ 
        error: 'Invalid request',
        message: 'Symbol and positive quantity are required' 
      });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        error: 'User not found' 
      });
    }
    
    // Get current stock price
    const upperSymbol = symbol.toUpperCase();
    const currentPrice = await getCurrentPrice(upperSymbol);
    const totalCost = currentPrice * quantity;
    
    // Check if user has sufficient balance
    if (user.balance < totalCost) {
      return res.status(400).json({ 
        error: 'Insufficient funds',
        message: `Required: ₹${totalCost.toLocaleString()}, Available: ₹${user.balance.toLocaleString()}` 
      });
    }
    
    // Update user balance
    user.balance -= totalCost;
    
    // Update portfolio
    const existingStock = user.portfolio.find(s => s.symbol === upperSymbol);
    
    if (existingStock) {
      // Update existing position
      const newQuantity = existingStock.quantity + quantity;
      const newAvgPrice = ((existingStock.avgPrice * existingStock.quantity) + totalCost) / newQuantity;
      
      existingStock.quantity = newQuantity;
      existingStock.avgPrice = newAvgPrice;
      existingStock.totalValue = newQuantity * currentPrice;
      existingStock.gainLoss = (currentPrice - newAvgPrice) * newQuantity;
      existingStock.gainLossPercent = ((currentPrice - newAvgPrice) / newAvgPrice) * 100;
    } else {
      // Add new position
      user.portfolio.push({
        symbol: upperSymbol,
        name: NSE_STOCKS[upperSymbol]?.name || `${upperSymbol} Ltd.`,
        quantity: quantity,
        avgPrice: currentPrice,
        totalValue: totalCost,
        gainLoss: 0,
        gainLossPercent: 0
      });
    }
    
    // Add trade record
    user.trades.push({
      type: 'BUY',
      symbol: upperSymbol,
      name: NSE_STOCKS[upperSymbol]?.name || `${upperSymbol} Ltd.`,
      quantity: quantity,
      price: currentPrice,
      totalAmount: totalCost,
      date: new Date()
    });
    
    await user.save();
    
    res.json({
      message: 'Stock purchased successfully',
      trade: {
        type: 'BUY',
        symbol: upperSymbol,
        quantity: quantity,
        price: currentPrice,
        totalAmount: totalCost
      },
      newBalance: user.balance,
      portfolio: user.portfolio
    });
    
  } catch (error) {
    console.error('Error buying stock:', error);
    res.status(500).json({ 
      error: 'Failed to buy stock',
      message: error.message 
    });
  }
});

// Sell stock
router.post('/sell', protect, async (req, res) => {
  try {
    const { symbol, quantity } = req.body;
    const userId = req.user.id;
    
    // Validation
    if (!symbol || !quantity || quantity <= 0) {
      return res.status(400).json({ 
        error: 'Invalid request',
        message: 'Symbol and positive quantity are required' 
      });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        error: 'User not found' 
      });
    }
    
    const upperSymbol = symbol.toUpperCase();
    const existingStock = user.portfolio.find(s => s.symbol === upperSymbol);
    
    if (!existingStock) {
      return res.status(400).json({ 
        error: 'Stock not found in portfolio' 
      });
    }
    
    if (existingStock.quantity < quantity) {
      return res.status(400).json({ 
        error: 'Insufficient shares',
        message: `Available: ${existingStock.quantity}, Requested: ${quantity}` 
      });
    }
    
    // Get current stock price
    const currentPrice = await getCurrentPrice(upperSymbol);
    const totalSaleAmount = currentPrice * quantity;
    
    // Update user balance
    user.balance += totalSaleAmount;
    
    // Update portfolio
    if (existingStock.quantity === quantity) {
      // Remove stock completely
      user.portfolio = user.portfolio.filter(s => s.symbol !== upperSymbol);
    } else {
      // Reduce quantity
      existingStock.quantity -= quantity;
      existingStock.totalValue = existingStock.quantity * currentPrice;
      existingStock.gainLoss = (currentPrice - existingStock.avgPrice) * existingStock.quantity;
      existingStock.gainLossPercent = ((currentPrice - existingStock.avgPrice) / existingStock.avgPrice) * 100;
    }
    
    // Add trade record
    user.trades.push({
      type: 'SELL',
      symbol: upperSymbol,
      name: NSE_STOCKS[upperSymbol]?.name || `${upperSymbol} Ltd.`,
      quantity: quantity,
      price: currentPrice,
      totalAmount: totalSaleAmount,
      date: new Date()
    });
    
    await user.save();
    
    res.json({
      message: 'Stock sold successfully',
      trade: {
        type: 'SELL',
        symbol: upperSymbol,
        quantity: quantity,
        price: currentPrice,
        totalAmount: totalSaleAmount
      },
      newBalance: user.balance,
      portfolio: user.portfolio
    });
    
  } catch (error) {
    console.error('Error selling stock:', error);
    res.status(500).json({ 
      error: 'Failed to sell stock',
      message: error.message 
    });
  }
});

// Get user portfolio
router.get('/portfolio', protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ 
        error: 'User not found' 
      });
    }
    
    // Update portfolio values with current prices
    if (user.portfolio.length > 0) {
      const symbols = user.portfolio.map(stock => stock.symbol);
      const pricePromises = symbols.map(async (symbol) => {
        try {
          const price = await getCurrentPrice(symbol);
          return { symbol, price };
        } catch (error) {
          console.error(`Error fetching price for ${symbol}:`, error);
          return { symbol, price: null };
        }
      });
      
      const prices = await Promise.all(pricePromises);
      const priceMap = {};
      prices.forEach(({ symbol, price }) => {
        if (price !== null) priceMap[symbol] = price;
      });
      
      user.updatePortfolioValues(priceMap);
      await user.save();
    }
    
    const totalPortfolioValue = user.balance + user.portfolio.reduce((sum, stock) => sum + stock.totalValue, 0);
    
    res.json({
      balance: user.balance,
      portfolio: user.portfolio,
      totalPortfolioValue: totalPortfolioValue,
      totalGainLoss: totalPortfolioValue - 1000000, // Starting amount was ₹10,00,000
      totalGainLossPercent: ((totalPortfolioValue - 1000000) / 1000000) * 100
    });
    
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    res.status(500).json({ 
      error: 'Failed to fetch portfolio',
      message: error.message 
    });
  }
});

// Get user trade history
router.get('/trades', protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ 
        error: 'User not found' 
      });
    }
    
    // Sort trades by date (newest first)
    const sortedTrades = user.trades.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    res.json({
      trades: sortedTrades,
      count: sortedTrades.length
    });
    
  } catch (error) {
    console.error('Error fetching trades:', error);
    res.status(500).json({ 
      error: 'Failed to fetch trades',
      message: error.message 
    });
  }
});

// Reset portfolio (for demo purposes)
router.post('/reset', protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ 
        error: 'User not found' 
      });
    }
    
    // Reset to initial state
    user.balance = 1000000; // ₹10,00,000
    user.portfolio = [];
    user.trades = [];
    
    await user.save();
    
    res.json({
      message: 'Portfolio reset successfully',
      balance: user.balance,
      portfolio: user.portfolio
    });
    
  } catch (error) {
    console.error('Error resetting portfolio:', error);
    res.status(500).json({ 
      error: 'Failed to reset portfolio',
      message: error.message 
    });
  }
});

module.exports = router;
