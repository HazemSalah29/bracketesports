'use client';

import { useState } from 'react';
import { apiClient } from '@/lib/api-client';

export default function ApiTestPage() {
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testBasicAPI = async () => {
    setLoading(true);
    try {
      const response = await apiClient.tournament.getAll();
      setTestResult({
        type: 'Tournament API Test',
        success: response.success,
        data: response.data,
      });
    } catch (error: any) {
      setTestResult({
        type: 'Tournament API Test',
        success: false,
        error: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const testAuthAPI = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test/auth');
      const data = await response.json();
      setTestResult({ type: 'Auth API Test', success: true, data });
    } catch (error: any) {
      setTestResult({
        type: 'Auth API Test',
        success: false,
        error: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const testApiClient = async () => {
    setLoading(true);
    try {
      // Test the API client directly
      const response = await apiClient.user.addGamingAccount({
        platform: 'valorant',
        username: 'TestUser#123',
        platformId: 'TestUser123',
      });
      setTestResult({ type: 'API Client Test', success: true, data: response });
    } catch (error: any) {
      setTestResult({
        type: 'API Client Test',
        success: false,
        error: error.message,
        fullError: {
          name: error.name,
          message: error.message,
          response: error.response,
          status: error.status,
          originalError: error.originalError,
          stack: error.stack,
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">API Test Page</h1>

      <div className="space-y-4">
        <button
          onClick={testBasicAPI}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Test Basic API
        </button>

        <button
          onClick={testAuthAPI}
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Test Auth API
        </button>

        <button
          onClick={testApiClient}
          disabled={loading}
          className="bg-red-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Test API Client (Gaming Account)
        </button>
      </div>

      {loading && <p className="mt-4">Loading...</p>}

      {testResult && (
        <div className="mt-6 p-4 border rounded">
          <h3 className="font-bold">{testResult.type} Result:</h3>
          <pre className="mt-2 bg-gray-100 p-2 rounded text-sm overflow-auto">
            {JSON.stringify(testResult, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
