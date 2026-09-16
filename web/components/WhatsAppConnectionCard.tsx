'use client';

import React, { useState, useEffect } from 'react';
import { AlertCircle, RotateCcw, Wifi, WifiOff } from 'lucide-react';

interface ConnectionStatus {
  status: 'connected' | 'disconnected' | 'connecting' | 'error';
  lastError?: string;
}

export default function WhatsAppConnectionCard() {
  const [status, setStatus] = useState<ConnectionStatus>({ status: 'disconnected' });
  const [restarting, setRestarting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/status');
      const data = await response.json();
      if (data.success) setStatus(data.whatsapp);
    } catch (error) {
      console.error('Failed to fetch status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestart = async () => {
    setRestarting(true);
    try {
      const response = await fetch('/api/restart/whatsapp', { method: 'POST' });
      const data = await response.json();
      if (data.success) {
        setStatus({ status: 'connecting' });
        setTimeout(fetchStatus, 3000);
      } else {
        setStatus({ status: 'error', lastError: data.error });
      }
    } catch (error) {
      setStatus({ status: 'error', lastError: String(error) });
    } finally {
      setRestarting(false);
    }
  };

  const getStatusDisplay = () => {
    const statusStyles = {
      connected: {
        icon: Wifi,
        color: 'text-green-500',
        bg: 'bg-green-50 dark:bg-green-900/20',
        label: 'Connected',
        description: 'Gateway is active and ready'
      },
      disconnected: {
        icon: WifiOff,
        color: 'text-gray-500',
        bg: 'bg-gray-50 dark:bg-gray-800',
        label: 'Disconnected',
        description: 'Restart the gateway to trigger a new pairing attempt'
      },
      connecting: {
        icon: RotateCcw,
        color: 'text-blue-500',
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        label: 'Connecting',
        description: 'Attempting to reconnect...'
      },
      error: {
        icon: AlertCircle,
        color: 'text-red-500',
        bg: 'bg-red-50 dark:bg-red-900/20',
        label: 'Error',
        description: status.lastError || 'Connection error'
      }
    };
    return statusStyles[status.status];
  };

  const display = getStatusDisplay();
  const Icon = display.icon;

  return (
    <div className={`rounded-lg p-6 ${display.bg} border border-gray-200 dark:border-gray-700`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
            <Icon className={`w-5 h-5 ${display.color}`} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">WhatsApp Connection</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Baileys Gateway</p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${display.color}`}>
          {display.label}
        </div>
      </div>

      <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">{display.description}</p>

      <button
        onClick={handleRestart}
        disabled={restarting || status.status === 'connecting'}
        className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
          restarting || status.status === 'connecting'
            ? 'bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        <RotateCcw className={`w-4 h-4 ${restarting ? 'animate-spin' : ''}`} />
        {restarting ? 'Restarting...' : 'Restart Gateway'}
      </button>

      {status.status === 'error' && status.lastError && (
        <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 rounded border border-red-200 dark:border-red-800">
          <p className="text-xs font-medium text-red-700 dark:text-red-400">Error:</p>
          <p className="text-xs text-red-600 dark:text-red-300 mt-1 break-words">{status.lastError}</p>
        </div>
      )}
    </div>
  );
}
