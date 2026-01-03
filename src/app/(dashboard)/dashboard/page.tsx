"use client";

import { useExpenses } from '@/contexts/ExpenseContext';
import { Card, CardContent } from '@/components/ui/card';
import { QuickAddExpense } from '@/components/QuickAddExpense';
import { ExpenseList } from '@/components/ExpenseList';
import { DollarSign, Calendar, Wallet, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  const { todaySpend, monthSpend, monthlyBudget, remainingBudget } = useExpenses();

  const budgetPercentage = monthlyBudget > 0 ? Math.min(100, (monthSpend / monthlyBudget) * 100) : 0;

  const stats = [
    {
      title: "Today's Spend",
      value: `$${todaySpend.toFixed(2)}`,
      icon: DollarSign,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
    },
    {
      title: "This Month",
      value: `$${monthSpend.toFixed(2)}`,
      icon: Calendar,
      color: 'from-teal-500 to-emerald-500',
      bgColor: 'bg-teal-50',
    },
    {
      title: "Budget Left",
      value: `$${remainingBudget.toFixed(2)}`,
      icon: Wallet,
      color: remainingBudget < monthlyBudget * 0.2 ? 'from-red-500 to-orange-500' : 'from-emerald-500 to-green-500',
      bgColor: remainingBudget < monthlyBudget * 0.2 ? 'bg-red-50' : 'bg-emerald-50',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Track your daily expenses smartly</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="border-0 shadow-lg bg-white overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 bg-gradient-to-r ${stat.color} bg-clip-text`} style={{ color: 'transparent', WebkitBackgroundClip: 'text' }} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-0 shadow-lg bg-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-teal-600" />
              <span className="font-semibold text-gray-900">Budget Progress</span>
            </div>
            <span className="text-sm text-gray-600">
              ${monthSpend.toFixed(2)} / ${monthlyBudget.toFixed(2)}
            </span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                budgetPercentage > 80
                  ? 'bg-gradient-to-r from-red-500 to-orange-500'
                  : budgetPercentage > 60
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500'
                  : 'bg-gradient-to-r from-teal-500 to-emerald-500'
              }`}
              style={{ width: `${budgetPercentage}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {budgetPercentage > 80
              ? 'Warning: You are close to exceeding your budget!'
              : budgetPercentage > 60
              ? 'You have used most of your budget for this month'
              : 'You are on track with your budget'}
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QuickAddExpense />
        <ExpenseList limit={5} />
      </div>
    </div>
  );
}
