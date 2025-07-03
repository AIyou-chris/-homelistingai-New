import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { healthMonitor } from '../../lib/supabase';
import { validateEnvironment, isDevelopment, debugLog } from '../../lib/utils';
import { WrenchScrewdriverIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface DevToolsProps {
  enabled?: boolean;
}

const DevTools: React.FC<DevToolsProps> = ({ enabled = isDevelopment() }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [envStatus, setEnvStatus] = useState(validateEnvironment());
  const { user, connectionStatus, forceHealthCheck } = useAuth();

  useEffect(() => {
    // Only show in development
    if (!enabled) return;

    // Log startup information
    debugLog('DevTools initialized', {
      environment: import.meta.env.MODE,
      user: user?.email,
      connectionStatus: connectionStatus.isConnected
    });
  }, [enabled, user, connectionStatus]);

  if (!enabled) return null;

  return (
    <>
      {/* Floating Dev Tools Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors"
        title="Open Dev Tools"
      >
        <WrenchScrewdriverIcon className="h-5 w-5" />
      </button>

      {/* Dev Tools Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <WrenchScrewdriverIcon className="h-5 w-5 mr-2" />
                Development Tools
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-6">
              {/* Environment Status */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                  Environment Status
                </h3>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Mode:</span>
                    <span className="text-sm font-mono bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                      {import.meta.env.MODE}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Environment Variables:</span>
                    <span className={`text-sm px-2 py-1 rounded ${
                      envStatus.isValid 
                        ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                        : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                    }`}>
                      {envStatus.isValid ? '✓ Valid' : '✗ Missing'}
                    </span>
                  </div>
                  {!envStatus.isValid && (
                    <div className="text-xs text-red-600 dark:text-red-400">
                      Missing: {envStatus.missingVars.join(', ')}
                    </div>
                  )}
                </div>
              </div>

              {/* Connection Status */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                  Connection Status
                </h3>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Supabase:</span>
                    <span className={`text-sm px-2 py-1 rounded ${
                      connectionStatus.isConnected 
                        ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                        : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                    }`}>
                      {connectionStatus.isConnected ? '🟢 Connected' : '🔴 Disconnected'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Last Check:</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {Math.round(connectionStatus.timeSinceLastCheck / 1000)}s ago
                    </span>
                  </div>
                  <button
                    onClick={forceHealthCheck}
                    className="w-full mt-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                  >
                    Test Connection
                  </button>
                </div>
              </div>

              {/* User Info */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                  Authentication
                </h3>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Status:</span>
                    <span className={`text-sm px-2 py-1 rounded ${
                      user 
                        ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                        : 'bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200'
                    }`}>
                      {user ? '✓ Authenticated' : '○ Anonymous'}
                    </span>
                  </div>
                  {user && (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-300">Email:</span>
                        <span className="text-sm font-mono text-gray-900 dark:text-white">
                          {user.email}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-300">User ID:</span>
                        <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
                          {user.id}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* System Info */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                  System Information
                </h3>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 space-y-1 text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">User Agent:</span>
                      <p className="font-mono text-gray-900 dark:text-white break-all">
                        {navigator.userAgent}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Online:</span>
                      <span className={navigator.onLine ? 'text-green-600' : 'text-red-600'}>
                        {navigator.onLine ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                  Debug Actions
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      console.clear();
                      debugLog('Console cleared by DevTools');
                    }}
                    className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded transition-colors"
                  >
                    Clear Console
                  </button>
                  <button
                    onClick={() => {
                      const data = {
                        environment: import.meta.env,
                        user,
                        connectionStatus,
                        timestamp: new Date().toISOString()
                      };
                      console.log('🔍 Debug Data Export:', data);
                      debugLog('Debug data exported to console');
                    }}
                    className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
                  >
                    Export Debug Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DevTools; 