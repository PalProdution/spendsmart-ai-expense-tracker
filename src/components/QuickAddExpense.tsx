"use client";

import { useState, useEffect } from 'react';
import { useExpenses } from '@/contexts/ExpenseContext';
import { ExpenseCategory } from '@/lib/expense-helpers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Loader2, Sparkles } from 'lucide-react';

const categories: ExpenseCategory[] = ['Food', 'Travel', 'Shopping', 'Subscriptions', 'Others'];

const categoryEmojis: Record<ExpenseCategory, string> = {
  Food: '🍔',
  Travel: '🚗',
  Shopping: '🛍️',
  Subscriptions: '📱',
  Others: '💰',
};

export function QuickAddExpense() {
  const { addNewExpense, suggestCategory } = useExpenses();
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Others');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (note.length >= 3) {
      const suggested = suggestCategory(note);
      setCategory(suggested);
    }
  }, [note, suggestCategory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;

    setLoading(true);
    try {
      await addNewExpense(Number(amount), category, note, new Date(date));
      setAmount('');
      setNote('');
      setCategory('Others');
      setDate(new Date().toISOString().split('T')[0]);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (error) {
      console.error('Failed to add expense:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-0 shadow-lg bg-white">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Plus className="w-5 h-5 text-teal-600" />
          Quick Add Expense
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-gray-700">Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="h-11 border-gray-200 focus:border-teal-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date" className="text-gray-700">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="h-11 border-gray-200 focus:border-teal-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="note" className="text-gray-700 flex items-center gap-2">
              Note
              <span className="text-xs text-teal-600 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Auto-categorize
              </span>
            </Label>
            <Input
              id="note"
              type="text"
              placeholder="e.g., Coffee at Starbucks"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="h-11 border-gray-200 focus:border-teal-500"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700">Category</Label>
            <Select value={category} onValueChange={(val) => setCategory(val as ExpenseCategory)}>
              <SelectTrigger className="h-11 border-gray-200 focus:border-teal-500">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    <span className="flex items-center gap-2">
                      {categoryEmojis[cat]} {cat}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            className={cn(
              "w-full h-11 font-medium transition-all duration-300",
              success
                ? "bg-green-500 hover:bg-green-600"
                : "bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700"
            )}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : success ? (
              'Added!'
            ) : (
              <>
                <Plus className="w-5 h-5 mr-2" />
                Add Expense
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
