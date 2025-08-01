import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { 
  TrendingUp, 
  TrendingDown, 
  IndianRupee, 
  Search,
  Plus,
  Minus,
  Activity,
  PieChart,
  BarChart3,
  RefreshCw,
  Clock,
  Globe,
  X
} from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const PaperTrading = ({ onEarnCoins }) => {
  // Google Sheets Configuration
  const SHEET_URL_KEY = 'googleSheetUrl';
  const DEFAULT_SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS3rchjqOy_gfZMXPEOwV2ZwXlFpQdYb3-Gu-4gPEZinH-1xNcC7Af5zowZI5HEMDdX8ActGy2kU5lN/pub?output=csv';
  
  // Load from localStorage or use defaults
  const [balance, setBalance] = useState(() => {
    const saved = localStorage.getItem('stockGameCash');
    return saved ? parseFloat(saved) : 1000000; // Starting with ₹10,00,000 virtual money
  });
  
  const [portfolio, setPortfolio] = useState(() => {
    const saved = localStorage.getItem('stockGamePortfolio');
    return saved ? JSON.parse(saved) : {}; // { ticker: { quantity, totalCost } }
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStock, setSelectedStock] = useState(null);
  const [tradeAmount, setTradeAmount] = useState('');
  const [tradeType, setTradeType] = useState('buy');
  const [stocksData, setStocksData] = useState([]);
  const [allStocksData, setAllStocksData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sheetUrl, setSheetUrl] = useState(() => {
    return localStorage.getItem(SHEET_URL_KEY) || DEFAULT_SHEET_URL;
  });

  const [chartData, setChartData] = useState(null);

  // Remove duplicate stocks based on symbol
  const removeDuplicateStocks = (stocks) => {
    const seen = new Set();
    const uniqueStocks = [];
    
    for (const stock of stocks) {
      if (!seen.has(stock.symbol)) {
        seen.add(stock.symbol);
        uniqueStocks.push(stock);
      } else {
        console.log('🗑️ Removing duplicate stock:', stock.symbol, '-', stock.name);
      }
    }
    
    console.log('✨ Removed', stocks.length - uniqueStocks.length, 'duplicate stocks');
    return uniqueStocks;
  };

  // Parse CSV data from Google Sheets
  const parseCSV = (csvText) => {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) {
      setError('CSV data is empty or has only headers.');
      return [];
    }

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const dataRows = lines.slice(1);

    const tickerIndex = headers.indexOf('ticker');
    const nameIndex = headers.indexOf('name');
    const priceIndex = headers.indexOf('price');
    const trendIndex = headers.indexOf('trend');

    if (tickerIndex === -1 || nameIndex === -1 || priceIndex === -1) {
      setError('CSV headers \'Ticker\', \'Name\', \'Price\' not found. Please ensure your sheet has these columns.');
      return [];
    }

    const parsedData = dataRows.map(row => {
      const values = row.split(',');
      let currentValues = values;
      
      // Handle names with commas
      if (values.length > headers.length && nameIndex !== -1) {
        const expectedLength = headers.length;
        const actualLength = values.length;
        const diff = actualLength - expectedLength;

        if (diff > 0 && nameIndex < expectedLength - 1) {
          const recombinedName = values.slice(nameIndex, nameIndex + 1 + diff).join(',');
          currentValues = [
            ...values.slice(0, nameIndex),
            recombinedName,
            ...values.slice(nameIndex + 1 + diff)
          ];
        }
      }

      const priceValue = parseFloat(currentValues[priceIndex]);
      const trendValue = parseFloat(currentValues[trendIndex]);

      return {
        symbol: currentValues[tickerIndex]?.trim() || '',
        name: currentValues[nameIndex]?.trim() || '',
        price: isNaN(priceValue) ? 0 : priceValue,
        trend: isNaN(trendValue) ? 0 : trendValue,
        change: isNaN(trendValue) ? 0 : trendValue,
        changePercent: isNaN(trendValue) ? 0 : (trendValue * 100),
        volume: Math.floor(Math.random() * 1000000), // Simulated volume
        exchange: 'BSE',
        dataSource: 'Google Sheets',
        lastUpdated: new Date().toISOString()
      };
    }).filter(stock => stock.symbol && stock.name && stock.price > 0);

    return parsedData;
  };

  // Parse JSON data from Google Sheets
  const parseJSON = (jsonText) => {
    try {
      const data = JSON.parse(jsonText);
      let parsedData = [];

      if (data.table && Array.isArray(data.table.rows)) {
        const cols = data.table.cols.map(col => col.label || col.id);
        parsedData = data.table.rows.map(row => {
          const obj = {};
          row.c.forEach((cell, i) => {
            if (cols[i]) {
              obj[cols[i].toLowerCase()] = cell.v;
            }
          });
          const priceValue = parseFloat(obj.price);
          const trendValue = parseFloat(obj.trend || 0);
          return {
            symbol: obj.ticker || '',
            name: obj.name || '',
            price: isNaN(priceValue) ? 0 : priceValue,
            trend: isNaN(trendValue) ? 0 : trendValue,
            change: isNaN(trendValue) ? 0 : trendValue,
            changePercent: isNaN(trendValue) ? 0 : (trendValue * 100),
            volume: Math.floor(Math.random() * 1000000),
            exchange: 'BSE',
            dataSource: 'Google Sheets',
            lastUpdated: new Date().toISOString()
          };
        }).filter(stock => stock.symbol && stock.name && stock.price > 0);
      } else if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object') {
        parsedData = data.map(row => {
          const priceValue = parseFloat(row.Price || row.price);
          const trendValue = parseFloat(row.Trend || row.trend || 0);
          return {
            symbol: row.Ticker || row.ticker || '',
            name: row.Name || row.name || '',
            price: isNaN(priceValue) ? 0 : priceValue,
            trend: isNaN(trendValue) ? 0 : trendValue,
            change: isNaN(trendValue) ? 0 : trendValue,
            changePercent: isNaN(trendValue) ? 0 : (trendValue * 100),
            volume: Math.floor(Math.random() * 1000000),
            exchange: 'BSE',
            dataSource: 'Google Sheets',
            lastUpdated: new Date().toISOString()
          };
        }).filter(stock => stock.symbol && stock.name && stock.price > 0);
      }

      return parsedData;
    } catch (error) {
      setError('JSON format not recognized. Please ensure your sheet is published correctly.');
      return [];
    }
  };

  // Fetch and parse data from Google Sheets
  const fetchAndDisplayData = async (url = sheetUrl, isAutoRefresh = false) => {
    if (!isAutoRefresh) {
      setLoading(true);
    }
    setError('');
    
    try {
      console.log(`Fetching data from Google Sheets: ${url}`);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const text = await response.text();

      let stockData = [];
      if (url.includes('output=csv')) {
        stockData = parseCSV(text);
      } else if (url.includes('output=json')) {
        stockData = parseJSON(text);
      } else {
        setError('Unsupported URL format. Please ensure it ends with `output=csv` or `output=json`.');
        return;
      }

      setAllStocksData(stockData);
      setStocksData(stockData);
      updatePortfolioValues(stockData);
      generateChartData(stockData);
      
      if (stockData.length === 0) {
        setError('No valid stock data found. Please check your Google Sheet format.');
      } else {
        console.log(`Successfully loaded ${stockData.length} stocks from Google Sheets`);
      }
      
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(`Failed to load data: ${error.message}. Check your URL and sheet format.`);
    } finally {
      setLoading(false);
    }
  };

  // Update portfolio values with current stock prices
  const updatePortfolioValues = (stockData) => {
    const portfolioTickers = Object.keys(portfolio);
    if (portfolioTickers.length === 0) return;

    portfolioTickers.forEach(ticker => {
      const stock = stockData.find(s => s.symbol === ticker);
      if (stock && portfolio[ticker]) {
        portfolio[ticker].currentPrice = stock.price;
      }
    });
  };

  // Generate chart data for visualization
  const generateChartData = (stockData) => {
    if (stockData.length === 0) return;

    // Create a simple price chart with top 10 stocks
    const topStocks = stockData.slice(0, 10);
    const chartConfig = {
      labels: topStocks.map(stock => stock.symbol),
      datasets: [
        {
          label: 'Stock Prices (₹)',
          data: topStocks.map(stock => stock.price),
          borderColor: 'rgb(147, 51, 234)',
          backgroundColor: 'rgba(147, 51, 234, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.1,
        },
      ],
    };
    setChartData(chartConfig);
  };

  // Generate individual stock chart data
  const generateIndividualStockChart = (stock) => {
    if (!stock) return;

    // Generate simulated historical data for the selected stock
    const days = 30;
    const historicalData = [];
    const labels = [];
    
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      labels.push(date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }));
      
      // Generate simulated price data around the current price
      const basePrice = stock.price;
      const variation = (Math.random() - 0.5) * 0.1; // ±10% variation
      const simulatedPrice = basePrice * (1 + variation);
      historicalData.push(Math.max(simulatedPrice, basePrice * 0.8)); // Minimum 80% of base price
    }
    
    // Ensure the last data point is the current price
    historicalData[historicalData.length - 1] = stock.price;

    const chartConfig = {
      labels: labels,
      datasets: [
        {
          label: `${stock.symbol} Price (₹)`,
          data: historicalData,
          borderColor: stock.change >= 0 ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)',
          backgroundColor: stock.change >= 0 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.1,
          pointRadius: 2,
          pointHoverRadius: 6,
        },
      ],
    };
    setChartData(chartConfig);
  };

  // Simple search function - filters stocks by name or symbol
  const searchStock = (searchQuery) => {
    console.log('🔍 SEARCHING FOR:', searchQuery);
    
    if (!searchQuery || !searchQuery.trim()) {
      console.log('❌ Empty search query');
      return;
    }
    
    if (!allStocksData || allStocksData.length === 0) {
      console.log('❌ No data to search');
      setError('No stock data available. Please wait for data to load.');
      return;
    }
    
    console.log('📊 Total stocks available:', allStocksData.length);
    console.log('📋 Sample stocks:', allStocksData.slice(0, 3).map(s => `${s.symbol}: ${s.name}`));
    
    const searchTerm = searchQuery.toLowerCase().trim();
    console.log('🔎 Normalized search term:', searchTerm);
    
    // Simple filter - search in both name and symbol
    const results = allStocksData.filter(stock => {
      if (!stock) return false;
      
      const stockName = String(stock.name || '').toLowerCase();
      const stockSymbol = String(stock.symbol || '').toLowerCase();
      
      const nameMatch = stockName.includes(searchTerm);
      const symbolMatch = stockSymbol.includes(searchTerm);
      
      if (nameMatch || symbolMatch) {
        console.log('✅ MATCH:', stock.symbol, '-', stock.name);
      }
      
      return nameMatch || symbolMatch;
    });
    
    console.log('🎯 Search results:', results.length, 'matches found');
    
    if (results.length > 0) {
      setStocksData(results);
      setError('');
      console.log('✅ Updated stocksData with', results.length, 'results');
    } else {
      console.log('❌ No matches found');
      setError(`No stocks found for "${searchQuery}". Try: ${allStocksData.slice(0, 3).map(s => s.name?.split(' ')[0]).join(', ')}`);
    }
  };

  // Clear search and show all stocks
  const clearSearch = () => {
    setStocksData(allStocksData);
    setSearchTerm('');
    setError('');
    setSelectedStock(null);
    generateOverviewChart(allStocksData.slice(0, 10));
  };

  // Handle search button click
  const handleSearchClick = () => {
    console.log('🔘 SEARCH BUTTON CLICKED');
    console.log('📝 Current search term:', searchTerm);
    console.log('📊 Available stocks:', allStocksData.length);
    
    if (!searchTerm || !searchTerm.trim()) {
      console.log('⚠️ Empty search term');
      setError('Please enter a company name to search.');
      return;
    }
    
    // Call the search function
    searchStock(searchTerm.trim());
    
    // Clear the search input after search
    setSearchTerm('');
  };

  // Update cash balance and save to localStorage
  const updateCashBalance = (newBalance) => {
    setBalance(newBalance);
    localStorage.setItem('stockGameCash', newBalance.toFixed(2));
  };

  // Update portfolio and save to localStorage
  const updatePortfolio = (newPortfolio) => {
    setPortfolio(newPortfolio);
    localStorage.setItem('stockGamePortfolio', JSON.stringify(newPortfolio));
  };

  // Initial load
  useEffect(() => {
    // Load data from Google Sheets on component mount
    fetchAndDisplayData();
    
    // Set up interval to auto-refresh every 10 minutes
    const refreshInterval = setInterval(() => {
      fetchAndDisplayData(sheetUrl, true);
    }, 600000); // 10 minutes
    
    return () => clearInterval(refreshInterval);
  }, []);

  // Update data when sheet URL changes
  useEffect(() => {
    if (sheetUrl) {
      localStorage.setItem(SHEET_URL_KEY, sheetUrl);
      fetchAndDisplayData(sheetUrl);
    }
  }, [sheetUrl]);

  // Use stocksData directly - search function handles filtering

  // Handle search on Enter key
  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearchClick(); // Use the same logic as button click
    }
  };

  const handleTrade = () => {
    if (!selectedStock || !tradeAmount) return;

    const amount = parseFloat(tradeAmount);
    if (amount <= 0) return;

    const currentPrice = selectedStock.price;
    const totalCost = amount * currentPrice;
    const ticker = selectedStock.symbol;

    if (tradeType === 'buy') {
      if (totalCost > balance) {
        alert(`Insufficient funds! You need ₹${totalCost.toFixed(2)}, but have ₹${balance.toFixed(2)}.`);
        return;
      }

      // Update cash balance
      const newBalance = balance - totalCost;
      updateCashBalance(newBalance);
      
      // Update portfolio
      const newPortfolio = { ...portfolio };
      if (!newPortfolio[ticker]) {
        newPortfolio[ticker] = { quantity: 0, totalCost: 0 };
      }
      newPortfolio[ticker].totalCost += totalCost;
      newPortfolio[ticker].quantity += amount;
      updatePortfolio(newPortfolio);

      // Award coins for successful trade
      onEarnCoins(Math.floor(amount / 10));
      
      setError('');
      console.log(`Successfully bought ${amount} shares of ${ticker} for ₹${totalCost.toFixed(2)}.`);
      
    } else {
      // Sell logic
      if (!portfolio[ticker] || portfolio[ticker].quantity < amount) {
        alert(`You don't own ${amount} shares of ${ticker} to sell. You currently own ${portfolio[ticker]?.quantity || 0}.`);
        return;
      }

      const revenue = currentPrice * amount;
      const avgPricePerShare = portfolio[ticker].totalCost / portfolio[ticker].quantity;
      const profitLoss = (currentPrice - avgPricePerShare) * amount;

      // Update cash balance
      const newBalance = balance + revenue;
      updateCashBalance(newBalance);
      
      // Update portfolio
      const newPortfolio = { ...portfolio };
      newPortfolio[ticker].quantity -= amount;
      newPortfolio[ticker].totalCost -= (avgPricePerShare * amount);

      if (newPortfolio[ticker].quantity === 0) {
        delete newPortfolio[ticker];
      }
      updatePortfolio(newPortfolio);

      // Award coins for successful trade
      onEarnCoins(Math.floor(amount / 10));
      
      setError('');
      console.log(`Successfully sold ${amount} shares of ${ticker} for ₹${revenue.toFixed(2)}. P/L: ₹${profitLoss.toFixed(2)}.`);
    }

    setTradeAmount('');
  };

  // Calculate portfolio totals for display
  const calculatePortfolioTotals = () => {
    const portfolioTickers = Object.keys(portfolio);
    let totalValue = 0;
    let totalGainLoss = 0;

    portfolioTickers.forEach(ticker => {
      const holding = portfolio[ticker];
      const stock = allStocksData.find(s => s.symbol === ticker);
      if (stock && holding) {
        const currentValue = holding.quantity * stock.price;
        const gainLoss = currentValue - holding.totalCost;
        totalValue += currentValue;
        totalGainLoss += gainLoss;
      }
    });

    return {
      totalValue,
      totalGainLoss,
      totalGainLossPercent: totalValue > 0 ? (totalGainLoss / (totalValue - totalGainLoss)) * 100 : 0
    };
  };

  const portfolioTotals = calculatePortfolioTotals();
  const totalPortfolioValue = balance + portfolioTotals.totalValue;

  return (
    <div className="space-y-6">
      {/* Google Sheets Configuration */}
      <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
            <div>
              <h3 className="text-white font-medium flex items-center">
                <Globe className="w-4 h-4 mr-2" />
                Indian Stock Market
              </h3>
              <p className="text-gray-300 text-sm">
                9:15 AM - 3:30 PM IST • Monday to Friday
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">

            <button
              onClick={() => fetchAndDisplayData()}
              disabled={loading}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
        

      </div>
      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-400 font-medium">Cash Balance</h3>
            <IndianRupee className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-4xl font-bold text-white">{balance.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-400 font-medium">Portfolio Value</h3>
            <PieChart className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-white">{portfolioTotals.totalValue.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</p>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-400 font-medium">Total Value</h3>
            <BarChart3 className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-white">{totalPortfolioValue.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</p>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-400 font-medium">Total P&L</h3>
            <Activity className="w-5 h-5 text-yellow-400" />
          </div>
          <p className={`text-2xl font-bold ${portfolioTotals.totalGainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {portfolioTotals.totalGainLoss.toLocaleString('en-IN', { style: 'currency', currency: 'INR', signDisplay: 'always' })}
          </p>
          <p className={`text-sm ${portfolioTotals.totalGainLoss >= 0 ? 'text-green-300' : 'text-red-300'}`}>
            ({portfolioTotals.totalGainLossPercent.toFixed(2)}%)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stock Market */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Stock Market</h3>
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by company name (e.g., Reliance, Tata, Infosys)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleSearchKeyPress}
                  className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                />
              </div>
              <button
                onClick={handleSearchClick}
                disabled={!searchTerm.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
              {stocksData.length < allStocksData.length && (
                <button
                  onClick={clearSearch}
                  className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all flex items-center space-x-2"
                >
                  <X className="w-4 h-4" />
                  <span>Clear</span>
                </button>
              )}
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-300 text-sm">
              {error}
            </div>
          )}

          {loading && stocksData.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
              Fetching real-time data from Alpha Vantage...
              <p className="text-xs mt-2">This may take a moment due to API rate limits</p>
            </div>
          )}

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {stocksData.map((stock, index) => (
              <div
                key={`${stock.symbol}-${index}`}
                onClick={() => {
                  setSelectedStock(stock);
                  generateIndividualStockChart(stock);
                }}
                className={`p-4 bg-gray-800/50 rounded-lg cursor-pointer hover:bg-gray-800/70 transition-all ${
                  selectedStock?.symbol === stock.symbol ? 'border border-purple-500' : 'border border-transparent'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium">{stock.symbol}</h4>
                    <p className="text-gray-400 text-sm">{stock.name}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-blue-400">{stock.exchange}</span>
                      {stock.dataSource && (
                        <span className="text-xs text-green-400">● Live</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">{stock.price?.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</p>
                    {stock.change !== 0 && (
                      <div className={`flex items-center text-sm ${stock.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {stock.change > 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                        <span>{stock.change > 0 ? '+' : ''}{stock.change?.toFixed(2)} ({stock.changePercent > 0 ? '+' : ''}{stock.changePercent?.toFixed(2)}%)</span>
                      </div>
                    )}
                    {stock.lastUpdated && (
                      <p className="text-gray-500 text-xs mt-1">
                        {new Date(stock.lastUpdated).toLocaleTimeString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {!loading && stocksData.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <p>No stocks available. Try refreshing or search for a specific stock.</p>
                <button 
                  onClick={() => fetchStockPrices()}
                  className="mt-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
                >
                  Load Stocks
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Trading Panel */}
        <div className="space-y-6">
          {/* Trade Form */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Trade</h3>
            
            {selectedStock ? (
              <div className="space-y-4">
                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <h4 className="text-white font-medium">{selectedStock.symbol}</h4>
                  <p className="text-gray-400 text-sm">{selectedStock.name}</p>
                  <p className="text-lg font-bold">{selectedStock.price?.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</p>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => setTradeType('buy')}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                      tradeType === 'buy' ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-400'
                    }`}
                  >
                    Buy
                  </button>
                  <button
                    onClick={() => setTradeType('sell')}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                      tradeType === 'sell' ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-400'
                    }`}
                  >
                    Sell
                  </button>
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Shares</label>
                  <input
                    type="number"
                    value={tradeAmount}
                    onChange={(e) => setTradeAmount(e.target.value)}
                    placeholder="Enter number of shares"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  />
                </div>

                {tradeAmount && selectedStock && (
                  <div className="p-4 bg-gray-800/50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Total Cost:</span>
                      <span className="text-white font-bold">
                        <p className="text-lg font-bold">{(tradeAmount * selectedStock.price).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</p>
                      </span>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleTrade}
                  disabled={!tradeAmount || loading}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : (tradeType === 'buy' ? 'Buy Shares' : 'Sell Shares')}
                </button>
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">Select a stock to trade</p>
            )}
          </div>

          {/* Portfolio Holdings */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Your Holdings</h3>
            
            {Object.keys(portfolio).length > 0 ? (
              <div className="space-y-3">
                {Object.keys(portfolio).map((ticker) => {
                  const holding = portfolio[ticker];
                  const stock = allStocksData.find(s => s.symbol === ticker);
                  const currentPrice = stock ? stock.price : 0;
                  const avgPrice = holding.totalCost / holding.quantity;
                  const currentValue = holding.quantity * currentPrice;
                  const profitLoss = currentValue - holding.totalCost;
                  const profitLossPercent = holding.totalCost > 0 ? (profitLoss / holding.totalCost) * 100 : 0;

                  return (
                    <div key={ticker} className="p-4 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="text-white font-medium">{ticker}</h4>
                          <p className="text-gray-400 text-sm">
                            {holding.quantity} shares @ ₹{avgPrice.toFixed(2)}
                          </p>
                          <p className="text-gray-500 text-xs">
                            {stock ? stock.name : 'Stock data not available'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-bold">
                            {currentValue.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                          </p>
                          <p className={`text-sm ${profitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {profitLoss.toLocaleString('en-IN', { style: 'currency', currency: 'INR', signDisplay: 'always' })} 
                            ({profitLossPercent.toFixed(2)}%)
                          </p>
                          <p className="text-gray-400 text-xs">
                            Current: ₹{currentPrice.toFixed(2)}
                          </p>
                          <button
                            onClick={() => {
                              setSelectedStock(stock);
                              setTradeType('sell');
                              setTradeAmount(holding.quantity.toString());
                            }}
                            className="mt-2 px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-all"
                          >
                            Sell All
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">No holdings yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Stock Chart */}
      {chartData && (
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">
            {selectedStock ? `${selectedStock.symbol} - ${selectedStock.name}` : 'Stock Prices Overview'}
          </h3>
          {selectedStock && (
            <div className="mb-4 p-3 bg-gray-800/50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-300 text-sm">Current Price</p>
                  <p className="text-2xl font-bold text-white">
                    ₹{selectedStock.price.toFixed(2)}
                  </p>
                </div>
                {selectedStock.change !== 0 && (
                  <div className="text-right">
                    <p className="text-gray-300 text-sm">Change</p>
                    <p className={`text-lg font-semibold ${selectedStock.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {selectedStock.change > 0 ? '+' : ''}₹{selectedStock.change.toFixed(2)} ({selectedStock.changePercent > 0 ? '+' : ''}{selectedStock.changePercent.toFixed(2)}%)
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
          <div className="h-64">
            <Line 
              data={chartData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    labels: {
                      color: 'white'
                    }
                  }
                },
                scales: {
                  x: {
                    ticks: {
                      color: 'white'
                    },
                    grid: {
                      color: 'rgba(255, 255, 255, 0.1)'
                    }
                  },
                  y: {
                    ticks: {
                      color: 'white',
                      callback: function(value) {
                        return '₹' + value.toLocaleString('en-IN');
                      }
                    },
                    grid: {
                      color: 'rgba(255, 255, 255, 0.1)'
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      )}

      {/* Educational Tips */}
      <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Stock Trading Simulator</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <h4 className="text-purple-300 font-medium">Data Source</h4>
            <ul className="text-gray-300 text-sm space-y-1">
              <li>• Stock data from Google Sheets</li>
              <li>• Customizable stock lists and prices</li>
              <li>• Auto-refresh every 10 minutes</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="text-blue-300 font-medium">Trading Features</h4>
            <ul className="text-gray-300 text-sm space-y-1">
              <li>• Paper trading with ₹10,00,000 virtual balance</li>
              <li>• Real-time portfolio tracking</li>
              <li>• P&L calculations and charts</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="text-green-300 font-medium">Configuration</h4>
            <ul className="text-gray-300 text-sm space-y-1">
              <li>• Configure your own Google Sheet</li>
              <li>• CSV/JSON format support</li>
              <li>• Persistent portfolio storage</li>
            </ul>
          </div>
        </div>
        <div className="mt-4 p-3 bg-blue-900/30 border border-blue-500/30 rounded-lg">
          <p className="text-blue-200 text-sm">
            <strong>Note: </strong> 
            Perfect for educational trading simulations!
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaperTrading;
