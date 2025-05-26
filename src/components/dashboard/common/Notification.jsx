import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CircleCheck, AlertCircle } from 'lucide-react';

const Notification = ({ message, type, onClose }) => {
  const [visible, setVisible] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [onClose]);
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      onClick={() => {
        setVisible(false);
        setTimeout(onClose, 300);
      }}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : -20 }}
      transition={{ duration: 0.3 }}
      className={`fixed top-4 right-4 z-[9999] px-4 py-3 rounded-lg shadow-lg flex items-center ${
        type === 'success' ? 'bg-green-600' : 'bg-red-600'
      }`}
    >
      {type === 'success' ? <CircleCheck className="w-5 h-5 mr-2" /> : <AlertCircle className="w-5 h-5 mr-2" />}
      <span className="text-white">{message}</span>
    </motion.div>
  );
};

export default Notification;