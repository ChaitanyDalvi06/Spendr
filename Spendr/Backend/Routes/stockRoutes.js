const express = require('express');
const router = express.Router();
const alpha = require('alphavantage')({ key: 'AN05VJE1YH41VRCX' });
const { subDays, format } = require('date-fns');

// NSE stock symbols mapping for Alpha Vantage API
const NSE_STOCKS = {
  'RELIANCE': { name: 'Reliance Industries Ltd.', symbol: 'RELIANCE.BSE', exchange: 'BSE' },
  'TCS': { name: 'Tata Consultancy Services Ltd.', symbol: 'TCS.BSE', exchange: 'BSE' },
  'HDFCBANK': { name: 'HDFC Bank Ltd.', symbol: 'HDFCBANK.BSE', exchange: 'BSE' },
  'INFY': { name: 'Infosys Ltd.', symbol: 'INFY.BSE', exchange: 'BSE' },
  'HINDUNILVR': { name: 'Hindustan Unilever Ltd.', symbol: 'HINDUNILVR.BSE', exchange: 'BSE' },
  'ICICIBANK': { name: 'ICICI Bank Ltd.', symbol: 'ICICIBANK.BSE', exchange: 'BSE' },
  'SBIN': { name: 'State Bank of India', symbol: 'SBIN.BSE', exchange: 'BSE' },
  'BHARTIARTL': { name: 'Bharti Airtel Ltd.', symbol: 'BHARTIARTL.BSE', exchange: 'BSE' },
  'ITC': { name: 'ITC Ltd.', symbol: 'ITC.BSE', exchange: 'BSE' },
  'KOTAKBANK': { name: 'Kotak Mahindra Bank Ltd.', symbol: 'KOTAKBANK.BSE', exchange: 'BSE' },
  'LT': { name: 'Larsen & Toubro Ltd.', symbol: 'LT.BSE', exchange: 'BSE' },
  'HCLTECH': { name: 'HCL Technologies Ltd.', symbol: 'HCLTECH.BSE', exchange: 'BSE' },
  'AXISBANK': { name: 'Axis Bank Ltd.', symbol: 'AXISBANK.BSE', exchange: 'BSE' },
  'ASIANPAINT': { name: 'Asian Paints Ltd.', symbol: 'ASIANPAINT.BSE', exchange: 'BSE' },
  'MARUTI': { name: 'Maruti Suzuki India Ltd.', symbol: 'MARUTI.BSE', exchange: 'BSE' },
  'BAJFINANCE': { name: 'Bajaj Finance Ltd.', symbol: 'BAJFINANCE.BSE', exchange: 'BSE' },
  'WIPRO': { name: 'Wipro Ltd.', symbol: 'WIPRO.BSE', exchange: 'BSE' },
  'NESTLEIND': { name: 'Nestle India Ltd.', symbol: 'NESTLEIND.BSE', exchange: 'BSE' },
  'ULTRACEMCO': { name: 'UltraTech Cement Ltd.', symbol: 'ULTRACEMCO.BSE', exchange: 'BSE' },
  'TITAN': { name: 'Titan Company Ltd.', symbol: 'TITAN.BSE', exchange: 'BSE' },
  
  // Additional popular Indian stocks
  'ADANIPORTS': { name: 'Adani Ports and Special Economic Zone Ltd.', symbol: 'ADANIPORTS.BSE', exchange: 'BSE' },
  'APOLLOHOSP': { name: 'Apollo Hospitals Enterprise Ltd.', symbol: 'APOLLOHOSP.BSE', exchange: 'BSE' },
  'BAJAJFINSV': { name: 'Bajaj Finserv Ltd.', symbol: 'BAJAJFINSV.BSE', exchange: 'BSE' },
  'BPCL': { name: 'Bharat Petroleum Corporation Ltd.', symbol: 'BPCL.BSE', exchange: 'BSE' },
  'BRITANNIA': { name: 'Britannia Industries Ltd.', symbol: 'BRITANNIA.BSE', exchange: 'BSE' },
  'CIPLA': { name: 'Cipla Ltd.', symbol: 'CIPLA.BSE', exchange: 'BSE' },
  'COALINDIA': { name: 'Coal India Ltd.', symbol: 'COALINDIA.BSE', exchange: 'BSE' },
  'DIVISLAB': { name: 'Divi\'s Laboratories Ltd.', symbol: 'DIVISLAB.BSE', exchange: 'BSE' },
  'DRREDDY': { name: 'Dr. Reddy\'s Laboratories Ltd.', symbol: 'DRREDDY.BSE', exchange: 'BSE' },
  'EICHERMOT': { name: 'Eicher Motors Ltd.', symbol: 'EICHERMOT.BSE', exchange: 'BSE' },
  'GRASIM': { name: 'Grasim Industries Ltd.', symbol: 'GRASIM.BSE', exchange: 'BSE' },
  'HDFCLIFE': { name: 'HDFC Life Insurance Company Ltd.', symbol: 'HDFCLIFE.BSE', exchange: 'BSE' },
  'HEROMOTOCO': { name: 'Hero MotoCorp Ltd.', symbol: 'HEROMOTOCO.BSE', exchange: 'BSE' },
  'HINDALCO': { name: 'Hindalco Industries Ltd.', symbol: 'HINDALCO.BSE', exchange: 'BSE' },
  'INDUSINDBK': { name: 'IndusInd Bank Ltd.', symbol: 'INDUSINDBK.BSE', exchange: 'BSE' },
  'IOC': { name: 'Indian Oil Corporation Ltd.', symbol: 'IOC.BSE', exchange: 'BSE' },
  'JSWSTEEL': { name: 'JSW Steel Ltd.', symbol: 'JSWSTEEL.BSE', exchange: 'BSE' },
  'M&M': { name: 'Mahindra & Mahindra Ltd.', symbol: 'M&M.BSE', exchange: 'BSE' },
  'NTPC': { name: 'NTPC Ltd.', symbol: 'NTPC.BSE', exchange: 'BSE' },
  'ONGC': { name: 'Oil and Natural Gas Corporation Ltd.', symbol: 'ONGC.BSE', exchange: 'BSE' },
  'POWERGRID': { name: 'Power Grid Corporation of India Ltd.', symbol: 'POWERGRID.BSE', exchange: 'BSE' },
  'SBILIFE': { name: 'SBI Life Insurance Company Ltd.', symbol: 'SBILIFE.BSE', exchange: 'BSE' },
  'SUNPHARMA': { name: 'Sun Pharmaceutical Industries Ltd.', symbol: 'SUNPHARMA.BSE', exchange: 'BSE' },
  'TATACONSUM': { name: 'Tata Consumer Products Ltd.', symbol: 'TATACONSUM.BSE', exchange: 'BSE' },
  'TATAMOTORS': { name: 'Tata Motors Ltd.', symbol: 'TATAMOTORS.BSE', exchange: 'BSE' },
  'TATASTEEL': { name: 'Tata Steel Ltd.', symbol: 'TATASTEEL.BSE', exchange: 'BSE' },
  'TECHM': { name: 'Tech Mahindra Ltd.', symbol: 'TECHM.BSE', exchange: 'BSE' },
  'UPL': { name: 'UPL Ltd.', symbol: 'UPL.BSE', exchange: 'BSE' }
};

// Get current stock price using Alpha Vantage
router.get('/price/:symbol', async (req, res) => {
  try {
    const symbol = req.params.symbol.toUpperCase();
    const stockInfo = NSE_STOCKS[symbol];
    
    if (!stockInfo) {
      return res.status(404).json({ 
        error: 'Stock not found',
        message: `Stock ${symbol} not found in our database. Please try a different symbol.` 
      });
    }

    console.log(`Fetching real-time price for ${symbol} (${stockInfo.symbol}) from Alpha Vantage`);
    
    try {
      // Use Alpha Vantage Global Quote for real-time data
      const data = await alpha.data.quote(stockInfo.symbol);
      
      if (data && data['Global Quote'] && data['Global Quote']['05. price']) {
        const quote = data['Global Quote'];
        
        const currentPrice = parseFloat(quote['05. price']);
        const previousClose = parseFloat(quote['08. previous close']);
        const change = parseFloat(quote['09. change']);
        const changePercent = parseFloat(quote['10. change percent'].replace('%', ''));
        const volume = parseInt(quote['06. volume']) || 0;
        
        res.json({
          symbol: symbol,
          name: stockInfo.name,
          price: currentPrice,
          currency: 'INR',
          exchange: stockInfo.exchange,
          previousClose: previousClose,
          change: change,
          changePercent: changePercent,
          volume: volume,
          lastUpdated: new Date().toISOString(),
          dataSource: 'Alpha Vantage - Real-time BSE Data'
        });
        
      } else {
        console.log('No data found in Alpha Vantage response, trying fallback...');
        
        // Fallback: Try to get daily data if real-time is not available
        const dailyData = await alpha.data.daily(stockInfo.symbol);
        
        if (dailyData && dailyData['Time Series (Daily)']) {
          const timeSeries = dailyData['Time Series (Daily)'];
          const dates = Object.keys(timeSeries).sort().reverse();
          const latestDate = dates[0];
          const latestData = timeSeries[latestDate];
          
          if (latestData) {
            const currentPrice = parseFloat(latestData['4. close']);
            const previousPrice = dates[1] ? parseFloat(timeSeries[dates[1]]['4. close']) : currentPrice;
            const change = currentPrice - previousPrice;
            const changePercent = ((change / previousPrice) * 100);
            
            res.json({
              symbol: symbol,
              name: stockInfo.name,
              price: currentPrice,
              currency: 'INR',
              exchange: stockInfo.exchange,
              previousClose: previousPrice,
              change: change,
              changePercent: changePercent,
              volume: parseInt(latestData['5. volume']) || 0,
              lastUpdated: new Date().toISOString(),
              dataSource: 'Alpha Vantage - Daily BSE Data',
              note: 'Using latest daily close price'
            });
            return;
          }
        }
        
        // If all Alpha Vantage attempts fail, return error
        return res.status(404).json({ 
          error: 'No data available',
          message: `Unable to fetch current data for ${symbol} from Alpha Vantage. The market may be closed or there may be a temporary issue.` 
        });
      }
      
    } catch (alphaError) {
      console.error('Alpha Vantage API error:', alphaError);
      return res.status(503).json({ 
        error: 'API service unavailable',
        message: 'Alpha Vantage API is currently unavailable. Please try again later.',
        details: alphaError.message
      });
    }
    
  } catch (error) {
    console.error('Error fetching stock price:', error);
    res.status(500).json({ 
      error: 'Failed to fetch stock price',
      message: error.message 
    });
  }
});

// Get historical data for real-time candle charts using Alpha Vantage
router.get('/candles/:symbol', async (req, res) => {
  try {
    const symbol = req.params.symbol.toUpperCase();
    const stockInfo = NSE_STOCKS[symbol];
    
    if (!stockInfo) {
      return res.status(404).json({ 
        error: 'Stock not found',
        message: `Stock ${symbol} not found in our database.` 
      });
    }

    console.log(`Fetching intraday data for ${symbol} (${stockInfo.symbol}) from Alpha Vantage`);
    
    try {
      // Try to get intraday data (5min intervals)
      const intradayData = await alpha.data.intraday(stockInfo.symbol, '5min', 'compact');
      
      if (intradayData && intradayData['Time Series (5min)']) {
        const timeSeries = intradayData['Time Series (5min)'];
        const dataPoints = Object.keys(timeSeries)
          .sort()
          .reverse()
          .slice(0, 50) // Last 50 data points (about 4 hours)
          .map(timestamp => {
            const data = timeSeries[timestamp];
            return {
              date: new Date(timestamp),
              open: parseFloat(data['1. open']),
              high: parseFloat(data['2. high']),
              low: parseFloat(data['3. low']),
              close: parseFloat(data['4. close']),
              volume: parseInt(data['5. volume']) || 0
            };
          })
          .reverse(); // Reverse to get chronological order
        
        if (dataPoints.length > 0) {
          res.json({
            symbol: symbol,
            name: stockInfo.name,
            data: dataPoints,
            lastUpdated: new Date().toISOString(),
            dataSource: 'Alpha Vantage - Real-time 5-minute BSE Data',
            interval: '5min',
            note: `Live intraday data for ${symbol}`
          });
          return;
        }
      }
      
      console.log('No intraday data available, trying daily data...');
      
      // Fallback to daily data if intraday is not available
      const dailyData = await alpha.data.daily(stockInfo.symbol, 'compact');
      
      if (dailyData && dailyData['Time Series (Daily)']) {
        const timeSeries = dailyData['Time Series (Daily)'];
        const dataPoints = Object.keys(timeSeries)
          .sort()
          .reverse()
          .slice(0, 30) // Last 30 days
          .map(date => {
            const data = timeSeries[date];
            return {
              date: new Date(date + 'T09:15:00+05:30'), // Add market opening time
              open: parseFloat(data['1. open']),
              high: parseFloat(data['2. high']),
              low: parseFloat(data['3. low']),
              close: parseFloat(data['4. close']),
              volume: parseInt(data['5. volume']) || 0
            };
          })
          .reverse();
        
        if (dataPoints.length > 0) {
          res.json({
            symbol: symbol,
            name: stockInfo.name,
            data: dataPoints,
            lastUpdated: new Date().toISOString(),
            dataSource: 'Alpha Vantage - Daily BSE Data',
            interval: 'daily',
            note: `Daily historical data for ${symbol} (last 30 days)`
          });
          return;
        }
      }
      
      // If no real data is available, create realistic simulation based on current price
      console.log('No historical data available, creating realistic simulation...');
      
      // Get current price for simulation
      const currentData = await alpha.data.quote(stockInfo.symbol);
      let currentPrice = 100; // Default fallback price
      
      if (currentData && currentData['Global Quote'] && currentData['Global Quote']['05. price']) {
        currentPrice = parseFloat(currentData['Global Quote']['05. price']);
      }
      
      // Generate realistic intraday simulation
      const chartData = [];
      const now = new Date();
      
      for (let i = 47; i >= 0; i--) {
        const timestamp = new Date(now.getTime() - (i * 5 * 60 * 1000)); // 5-minute intervals
        
        // Create realistic price movement
        const baseVariation = (Math.random() - 0.5) * 0.02; // ±2% variation
        const trendFactor = Math.sin((47 - i) / 10) * 0.01; // Small trend
        const priceVariation = baseVariation + trendFactor;
        
        const adjustedPrice = currentPrice * (1 + priceVariation);
        
        // Generate realistic OHLC
        const open = adjustedPrice * (1 + (Math.random() - 0.5) * 0.005);
        const close = adjustedPrice * (1 + (Math.random() - 0.5) * 0.005);
        const high = Math.max(open, close) * (1 + Math.random() * 0.008);
        const low = Math.min(open, close) * (1 - Math.random() * 0.008);
        
        chartData.push({
          date: timestamp,
          open: parseFloat(open.toFixed(2)),
          high: parseFloat(high.toFixed(2)),
          low: parseFloat(low.toFixed(2)),
          close: parseFloat(close.toFixed(2)),
          volume: Math.floor(Math.random() * 100000) + 10000
        });
      }
      
      res.json({
        symbol: symbol,
        name: stockInfo.name,
        data: chartData,
        lastUpdated: new Date().toISOString(),
        dataSource: 'Simulated based on Alpha Vantage current price',
        interval: '5min',
        note: `Realistic price simulation for ${symbol} - Market may be closed`,
        isSimulated: true,
        basedOnPrice: currentPrice
      });
      
    } catch (alphaError) {
      console.error('Alpha Vantage API error:', alphaError);
      return res.status(503).json({ 
        error: 'API service unavailable',
        message: 'Alpha Vantage API is currently unavailable. Please try again later.',
        details: alphaError.message
      });
    }
    
  } catch (error) {
    console.error('Error fetching historical data:', error);
    res.status(500).json({ 
      error: 'Failed to fetch historical data',
      message: error.message 
    });
  }
});

// Get multiple stock prices at once using Alpha Vantage
router.post('/prices', async (req, res) => {
  try {
    const { symbols } = req.body;
    
    if (!symbols || !Array.isArray(symbols)) {
      return res.status(400).json({ 
        error: 'Invalid request',
        message: 'symbols array is required' 
      });
    }
    
    console.log(`Fetching prices for ${symbols.length} stocks from Alpha Vantage`);
    
    const promises = symbols.map(async (symbol) => {
      try {
        const upperSymbol = symbol.toUpperCase();
        const stockInfo = NSE_STOCKS[upperSymbol];
        
        if (!stockInfo) {
          console.log(`Stock ${upperSymbol} not found in database`);
          return null;
        }
        
        // Add delay between requests to respect API limits
        await new Promise(resolve => setTimeout(resolve, 200));
        
        const data = await alpha.data.quote(stockInfo.symbol);
        
        if (data && data['Global Quote'] && data['Global Quote']['05. price']) {
          const quote = data['Global Quote'];
          
          return {
            symbol: upperSymbol,
            name: stockInfo.name,
            price: parseFloat(quote['05. price']),
            change: parseFloat(quote['09. change']),
            changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
            volume: parseInt(quote['06. volume']) || 0,
            exchange: stockInfo.exchange
          };
        }
        
        console.log(`No data available for ${upperSymbol}`);
        return null;
        
      } catch (error) {
        console.error(`Error fetching ${symbol}:`, error.message);
        return null;
      }
    });
    
    const results = await Promise.all(promises);
    const validResults = results.filter(result => result !== null);
    
    res.json({
      stocks: validResults,
      count: validResults.length,
      total: symbols.length,
      lastUpdated: new Date().toISOString(),
      dataSource: 'Alpha Vantage - Real-time BSE Data'
    });
    
  } catch (error) {
    console.error('Error fetching multiple stock prices:', error);
    res.status(500).json({ 
      error: 'Failed to fetch stock prices',
      message: error.message 
    });
  }
});

// Search for stocks in Alpha Vantage database
router.get('/search/:query', async (req, res) => {
  try {
    const query = req.params.query.toUpperCase();
    
    // Search in our predefined stock database
    const matches = Object.keys(NSE_STOCKS).filter(symbol => 
      symbol.includes(query) || 
      NSE_STOCKS[symbol].name.toUpperCase().includes(query)
    );
    
    const searchResults = matches.map(symbol => ({
      symbol: symbol,
      name: NSE_STOCKS[symbol].name,
      exchange: NSE_STOCKS[symbol].exchange,
      alphaVantageSymbol: NSE_STOCKS[symbol].symbol
    }));
    
    // Also try Alpha Vantage symbol search if no local matches
    if (searchResults.length === 0) {
      try {
        console.log(`Searching Alpha Vantage for: ${query}`);
        const searchData = await alpha.data.search(query);
        
        if (searchData && searchData['bestMatches']) {
          const alphaMatches = searchData['bestMatches']
            .filter(match => 
              match['4. region'] === 'India' || 
              match['1. symbol'].includes('.BSE') ||
              match['1. symbol'].includes('.NSE')
            )
            .slice(0, 10) // Limit to 10 results
            .map(match => ({
              symbol: match['1. symbol'].replace('.BSE', '').replace('.NSE', ''),
              name: match['2. name'],
              exchange: match['1. symbol'].includes('.BSE') ? 'BSE' : 
                       match['1. symbol'].includes('.NSE') ? 'NSE' : 'India',
              alphaVantageSymbol: match['1. symbol'],
              type: match['3. type'],
              region: match['4. region'],
              isFromSearch: true
            }));
          
          searchResults.push(...alphaMatches);
        }
      } catch (searchError) {
        console.error('Alpha Vantage search error:', searchError);
        // Continue with local results even if search fails
      }
    }
    
    res.json({
      query: query,
      results: searchResults,
      count: searchResults.length,
      note: searchResults.length === 0 ? 
        'No matches found. Try searching for major Indian companies like RELIANCE, TCS, INFY, etc.' : 
        'Results from BSE/NSE stock database'
    });
    
  } catch (error) {
    console.error('Error searching stocks:', error);
    res.status(500).json({ 
      error: 'Failed to search stocks',
      message: error.message 
    });
  }
});

// Get list of popular Indian stocks (BSE/NSE)
router.get('/popular', (req, res) => {
  try {
    const popularStocks = Object.keys(NSE_STOCKS).map(symbol => ({
      symbol: symbol,
      name: NSE_STOCKS[symbol].name,
      exchange: NSE_STOCKS[symbol].exchange,
      alphaVantageSymbol: NSE_STOCKS[symbol].symbol
    }));
    
    res.json({
      stocks: popularStocks,
      count: popularStocks.length,
      exchanges: ['BSE'],
      note: 'Popular Indian stocks available for trading',
      dataSource: 'Alpha Vantage supported BSE stocks'
    });
    
  } catch (error) {
    console.error('Error fetching popular stocks:', error);
    res.status(500).json({ 
      error: 'Failed to fetch popular stocks',
      message: error.message 
    });
  }
});

// Get real-time market status
router.get('/market-status', async (req, res) => {
  try {
    // Check if Indian market is open (9:15 AM to 3:30 PM IST, Monday to Friday)
    const now = new Date();
    const istTime = new Date(now.getTime() + (5.5 * 60 * 60 * 1000)); // Convert to IST
    const day = istTime.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const hour = istTime.getHours();
    const minute = istTime.getMinutes();
    
    const isWeekday = day >= 1 && day <= 5;
    const isMarketHours = (hour > 9 || (hour === 9 && minute >= 15)) && 
                         (hour < 15 || (hour === 15 && minute <= 30));
    
    const isOpen = isWeekday && isMarketHours;
    
    res.json({
      isOpen: isOpen,
      currentTime: istTime.toISOString(),
      timezone: 'Asia/Kolkata',
      marketHours: '9:15 AM - 3:30 PM IST',
      tradingDays: 'Monday to Friday',
      note: isOpen ? 'Market is currently open' : 'Market is currently closed'
    });
    
  } catch (error) {
    console.error('Error checking market status:', error);
    res.status(500).json({ 
      error: 'Failed to check market status',
      message: error.message 
    });
  }
});

module.exports = router;
