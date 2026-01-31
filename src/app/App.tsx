import { useState, useEffect } from 'react';
import { TrendingDown, Eye, Bell, Target, Loader2, Mail, Settings } from 'lucide-react'; // Added icons
import { Toaster, toast } from 'sonner'; // Added toast for notifications
import { motion } from 'motion/react';
import { AddProductForm } from '@/app/components/AddProductForm';
import { ProductCard, TrackedProduct } from '@/app/components/ProductCard';
import { EmailPromptCard } from '@/app/components/EmailPromptCard';
import { LoadingCard } from '@/app/components/LoadingCard';
import { ProductsLoadingState } from '@/app/components/ProductsLoadingState';
import { Logo } from '@/app/components/Logo';

// 1. Import our Remote Control functions
import { fetchProducts, trackProduct, deleteProduct, submitEmail } from '../api';

function App() {
  const [products, setProducts] = useState<TrackedProduct[]>([]);
  const [showEmailPrompt, setShowEmailPrompt] = useState(false); // Default false until we check
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // New loading state
  const [isScraping, setIsScraping] = useState(false); // Scraping state for loading card
  const [emailError, setEmailError] = useState<string | null>(null); // Email submission error

  // 2. Helper to convert Backend Data -> Frontend Format
  // Backend sends snake_case (current_price), Frontend wants camelCase (currentPrice)
  const mapBackendToFrontend = (data: any): TrackedProduct => {
    // Check if we are receiving the 'Tracking' object (which has a nested 'product')
    // or just the product data directly.
    const productData = data.product || data; 
    
    return {
      id: productData.id.toString(), // Store Product ID for deletion
      name: productData.title,
      url: productData.amazon_url,
      currentPrice: parseFloat(productData.current_price) || 0,
      initialPrice: parseFloat(data.initial_price) || parseFloat(productData.current_price) || 0, // Tracking object has initial_price
      imageUrl: productData.image_url || "https://placehold.co/400x400?text=No+Image",
      lastChecked: new Date(productData.last_checked || Date.now())
    };
  };

  // 3. Load Real Products on Mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchProducts();
        
        // Map the list from backend to frontend format
        const formattedProducts = data.map(mapBackendToFrontend);
        setProducts(formattedProducts);
        
        // Check if user has email saved
        const savedEmail = localStorage.getItem('userEmail');
        
        if (savedEmail) {
          setUserEmail(savedEmail);
          setShowEmailPrompt(false);
        } else if (formattedProducts.length > 0) {
          // Show email prompt if user has products but no email
          setShowEmailPrompt(true);
        }
        
      } catch (error) {
        console.error("Failed to load products", error);
        toast.error("Could not connect to server. Is the backend running?");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // 4. REAL Add Product Logic
  const handleAddProduct = async (url: string) => {
    try {
      setIsScraping(true);
      
      const newTrackingData = await trackProduct(url);
      
      const newProduct = mapBackendToFrontend(newTrackingData);
      setProducts(prev => [newProduct, ...prev]);
      
      toast.success("Product tracked successfully!");
      
    } catch (error: any) {
      console.error("Add failed", error);
      // Show specific error messages from backend (like "Already tracking")
      const msg = error.response?.data?.detail || "Failed to track product.";
      toast.error(msg);
    } finally {
      setIsScraping(false);
    }
  };

  // 5. REAL Delete Logic
  const handleDeleteProduct = async (id: string) => {
    try {
      // Optimistic Update: Remove immediately for snappy feel
      const originalProducts = [...products];
      setProducts(products.filter(p => p.id !== id));
      
      await deleteProduct(id);
      toast.success("Stopped tracking product.");
      
    } catch (error) {
      console.error("Delete failed", error);
      toast.error("Failed to delete. Refreshing...");
      // Revert if failed
      const data = await fetchProducts();
      setProducts(data.map(mapBackendToFrontend));
    }
  };

  // 6. REAL Email Logic
  const handleSubmitEmail = async (email: string) => {
    try {
      setEmailError(null); // Clear previous error
      await submitEmail(email);
      setUserEmail(email);
      localStorage.setItem('userEmail', email); // Remember locally too
      setShowEmailPrompt(false); // Only dismiss on success
      setEmailError(null);
      toast.success("Email saved! You'll get alerts now.");
    } catch (error: any) {
      console.error("Email failed", error);
      const errorMsg = error.response?.data?.detail || "Failed to save email. Please try again.";
      setEmailError(errorMsg); // Set error for display in the card
      // Don't dismiss the popup - let user try again
      setShowEmailPrompt(true);
    }
  };

  const handleDismissEmailPrompt = () => {
    // Only allow dismiss if user already has an email (changing email scenario)
    // If no email, force them to enter one
    if (userEmail) {
      setShowEmailPrompt(false);
      setEmailError(null); // Clear error when dismissing
    }
  };

  return (
    <div className="relative min-h-screen bg-white overflow-hidden" style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Animated background pattern for entire page */}
      <motion.div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          opacity: 0.06,
          backgroundImage: `repeating-linear-gradient(
            45deg,
            #800020 0px,
            #800020 1px,
            transparent 1px,
            transparent 30px
          )`
        }}
        animate={{
          backgroundPosition: ['0px 0px', '30px 30px'],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      <Toaster position="top-right" theme="light" />
      
      {/* Header/Navigation with Logo */}
      <header className="relative z-20 bg-white border-b-2 border-black py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3"
            >
              <Logo size={48} />
              <span 
                className="text-xl font-black hidden sm:block"
                style={{ color: '#000' }}
              >
                Price<span style={{ color: '#800020' }}>Tracker</span>
              </span>
            </motion.div>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <div className="relative z-10 overflow-hidden border-b-4 border-black" style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)' }}>
        <div className="container mx-auto px-4 py-16 sm:py-24 relative z-10">
          <motion.div 
            className="max-w-5xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1 
              className="text-6xl sm:text-7xl lg:text-8xl font-black mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              style={{
                color: '#000',
                textShadow: '3px 3px 0px rgba(128, 0, 32, 0.15)'
              }}
            >
              Amazon Price
              <span className="block" style={{ color: '#800020' }}>Tracker</span>
            </motion.h1>

            <motion.p 
              className="text-xl sm:text-2xl mb-12 max-w-3xl mx-auto font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              style={{ color: '#333' }}
            >
              Never overpay again. Track Amazon prices in real-time and get notified the moment they drop.
            </motion.p>
            
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              {/* Feature Cards (Unchanged) */}
              <motion.div 
                className="bg-white border-2 border-black rounded-2xl p-8 hover:border-black transition-all shadow-sm hover:shadow-xl hover:-translate-y-1"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-black rounded-2xl flex items-center justify-center shadow-lg">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-black">Real-Time Monitoring</h3>
                <p className="text-sm font-medium" style={{ color: '#666' }}>
                  Continuous price tracking with instant updates
                </p>
              </motion.div>
              
              <motion.div 
                className="border-2 rounded-2xl p-8 hover:border-black transition-all shadow-sm hover:shadow-xl hover:-translate-y-1"
                style={{ 
                  backgroundColor: 'rgba(128, 0, 32, 0.05)',
                  borderColor: '#800020'
                }}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center shadow-lg" style={{ backgroundColor: '#800020' }}>
                  <Bell className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-black">Instant Alerts</h3>
                <p className="text-sm font-medium" style={{ color: '#666' }}>
                  Get notified immediately when prices drop
                </p>
              </motion.div>
              
              <motion.div 
                className="bg-white border-2 border-black rounded-2xl p-8 hover:border-black transition-all shadow-sm hover:shadow-xl hover:-translate-y-1"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-black rounded-2xl flex items-center justify-center shadow-lg">
                  <Eye className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-black">Price History</h3>
                <p className="text-sm font-medium" style={{ color: '#666' }}>
                  Monitor and analyze price trends over time
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Add Product Section */}
      <motion.div 
        className="relative z-10 container mx-auto px-4 py-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.9 }}
      >
        <AddProductForm onAddProduct={handleAddProduct} />
      </motion.div>

      {/* Scraping Loading Card */}
      {isScraping && (
        <motion.div 
          className="relative z-10 container mx-auto px-4 pb-12"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          <LoadingCard />
        </motion.div>
      )}

      {/* Email Prompt Card */}
      {showEmailPrompt && products.length > 0 && (
        <motion.div 
          className="relative z-10 container mx-auto px-4 pb-12"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-3xl mx-auto">
            <EmailPromptCard 
              onDismiss={handleDismissEmailPrompt}
              onSubmitEmail={handleSubmitEmail}
              existingEmail={userEmail}
              error={emailError}
            />
          </div>
        </motion.div>
      )}

      {/* Tracked Products Section */}
      {/* LOADING STATE */}
      {isLoading ? (
        <ProductsLoadingState />
      ) : (
        <>
            {products.length > 0 && (
            <motion.div 
            className="relative z-10 container mx-auto px-4 pb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            >
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <h2 
                    className="text-4xl font-black"
                    style={{
                    color: '#000',
                    textShadow: '2px 2px 0px rgba(128, 0, 32, 0.15)'
                    }}
                >
                    Your Tracked Products
                </h2>
                <div className="flex items-center gap-3">
                  {userEmail && (
                    <motion.button
                      onClick={() => setShowEmailPrompt(true)}
                      className="flex items-center gap-2 px-4 py-2 border-2 border-black rounded-full font-bold text-sm transition-all hover:shadow-md"
                      style={{ backgroundColor: 'white' }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      title="Change Email"
                    >
                      <Mail className="w-4 h-4" style={{ color: '#800020' }} />
                      <span style={{ color: '#333' }}>Change Email</span>
                    </motion.button>
                  )}
                  <span className="text-white px-5 py-2 rounded-full font-bold shadow-lg" style={{ backgroundColor: '#800020' }}>
                    {products.length} {products.length === 1 ? 'product' : 'products'}
                  </span>
                </div>
                </div>
                
                <div className="space-y-4">
                {products.map((product, index) => (
                    <motion.div
                    key={product.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                    <ProductCard
                        product={product}
                        onDelete={handleDeleteProduct}
                    />
                    </motion.div>
                ))}
                </div>
            </div>
            </motion.div>
        )}

        {products.length === 0 && (
            <motion.div 
            className="relative z-10 container mx-auto px-4 pb-16"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            >
            <div className="max-w-2xl mx-auto text-center">
                <div className="bg-white/95 border-2 border-black rounded-2xl p-16 shadow-lg backdrop-blur-sm">
                <motion.div 
                    className="w-24 h-24 mx-auto mb-6 rounded-2xl flex items-center justify-center border-2"
                    style={{ 
                    backgroundColor: 'rgba(128, 0, 32, 0.1)',
                    borderColor: '#800020'
                    }}
                    animate={{ 
                    rotate: [0, 5, -5, 0],
                    }}
                    transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                    }}
                >
                    <TrendingDown className="w-12 h-12" style={{ color: '#800020' }} />
                </motion.div>
                <h3 className="text-3xl font-bold mb-3 text-black">No products tracked yet</h3>
                <p className="font-medium text-lg" style={{ color: '#666' }}>
                    Add your first Amazon product link above to start tracking prices!
                </p>
                </div>
            </div>
            </motion.div>
        )}
        </>
      )}

      {/* Footer */}
      <footer className="relative z-10 border-t-4 border-black py-8 mt-16 bg-white/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center">
          <p className="font-semibold" style={{ color: '#666' }}>
            © 2026 Amazon Price Tracker. Track smarter, save more.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;