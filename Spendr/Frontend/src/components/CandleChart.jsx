import React, { useEffect, useState } from 'react';
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
import { Line } from 'react-chartjs-2';
import axios from 'axios';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const CandleChart = ({ symbol }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [chartTitle, setChartTitle] = useState('');
  const [dataInfo, setDataInfo] = useState(null);

  useEffect(() => {
    if (symbol) {
      fetchChartData();
    }
  }, [symbol]);

  const fetchChartData = async () => {
    setLoading(true);
    setError('');
    
    try {
      console.log(`Fetching real-time chart data for ${symbol} from Alpha Vantage...`);
      const response = await axios.get(`http://localhost:3001/api/stocks/candles/${symbol}`);
      const responseData = response.data;
      
      console.log('Chart data response:', responseData);

      if (responseData && responseData.data && responseData.data.length > 0) {
        const data = responseData.data;
        
        const labels = data.map(item => 
          new Date(item.date).toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })
        );
        
        const prices = data.map(item => item.close);

        setChartData({
          labels: labels,
          datasets: [
            {
              label: `${symbol} Price (₹)`,
              data: prices,
              borderColor: responseData.isSimulated ? 'rgb(251, 191, 36)' : 'rgb(147, 51, 234)', // Yellow for simulated, Purple for real
              backgroundColor: responseData.isSimulated ? 'rgba(251, 191, 36, 0.1)' : 'rgba(147, 51, 234, 0.1)',
              borderWidth: 2,
              fill: true,
              tension: 0.1,
              pointRadius: 0,
              pointHoverRadius: 4,
            },
          ],
        });

        // Update chart title based on data source
        setChartTitle(`${symbol} - ${responseData.interval === 'daily' ? 'Daily' : '5 Minute'} Chart (${responseData.dataSource})`);
        setDataInfo({
          source: responseData.dataSource,
          interval: responseData.interval,
          isSimulated: responseData.isSimulated,
          note: responseData.note,
          lastUpdated: responseData.lastUpdated
        });
        
      } else {
        setError('No chart data available for this stock');
      }
    } catch (err) {
      console.error('Error fetching chart data:', err);
      if (err.response && err.response.status === 404) {
        setError(`Stock ${symbol} not found. Please try a different symbol.`);
      } else if (err.response && err.response.status === 503) {
        setError('Alpha Vantage API is temporarily unavailable. Please try again later.');
      } else {
        setError(`Failed to load chart data: ${err.response?.data?.message || err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'white',
          font: {
            size: 12
          }
        }
      },
      title: {
        display: true,
        text: chartTitle || `${symbol} - Live Chart (Alpha Vantage)`,
        color: 'white',
        font: {
          size: 16
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(147, 51, 234, 0.5)',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            return `Price: ₹${context.parsed.y.toFixed(2)}`;
          }
        }
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Time',
          color: 'white'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          maxTicksLimit: 10
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Price (₹)',
          color: 'white'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          callback: function(value) {
            return '₹' + value.toFixed(2);
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
    },
  };

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-2"></div>
          Loading chart data...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-64 flex items-center justify-center text-red-400">
        <div className="text-center">
          <p className="mb-2">{error}</p>
          <button 
            onClick={fetchChartData}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!chartData) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400">
        <div className="text-center">
          <p className="mb-2">Select a stock to view chart</p>
          {symbol && (
            <button 
              onClick={fetchChartData}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
            >
              Load Chart
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-400">
          {dataInfo ? (
            <div>
              <p>{dataInfo.note}</p>
              {dataInfo.isSimulated && (
                <p className="text-yellow-400">⚠ Simulated data - Market may be closed</p>
              )}
              <p className="text-xs mt-1">Source: {dataInfo.source}</p>
            </div>
          ) : (
            'Real-time Alpha Vantage data'
          )}
        </div>
        <button 
          onClick={fetchChartData}
          disabled={loading}
          className="px-3 py-1 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-all disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>
      <div className="h-64">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default CandleChart;
