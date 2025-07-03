import React from 'react';
import { AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { healthMonitor } from '../../lib/supabase';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  showStatus?: boolean;
  type?: 'default' | 'error' | 'warning';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  text, 
  showStatus = false,
  type = 'default'
}) => {
  const [connectionStatus, setConnectionStatus] = React.useState(
    healthMonitor.getConnectionStatus()
  );

  React.useEffect(() => {
    if (showStatus) {
      const interval = setInterval(() => {
        setConnectionStatus(healthMonitor.getConnectionStatus());
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [showStatus]);

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const getSpinnerColor = () => {
    switch (type) {
      case 'error':
        return 'border-red-500';
      case 'warning':
        return 'border-yellow-500';
      default:
        return 'border-blue-500';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'error':
        return <AlertCircle className={`${sizeClasses[size]} text-red-500`} />;
      case 'warning':
        return <AlertCircle className={`${sizeClasses[size]} text-yellow-500`} />;
      default:
        return (
          <div
            className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-gray-300 ${getSpinnerColor()} border-t-transparent`}
          />
        );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div className="flex items-center space-x-2">
        {getIcon()}
        {showStatus && (
          <div className="flex items-center space-x-1">
            {connectionStatus.isConnected ? (
              <Wifi className="h-4 w-4 text-green-500" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-500" />
            )}
          </div>
        )}
      </div>
      
      {text && (
        <p className={`${textSizeClasses[size]} text-gray-600 dark:text-gray-300 font-medium`}>
          {text}
        </p>
      )}
      
      {showStatus && (
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          <div>
            Status: {connectionStatus.isConnected ? 'Connected' : 'Disconnected'}
          </div>
          <div>
            Last check: {Math.round(connectionStatus.timeSinceLastCheck / 1000)}s ago
          </div>
        </div>
      )}
    </div>
  );
};

// Simple spinner for inline use
export const InlineSpinner: React.FC<{ size?: 'sm' | 'md' }> = ({ size = 'sm' }) => (
  <div
    className={`${size === 'sm' ? 'h-4 w-4' : 'h-6 w-6'} animate-spin rounded-full border-2 border-gray-300 border-t-blue-500`}
  />
);

// Full page loading overlay
export const FullPageLoader: React.FC<{ 
  text?: string; 
  showStatus?: boolean;
  canDismiss?: boolean;
  onDismiss?: () => void;
}> = ({ 
  text = 'Loading...', 
  showStatus = true,
  canDismiss = false,
  onDismiss
}) => (
  <div className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center">
    <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-sm w-full mx-4">
      <LoadingSpinner 
        size="lg" 
        text={text} 
        showStatus={showStatus}
      />
      
      {canDismiss && onDismiss && (
        <button
          onClick={onDismiss}
          className="mt-4 w-full px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
        >
          Continue anyway
        </button>
      )}
    </div>
  </div>
);

export default LoadingSpinner;
