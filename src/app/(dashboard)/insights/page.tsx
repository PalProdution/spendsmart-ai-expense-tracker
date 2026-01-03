"use client";

import { useExpenses } from '@/contexts/ExpenseContext';
import { generateInsights, calculatePrediction, Insight } from '@/lib/ai-insights';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle, Target, Brain, Loader2 } from 'lucide-react';

const insightTypeStyles: Record<string, { bg: string; border: string; icon: typeof AlertTriangle }> = {
  warning: { bg: 'bg-amber-50', border: 'border-amber-200', icon: AlertTriangle },
  tip: { bg: 'bg-blue-50', border: 'border-blue-200', icon: Lightbulb },
  prediction: { bg: 'bg-purple-50', border: 'border-purple-200', icon: Target },
  achievement: { bg: 'bg-green-50', border: 'border-green-200', icon: CheckCircle },
};

export default function InsightsPage() {
  const { expenses, loading, monthlyBudget, monthSpend } = useExpenses();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-teal-600" />
      </div>
    );
  }

  const insights = generateInsights(expenses, monthlyBudget);
  const prediction = calculatePrediction(expenses, monthlyBudget);

  const TrendIcon = prediction.trend === 'up' ? TrendingUp : prediction.trend === 'down' ? TrendingDown : Minus;
  const trendColor = prediction.trend === 'up' ? 'text-red-500' : prediction.trend === 'down' ? 'text-green-500' : 'text-gray-500';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Brain className="w-7 h-7 text-teal-600" />
          AI Insights
        </h1>
        <p className="text-gray-600 mt-1">Smart analysis of your spending patterns</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-teal-500 to-emerald-600 text-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Target className="w-5 h-5" />
              Monthly Prediction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-white/80 text-sm">Predicted Month-End Spending</p>
                <p className="text-4xl font-bold">${prediction.predictedMonthEnd}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-xl p-3">
                  <p className="text-white/80 text-xs">Daily Average</p>
                  <p className="text-xl font-semibold">${prediction.averageDailySpend}</p>
                </div>
                <div className="bg-white/10 rounded-xl p-3">
                  <p className="text-white/80 text-xs">Days Left</p>
                  <p className="text-xl font-semibold">{prediction.daysRemaining}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white/10 rounded-xl p-3">
                <TrendIcon className={`w-5 h-5 ${prediction.trend === 'up' ? 'text-amber-300' : prediction.trend === 'down' ? 'text-emerald-300' : 'text-white/60'}`} />
                <span className="text-sm">
                  {prediction.trend === 'up'
                    ? `Spending ${Math.abs(prediction.percentageChange)}% higher than last month`
                    : prediction.trend === 'down'
                    ? `Spending ${Math.abs(prediction.percentageChange)}% lower than last month`
                    : 'Spending stable compared to last month'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <TrendIcon className={`w-5 h-5 ${trendColor}`} />
              Budget Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-sm text-gray-500">Current Spending</p>
                  <p className="text-3xl font-bold text-gray-900">${monthSpend.toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Budget</p>
                  <p className="text-xl font-semibold text-gray-700">${monthlyBudget}</p>
                </div>
              </div>
              
              <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    prediction.predictedMonthEnd > monthlyBudget
                      ? 'bg-gradient-to-r from-red-500 to-orange-500'
                      : monthSpend > monthlyBudget * 0.8
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-500'
                      : 'bg-gradient-to-r from-teal-500 to-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, (monthSpend / monthlyBudget) * 100)}%` }}
                />
              </div>

              <div className="p-4 rounded-xl bg-gray-50">
                <p className="text-sm text-gray-600">
                  {prediction.predictedMonthEnd > monthlyBudget ? (
                    <span className="text-red-600 font-medium">
                      At this rate, you'll exceed your budget by ${(prediction.predictedMonthEnd - monthlyBudget).toFixed(2)}
                    </span>
                  ) : (
                    <span className="text-green-600 font-medium">
                      You're on track to stay within budget with ${(monthlyBudget - prediction.predictedMonthEnd).toFixed(2)} to spare
                    </span>
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-lg bg-white">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-teal-600" />
            Smart Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insights.map((insight) => {
              const styles = insightTypeStyles[insight.type] || insightTypeStyles.tip;
              const Icon = styles.icon;
              
              return (
                <div
                  key={insight.id}
                  className={`p-4 rounded-xl border ${styles.bg} ${styles.border} flex items-start gap-4`}
                >
                  <div className="text-2xl">{insight.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{insight.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{insight.message}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">AI-Powered Spending Analysis</h3>
              <p className="text-white/80 mt-2 text-sm">
                Our smart algorithm analyzes your spending patterns, compares them with previous periods, 
                and provides personalized recommendations to help you save money and stay within budget.
              </p>
              <p className="text-white/60 mt-3 text-xs">
                Future updates will include ML-powered predictions using Google AutoML for even more accurate insights.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
