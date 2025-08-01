// Diverse recommendation sets for AIAdvisor refresh functionality
export const getRandomRecommendations = () => {
  const recommendationSets = [
    // Set 1: IT & Tech Focus
    [
      {
        symbol: "TCS.NS",
        name: "Tata Consultancy Services",
        type: "stock",
        riskLevel: "medium",
        expectedReturn: 12.5,
        description: "India's largest IT services company with strong digital transformation focus",
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
    
    // Set 2: Banking & Finance Focus
    [
      {
        symbol: "HDFC.NS",
        name: "HDFC Bank Limited",
        type: "stock",
        riskLevel: "medium",
        expectedReturn: 13.8,
        description: "India's leading private sector bank with strong digital banking capabilities",
        pros: ["Strong brand reputation", "Robust digital platform", "Consistent profit growth"],
        cons: ["Interest rate sensitivity", "Credit risk exposure", "Regulatory compliance costs"]
      },
      {
        symbol: "SBI_BLUECHIP",
        name: "SBI Bluechip Fund",
        type: "mutual_fund",
        riskLevel: "medium",
        expectedReturn: 12.3,
        description: "Large-cap equity fund focusing on established blue-chip companies",
        pros: ["Stable large-cap exposure", "Experienced fund house", "Good long-term track record"],
        cons: ["Limited growth potential", "Market dependency", "Fund management risk"]
      },
      {
        symbol: "MINDSPACE_REIT",
        name: "Mindspace Business Parks REIT",
        type: "reit",
        riskLevel: "medium",
        expectedReturn: 8.9,
        description: "Commercial real estate REIT with office spaces across major Indian cities",
        pros: ["Diversified tenant base", "Prime locations", "Stable rental yields"],
        cons: ["Economic cycle dependency", "Interest rate risk", "Vacancy risk"]
      }
    ],
    
    // Set 3: Consumer & Energy Focus
    [
      {
        symbol: "RELIANCE.NS",
        name: "Reliance Industries Limited",
        type: "stock",
        riskLevel: "medium",
        expectedReturn: 13.2,
        description: "Diversified conglomerate with strong presence in oil, telecom, and retail",
        pros: ["Diversified business model", "Strong cash generation", "Digital transformation initiatives"],
        cons: ["Oil price volatility", "High debt levels", "Regulatory challenges"]
      },
      {
        symbol: "AXIS_BLUECHIP",
        name: "Axis Bluechip Fund",
        type: "mutual_fund",
        riskLevel: "medium",
        expectedReturn: 11.9,
        description: "Equity fund investing in high-quality large-cap stocks with growth potential",
        pros: ["Quality stock selection", "Strong research team", "Consistent performance"],
        cons: ["Market volatility exposure", "Concentration risk", "Exit load charges"]
      },
      {
        symbol: "GOLD_ETF",
        name: "Gold Exchange Traded Fund",
        type: "etf",
        riskLevel: "low",
        expectedReturn: 8.5,
        description: "Gold-backed ETF providing exposure to precious metals as inflation hedge",
        pros: ["Inflation protection", "Portfolio diversification", "High liquidity"],
        cons: ["No dividend income", "Storage costs", "Price volatility"]
      }
    ],
    
    // Set 4: Growth & Pharma Focus
    [
      {
        symbol: "INFY.NS",
        name: "Infosys Limited",
        type: "stock",
        riskLevel: "medium",
        expectedReturn: 12.8,
        description: "Leading IT services company with strong focus on digital transformation and AI",
        pros: ["Strong digital capabilities", "Global client base", "Innovation focus"],
        cons: ["US market dependency", "Talent retention challenges", "Currency headwinds"]
      },
      {
        symbol: "ICICI_PRUDENTIAL",
        name: "ICICI Prudential Large Cap Fund",
        type: "mutual_fund",
        riskLevel: "medium",
        expectedReturn: 12.0,
        description: "Large-cap equity fund with focus on quality companies and sustainable growth",
        pros: ["Strong fund management", "Diversified portfolio", "Consistent returns"],
        cons: ["Market risk", "Fund manager dependency", "Exit load applicable"]
      },
      {
        symbol: "BROOKFIELD_REIT",
        name: "Brookfield India Real Estate Trust",
        type: "reit",
        riskLevel: "medium",
        expectedReturn: 9.5,
        description: "Real estate investment trust with premium office properties in key Indian cities",
        pros: ["Quality assets", "Strong sponsor", "Regular distributions"],
        cons: ["Real estate cycles", "Interest rate sensitivity", "Occupancy risk"]
      }
    ],
    
    // Set 5: Diversified & Conservative Focus
    [
      {
        symbol: "ITC.NS",
        name: "ITC Limited",
        type: "stock",
        riskLevel: "low",
        expectedReturn: 10.5,
        description: "Diversified conglomerate with presence in FMCG, hotels, and agri-business",
        pros: ["Strong dividend yield", "Diversified revenue streams", "Market leadership in FMCG"],
        cons: ["Cigarette business regulatory risks", "ESG concerns", "Slow growth in core business"]
      },
      {
        symbol: "NIPPON_LARGE_CAP",
        name: "Nippon India Large Cap Fund",
        type: "mutual_fund",
        riskLevel: "medium",
        expectedReturn: 11.5,
        description: "Large-cap equity fund with focus on established companies with strong fundamentals",
        pros: ["Stable large-cap focus", "Experienced management", "Good risk-adjusted returns"],
        cons: ["Limited upside potential", "Market correlation", "Management fees"]
      },
      {
        symbol: "LIQUID_FUND",
        name: "Liquid Fund",
        type: "mutual_fund",
        riskLevel: "low",
        expectedReturn: 6.8,
        description: "Ultra-short term debt fund providing liquidity with better returns than savings account",
        pros: ["High liquidity", "Low risk", "Better than bank deposits"],
        cons: ["Low returns", "Interest rate risk", "Credit risk"]
      }
    ]
  ];
  
  // Return a random set
  return recommendationSets[Math.floor(Math.random() * recommendationSets.length)];
};
