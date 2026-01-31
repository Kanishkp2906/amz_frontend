import { TrendingDown, TrendingUp, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';

export interface TrackedProduct {
  id: string;
  name: string;
  url: string;
  currentPrice: number;
  initialPrice: number;
  imageUrl: string;
  lastChecked: Date;
}

interface ProductCardProps {
  product: TrackedProduct;
  onDelete: (id: string) => void;
}

export function ProductCard({ product, onDelete }: ProductCardProps) {
  const priceChange = product.currentPrice - product.initialPrice;
  const priceChangePercent = ((priceChange / product.initialPrice) * 100).toFixed(1);
  const isPriceDown = priceChange < 0;

  return (
    <motion.div 
      className="bg-white border-2 border-black rounded-2xl overflow-hidden hover:border-black transition-all hover:shadow-xl group"
      style={{ fontFamily: 'Poppins, sans-serif' }}
      whileHover={{ scale: 1.01, y: -2 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="flex flex-col sm:flex-row">
        <div className="sm:w-48 h-48 flex-shrink-0 overflow-hidden relative" style={{ backgroundColor: 'rgba(128, 0, 32, 0.05)' }}>
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>
        
        <div className="flex-1 p-6">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-2 line-clamp-2 text-black">
                {product.name}
              </h3>
              
              <a
                href={product.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm transition-colors mb-4 block truncate font-semibold hover:underline"
                style={{ color: '#800020' }}
              >
                View on Amazon →
              </a>

              <div className="flex flex-wrap items-center gap-6 mb-4">
                <div>
                  <div className="text-xs mb-1 font-semibold uppercase tracking-wide" style={{ color: '#666' }}>Current Price</div>
                  <div 
                    className="text-3xl font-black"
                    style={{
                      color: '#000',
                      textShadow: '1px 1px 0px rgba(128, 0, 32, 0.15)'
                    }}
                  >
                    ₹{product.currentPrice.toFixed(2)}
                  </div>
                </div>
                
                <div>
                  <div className="text-xs mb-1 font-semibold uppercase tracking-wide" style={{ color: '#666' }}>Initial Price</div>
                  <div className="text-xl font-bold line-through" style={{ color: '#999' }}>
                    ₹{product.initialPrice.toFixed(2)}
                  </div>
                </div>

                {priceChange !== 0 && (
                  <motion.div 
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl shadow-md text-white`}
                    style={{ 
                      backgroundColor: isPriceDown ? '#800020' : '#000'
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500 }}
                  >
                    {isPriceDown ? (
                      <TrendingDown className="w-5 h-5" />
                    ) : (
                      <TrendingUp className="w-5 h-5" />
                    )}
                    <span className="font-black text-sm">
                      {isPriceDown ? '' : '+'}₹{Math.abs(priceChange).toFixed(2)} ({isPriceDown ? '' : '+'}{priceChangePercent}%)
                    </span>
                  </motion.div>
                )}
              </div>

              <div className="text-xs font-semibold" style={{ color: '#999' }}>
                Last checked: {new Date(product.lastChecked).toLocaleString()}
              </div>
            </div>

            <motion.button
              onClick={() => onDelete(product.id)}
              className="p-3 rounded-xl text-white transition-all border-2 border-black"
              style={{ backgroundColor: '#000' }}
              title="Delete"
              whileHover={{ scale: 1.1, rotate: 5, backgroundColor: '#800020' }}
              whileTap={{ scale: 0.9 }}
            >
              <Trash2 className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
