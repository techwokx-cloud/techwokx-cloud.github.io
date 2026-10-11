'use client';

import React, { useState } from 'react';
import { X, Upload, FileText, Sheet3, Facebook, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface ImportResult {
  success: boolean;
  message: string;
  imported?: number;
  errors?: string[];
}

interface LeadsImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: (count: number) => void;
}

export default function LeadsImportModal({ isOpen, onClose, onImportSuccess }: LeadsImportModalProps) {
  const [activeTab, setActiveTab] = useState<'csv' | 'sheets' | 'facebook'>('csv');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);

  if (!isOpen) return null;

  // CSV/Excel Import Handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/leads/import-csv', {
        method: 'POST',
        headers: {
          'x-admin-token': localStorage.getItem('dashboard_token') || '',
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setResult({
          success: true,
          message: `Successfully imported ${data.imported} leads`,
          imported: data.imported,
        });
        onImportSuccess(data.imported);
      } else {
        setResult({
          success: false,
          message: data.error || 'Import failed',
          errors: data.errors,
        });
      }
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'Import failed',
      });
    } finally {
      setLoading(false);
    }
  };

  // Google Sheets Connect
  const handleGoogleSheetsAuth = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/leads/google-sheets/auth', {
        method: 'POST',
        headers: {
          'x-admin-token': localStorage.getItem('dashboard_token') || '',
        },
      });

      const data = await response.json();
      if (data.authUrl) {
        window.location.href = data.authUrl;
      } else {
        setResult({
          success: false,
          message: data.error || 'Failed to get authorization URL',
        });
      }
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'Authentication failed',
      });
    } finally {
      setLoading(false);
    }
  };

  // Facebook Lead Ads Connect
  const handleFacebookAuth = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/leads/facebook/auth', {
        method: 'POST',
        headers: {
          'x-admin-token': localStorage.getItem('dashboard_token') || '',
        },
      });

      const data = await response.json();
      if (data.authUrl) {
        window.location.href = data.authUrl;
      } else {
        setResult({
          success: false,
          message: data.error || 'Failed to get authorization URL',
        });
      }
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'Authentication failed',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-navy">Import Leads</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-slate-100"
          >
            <X size={24} className="text-slate-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2 border-b border-slate-200">
          {[
            { id: 'csv', label: 'Upload File', icon: Upload },
            { id: 'sheets', label: 'Google Sheets', icon: Sheet3 },
            { id: 'facebook', label: 'Facebook Ads', icon: Facebook },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center gap-2 border-b-2 px-4 py-3 font-medium transition-colors ${
                activeTab === id
                  ? 'border-violet-600 text-violet-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="mb-6">
          {activeTab === 'csv' && (
            <div className="space-y-4">
              <p className="text-sm text-slate-600">
                Upload a CSV or Excel file with columns: business_name, email, whatsapp_number (optional), source_url (optional)
              </p>
              <label className="block">
                <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-slate-300 px-6 py-12 hover:border-violet-400 hover:bg-violet-50 cursor-pointer transition-colors">
                  <div className="text-center">
                    <FileText size={40} className="mx-auto mb-3 text-slate-400" />
                    <p className="font-medium text-navy">Choose a file</p>
                    <p className="text-xs text-slate-500">CSV, XLSX or XLS</p>
                  </div>
                </div>
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileUpload}
                  disabled={loading}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {activeTab === 'sheets' && (
            <div className="space-y-4">
              <p className="text-sm text-slate-600">
                Connect your Google Sheets account to auto-sync leads. You'll need to authorize access to your Drive.
              </p>
              <button
                onClick={handleGoogleSheetsAuth}
                disabled={loading}
                className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Sheet3 size={18} />}
                {loading ? 'Connecting...' : 'Connect Google Sheets'}
              </button>
              <p className="text-xs text-slate-500">
                After connecting, select a spreadsheet with columns: business_name, email, whatsapp_number (optional), source_url (optional)
              </p>
            </div>
          )}

          {activeTab === 'facebook' && (
            <div className="space-y-4">
              <p className="text-sm text-slate-600">
                Connect your Facebook Business account to import leads from your Lead Ads campaigns.
              </p>
              <button
                onClick={handleFacebookAuth}
                disabled={loading}
                className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Facebook size={18} />}
                {loading ? 'Connecting...' : 'Connect Facebook'}
              </button>
              <p className="text-xs text-slate-500">
                After connecting, you can select which lead forms to import from.
              </p>
            </div>
          )}
        </div>

        {/* Result Message */}
        {result && (
          <div
            className={`mb-6 flex items-start gap-3 rounded-lg px-4 py-3 ${
              result.success
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-rose-50 text-rose-700'
            }`}
          >
            {result.success ? (
              <CheckCircle size={20} className="shrink-0 mt-0.5" />
            ) : (
              <AlertCircle size={20} className="shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-medium">{result.message}</p>
              {result.errors && result.errors.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {result.errors.slice(0, 3).map((err, i) => (
                    <li key={i} className="text-sm">
                      • {err}
                    </li>
                  ))}
                  {result.errors.length > 3 && (
                    <li className="text-sm">• ... and {result.errors.length - 3} more</li>
                  )}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2 font-medium text-navy hover:bg-slate-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
