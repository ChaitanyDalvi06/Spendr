/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {number} level
 * @property {number} xp
 * @property {number} coins
 * @property {number} totalSaved
 * @property {string} joinDate
 */

/**
 * @typedef {Object} Choice
 * @property {string} id
 * @property {string} text
 * @property {string} consequence
 * @property {{ money: number, xp: number, risk: 'low' | 'medium' | 'high' }} impact
 */

/**
 * @typedef {Object} GameScenario
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {'easy' | 'medium' | 'hard'} difficulty
 * @property {number} xpReward
 * @property {number} coinReward
 * @property {string} category
 * @property {boolean} completed
 * @property {boolean} locked
 * @property {Choice[]} choices
 */

/**
 * @typedef {Object} Stock
 * @property {string} symbol
 * @property {string} name
 * @property {number} price
 * @property {number} change
 * @property {number} changePercent
 * @property {number} volume
 */

/**
 * @typedef {Object} PortfolioStock
 * @property {string} symbol
 * @property {string} name
 * @property {number} shares
 * @property {number} avgPrice
 * @property {number} currentPrice
 * @property {number} totalValue
 * @property {number} gainLoss
 * @property {number} gainLossPercent
 */

/**
 * @typedef {Object} Portfolio
 * @property {PortfolioStock[]} stocks
 * @property {number} totalValue
 * @property {number} totalGainLoss
 * @property {number} totalGainLossPercent
 */

/**
 * @typedef {Object} BudgetCategory
 * @property {string} id
 * @property {string} name
 * @property {number} budget
 * @property {number} spent
 * @property {string} color
 * @property {string} icon
 */

/**
 * @typedef {Object} Transaction
 * @property {string} id
 * @property {string} description
 * @property {number} amount
 * @property {string} category
 * @property {string} date
 * @property {'income' | 'expense'} type
 */

/**
 * @typedef {Object} FinancialGoal
 * @property {string} id
 * @property {string} name
 * @property {number} targetAmount
 * @property {number} currentAmount
 * @property {string} deadline
 * @property {number} monthlyContribution
 * @property {'low' | 'medium' | 'high'} priority
 * @property {string} category
 * @property {string} [image]
 */

/**
 * @typedef {Object} Investment
 * @property {string} symbol
 * @property {string} name
 * @property {'stock' | 'etf' | 'crypto'} type
 * @property {'low' | 'medium' | 'high'} riskLevel
 * @property {number} expectedReturn
 * @property {string} description
 * @property {string[]} pros
 * @property {string[]} cons
 */
