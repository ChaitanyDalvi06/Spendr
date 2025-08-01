import React, { useState } from 'react';
import { 
  Store, 
  Coins, 
  Laptop, 
  Gift, 
  Shirt, 
  Star, 
  Check,
  AlertTriangle,
  Package,
  Coffee,
  Gamepad2,
  Headphones
} from 'lucide-react';

const StorePage = ({ user, onPurchase }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const categories = [
    { id: 'all', label: 'All Items', icon: Store },
    { id: 'electronics', label: 'Electronics', icon: Laptop },
    { id: 'merchandise', label: 'Spendr Merch', icon: Shirt },
    { id: 'coupons', label: 'Coupons', icon: Gift },
  ];

  const storeItems = [
    // Electronics
    {
      id: 'laptop',
      name: 'Gaming Laptop',
      description: 'High-performance gaming laptop perfect for students and gaming enthusiasts',
      price: 15000,
      category: 'electronics',
      image: '💻',
      availability: 'limited',
      discount: null
    },
    {
      id: 'headphones',
      name: 'Wireless Headphones',
      description: 'Premium noise-canceling wireless headphones',
      price: 3500,
      category: 'electronics',
      image: '🎧',
      availability: 'in-stock',
      discount: 20
    },
    {
      id: 'tablet',
      name: 'Tablet',
      description: 'Perfect for studying and entertainment',
      price: 8000,
      category: 'electronics',
      image: '📱',
      availability: 'in-stock',
      discount: null
    },
    
    // Spendr Merchandise
    {
      id: 'hoodie',
      name: 'Spendr Hoodie',
      description: 'Official Spendr branded hoodie - comfortable and stylish',
      price: 1200,
      category: 'merchandise',
      image: '👕',
      availability: 'in-stock',
      discount: null
    },
    {
      id: 'mug',
      name: 'Spendr Coffee Mug',
      description: 'Start your day with Spendr motivation',
      price: 300,
      category: 'merchandise',
      image: '☕',
      availability: 'in-stock',
      discount: null
    },
    {
      id: 'tshirt',
      name: 'Spendr T-Shirt',
      description: 'Classic Spendr logo t-shirt',
      price: 800,
      category: 'merchandise',
      image: '👕',
      availability: 'in-stock',
      discount: 15
    },
    
    // Coupons
    {
      id: 'amazon-50',
      name: 'Amazon Gift Card',
      description: '₹50 Amazon gift card for online shopping',
      price: 5000,
      category: 'coupons',
      image: '🎁',
      availability: 'in-stock',
      discount: null
    },
    {
      id: 'netflix',
      name: 'Netflix 3-Month Subscription',
      description: '3 months of Netflix premium subscription',
      price: 2500,
      category: 'coupons',
      image: '🎬',
      availability: 'in-stock',
      discount: null
    },
    {
      id: 'spotify',
      name: 'Spotify Premium (6 months)',
      description: '6 months of ad-free music streaming',
      price: 1500,
      category: 'coupons',
      image: '🎵',
      availability: 'in-stock',
      discount: 10
    }
  ];

  const filteredItems = selectedCategory === 'all' 
    ? storeItems 
    : storeItems.filter(item => item.category === selectedCategory);

  const getDiscountedPrice = (item) => {
    if (!item.discount) return item.price;
    return Math.floor(item.price * (1 - item.discount / 100));
  };

  const canAfford = (item) => {
    const price = getDiscountedPrice(item);
    return (user?.coins || 0) >= price;
  };

  const handlePurchase = (item) => {
    setSelectedItem(item);
    setShowConfirmModal(true);
  };

  const confirmPurchase = () => {
    if (selectedItem && onPurchase) {
      const price = getDiscountedPrice(selectedItem);
      onPurchase(selectedItem, price);
    }
    setShowConfirmModal(false);
    setSelectedItem(null);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Store className="w-8 h-8 text-purple-400" />
            <h1 className="text-3xl sm:text-4xl font-bold text-white">
              Spendr Store
            </h1>
          </div>
          <p className="text-gray-400 text-lg">
            Exchange your earned coins for amazing rewards!
          </p>
          <div className="flex items-center justify-center gap-2 mt-4 bg-gray-900 rounded-lg px-6 py-3 w-fit mx-auto">
            <Coins className="w-5 h-5 text-yellow-500" />
            <span className="text-xl font-bold text-white">
              {typeof user?.coins === 'number' ? user.coins : parseInt(user?.coins) || 0}
            </span>
            <span className="text-gray-400">coins available</span>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                selectedCategory === category.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <category.icon className="w-4 h-4" />
              {category.label}
            </button>
          ))}
        </div>

        {/* Store Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => {
            const discountedPrice = getDiscountedPrice(item);
            const affordable = canAfford(item);
            
            return (
              <div 
                key={item.id}
                className={`bg-gray-900 border rounded-xl p-6 transition-all duration-300 ${
                  affordable 
                    ? 'border-gray-700 hover:border-purple-500 hover:shadow-xl' 
                    : 'border-gray-800 opacity-75'
                }`}
              >
                {/* Item Image & Availability */}
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl">{item.image}</div>
                  <div className="flex flex-col items-end gap-2">
                    {item.availability === 'limited' && (
                      <span className="bg-orange-500/20 text-orange-400 px-2 py-1 rounded text-xs font-medium">
                        Limited
                      </span>
                    )}
                    {item.discount && (
                      <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs font-medium">
                        -{item.discount}% OFF
                      </span>
                    )}
                  </div>
                </div>

                {/* Item Info */}
                <h3 className="text-xl font-bold text-white mb-2">{item.name}</h3>
                <p className="text-gray-400 mb-4 text-sm leading-relaxed">{item.description}</p>

                {/* Pricing */}
                <div className="flex items-center gap-2 mb-4">
                  <Coins className="w-4 h-4 text-yellow-500" />
                  <div className="flex items-center gap-2">
                    {item.discount ? (
                      <>
                        <span className="text-lg font-bold text-white">{discountedPrice}</span>
                        <span className="text-sm text-gray-500 line-through">{item.price}</span>
                      </>
                    ) : (
                      <span className="text-lg font-bold text-white">{item.price}</span>
                    )}
                  </div>
                </div>

                {/* Purchase Button */}
                <button
                  onClick={() => handlePurchase(item)}
                  disabled={!affordable}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                    affordable
                      ? 'bg-purple-600 hover:bg-purple-700 text-white'
                      : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {affordable ? (
                    <>
                      <Package className="w-4 h-4" />
                      Purchase
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4" />
                      Not Enough Coins
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Confirmation Modal */}
        {showConfirmModal && selectedItem && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-white mb-4">Confirm Purchase</h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="text-3xl">{selectedItem.image}</div>
                <div>
                  <h4 className="font-medium text-white">{selectedItem.name}</h4>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Coins className="w-4 h-4" />
                    <span>{getDiscountedPrice(selectedItem)} coins</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-400 mb-6 text-sm">
                Are you sure you want to purchase this item? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 py-2 px-4 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmPurchase}
                  className="flex-1 py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StorePage;
