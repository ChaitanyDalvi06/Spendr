import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getRandomRecommendations } from './RecommendationSets';
import { 
  Bot, 
  Send, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  DollarSign,
  BarChart3,
  PieChart,
  Target,
  Lightbulb,
  Newspaper,
  Clock,
  Eye,
  ArrowUpRight,
  Zap,
  Globe,
  Activity,
  RefreshCw
} from 'lucide-react';

const AIAdvisor = () => {
  // Initialize Gemini AI - using environment variables for API keys
  const geminiApiKey = import.meta.env.VITE_GEMINI_AI_ADVISOR_API_KEY;
  const genAI = new GoogleGenerativeAI(geminiApiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const [messages, setMessages] = useState([
    {
      id: '1',
      type: 'ai',
      content: "Hi! I'm your AI Investment Advisor. I help teenagers learn about investing, saving, and financial planning. Ask me anything about money, stocks, ETFs, or investment strategies!",
      timestamp: new Date().toISOString()
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(true);
  const [news, setNews] = useState([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [newsError, setNewsError] = useState(null);
  
  // AI Trainer simulation states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentAnalysisStep, setCurrentAnalysisStep] = useState('');
  const [showVideo, setShowVideo] = useState(false);

  // Fetch real finance news from NewsData.io API
  const fetchFinanceNews = async () => {
    setNewsLoading(true);
    setNewsError(null);
    
    try {
      const apiKey = import.meta.env.VITE_NEWSDATA_API_KEY || 'pub_d69eca491fb6443d93d00cfe9b3b11f6';
      
      // Simplified finance queries under 100 characters for free tier
      const financeQueries = [
        'stock market investment',
        'mutual funds ETF',
        'cryptocurrency bitcoin',
        'financial planning',
        'interest rates inflation',
        'trading forex gold'
      ];
      
      // Use random query selection for fresh news on every refresh
      const queryIndex = Math.floor(Math.random() * financeQueries.length);
      const selectedQuery = financeQueries[queryIndex];
      // Use both business category and more specific finance keywords
      const apiUrl = `https://newsdata.io/api/1/latest?apikey=${apiKey}&category=business&q=${encodeURIComponent(selectedQuery)}&language=en&size=10`;
      
      console.log('Fetching news from:', apiUrl);
      
      const response = await fetch(apiUrl);
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      const data = await response.json();
      console.log('API Response:', data);
      
      if (data.status === 'success' && data.results && data.results.length > 0) {
        // Enhanced filtering: valid images AND finance-related content
        const financeKeywords = [
          'stock', 'stocks', 'equity', 'share', 'shares', 'market', 'trading', 'investment', 'invest',
          'mutual fund', 'etf', 'index fund', 'portfolio', 'asset', 'wealth', 'finance', 'financial',
          'cryptocurrency', 'crypto', 'bitcoin', 'ethereum', 'blockchain', 'digital currency',
          'interest rate', 'federal reserve', 'central bank', 'inflation', 'monetary', 'bond',
          'forex', 'currency', 'commodities', 'gold', 'oil', 'futures', 'derivatives',
          'dividend', 'earnings', 'revenue', 'profit', 'loss', 'valuation', 'ipo', 'merger',
          'nasdaq', 'nyse', 'dow jones', 's&p 500', 'nifty', 'sensex', 'bse'
        ];
        
        const articlesWithImages = data.results.filter(article => {
          // Check for valid image
          const hasValidImage = article.image_url && 
            article.image_url.trim() !== '' && 
            article.image_url !== 'null' &&
            article.image_url.startsWith('http');
          
          if (!hasValidImage) return false;
          
          // Check if content is finance-related
          const title = (article.title || '').toLowerCase();
          const description = (article.description || '').toLowerCase();
          const content = (article.content || '').toLowerCase();
          const fullText = `${title} ${description} ${content}`;
          
          // Must contain at least 1 finance keyword (reduced from 2 for more results)
          const keywordMatches = financeKeywords.filter(keyword => 
            fullText.includes(keyword.toLowerCase())
          ).length;
          
          return keywordMatches >= 1;
        });
        
        console.log(`Found ${articlesWithImages.length} articles with images out of ${data.results.length} total`);
        
        if (articlesWithImages.length === 0) {
          throw new Error('No articles with images found');
        }
        
        // Shuffle results to get different articles on each refresh
        const shuffledResults = articlesWithImages.sort(() => Math.random() - 0.5);
        
        // Transform API data to match our UI structure
        const transformedNews = shuffledResults.slice(0, 4).map((article, index) => {
          // More specific finance categories based on content
          const categories = ['Stocks', 'Crypto', 'Mutual Funds', 'Trading', 'Investment', 'Markets', 'Economy', 'Banking'];
          const icons = ['TrendingUp', 'Activity', 'Zap', 'Globe', 'BarChart3', 'PieChart', 'Target', 'DollarSign'];
          
          // Generate realistic market changes
          const changeValues = [
            '+2.4%', '+1.8%', '+3.1%', '+0.9%', '+4.2%', '+1.2%', '-0.8%', '-1.5%', 
            '+5.7%', '+2.9%', '+0.3%', '-2.1%', '+6.8%', '+1.7%', '-0.4%', '+3.5%'
          ];
          const impacts = ['high', 'medium', 'high', 'medium', 'low', 'high', 'medium', 'low'];
          
          return {
            id: article.article_id || index + 1,
            title: article.title || 'Finance News Update',
            source: article.source_name || 'Financial Times',
            snippet: article.description ? 
              (article.description.length > 80 ? article.description.substring(0, 80) + '...' : article.description) : 
              (article.content ? 
                (article.content.length > 80 ? article.content.substring(0, 80) + '...' : article.content) : 
                'Latest financial market updates and analysis.'),
            link: article.link || '#',
            image: article.image_url, // Always has image since we filtered for it
            time: article.pubDate ? new Date(article.pubDate).toLocaleString('en-US', {
              hour: 'numeric',
              minute: 'numeric',
              hour12: true,
              month: 'short',
              day: 'numeric'
            }) : `${Math.floor(Math.random() * 12) + 1} hours ago`,
            category: categories[Math.floor(Math.random() * categories.length)],
            trending: Math.random() > 0.6, // 40% chance of trending
            views: `${(Math.random() * 25 + 3).toFixed(1)}K`,
            impact: impacts[Math.floor(Math.random() * impacts.length)],
            change: changeValues[Math.floor(Math.random() * changeValues.length)],
            icon: icons[index % icons.length]
          };
        });
        
        setNews(transformedNews);
      } else {
        console.error('API Response Issue:', { status: data.status, resultsLength: data.results?.length });
        throw new Error(`Invalid API response: status=${data.status}, results=${data.results?.length || 0}`);
      }
    } catch (error) {
      console.error('Error fetching finance news:', error);
      
      // More specific error messages
      let errorMessage = 'Failed to load latest news.';
      if (error.message.includes('CORS')) {
        errorMessage = 'CORS error - API blocked by browser.';
      } else if (error.message.includes('429')) {
        errorMessage = 'Rate limit exceeded - too many requests.';
      } else if (error.message.includes('401') || error.message.includes('403')) {
        errorMessage = 'API key invalid or expired.';
      } else if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
        errorMessage = 'Network error - check internet connection.';
      }
      
      setNewsError(errorMessage);
      
      // Fallback to mock data if API fails - Updated with reliable finance images
      const fallbackNews = [
        {
          id: 1,
          title: 'Global Markets Rally on Tech Sector Growth',
          source: 'Finance Today',
          snippet: 'Tech stocks led the charge today, with major indices seeing significant gains. Investors are optimistic about the upcoming earnings season.',
          link: '#',
          image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400&h=200&fit=crop&auto=format&q=80',
          time: '2 hours ago',
          category: 'Markets',
          trending: true,
          views: '12.5K',
          impact: 'high',
          change: '+2.4%',
          icon: 'TrendingUp'
        },
        {
          id: 2,
          title: 'RBI Holds Interest Rates Steady at 6.5%',
          source: 'Economic Times',
          snippet: 'The Reserve Bank of India has decided to keep the repo rate unchanged at 6.5%, balancing growth and inflation pressures.',
          link: '#',
          image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=200&fit=crop&auto=format&q=80',
          time: '4 hours ago',
          category: 'Policy',
          trending: false,
          views: '8.2K',
          impact: 'medium',
          change: '0.0%',
          icon: 'Activity'
        },
        {
          id: 3,
          title: 'Cryptocurrency Market Sees Strong Recovery',
          source: 'Crypto News',
          snippet: 'Bitcoin and major altcoins surge as institutional investors show renewed interest in digital assets.',
          link: '#',
          image: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=200&fit=crop&auto=format&q=80',
          time: '6 hours ago',
          category: 'Crypto',
          trending: true,
          views: '15.8K',
          impact: 'high',
          change: '+5.2%',
          icon: 'Zap'
        },
        {
          id: 4,
          title: 'Mutual Fund Inflows Hit Record High',
          source: 'Investment Weekly',
          snippet: 'Indian mutual fund industry witnesses unprecedented inflows as retail investors embrace systematic investment plans.',
          link: '#',
          image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=200&fit=crop&auto=format&q=80',
          time: '8 hours ago',
          category: 'Investment',
          trending: false,
          views: '9.7K',
          impact: 'medium',
          change: '+1.8%',
          icon: 'BarChart3'
        }
      ];
      setNews(fallbackNews);
    } finally {
      setNewsLoading(false);
    }
  };

  // AI Trainer simulation function
  const startAnalysis = () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setShowVideo(false);
    
    const analysisSteps = [
      { step: 'AI is observing patterns...', duration: 2000 },
      { step: 'Analyzing your investment behavior...', duration: 2000 },
      { step: 'Observing goals and preferences...', duration: 2000 },
      { step: 'Processing risk tolerance...', duration: 2000 },
      { step: 'Script is being prepared...', duration: 2000 },
      { step: 'Making personalized video...', duration: 2500 },
      { step: 'Generating final video...', duration: 2500 }
    ];
    
    let currentStep = 0;
    let totalProgress = 0;
    
    const progressInterval = setInterval(() => {
      totalProgress += 100 / 150; // 15 seconds = 150 intervals of 100ms
      setAnalysisProgress(Math.min(totalProgress, 100));
    }, 100);
    
    const stepInterval = setInterval(() => {
      if (currentStep < analysisSteps.length) {
        setCurrentAnalysisStep(analysisSteps[currentStep].step);
        currentStep++;
      }
    }, 2000);
    
    // Complete after 15 seconds
    setTimeout(() => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
      setAnalysisProgress(100);
      setCurrentAnalysisStep('Video ready!');
      setIsAnalyzing(false);
      setShowVideo(true);
    }, 15000);
  };

  // Fallback recommendations when API is unavailable
  const getFallbackRecommendations = () => {
    const fallbackSets = [
      [
        {
          symbol: "TCS.NS",
          name: "Tata Consultancy Services",
          type: "stock",
          riskLevel: "medium",
          expectedReturn: 12.5,
          description: "India's largest IT services company with strong digital transformation focus and global presence",
          pros: ["Market leader in IT services", "Strong recurring revenue model", "Excellent dividend track record"],
          cons: ["Dependent on US market", "Currency fluctuation risks", "High competition in IT sector"]
        },
        {
          symbol: "UTI_NIFTY_50",
          name: "UTI Nifty 50 Index Fund",
          type: "mutual_fund",
          riskLevel: "medium",
          expectedReturn: 11.8,
          description: "Diversified index fund tracking India's top 50 companies with low expense ratio",
          pros: ["Broad market exposure", "Low management fees", "Professional fund management"],
          cons: ["Market volatility risk", "No guaranteed returns", "Tracking error possibilities"]
        },
        {
          symbol: "EMBASSY_REIT",
          name: "Embassy Office Parks REIT",
          type: "reit",
          riskLevel: "medium",
          expectedReturn: 9.2,
          description: "India's first listed REIT with premium office spaces in major IT hubs",
          pros: ["Steady rental income", "Quality office portfolio", "Regular dividend distributions"],
          cons: ["Interest rate sensitivity", "Real estate market cycles", "Tenant concentration risk"]
        }
      ],
      [
        {
          symbol: "RELIANCE.NS",
          name: "Reliance Industries Limited",
          type: "stock",
          riskLevel: "medium",
          expectedReturn: 13.2,
          description: "Diversified conglomerate with strong presence in oil, telecom, and retail sectors",
          pros: ["Diversified business model", "Strong cash generation", "Digital transformation initiatives"],
          cons: ["Oil price volatility", "High debt levels", "Regulatory challenges"]
        },
        {
          symbol: "HDFC_TOP_100",
          name: "HDFC Top 100 Fund",
          type: "mutual_fund",
          riskLevel: "medium",
          expectedReturn: 12.1,
          description: "Large-cap focused mutual fund with consistent performance track record",
          pros: ["Experienced fund management", "Large-cap stability", "Good historical returns"],
          cons: ["Market risk exposure", "Fund manager dependency", "Exit load charges"]
        },
        {
          symbol: "GOLD_ETF",
          name: "Gold Exchange Traded Fund",
          type: "etf",
          riskLevel: "low",
          expectedReturn: 8.5,
          description: "Gold-backed ETF providing exposure to precious metals as inflation hedge",
          pros: ["Inflation protection", "Portfolio diversification", "High liquidity"],
          cons: ["No dividend income", "Storage and insurance costs", "Price volatility"]
        }
      ]
    ];
    
    // Return random set of fallback recommendations
    return fallbackSets[Math.floor(Math.random() * fallbackSets.length)];
  };

  // Credit-optimized recommendation fetcher with caching
  const fetchRecommendations = async (forceRefresh = false) => {
    setLoadingRecommendations(true);
    
    // Check cache first to save API credits
    const cacheKey = 'spendr_recommendations_cache';
    const cacheTimeKey = 'spendr_recommendations_cache_time';
    const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes cache
    
    const cachedData = localStorage.getItem(cacheKey);
    const cacheTime = localStorage.getItem(cacheTimeKey);
    
    // Use cached data if available and not expired (unless force refresh)
    if (!forceRefresh && cachedData && cacheTime) {
      const timeDiff = Date.now() - parseInt(cacheTime);
      if (timeDiff < CACHE_DURATION) {
        console.log('📦 Using cached recommendations to save API credits');
        setRecommendations(JSON.parse(cachedData));
        setLoadingRecommendations(false);
        return;
      }
    }
    
    // Check if API key is available
    if (!geminiApiKey) {
      console.warn('⚠️ Gemini API key not found. Using fallback recommendations.');
      const fallbackData = getFallbackRecommendations();
      setRecommendations(fallbackData);
      // Cache fallback data too
      localStorage.setItem(cacheKey, JSON.stringify(fallbackData));
      localStorage.setItem(cacheTimeKey, Date.now().toString());
      setLoadingRecommendations(false);
      return;
    }
    
    // Check if we've recently hit rate limits to avoid API calls entirely
    const rateLimitKey = 'spendr_rate_limit_detected';
    const rateLimitTime = localStorage.getItem(rateLimitKey);
    const RATE_LIMIT_COOLDOWN = 10 * 60 * 1000; // 10 minutes cooldown after rate limit
    
    // If we recently hit rate limits, skip API entirely
    if (rateLimitTime && (Date.now() - parseInt(rateLimitTime)) < RATE_LIMIT_COOLDOWN) {
      console.log('⏰ Rate limit cooldown active - using fallback data only');
      const fallbackData = getFallbackRecommendations();
      setRecommendations(fallbackData);
      localStorage.setItem(cacheKey, JSON.stringify(fallbackData));
      localStorage.setItem(cacheTimeKey, Date.now().toString());
      setLoadingRecommendations(false);
      return;
    }
    
    // Limit API calls - only call API 10% of the time, use fallback 90% of the time
    const shouldUseAPI = Math.random() < 0.1; // 10% chance to use API
    
    if (!shouldUseAPI && !forceRefresh) {
      console.log('💰 Using fallback data to conserve API credits (90% fallback strategy)');
      const fallbackData = getFallbackRecommendations();
      setRecommendations(fallbackData);
      // Cache fallback data
      localStorage.setItem(cacheKey, JSON.stringify(fallbackData));
      localStorage.setItem(cacheTimeKey, Date.now().toString());
      setLoadingRecommendations(false);
      return;
    }
    
    try {
      console.log('🔄 Making API call (credit usage)');
      const timestamp = Date.now();
      const sessionId = Math.random().toString(36).substring(7);
      
      // Simplified, credit-efficient prompt
      const simplePrompt = `Generate 3 Indian investment recommendations for teenagers in JSON format:
      [{"symbol":"STOCK.NS","name":"Company Name","type":"stock/mutual_fund/reit","riskLevel":"low/medium/high","expectedReturn":10.5,"description":"Brief description","pros":["Pro 1","Pro 2","Pro 3"],"cons":["Con 1","Con 2","Con 3"]}]
      
      Include 1 Indian stock, 1 mutual fund, 1 REIT. Return only valid JSON array.`;

      const result = await model.generateContent(simplePrompt);
      const response = await result.response;
      let responseText = response.text().trim();
      
      // Enhanced JSON cleaning
      if (responseText.includes('```json')) {
        responseText = responseText.split('```json')[1].split('```')[0].trim();
      } else if (responseText.includes('```')) {
        responseText = responseText.split('```')[1].split('```')[0].trim();
      }
      
      // Remove any leading/trailing non-JSON content
      const jsonStart = responseText.indexOf('[');
      const jsonEnd = responseText.lastIndexOf(']') + 1;
      if (jsonStart !== -1 && jsonEnd !== -1) {
        responseText = responseText.substring(jsonStart, jsonEnd);
      }
      
      const newRecommendations = JSON.parse(responseText);
      
      // Validate that we got valid data
      if (!Array.isArray(newRecommendations) || newRecommendations.length === 0) {
        throw new Error('Invalid response format from API');
      }
      
      // Cache successful API response to save future credits
      localStorage.setItem(cacheKey, JSON.stringify(newRecommendations));
      localStorage.setItem(cacheTimeKey, Date.now().toString());
      console.log('✅ API call successful - cached for 30 minutes');
      
      setRecommendations(newRecommendations);
    } catch (error) {
      console.error('💸 API call failed:', error.message);
      
      // For rate limit errors, immediately use fallback to avoid wasting credits
      if (error.message?.includes('429') || error.message?.includes('quota') || error.message?.includes('rate limit')) {
        console.log('🚫 Rate limit hit - entering 10min cooldown mode');
        // Record rate limit hit for cooldown period
        localStorage.setItem('spendr_rate_limit_detected', Date.now().toString());
        const fallbackData = getFallbackRecommendations();
        setRecommendations(fallbackData);
        // Cache fallback data
        localStorage.setItem(cacheKey, JSON.stringify(fallbackData));
        localStorage.setItem(cacheTimeKey, Date.now().toString());
      } else {
        // For other errors, use fallback without retries to save credits
        console.log('⚠️ API error - using fallback data to conserve credits');
        const fallbackData = getFallbackRecommendations();
        setRecommendations(fallbackData);
        localStorage.setItem(cacheKey, JSON.stringify(fallbackData));
        localStorage.setItem(cacheTimeKey, Date.now().toString());
      }
    } finally {
      setLoadingRecommendations(false);
    }
  };

  // Fetch recommendations and real finance news on component mount
  useEffect(() => {
    // Always show diverse recommendations immediately on load
    const initialRecommendations = getRandomRecommendations();
    setRecommendations(initialRecommendations);
    setLoadingRecommendations(false);
    console.log('🚀 Initial load - showing diverse recommendations:', initialRecommendations);
    
    // Fetch news separately
    fetchFinanceNews();
  }, []);

  const quickQuestions = [
    "What's the difference between stocks and ETFs?",
    "How much should I invest as a teenager?",
    "What's a good risk level for beginners?",
    "How do I start investing with little money?",
    "What are the best investment apps for teens?",
    "What's the weather like today?"
  ];

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = inputMessage;
    setInputMessage('');
    setIsTyping(true);

    try {
      // Create a context-aware prompt for investment advice
      const prompt = `You are an AI investment advisor specifically designed to help teenagers and young adults learn about investing. 

      IMPORTANT INSTRUCTIONS:
      1. Keep responses SHORT (1-2 paragraphs maximum, 3-4 sentences each)
      2. If the question is NOT about investing, money, finance, stocks, ETFs, savings, or financial topics, respond with: "I'm specifically designed to help with investment and financial questions. Please ask me about investing, saving, stocks, ETFs, or other financial topics!"
      3. For investment questions: provide helpful, educational advice focused on beginner-friendly strategies
      4. Always emphasize safety, diversification, and long-term thinking
      5. Be concise but informative
      
      User question: ${currentMessage}
      
      Provide a clear, SHORT educational response.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const aiResponseText = response.text();

      const aiMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponseText,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      
      // Enhanced fallback responses based on common questions
      let fallbackContent = "I'm having trouble connecting to my AI service. ";
      
      const lowerMessage = currentMessage.toLowerCase();
      const isInvestmentRelated = lowerMessage.includes('invest') || lowerMessage.includes('money') || 
                                 lowerMessage.includes('stock') || lowerMessage.includes('etf') || 
                                 lowerMessage.includes('saving') || lowerMessage.includes('financial') ||
                                 lowerMessage.includes('portfolio') || lowerMessage.includes('fund') ||
                                 lowerMessage.includes('risk') || lowerMessage.includes('return');
      
      if (!isInvestmentRelated) {
        fallbackContent = "I'm specifically designed to help with investment and financial questions. Please ask me about investing, saving, stocks, ETFs, or other financial topics!";
      } else if (lowerMessage.includes('etf')) {
        fallbackContent += "ETFs are like baskets of many stocks. Great for beginners - try VTI or VOO.";
      } else if (lowerMessage.includes('how much') && lowerMessage.includes('invest')) {
        fallbackContent += "Start small as a teen - ₹25-50/month is perfect. Consistency beats timing!";
      } else if (lowerMessage.includes('risk')) {
        fallbackContent += "Beginners should start with low-medium risk ETFs. They're safer than individual stocks.";
      } else if (lowerMessage.includes('app') || lowerMessage.includes('broker')) {
        fallbackContent += "For teens: Fidelity Youth, Schwab Teen, or Vanguard with parent help.";
      } else {
        fallbackContent += "Key tips: Start early, invest regularly, choose ETFs, stay long-term!";
      }
      
      const fallbackMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: fallbackContent,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'low': return 'text-green-400 bg-green-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'high': return 'text-red-400 bg-red-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'stock': return <TrendingUp className="w-4 h-4" />;
      case 'etf': return <BarChart3 className="w-4 h-4" />;
      case 'mutual_fund': return <PieChart className="w-4 h-4" />;
      case 'crypto': return <DollarSign className="w-4 h-4" />;
      case 'bond': return <Target className="w-4 h-4" />;
      case 'reit': return <PieChart className="w-4 h-4" />;
      case 'real_estate': return <PieChart className="w-4 h-4" />;
      case 'commodity': return <TrendingDown className="w-4 h-4" />;
      default: return <PieChart className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
          <Bot className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">AI Investment Advisor</h2>
          <p className="text-gray-400">Get personalized investment advice and risk analysis</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-3 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
          <div className="h-96 overflow-y-auto mb-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-4 rounded-2xl ${
                  message.type === 'user' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-800 text-gray-100'
                }`}>
                  {message.type === 'ai' && (
                    <div className="flex items-center space-x-2 mb-2">
                      <Bot className="w-4 h-4 text-purple-400" />
                      <span className="text-purple-400 text-sm font-medium">AI Advisor</span>
                    </div>
                  )}
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-800 text-gray-100 p-4 rounded-2xl">
                  <div className="flex items-center space-x-2">
                    <Bot className="w-4 h-4 text-purple-400" />
                    <span className="text-purple-400 text-sm font-medium">AI Advisor</span>
                  </div>
                  <div className="flex space-x-1 mt-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Questions */}
          <div className="mb-4">
            <p className="text-gray-400 text-sm mb-2">Quick questions:</p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setInputMessage(question);
                    // Auto-send the question
                    setTimeout(() => {
                      const event = { target: { value: question } };
                      setInputMessage(question);
                    }, 100);
                  }}
                  className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-xs hover:bg-gray-700 transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask me about investing..."
              className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Investment Recommendations - Now below the chat */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white flex items-center">
              <Lightbulb className="w-5 h-5 mr-2 text-yellow-400" />
              Recommended for Teens
            </h3>
            <button
              onClick={async () => {
                // Credit-efficient Gemini API call with internet search data
                setLoadingRecommendations(true);
                
                try {
                  // Check rate limit cooldown first
                  const rateLimitKey = 'spendr_rate_limit_detected';
                  const rateLimitTime = localStorage.getItem(rateLimitKey);
                  const RATE_LIMIT_COOLDOWN = 10 * 60 * 1000; // 10 minutes
                  
                  if (rateLimitTime && (Date.now() - parseInt(rateLimitTime)) < RATE_LIMIT_COOLDOWN) {
                    console.log('⏰ Rate limit cooldown - using diverse fallback');
                    const fallbackData = getRandomRecommendations();
                    setRecommendations(fallbackData);
                    setLoadingRecommendations(false);
                    return;
                  }
                  
                  // Credit-efficient API call with minimal prompt
                  if (geminiApiKey) {
                    console.log('🔍 Making credit-efficient API call with search data');
                    
                    // Simple, credit-efficient prompt using current market context
                    const efficientPrompt = `Based on current Indian market trends, suggest 3 teen-friendly investments:
                    1 Indian stock (TCS/Infosys/HDFC/Reliance)
                    1 mutual fund (UTI/SBI/HDFC funds)
                    1 REIT/ETF option
                    
                    Format: [{"symbol":"STOCK.NS","name":"Company","type":"stock","riskLevel":"medium","expectedReturn":12.0,"description":"Brief desc","pros":["Pro1","Pro2","Pro3"],"cons":["Con1","Con2","Con3"]}]
                    
                    Return only JSON array, no explanation.`;
                    
                    const result = await model.generateContent(efficientPrompt);
                    const response = await result.response;
                    let responseText = response.text().trim();
                    
                    // Clean JSON response
                    if (responseText.includes('```json')) {
                      responseText = responseText.split('```json')[1].split('```')[0].trim();
                    } else if (responseText.includes('```')) {
                      responseText = responseText.split('```')[1].split('```')[0].trim();
                    }
                    
                    // Extract JSON array
                    const jsonMatch = responseText.match(/\[.*\]/s);
                    if (jsonMatch) {
                      responseText = jsonMatch[0];
                    }
                    
                    const apiRecommendations = JSON.parse(responseText);
                    
                    if (Array.isArray(apiRecommendations) && apiRecommendations.length > 0) {
                      setRecommendations(apiRecommendations);
                      console.log('✅ API call successful - fresh recommendations:', apiRecommendations);
                    } else {
                      throw new Error('Invalid API response');
                    }
                    
                  } else {
                    throw new Error('No API key available');
                  }
                  
                } catch (error) {
                  console.log('⚠️ API failed, using diverse fallback:', error.message);
                  
                  // Record rate limit if applicable
                  if (error.message?.includes('429') || error.message?.includes('quota')) {
                    localStorage.setItem('spendr_rate_limit_detected', Date.now().toString());
                  }
                  
                  // Always show diverse recommendations as fallback
                  const fallbackData = getRandomRecommendations();
                  setRecommendations(fallbackData);
                }
                
                setLoadingRecommendations(false);
              }}
              disabled={loadingRecommendations}
              className="px-3 py-1 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingRecommendations ? 'Loading...' : 'Refresh'}
            </button>
          </div>
          
          {loadingRecommendations ? (
            <div className="space-y-4">
              {[1, 2, 3].map((index) => (
                <div key={index} className="p-4 bg-gray-800/50 rounded-xl animate-pulse">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-gray-700 rounded"></div>
                      <div>
                        <div className="w-16 h-4 bg-gray-700 rounded mb-1"></div>
                        <div className="w-32 h-3 bg-gray-700 rounded"></div>
                      </div>
                    </div>
                    <div className="w-20 h-6 bg-gray-700 rounded-full"></div>
                  </div>
                  <div className="w-full h-3 bg-gray-700 rounded mb-3"></div>
                  <div className="w-3/4 h-3 bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>
          ) : recommendations.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
              <h4 className="text-white font-medium mb-2">Unable to fetch real-time data</h4>
              <p className="text-gray-400 text-sm mb-4">
                We couldn't get the latest investment recommendations from our AI. 
                This might be due to API rate limits or connectivity issues.
              </p>
              <button
                onClick={() => fetchRecommendations(true)} // Force refresh to show fallback recommendations
                className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {recommendations.map((investment, index) => (
                <div key={index} className="p-4 bg-gray-800/50 rounded-xl">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(investment.type)}
                      <div>
                        <h4 className="text-white font-medium text-sm">{investment.symbol}</h4>
                        <p className="text-gray-400 text-xs">{investment.name}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(investment.riskLevel)}`}>
                      {investment.riskLevel} risk
                    </span>
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-3">{investment.description}</p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      <span className="text-green-400 font-medium text-sm">
                        {investment.expectedReturn}% expected return
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <p className="text-green-400 text-xs font-medium mb-1">Pros:</p>
                      <ul className="text-gray-300 text-xs space-y-1">
                        {investment.pros.map((pro, i) => (
                          <li key={i}>• {pro}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-red-400 text-xs font-medium mb-1">Cons:</p>
                      <ul className="text-gray-300 text-xs space-y-1">
                        {investment.cons.map((con, i) => (
                          <li key={i}>• {con}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Risk Assessment */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-yellow-400" />
            Risk Assessment
          </h3>
          
          <div className="space-y-4">
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <h4 className="text-green-400 font-medium mb-2">Low Risk (Recommended)</h4>
              <p className="text-gray-300 text-sm mb-2">Stable investments with predictable returns</p>
              <ul className="text-gray-400 text-xs space-y-1">
                <li>• High-yield savings accounts</li>
                <li>• Government bonds</li>
                <li>• Broad market ETFs</li>
              </ul>
            </div>
            
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <h4 className="text-yellow-400 font-medium mb-2">Medium Risk</h4>
              <p className="text-gray-300 text-sm mb-2">Balanced growth with moderate volatility</p>
              <ul className="text-gray-400 text-xs space-y-1">
                <li>• Diversified stock portfolios</li>
                <li>• Sector-specific ETFs</li>
                <li>• Real estate investment trusts</li>
              </ul>
            </div>
            
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <h4 className="text-red-400 font-medium mb-2">High Risk (Advanced)</h4>
              <p className="text-gray-300 text-sm mb-2">High potential returns with significant risk</p>
              <ul className="text-gray-400 text-xs space-y-1">
                <li>• Individual stocks</li>
                <li>• Cryptocurrency</li>
                <li>• Options trading</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Educational Tips */}
      <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Investment Tips for Teenagers</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-800/50 rounded-xl p-4">
            <Target className="w-8 h-8 text-purple-400 mb-2" />
            <h4 className="text-white font-medium mb-2">Start Early</h4>
            <p className="text-gray-300 text-sm">Time is your biggest advantage. Even small amounts can grow significantly over decades.</p>
          </div>
          
          <div className="bg-gray-800/50 rounded-xl p-4">
            <PieChart className="w-8 h-8 text-blue-400 mb-2" />
            <h4 className="text-white font-medium mb-2">Diversify</h4>
            <p className="text-gray-300 text-sm">Don't put all your money in one investment. Spread risk across different assets.</p>
          </div>
          
          <div className="bg-gray-800/50 rounded-xl p-4">
            <BarChart3 className="w-8 h-8 text-green-400 mb-2" />
            <h4 className="text-white font-medium mb-2">Stay Consistent</h4>
            <p className="text-gray-300 text-sm">Regular investing beats trying to time the market. Set up automatic investments.</p>
          </div>
          
          <div className="bg-gray-800/50 rounded-xl p-4">
            <Lightbulb className="w-8 h-8 text-yellow-400 mb-2" />
            <h4 className="text-white font-medium mb-2">Keep Learning</h4>
            <p className="text-gray-300 text-sm">Financial education is an investment in itself. Read, learn, and ask questions.</p>
          </div>
        </div>
      </div>

      {/* Finance News Section */}
      <div className="mt-8 bg-gradient-to-r from-teal-900/50 to-cyan-900/50 backdrop-blur-sm border border-teal-500/20 rounded-2xl p-6 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-400/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-cyan-400/10 rounded-full blur-lg animate-pulse delay-1000"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="p-2 bg-teal-500/20 rounded-xl">
                <Newspaper className="w-7 h-7 text-teal-300" />
              </div>
              Latest Finance News
              <div className="flex items-center gap-1 text-xs bg-red-500/20 text-red-300 px-2 py-1 rounded-full">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                LIVE
              </div>
            </h3>
            <div className="flex items-center gap-4">
              <button
                onClick={fetchFinanceNews}
                disabled={newsLoading}
                className="flex items-center gap-2 bg-teal-500/20 hover:bg-teal-500/30 disabled:opacity-50 disabled:cursor-not-allowed text-teal-300 px-3 py-2 rounded-lg transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${newsLoading ? 'animate-spin' : ''}`} />
                <span className="text-sm font-medium">Refresh</span>
              </button>
              <div className="text-right">
                <p className="text-teal-300 text-sm font-medium">Market Status</p>
                <p className="text-white text-xs flex items-center gap-1">
                  <Activity className="w-3 h-3 text-green-400" />
                  Active
                </p>
              </div>
            </div>
          </div>


          {/* Error Message */}
          {newsError && (
            <div className="mb-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0" />
              <span className="text-yellow-300 text-sm">{newsError}</span>
            </div>
          )}

          {/* News Grid - Horizontal Square Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {newsLoading ? (
              // Loading skeleton
              [...Array(4)].map((_, index) => (
                <div key={index} className="bg-gray-800/60 rounded-xl p-4 border border-gray-700/50 animate-pulse aspect-square flex flex-col">
                  <div className="h-20 bg-gray-700 rounded-lg mb-3"></div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-gray-700 rounded flex-shrink-0"></div>
                    <div className="h-3 bg-gray-700 rounded w-3/4"></div>
                  </div>
                  <div className="h-3 bg-gray-700 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded w-4/5 mb-3"></div>
                  <div className="mt-auto flex justify-between">
                    <div className="h-3 bg-gray-700 rounded w-1/3"></div>
                    <div className="h-3 bg-gray-700 rounded w-1/4"></div>
                  </div>
                </div>
              ))
            ) : (
              news.map((article, index) => {
              const IconComponent = { TrendingUp, Activity, Zap, Globe }[article.icon];
              const impactColor = {
                high: 'border-red-500/30 bg-red-500/5',
                medium: 'border-yellow-500/30 bg-yellow-500/5',
                low: 'border-green-500/30 bg-green-500/5'
              }[article.impact];
              
              return (
                <div 
                  key={article.id} 
                  className={`bg-gray-800/60 rounded-xl p-4 border ${impactColor} transition-all duration-300 hover:scale-[1.02] hover:bg-gray-700/70 cursor-pointer group relative overflow-hidden aspect-square flex flex-col`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {article.trending && (
                    <div className="absolute top-2 right-2 bg-orange-500/20 text-orange-300 text-xs px-1.5 py-0.5 rounded-full flex items-center gap-1">
                      <Zap className="w-2.5 h-2.5" />
                      <span className="text-xs">Hot</span>
                    </div>
                  )}
                  
                  <a href={article.link} target="_blank" rel="noopener noreferrer" className="block h-full flex flex-col">
                    {/* Article Image */}
                    {article.image && (
                      <div className="mb-3 rounded-lg overflow-hidden flex-shrink-0">
                        <img 
                          src={article.image} 
                          alt={article.title}
                          className="w-full h-20 object-cover transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    
                    {/* Header with Icon and Category */}
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 bg-teal-500/20 rounded-lg flex-shrink-0">
                        {IconComponent && <IconComponent className="w-3 h-3 text-teal-300" />}
                      </div>
                      <span className="text-teal-300 text-xs font-medium bg-teal-500/10 px-2 py-0.5 rounded flex-1 text-center">
                        {article.category}
                      </span>
                      <ArrowUpRight className="w-3 h-3 text-gray-400 group-hover:text-teal-300 transition-colors flex-shrink-0" />
                    </div>
                    
                    {/* Title */}
                    <h4 className="text-white font-semibold text-sm leading-tight group-hover:text-teal-300 transition-colors mb-2 flex-1">
                      {article.title.length > 60 ? article.title.substring(0, 60) + '...' : article.title}
                    </h4>
                    
                    {/* Description */}
                    <p className="text-gray-300 text-xs leading-relaxed mb-3 flex-1">
                      {article.snippet.length > 50 ? article.snippet.substring(0, 50) + '...' : article.snippet}
                    </p>
                    
                    {/* Footer */}
                    <div className="mt-auto">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-gray-400 text-xs">{article.source}</span>
                        <div className={`text-xs font-bold ${
                          article.change.startsWith('+') ? 'text-green-400' : 
                          article.change.startsWith('-') ? 'text-red-400' : 'text-gray-400'
                        }`}>
                          {article.change}
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {article.time}
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {article.views}
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
              );
              })
            )}
          </div>
        </div>
      </div>

      {/* AI Investment Trainer Section */}
      <div className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 shadow-2xl relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-400/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-400/10 rounded-full blur-lg animate-pulse delay-1000"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-white flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-500/20 rounded-xl">
                  <Target className="w-7 h-7 text-purple-300" />
                </div>
                AI Investment Trainer
                <div className="flex items-center gap-1 text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">
                  <Lightbulb className="w-3 h-3" />
                  NEW
                </div>
              </h3>
              <p className="text-gray-300 text-sm ml-12">Video answers to your finance questions</p>
            </div>
            <div className="text-right">
              <p className="text-purple-300 text-sm font-medium">AI Powered</p>
              <p className="text-white text-xs flex items-center gap-1">
                <Activity className="w-3 h-3 text-green-400" />
                Ready
              </p>
            </div>
          </div>

          {/* Personalized AI Description */}
          <div className="bg-gray-800/40 rounded-xl p-6 border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-indigo-500/10">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-purple-500/20 rounded-full">
                <Bot className="w-8 h-8 text-purple-300" />
              </div>
            </div>
            <p className="text-gray-200 text-center text-lg leading-relaxed mb-6">
              Our AI Investment Trainer analyzes your behavior and creates personalized videos to help you understand investing
            </p>
            
            {/* Start Analysis Button */}
            {!isAnalyzing && !showVideo && (
              <div className="flex justify-center">
                <button 
                  onClick={startAnalysis}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 flex items-center gap-3 group"
                >
                  <Bot className="w-5 h-5 group-hover:animate-pulse" />
                  Start Analysis and Generate Video
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </div>
            )}
            
            {/* Analysis Progress */}
            {isAnalyzing && (
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-purple-300 font-medium mb-2">{currentAnalysisStep}</p>
                  <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${analysisProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-gray-400 text-sm mt-2">{Math.round(analysisProgress)}% Complete</p>
                </div>
                
                {/* AI Analysis Animation */}
                <div className="flex justify-center items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            )}
            
            {/* Video Display */}
            {showVideo && (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <p className="text-green-400 font-medium flex items-center justify-center gap-2">
                    <Zap className="w-4 h-4" />
                    Your Personalized Investment Video is Ready!
                  </p>
                </div>
                
                <div className="bg-gray-900/50 rounded-xl p-6 border border-purple-500/30">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Investment Hindi Video */}
                    <div className="bg-gray-800/60 rounded-xl p-3 shadow-2xl">
                      <h4 className="text-white text-sm font-medium mb-2 text-center">Investment Basics</h4>
                      <video 
                        controls 
                        className="w-full rounded-lg shadow-lg"
                        style={{ height: '200px', objectFit: 'contain' }}
                        poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23374151'/%3E%3Ctext x='150' y='100' text-anchor='middle' fill='%23d1d5db' font-size='12'%3EInvestment Basics%3C/text%3E%3C/svg%3E"
                      >
                        <source src="/src/videos/investmentHindi.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                    
                    {/* Crypto Video */}
                    <div className="bg-gray-800/60 rounded-xl p-3 shadow-2xl">
                      <h4 className="text-white text-sm font-medium mb-2 text-center">Cryptocurrency</h4>
                      <video 
                        controls 
                        className="w-full rounded-lg shadow-lg"
                        style={{ height: '200px', objectFit: 'contain' }}
                        poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23374151'/%3E%3Ctext x='150' y='100' text-anchor='middle' fill='%23d1d5db' font-size='12'%3ECryptocurrency%3C/text%3E%3C/svg%3E"
                      >
                        <source src="/src/videos/crypto.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                    
                    {/* Mutual Funds Video */}
                    <div className="bg-gray-800/60 rounded-xl p-3 shadow-2xl">
                      <h4 className="text-white text-sm font-medium mb-2 text-center">Mutual Funds</h4>
                      <video 
                        controls 
                        className="w-full rounded-lg shadow-lg"
                        style={{ height: '200px', objectFit: 'contain' }}
                        poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23374151'/%3E%3Ctext x='150' y='100' text-anchor='middle' fill='%23d1d5db' font-size='12'%3EMutual Funds%3C/text%3E%3C/svg%3E"
                      >
                        <source src="/src/videos/Mutualfunds_English.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <button 
                    onClick={() => {
                      setShowVideo(false);
                      setAnalysisProgress(0);
                      setCurrentAnalysisStep('');
                    }}
                    className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-6 rounded-lg transition-all duration-200 flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Generate New Video
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAdvisor;
