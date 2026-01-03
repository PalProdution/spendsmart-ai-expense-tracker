"use client";

import { useState } from 'react';
import { useExpenses } from '@/contexts/ExpenseContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, DollarSign, User, Bell, Shield, Check } from 'lucide-react';

export default function SettingsPage() {
  const { user, demoMode } = useAuth();
  const { monthlyBudget, setMonthlyBudget } = useExpenses();
  const [budgetInput, setBudgetInput] = useState(String(monthlyBudget));
  const [saved, setSaved] = useState(false);

  const handleSaveBudget = () => {
    const newBudget = Number(budgetInput);
    if (newBudget > 0) {
      setMonthlyBudget(newBudget);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Settings className="w-7 h-7 text-teal-600" />
          Settings
        </h1>
        <p className="text-gray-600 mt-1">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <User className="w-5 h-5 text-teal-600" />
              Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{user?.displayName || 'User'}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
                {demoMode && (
                  <span className="inline-block mt-1 text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full">
                    Demo Mode
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-teal-600" />
              Monthly Budget
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="budget" className="text-gray-700">Set your monthly budget limit</Label>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                  <Input
                    id="budget"
                    type="number"
                    min="0"
                    step="10"
                    value={budgetInput}
                    onChange={(e) => setBudgetInput(e.target.value)}
                    className="pl-8 h-11 border-gray-200"
                  />
                </div>
                <Button
                  onClick={handleSaveBudget}
                  className={`h-11 px-6 transition-all duration-300 ${
                    saved
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700'
                  }`}
                >
                  {saved ? <Check className="w-5 h-5" /> : 'Save'}
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                You'll receive alerts when approaching this limit
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Bell className="w-5 h-5 text-teal-600" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { label: 'Budget alerts', description: 'Get notified when approaching budget limit', enabled: true },
                { label: 'Weekly summary', description: 'Receive weekly spending reports', enabled: false },
                { label: 'AI insights', description: 'Get smart spending recommendations', enabled: true },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-900">{item.label}</p>
                    <p className="text-xs text-gray-500">{item.description}</p>
                  </div>
                  <div
                    className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${
                      item.enabled ? 'bg-teal-500' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                        item.enabled ? 'left-7' : 'left-1'
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Shield className="w-5 h-5 text-teal-600" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl">
                <p className="font-medium text-teal-800">Your data is secure</p>
                <p className="text-sm text-teal-600 mt-1">
                  {demoMode
                    ? 'Demo mode: Data is stored locally in your browser'
                    : 'Your expense data is encrypted and stored securely in Firebase'}
                </p>
              </div>
              <Button variant="outline" className="w-full justify-start text-gray-600" disabled={demoMode}>
                Change Password
              </Button>
              <Button variant="outline" className="w-full justify-start text-gray-600" disabled={demoMode}>
                Export Data
              </Button>
              <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50" disabled={demoMode}>
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
