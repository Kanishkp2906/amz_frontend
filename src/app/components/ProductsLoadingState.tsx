import { motion } from 'motion/react';
import { Package, Search, TrendingDown } from 'lucide-react';

export function ProductsLoadingState() {
  return (
    <div className="relative z-10 max-w-6xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <motion.h2 
          className="text-4xl font-black mb-2"
          style={{
            color: '#000',
            textShadow: '2px 2px 0px rgba(128, 0, 32, 0.15)'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Loading Your Products
        </motion.h2>
        <motion.p 
          className="text-lg font-medium"
          style={{ color: '#666' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Fetching your tracked Amazon products...
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="bg-white border-2 border-black rounded-2xl p-8 shadow-lg"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15, duration: 0.5 }}
          >
            <div className="flex flex-col items-center">
              <motion.div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 border-2 border-black"
                style={{ backgroundColor: 'rgba(128, 0, 32, 0.1)' }}
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.3,
                }}
              >
                {index === 0 && <Package className="w-8 h-8" style={{ color: '#800020' }} />}
                {index === 1 && <Search className="w-8 h-8" style={{ color: '#800020' }} />}
                {index === 2 && <TrendingDown className="w-8 h-8" style={{ color: '#800020' }} />}
              </motion.div>
              
              <div className="space-y-3 w-full">
                <motion.div 
                  className="h-4 rounded-full mx-auto"
                  style={{ backgroundColor: 'rgba(128, 0, 32, 0.2)', width: '80%' }}
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: index * 0.2,
                  }}
                />
                <motion.div 
                  className="h-3 rounded-full mx-auto"
                  style={{ backgroundColor: 'rgba(128, 0, 32, 0.15)', width: '60%' }}
                  animate={{
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: index * 0.2 + 0.1,
                  }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Animated progress dots */}
      <div className="flex justify-center gap-3 mt-12">
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="w-3 h-3 rounded-full border-2 border-black"
            style={{ backgroundColor: '#800020' }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.15,
            }}
          />
        ))}
      </div>
    </div>
  );
}
