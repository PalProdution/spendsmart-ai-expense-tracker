"use client";

import { useExpenses } from '@/contexts/ExpenseContext';
import { getCategoryBreakdown, getDailySpending } from '@/lib/ai-insights';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, BarChart3, TrendingUp, Loader2 } from 'lucide-react';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const categoryColors: Record<string, { bg: string; border: string }> = {
  Food: { bg: 'rgba(249, 115, 22, 0.7)', border: 'rgb(249, 115, 22)' },
  Travel: { bg: 'rgba(59, 130, 246, 0.7)', border: 'rgb(59, 130, 246)' },
  Shopping: { bg: 'rgba(236, 72, 153, 0.7)', border: 'rgb(236, 72, 153)' },
  Subscriptions: { bg: 'rgba(139, 92, 246, 0.7)', border: 'rgb(139, 92, 246)' },
  Others: { bg: 'rgba(107, 114, 128, 0.7)', border: 'rgb(107, 114, 128)' },
};

export default function AnalyticsPage() {
  const { expenses, loading, monthSpend } = useExpenses();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-teal-600" />
      </div>
    );
  }

  const categoryBreakdown = getCategoryBreakdown(expenses);
  const dailySpending = getDailySpending(expenses, 7);

  const pieData = {
    labels: categoryBreakdown.map((c) => c.category),
    datasets: [
      {
        data: categoryBreakdown.map((c) => c.total),
        backgroundColor: categoryBreakdown.map((c) => categoryColors[c.category]?.bg || 'rgba(107, 114, 128, 0.7)'),
        borderColor: categoryBreakdown.map((c) => categoryColors[c.category]?.border || 'rgb(107, 114, 128)'),
        borderWidth: 2,
      },
    ],
  };

  const barData = {
    labels: dailySpending.map((d) => d.date),
    datasets: [
      {
        label: 'Daily Spending',
        data: dailySpending.map((d) => d.amount),
        backgroundColor: 'rgba(20, 184, 166, 0.7)',
        borderColor: 'rgb(20, 184, 166)',
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
          },
        },
      },
    },
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          callback: function(value: number | string) {
            return '$' + value;
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-1">Visual breakdown of your spending habits</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-teal-500 to-emerald-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-white/80">This Month Total</p>
                <p className="text-2xl font-bold">${monthSpend.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-cyan-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <PieChart className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-white/80">Categories</p>
                <p className="text-2xl font-bold">{categoryBreakdown.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-pink-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-white/80">Transactions</p>
                <p className="text-2xl font-bold">{expenses.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-teal-600" />
              Spending by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            {categoryBreakdown.length > 0 ? (
              <div className="h-80">
                <Pie data={pieData} options={pieOptions} />
              </div>
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-500">
                No spending data this month
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-teal-600" />
              Daily Spending (Last 7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <Bar data={barData} options={barOptions} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-lg bg-white">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Category Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          {categoryBreakdown.length > 0 ? (
            <div className="space-y-4">
              {categoryBreakdown.map((cat) => (
                <div key={cat.category} className="flex items-center gap-4">
                  <div className="w-24 text-sm font-medium text-gray-700">{cat.category}</div>
                  <div className="flex-1">
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${cat.percentage}%`,
                          backgroundColor: categoryColors[cat.category]?.border || '#6B7280',
                        }}
                      />
                    </div>
                  </div>
                  <div className="w-20 text-right text-sm font-semibold text-gray-900">
                    ${cat.total.toFixed(2)}
                  </div>
                  <div className="w-12 text-right text-sm text-gray-500">
                    {cat.percentage}%
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500">No spending data this month</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
