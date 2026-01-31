import { useState } from 'react';
import { Mail, X } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion/react';

interface EmailPromptCardProps {
  onDismiss: () => void;
  onSubmitEmail: (email: string) => void;
  existingEmail?: string | null;
  error?: string | null;
}

export function EmailPromptCard({ onDismiss, onSubmitEmail, existingEmail, error }: EmailPromptCardProps) {
  const [email, setEmail] = useState(existingEmail || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(error || null);
  const isChangingEmail = !!existingEmail;
  const displayError = error || localError;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setLocalError(null);
    
    if (!email.includes('@')) {
      setLocalError('Please enter a valid email address');
      return;
    }

    if (email === existingEmail) {
      setLocalError('Please enter a different email address');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmitEmail(email);
      // Parent handles success/dismiss
    } catch (error) {
      // Error is handled by parent
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      className="relative border-2 border-black rounded-2xl p-8 shadow-xl"
      style={{ 
        fontFamily: 'Poppins, sans-serif',
        backgroundColor: 'rgba(128, 0, 32, 0.05)'
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Close button - only show when changing email */}
      {isChangingEmail && (
        <motion.button
          onClick={onDismiss}
          className="absolute top-4 right-4 p-2 rounded-xl transition-colors"
          style={{ 
            backgroundColor: 'rgba(128, 0, 32, 0.1)',
            color: '#800020'
          }}
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
        >
          <X className="w-5 h-5" />
        </motion.button>
      )}

      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl shadow-lg" style={{ backgroundColor: '#800020' }}>
            <Mail className="w-6 h-6 text-white" />
          </div>
          <h3 
            className="text-xl font-black"
            style={{
              color: '#000',
              textShadow: '1px 1px 0px rgba(128, 0, 32, 0.15)'
            }}
          >
            {isChangingEmail ? 'Update Your Email' : 'Get Price Drop Alerts'}
          </h3>
        </div>

        <p className="mb-6 font-medium" style={{ color: '#333' }}>
          {isChangingEmail 
            ? 'Enter a new email address to receive price drop notifications.'
            : 'Never miss a deal! Enter your email to receive instant notifications when prices drop on your tracked products.'
          }
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (displayError) setLocalError(null); // Clear error when typing
              }}
              placeholder="your@email.com"
              className={`flex-1 px-4 py-3 bg-white border-2 rounded-xl text-black placeholder:text-gray-400 focus:ring-4 font-medium transition-colors ${
                displayError ? 'border-red-500 focus:border-red-500' : 'border-black focus:border-black'
              }`}
              style={{ outlineColor: displayError ? 'rgba(239, 68, 68, 0.3)' : 'rgba(128, 0, 32, 0.2)' }}
              required
            />
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              style={{ backgroundColor: '#800020' }}
              whileHover={{ scale: 1.05, backgroundColor: '#5c0017' }}
              whileTap={{ scale: 0.95 }}
            >
              {isSubmitting ? 'Saving...' : (isChangingEmail ? 'Update Email' : 'Enable Alerts')}
            </motion.button>
          </div>
          {displayError && (
            <motion.p 
              className="text-sm font-semibold text-red-500"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {displayError}
            </motion.p>
          )}
        </form>
      </div>
    </motion.div>
  );
}
