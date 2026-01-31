import { Loader2, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export function LoadingCard() {
  return (
    <motion.div 
      className="bg-white border-2 border-black rounded-2xl p-8 max-w-3xl mx-auto shadow-xl"
      style={{ fontFamily: 'Poppins, sans-serif' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="flex flex-col items-center justify-center py-8">
        <motion.div 
          className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 border-2 border-black"
          style={{ backgroundColor: 'rgba(128, 0, 32, 0.1)' }}
          animate={{ 
            rotate: [0, 360],
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <Loader2 className="w-10 h-10" style={{ color: '#800020' }} />
        </motion.div>
        
        <h3 
          className="text-2xl font-black mb-3"
          style={{
            color: '#000',
            textShadow: '2px 2px 0px rgba(128, 0, 32, 0.15)'
          }}
        >
          Tracking Product...
        </h3>
        
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4" style={{ color: '#800020' }} />
          <p className="text-lg font-semibold" style={{ color: '#333' }}>
            This might take a few seconds
          </p>
          <Sparkles className="w-4 h-4" style={{ color: '#800020' }} />
        </div>
        
        <p className="text-sm font-medium" style={{ color: '#666' }}>
          We're extracting product details and pricing information
        </p>
        
        <div className="mt-6 flex gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 rounded-full border-2 border-black"
              style={{ backgroundColor: '#800020' }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
