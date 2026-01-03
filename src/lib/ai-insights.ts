import { Expense, ExpenseCategory } from './expense-helpers';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval, subWeeks, subMonths, differenceInDays } from 'date-fns';

export interface Insight {
  id: string;
  type: 'warning' | 'tip' | 'prediction' | 'achievement';
  title: string;
  message: string;
  icon: string;
}

export interface SpendingPrediction {
  predictedMonthEnd: number;
  averageDailySpend: number;
  daysRemaining: number;
  trend: 'up' | 'down' | 'stable';
  percentageChange: number;
}

function getCategoryTotal(expenses: Expense[], category: ExpenseCategory, startDate: Date, endDate: Date): number {
  return expenses
    .filter(e => e.category === category && isWithinInterval(e.date, { start: startDate, end: endDate }))
    .reduce((sum, e) => sum + e.amount, 0);
}

function getTotalInRange(expenses: Expense[], startDate: Date, endDate: Date): number {
  return expenses
    .filter(e => isWithinInterval(e.date, { start: startDate, end: endDate }))
    .reduce((sum, e) => sum + e.amount, 0);
}

export function generateInsights(expenses: Expense[], monthlyBudget: number): Insight[] {
  const insights: Insight[] = [];
  const now = new Date();
  
  const thisWeekStart = startOfWeek(now);
  const thisWeekEnd = endOfWeek(now);
  const lastWeekStart = startOfWeek(subWeeks(now, 1));
  const lastWeekEnd = endOfWeek(subWeeks(now, 1));
  
  const thisMonthStart = startOfMonth(now);
  const thisMonthEnd = endOfMonth(now);
  const lastMonthStart = startOfMonth(subMonths(now, 1));
  const lastMonthEnd = endOfMonth(subMonths(now, 1));

  const thisWeekTotal = getTotalInRange(expenses, thisWeekStart, thisWeekEnd);
  const lastWeekTotal = getTotalInRange(expenses, lastWeekStart, lastWeekEnd);
  const thisMonthTotal = getTotalInRange(expenses, thisMonthStart, thisMonthEnd);
  const lastMonthTotal = getTotalInRange(expenses, lastMonthStart, lastMonthEnd);

  const categories: ExpenseCategory[] = ['Food', 'Travel', 'Shopping', 'Subscriptions', 'Others'];
  
  categories.forEach(category => {
    const thisWeekCat = getCategoryTotal(expenses, category, thisWeekStart, thisWeekEnd);
    const lastWeekCat = getCategoryTotal(expenses, category, lastWeekStart, lastWeekEnd);
    
    if (lastWeekCat > 0 && thisWeekCat > lastWeekCat * 1.3) {
      const increase = Math.round(((thisWeekCat - lastWeekCat) / lastWeekCat) * 100);
      insights.push({
        id: `overspend-${category}`,
        type: 'warning',
        title: `High ${category} Spending`,
        message: `You're spending ${increase}% more on ${category.toLowerCase()} this week compared to last week. Consider cutting back!`,
        icon: category === 'Food' ? '🍔' : category === 'Travel' ? '🚗' : category === 'Shopping' ? '🛍️' : category === 'Subscriptions' ? '📱' : '💰',
      });
    }
  });

  const daysInMonth = differenceInDays(thisMonthEnd, thisMonthStart) + 1;
  const daysPassed = differenceInDays(now, thisMonthStart) + 1;
  const dailyAverage = thisMonthTotal / daysPassed;
  const projectedTotal = dailyAverage * daysInMonth;

  if (projectedTotal > monthlyBudget) {
    const excess = Math.round(projectedTotal - monthlyBudget);
    insights.push({
      id: 'budget-warning',
      type: 'warning',
      title: 'Budget Alert',
      message: `At your current spending rate, you'll exceed your monthly budget by $${excess}. Try to reduce daily spending.`,
      icon: '⚠️',
    });
  }

  if (monthlyBudget > 0 && thisMonthTotal > monthlyBudget * 0.8 && thisMonthTotal < monthlyBudget) {
    const remaining = Math.round(monthlyBudget - thisMonthTotal);
    const daysLeft = differenceInDays(thisMonthEnd, now);
    insights.push({
      id: 'budget-approaching',
      type: 'warning',
      title: 'Approaching Budget Limit',
      message: `You've used 80% of your monthly budget. Only $${remaining} left for the next ${daysLeft} days.`,
      icon: '📊',
    });
  }

  if (lastWeekTotal > 0 && thisWeekTotal < lastWeekTotal * 0.8) {
    const saved = Math.round(lastWeekTotal - thisWeekTotal);
    insights.push({
      id: 'saving-achievement',
      type: 'achievement',
      title: 'Great Job Saving!',
      message: `You saved $${saved} this week compared to last week. Keep up the good work!`,
      icon: '🎉',
    });
  }

  const foodTotal = getCategoryTotal(expenses, 'Food', thisMonthStart, thisMonthEnd);
  if (foodTotal > thisMonthTotal * 0.4) {
    insights.push({
      id: 'food-tip',
      type: 'tip',
      title: 'Food Spending Tip',
      message: 'Food makes up over 40% of your expenses. Try meal prepping on weekends to save money!',
      icon: '💡',
    });
  }

  const subscriptionsTotal = getCategoryTotal(expenses, 'Subscriptions', thisMonthStart, thisMonthEnd);
  if (subscriptionsTotal > 50) {
    insights.push({
      id: 'subscription-tip',
      type: 'tip',
      title: 'Review Subscriptions',
      message: `You're spending $${Math.round(subscriptionsTotal)} on subscriptions. Review them to see if you can cancel unused ones.`,
      icon: '📱',
    });
  }

  insights.push({
    id: 'general-tip',
    type: 'tip',
    title: 'Smart Spending Tip',
    message: 'Try the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings.',
    icon: '🎯',
  });

  return insights;
}

export function calculatePrediction(expenses: Expense[], monthlyBudget: number): SpendingPrediction {
  const now = new Date();
  const thisMonthStart = startOfMonth(now);
  const thisMonthEnd = endOfMonth(now);
  const lastMonthStart = startOfMonth(subMonths(now, 1));
  const lastMonthEnd = endOfMonth(subMonths(now, 1));

  const thisMonthTotal = getTotalInRange(expenses, thisMonthStart, now);
  const lastMonthTotal = getTotalInRange(expenses, lastMonthStart, lastMonthEnd);
  
  const daysPassed = differenceInDays(now, thisMonthStart) + 1;
  const daysRemaining = differenceInDays(thisMonthEnd, now);
  const daysInMonth = differenceInDays(thisMonthEnd, thisMonthStart) + 1;
  
  const averageDailySpend = daysPassed > 0 ? thisMonthTotal / daysPassed : 0;
  const predictedMonthEnd = thisMonthTotal + (averageDailySpend * daysRemaining);
  
  let trend: 'up' | 'down' | 'stable' = 'stable';
  let percentageChange = 0;
  
  if (lastMonthTotal > 0) {
    const lastMonthDaily = lastMonthTotal / differenceInDays(lastMonthEnd, lastMonthStart);
    percentageChange = ((averageDailySpend - lastMonthDaily) / lastMonthDaily) * 100;
    
    if (percentageChange > 10) trend = 'up';
    else if (percentageChange < -10) trend = 'down';
  }

  return {
    predictedMonthEnd: Math.round(predictedMonthEnd),
    averageDailySpend: Math.round(averageDailySpend * 100) / 100,
    daysRemaining,
    trend,
    percentageChange: Math.round(percentageChange),
  };
}

export function getCategoryBreakdown(expenses: Expense[]): { category: ExpenseCategory; total: number; percentage: number }[] {
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);
  
  const monthExpenses = expenses.filter(e => isWithinInterval(e.date, { start: monthStart, end: monthEnd }));
  const total = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
  
  const categories: ExpenseCategory[] = ['Food', 'Travel', 'Shopping', 'Subscriptions', 'Others'];
  
  return categories.map(category => {
    const categoryTotal = monthExpenses
      .filter(e => e.category === category)
      .reduce((sum, e) => sum + e.amount, 0);
    
    return {
      category,
      total: Math.round(categoryTotal * 100) / 100,
      percentage: total > 0 ? Math.round((categoryTotal / total) * 100) : 0,
    };
  }).filter(c => c.total > 0);
}

export function getDailySpending(expenses: Expense[], days: number = 7): { date: string; amount: number }[] {
  const now = new Date();
  const result: { date: string; amount: number }[] = [];
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    
    const dayTotal = expenses
      .filter(e => e.date >= date && e.date < nextDay)
      .reduce((sum, e) => sum + e.amount, 0);
    
    result.push({
      date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      amount: Math.round(dayTotal * 100) / 100,
    });
  }
  
  return result;
}
