"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { Expense, subscribeToExpenses, addExpense, updateExpense, deleteExpense, ExpenseCategory, autoCategorizExpense } from '@/lib/expense-helpers';
import { startOfDay, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

interface ExpenseContextType {
  expenses: Expense[];
  loading: boolean;
  todaySpend: number;
  monthSpend: number;
  monthlyBudget: number;
  remainingBudget: number;
  addNewExpense: (amount: number, category: ExpenseCategory, note: string, date: Date) => Promise<void>;
  editExpense: (id: string, data: Partial<Expense>) => Promise<void>;
  removeExpense: (id: string) => Promise<void>;
  setMonthlyBudget: (budget: number) => void;
  suggestCategory: (note: string) => ExpenseCategory;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export function ExpenseProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [monthlyBudget, setMonthlyBudgetState] = useState(500);

  useEffect(() => {
    const saved = localStorage.getItem('monthly_budget');
    if (saved) {
      setMonthlyBudgetState(Number(saved));
    }
  }, []);

  useEffect(() => {
    if (!user) {
      setExpenses([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeToExpenses(user.uid, (data) => {
      setExpenses(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const todayStart = startOfDay(new Date());
  const todaySpend = expenses
    .filter(e => e.date >= todayStart)
    .reduce((sum, e) => sum + e.amount, 0);

  const monthStart = startOfMonth(new Date());
  const monthEnd = endOfMonth(new Date());
  const monthSpend = expenses
    .filter(e => isWithinInterval(e.date, { start: monthStart, end: monthEnd }))
    .reduce((sum, e) => sum + e.amount, 0);

  const remainingBudget = Math.max(0, monthlyBudget - monthSpend);

  const addNewExpense = async (amount: number, category: ExpenseCategory, note: string, date: Date) => {
    if (!user) throw new Error('Must be logged in');
    await addExpense({
      userId: user.uid,
      amount,
      category,
      note,
      date,
    });
  };

  const editExpense = async (id: string, data: Partial<Expense>) => {
    await updateExpense(id, data);
  };

  const removeExpense = async (id: string) => {
    await deleteExpense(id);
  };

  const setMonthlyBudget = (budget: number) => {
    setMonthlyBudgetState(budget);
    localStorage.setItem('monthly_budget', String(budget));
  };

  const suggestCategory = (note: string): ExpenseCategory => {
    return autoCategorizExpense(note);
  };

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        loading,
        todaySpend,
        monthSpend,
        monthlyBudget,
        remainingBudget,
        addNewExpense,
        editExpense,
        removeExpense,
        setMonthlyBudget,
        suggestCategory,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpenses() {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
}
