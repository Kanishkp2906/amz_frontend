import { useState } from 'react';
import { Plus, Link as LinkIcon } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion/react';

interface AddProductFormProps {
  onAddProduct: (url: string) => void;
}

export function AddProductForm({ onAddProduct }: AddProductFormProps) {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateAmazonUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.includes('amazon.');
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      toast.error('Please enter an Amazon product URL');
      return;
    }

    if (!validateAmazonUrl(url)) {
      toast.error('Please enter a valid Amazon product URL');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      onAddProduct(url);
      setUrl('');
      setIsLoading(false);
    }, 500);
  };

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="bg-white border-2 border-black rounded-2xl p-8 max-w-3xl mx-auto shadow-xl"
      style={{ fontFamily: 'Poppins, sans-serif' }}
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <h2 
        className="text-3xl font-black mb-6"
        style={{
          color: '#000',
          textShadow: '2px 2px 0px rgba(128, 0, 32, 0.15)'
        }}
      >
        Track a New Product
      </h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="product-url" className="block text-sm font-bold mb-3 uppercase tracking-wide" style={{ color: '#333' }}>
            Amazon Product URL
          </label>
          <div className="relative group">
            <LinkIcon 
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors group-focus-within:text-black" 
              style={{ color: '#800020' }}
            />
            <input
              id="product-url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.amazon.com/product/..."
              className="w-full pl-12 pr-4 py-4 border-2 border-black rounded-xl text-black placeholder:text-gray-400 focus:ring-4 focus:border-black transition-all font-medium"
              style={{
                backgroundColor: 'rgba(128, 0, 32, 0.03)',
                outlineColor: 'rgba(128, 0, 32, 0.2)'
              }}
              required
            />
          </div>
        </div>

        <motion.button
          type="submit"
          disabled={isLoading}
          className="w-full text-white py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 font-bold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          style={{ backgroundColor: '#800020' }}
          whileHover={{ scale: 1.02, backgroundColor: '#5c0017' }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus className="w-5 h-5" />
          {isLoading ? 'Adding Product...' : 'Start Tracking'}
        </motion.button>
      </div>
    </motion.form>
  );
}
