// hooks/useToast.js
import { toast } from 'react-hot-toast';

const useToast = () => {
  const showToast = (message = 'Configura tu sistema primero') => {
    toast.success(message, {
      duration: 3000,
      position: 'top-center',
      style: {
        background: '#961C2C',
        color: '#fff',
        fontFamily: 'Bai Jamjuree, sans-serif',
        fontWeight: '500',
        padding: '16px 24px',
        borderRadius: '50px',
        boxShadow: '0 10px 30px rgba(150, 28, 44, 0.3)',
      },
      icon: '👆',
    });
  };

  return { showToast };
};

export default useToast;