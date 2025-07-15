'use client';

import { useState } from 'react';
import { apiClient } from '@/lib/api-client';

export default function BackendTestPage() {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const addResult = (
    test: string,
    success: boolean,
    data?: any,
    error?: any
  ) => {
    const result = {
      test,
      success,
      data,
      error: error?.message || error,
      timestamp: new Date().toISOString(),
    };
    setTestResults((prev) => [result, ...prev]);
  };

  const testBackendConnection = async () => {
    setLoading(true);
    setTestResults([]);

    // Test 1: Basic API Health Check
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') ||
          'https://bracketesports-backend.onrender.com'
      );
      if (response.ok) {
        addResult('Backend Health Check', true, {
          status: response.status,
          statusText: response.statusText,
        });
      } else {
        addResult(
          'Backend Health Check',
          false,
          null,
          `HTTP ${response.status}: ${response.statusText}`
        );
      }
    } catch (error) {
      addResult('Backend Health Check', false, null, error);
    }

    // Test 2: API Endpoint Test
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/health` ||
          'https://bracketesports-backend.onrender.com/api/health'
      );
      const data = await response.text();
      addResult('API Health Endpoint', response.ok, data);
    } catch (error) {
      addResult('API Health Endpoint', false, null, error);
    }

    // Test 3: Tournament API Test
    try {
      const response = await apiClient.tournament.getAll();
      addResult('Tournament API (via apiClient)', true, response);
    } catch (error) {
      addResult('Tournament API (via apiClient)', false, null, error);
    }

    // Test 4: Coin Packages API Test
    try {
      const response = await apiClient.coins.getPackages();
      addResult('Coin Packages API', true, response);
    } catch (error) {
      addResult('Coin Packages API', false, null, error);
    }

    // Test 5: Exchange Rate API Test
    try {
      const response = await apiClient.coins.getExchangeRate();
      addResult('Exchange Rate API', true, response);
    } catch (error) {
      addResult('Exchange Rate API', false, null, error);
    }

    // Test 6: Teams API Test
    try {
      const response = await apiClient.teams.getAll();
      addResult('Teams API', true, response);
    } catch (error) {
      addResult('Teams API', false, null, error);
    }

    // Test 4: Auth API Test (without credentials)
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/test` ||
          'https://bracketesports-backend.onrender.com/api/auth/test'
      );
      const data = await response.json();
      addResult('Auth API Test', response.ok, data);
    } catch (error) {
      addResult('Auth API Test', false, null, error);
    }

    setLoading(false);
  };

  const testRegistration = async () => {
    setLoading(true);

    try {
      const testUser = {
        username: `test_${Date.now()}`,
        email: `test_${Date.now()}@example.com`,
        password: 'testpass123',
        firstName: 'Test',
        lastName: 'User',
      };

      const response = await apiClient.auth.register(testUser);
      addResult(
        'User Registration Test',
        response.success,
        response.data,
        response.error
      );
    } catch (error) {
      addResult('User Registration Test', false, null, error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Backend Connection Test</h1>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Configuration</h2>
          <div className="bg-gray-800 p-4 rounded-lg">
            <p>
              <strong>Backend URL:</strong>{' '}
              {process.env.NEXT_PUBLIC_API_URL || 'Not configured'}
            </p>
            <p>
              <strong>Frontend URL:</strong>{' '}
              {typeof window !== 'undefined'
                ? window.location.origin
                : 'Unknown'}
            </p>
          </div>
        </div>

        <div className="space-x-4 mb-8">
          <button
            onClick={testBackendConnection}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Backend Connection'}
          </button>

          <button
            onClick={testRegistration}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Registration API'}
          </button>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Test Results</h2>

          {testResults.length === 0 ? (
            <p className="text-gray-400">
              No tests run yet. Click a test button above.
            </p>
          ) : (
            <div className="space-y-4">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-l-4 ${
                    result.success
                      ? 'bg-green-900 border-green-500'
                      : 'bg-red-900 border-red-500'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{result.test}</h3>
                    <span
                      className={`text-sm px-2 py-1 rounded ${
                        result.success ? 'bg-green-600' : 'bg-red-600'
                      }`}
                    >
                      {result.success ? 'PASS' : 'FAIL'}
                    </span>
                  </div>

                  {result.data && (
                    <div className="mb-2">
                      <strong>Data:</strong>
                      <pre className="bg-gray-800 p-2 rounded text-sm mt-1 overflow-auto">
                        {typeof result.data === 'string'
                          ? result.data
                          : JSON.stringify(result.data, null, 2)}
                      </pre>
                    </div>
                  )}

                  {result.error && (
                    <div className="mb-2">
                      <strong>Error:</strong>
                      <pre className="bg-gray-800 p-2 rounded text-sm mt-1 text-red-300">
                        {typeof result.error === 'string'
                          ? result.error
                          : JSON.stringify(result.error, null, 2)}
                      </pre>
                    </div>
                  )}

                  <div className="text-xs text-gray-400">
                    {new Date(result.timestamp).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
