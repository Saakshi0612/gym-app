import React from "react";
import { FaCheck, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

interface SuccessAlertProps {
  message: string;
  onClose: () => void;
  type?: 'success' | 'error';
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1]
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

const iconVariants = {
  hidden: { scale: 0, rotate: -180 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
      delay: 0.1
    }
  }
};

const contentVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
      delay: 0.2
    }
  }
};

const buttonVariants = {
  hover: {
    scale: 1.1,
    transition: {
      duration: 0.2,
      ease: [0.22, 1, 0.36, 1]
    }
  },
  tap: {
    scale: 0.95
  }
};

const SuccessAlert: React.FC<SuccessAlertProps> = ({ message, onClose, type = 'success' }) => {
  const isSuccess = type === 'success';

  const colorClasses = isSuccess
    ? {
        bg: 'bg-green-50',
        border: 'border-green-200',
        iconBg: 'bg-green-500',
        text: 'text-green-800',
        subText: 'text-green-700',
        button: 'text-green-500 hover:bg-green-100',
        icon: <FaCheck className="text-white text-xs" />,
        dismissIcon: <FaCheck className="h-4 w-4" />,
        heading: 'Success',
      }
    : {
        bg: 'bg-red-50',
        border: 'border-red-200',
        iconBg: 'bg-red-500',
        text: 'text-red-800',
        subText: 'text-red-700',
        button: 'text-red-500 hover:bg-red-100',
        icon: <FaTimes className="text-white text-xs" />,
        dismissIcon: <FaTimes className="h-4 w-4" />,
        heading: 'Error',
      };

  return (
    <motion.div 
      className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full p-2 max-w-md"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className={`${colorClasses.bg} ${colorClasses.border} rounded-md p-4 relative shadow-lg`}>
        <div className="flex items-start">
          <motion.div 
            className="flex-shrink-0"
            variants={iconVariants}
          >
            <div className={`w-5 h-5 ${colorClasses.iconBg} rounded-full flex items-center justify-center`}>
              {colorClasses.icon}
            </div>
          </motion.div>
          <motion.div 
            className="ml-3"
            variants={contentVariants}
          >
            <h3 className={`text-sm font-medium ${colorClasses.text}`}>{colorClasses.heading}</h3>
            <div className={`mt-1 text-sm ${colorClasses.subText}`}>
              {message}
            </div>
          </motion.div>
          <motion.button
            type="button"
            className={`ml-auto -mx-1.5 -my-1.5 ${colorClasses.bg} ${colorClasses.button} rounded-lg p-1.5`}
            onClick={onClose}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <span className="sr-only">Dismiss</span>
            {colorClasses.dismissIcon}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default SuccessAlert;
