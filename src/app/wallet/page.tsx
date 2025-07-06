'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  CreditCardIcon, 
  BanknotesIcon, 
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

// Mock data - in a real app, this would come from your API
const mockBalance = 150.75;
const mockEarnings = 2450.00;

const mockPaymentMethods = [
  {
    id: '1',
    type: 'credit_card',
    brand: 'Visa',
    last4: '4242',
    expiryMonth: 12,
    expiryYear: 2025,
    isDefault: true
  },
  {
    id: '2',
    type: 'paypal',
    email: 'john.doe@example.com',
    isDefault: false
  }
];

const mockTransactions = [
  {
    id: '1',
    type: 'prize_payout',
    amount: 500.00,
    description: 'CS:GO Winter Championship - 2nd Place',
    status: 'completed',
    date: new Date('2024-12-15'),
    tournamentId: '1'
  },
  {
    id: '2',
    type: 'deposit',
    amount: 100.00,
    description: 'Wallet Deposit',
    status: 'completed',
    date: new Date('2024-12-10'),
    paymentMethodId: '1'
  },
  {
    id: '3',
    type: 'entry_fee',
    amount: -25.00,
    description: 'Valorant Weekly Showdown Entry Fee',
    status: 'completed',
    date: new Date('2024-12-08'),
    tournamentId: '2'
  },
  {
    id: '4',
    type: 'prize_payout',
    amount: 250.00,
    description: 'Valorant Weekly Showdown - 1st Place',
    status: 'completed',
    date: new Date('2024-12-08'),
    tournamentId: '2'
  },
  {
    id: '5',
    type: 'withdrawal',
    amount: -200.00,
    description: 'Withdrawal to Bank Account',
    status: 'pending',
    date: new Date('2024-12-05'),
    paymentMethodId: '1'
  }
];

export default function WalletPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');

  const tabs = [
    { id: 'overview', name: 'Overview' },
    { id: 'transactions', name: 'Transactions' },
    { id: 'methods', name: 'Payment Methods' }
  ];

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownTrayIcon className="w-5 h-5 text-green-500" />;
      case 'withdrawal':
        return <ArrowUpTrayIcon className="w-5 h-5 text-blue-500" />;
      case 'entry_fee':
        return <BanknotesIcon className="w-5 h-5 text-red-500" />;
      case 'prize_payout':
        return <CheckCircleIcon className="w-5 h-5 text-accent-500" />;
      default:
        return <BanknotesIcon className="w-5 h-5 text-slate-500" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="w-4 h-4 text-green-500" />;
      case 'pending':
        return <ClockIcon className="w-4 h-4 text-yellow-500" />;
      case 'failed':
        return <XCircleIcon className="w-4 h-4 text-red-500" />;
      default:
        return <ClockIcon className="w-4 h-4 text-slate-500" />;
    }
  };

  const handleAddFunds = () => {
    // Handle add funds logic
    console.log('Adding funds:', depositAmount);
    setShowAddFunds(false);
    setDepositAmount('');
  };

  const handleWithdraw = () => {
    // Handle withdrawal logic
    console.log('Withdrawing funds:', withdrawAmount);
    setShowWithdraw(false);
    setWithdrawAmount('');
  };

  return (
    <div className="min-h-screen py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl font-gaming">
            Wallet
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-300">
            Manage your balance, view transactions, and handle payments.
          </p>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="gaming-card rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Available Balance</p>
                <p className="text-3xl font-bold text-white mt-2">${mockBalance.toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 bg-gaming-600 rounded-full flex items-center justify-center">
                <BanknotesIcon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setShowAddFunds(true)}
                className="flex-1 bg-gaming-600 hover:bg-gaming-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
              >
                Add Funds
              </button>
              <button
                onClick={() => setShowWithdraw(true)}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
              >
                Withdraw
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="gaming-card rounded-xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Earnings</p>
                <p className="text-3xl font-bold text-accent-500 mt-2 prize-glow">${mockEarnings.toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 bg-accent-600 rounded-full flex items-center justify-center">
                <CheckCircleIcon className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-sm text-slate-400 mt-4">
              Lifetime tournament winnings
            </p>
          </motion.div>
        </div>

        {/* Tab Navigation */}
        <div className="gaming-card rounded-xl p-6">
          <div className="border-b border-slate-700">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-gaming-500 text-gaming-500'
                      : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="mt-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Recent Transactions</h3>
                  <div className="space-y-3">
                    {mockTransactions.slice(0, 5).map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          {getTransactionIcon(transaction.type)}
                          <div>
                            <p className="font-medium text-white">{transaction.description}</p>
                            <div className="flex items-center gap-2 mt-1">
                              {getStatusIcon(transaction.status)}
                              <span className="text-sm text-slate-400">
                                {transaction.date.toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold ${
                            transaction.amount > 0 ? 'text-green-500' : 'text-red-500'
                          }`}>
                            {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                          </p>
                          <p className="text-sm text-slate-400 capitalize">{transaction.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Link
                    href="#"
                    onClick={() => setActiveTab('transactions')}
                    className="inline-flex items-center gap-2 text-gaming-500 hover:text-gaming-400 mt-4"
                  >
                    <EyeIcon className="w-4 h-4" />
                    View All Transactions
                  </Link>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={() => setShowAddFunds(true)}
                      className="p-4 bg-gaming-600 hover:bg-gaming-700 text-white rounded-lg transition-colors text-left"
                    >
                      <ArrowDownTrayIcon className="w-6 h-6 mb-2" />
                      <h4 className="font-semibold">Add Funds</h4>
                      <p className="text-sm opacity-90">Deposit money to your wallet</p>
                    </button>
                    <button
                      onClick={() => setShowWithdraw(true)}
                      className="p-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-left"
                    >
                      <ArrowUpTrayIcon className="w-6 h-6 mb-2" />
                      <h4 className="font-semibold">Withdraw Funds</h4>
                      <p className="text-sm opacity-90">Transfer money to your bank</p>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'transactions' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">All Transactions</h3>
                  <select className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm">
                    <option>All Types</option>
                    <option>Deposits</option>
                    <option>Withdrawals</option>
                    <option>Entry Fees</option>
                    <option>Prize Payouts</option>
                  </select>
                </div>
                <div className="space-y-3">
                  {mockTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        {getTransactionIcon(transaction.type)}
                        <div>
                          <p className="font-medium text-white">{transaction.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            {getStatusIcon(transaction.status)}
                            <span className="text-sm text-slate-400">
                              {transaction.date.toLocaleDateString()} at {transaction.date.toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${
                          transaction.amount > 0 ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                        </p>
                        <p className="text-sm text-slate-400 capitalize">{transaction.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'methods' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Payment Methods</h3>
                  <button className="flex items-center gap-2 px-4 py-2 bg-gaming-600 hover:bg-gaming-700 text-white rounded-lg transition-colors">
                    <PlusIcon className="w-4 h-4" />
                    Add Payment Method
                  </button>
                </div>
                <div className="space-y-3">
                  {mockPaymentMethods.map((method) => (
                    <div key={method.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
                          <CreditCardIcon className="w-5 h-5 text-slate-400" />
                        </div>
                        <div>
                          {method.type === 'credit_card' ? (
                            <>
                              <p className="font-medium text-white">
                                {method.brand} ****{method.last4}
                              </p>
                              <p className="text-sm text-slate-400">
                                Expires {method.expiryMonth}/{method.expiryYear}
                              </p>
                            </>
                          ) : (
                            <>
                              <p className="font-medium text-white">PayPal</p>
                              <p className="text-sm text-slate-400">{method.email}</p>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {method.isDefault && (
                          <span className="px-2 py-1 bg-gaming-600 text-white text-xs rounded-full">
                            Default
                          </span>
                        )}
                        <button className="text-sm text-slate-400 hover:text-white">
                          Edit
                        </button>
                        <button className="text-sm text-red-400 hover:text-red-300">
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Funds Modal */}
      {showAddFunds && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 rounded-xl p-6 w-full max-w-md mx-4"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Add Funds</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Amount ($)
                </label>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  placeholder="Enter amount"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Payment Method
                </label>
                <select className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white">
                  <option>Visa ****4242</option>
                  <option>PayPal</option>
                </select>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleAddFunds}
                  className="flex-1 bg-gaming-600 hover:bg-gaming-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                >
                  Add Funds
                </button>
                <button
                  onClick={() => setShowAddFunds(false)}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Withdraw Funds Modal */}
      {showWithdraw && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 rounded-xl p-6 w-full max-w-md mx-4"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Withdraw Funds</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Amount ($)
                </label>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                  placeholder="Enter amount"
                  max={mockBalance}
                />
                <p className="text-sm text-slate-400 mt-1">
                  Available balance: ${mockBalance.toFixed(2)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Withdraw to
                </label>
                <select className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white">
                  <option>Bank Account ****4242</option>
                  <option>PayPal</option>
                </select>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-3">
                <p className="text-sm text-slate-400">
                  Withdrawals typically take 1-3 business days to process.
                </p>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleWithdraw}
                  className="flex-1 bg-gaming-600 hover:bg-gaming-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                >
                  Withdraw
                </button>
                <button
                  onClick={() => setShowWithdraw(false)}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
