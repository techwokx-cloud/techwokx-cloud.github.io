'use client';

import React, { useState, useEffect } from 'react';
import { AlertCircle, RotateCcw, XCircle } from 'lucide-react';

interface BotConnectionStatus {
  status: 'connected' | 'disconnected' | 'connecting' | 'error';
  lastError?: string;
}

export default function BotConnectionCard() {
  const [status, setStatus] = useState<BotConnectionStatus>({ status: 'disconnected' });
  const [restarting, setRestarting] = useState(false);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/status');
      const data = await response.json();
      if (data.success) setStatus(data.bot);
    } catch (error) {
      console.error('Failed to fetch bot status:', error);
      setStatus({ status: 'error', lastError: String(error) });
    }
  };

  const handleRestart = async () => {
    setRestarting(true);
    try {
      const response = await fetch('/api/restart/bot', { method: 'POST' });
      const data = await response.json();
      if (data.success) {
        setStatus({ status: 'connecting' });
        setTimeout(fetchStatus, 2000);
      } else {
        setStatus({ status: 'error', lastError: data.error });
      }
    } catch (error) {
      setStatus({ status: 'error', lastError: String(error) });
    } finally {
      setRestarting(false);
    }
  };

  const isConnected = status.status === 'connected';
  const isConnecting = status.status === 'connecting';
  const isError = status.status === 'error';

  return (
    <div className="rounded-lg border border-gray-700 p-6 bg-gray-900/50 backdrop-blur">
      <h3 className="text-lg font-semibold text-white mb-4">Bot Connection</h3>

      <div className="flex items-center gap-3 mb-6">
        {isConnected ? (
          <>
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-green-500 font-medium">Connected</span>
          </>
        ) : isConnecting ? (
          <>
            <div className="w-3 h-3 rounded-full bg-blue-500 animate-spin"></div>
            <span className="text-blue-500 font-medium">Connecting...</span>
          </>
        ) : isError ? (
          <>
            <XCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-500 font-medium">Error</span>
          </>
        ) : (
          <>
            <XCircle className="w-5 h-5 text-red-500" />
            <span className="text-red-500 font-medium">Disconnected</span>
          </>
        )}
      </div>

      <p className="text-sm text-gray-400 mb-6">
        {isConnected
          ? 'Bot is ready for orders'
          : isConnecting
          ? 'Reconnecting...'
          : isError
          ? 'Bot error. Please restart.'
          : 'Conversation and order notifications depend on bot connection.'}
      </p>

      {isError && status.lastError && (
        <div className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded">
          <p className="text-xs font-semibold text-red-400 mb-2">Error:</p>
          <p className="text-xs text-red-300 break-words">{status.lastError}</p>
        </div>
      )}

      <button
        onClick={handleRestart}
        disabled={restarting || isConnecting}
        className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
          restarting || isConnecting
            ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
            : isConnected
            ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
            : 'bg-red-600 hover:bg-red-700 text-white'
        }`}
      >
        <RotateCcw className={`w-4 h-4 ${restarting ? 'animate-spin' : ''}`} />
        {restarting ? 'Restarting...' : isConnected ? 'Reconnect' : 'Restart Bot'}
      </button>

      <div className="mt-4 p-3 bg-yellow-900/30 border border-yellow-700/50 rounded">
        <p className="text-xs text-yellow-400">
          <strong>Note:</strong> May take 10-30 seconds to reconnect.
        </p>
      </div>
    </div>
  );
}
