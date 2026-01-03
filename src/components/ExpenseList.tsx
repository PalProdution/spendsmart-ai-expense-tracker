"use client";

import { useState } from 'react';
import { useExpenses } from '@/contexts/ExpenseContext';
import { Expense, ExpenseCategory } from '@/lib/expense-helpers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Clock, Pencil, Trash2, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

const categoryColors: Record<ExpenseCategory, string> = {
  Food: 'bg-orange-100 text-orange-700',
  Travel: 'bg-blue-100 text-blue-700',
  Shopping: 'bg-pink-100 text-pink-700',
  Subscriptions: 'bg-purple-100 text-purple-700',
  Others: 'bg-gray-100 text-gray-700',
};

const categoryEmojis: Record<ExpenseCategory, string> = {
  Food: '🍔',
  Travel: '🚗',
  Shopping: '🛍️',
  Subscriptions: '📱',
  Others: '💰',
};

const categories: ExpenseCategory[] = ['Food', 'Travel', 'Shopping', 'Subscriptions', 'Others'];

export function ExpenseList({ limit }: { limit?: number }) {
  const { expenses, loading, editExpense, removeExpense } = useExpenses();
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [editAmount, setEditAmount] = useState('');
  const [editCategory, setEditCategory] = useState<ExpenseCategory>('Others');
  const [editNote, setEditNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const displayExpenses = limit ? expenses.slice(0, limit) : expenses;

  const openEditDialog = (expense: Expense) => {
    setEditingExpense(expense);
    setEditAmount(String(expense.amount));
    setEditCategory(expense.category);
    setEditNote(expense.note);
  };

  const handleSave = async () => {
    if (!editingExpense) return;
    setSaving(true);
    try {
      await editExpense(editingExpense.id!, {
        amount: Number(editAmount),
        category: editCategory,
        note: editNote,
      });
      setEditingExpense(null);
    } catch (error) {
      console.error('Failed to update expense:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      await removeExpense(id);
    } catch (error) {
      console.error('Failed to delete expense:', error);
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <Card className="border-0 shadow-lg bg-white">
        <CardContent className="py-12 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-0 shadow-lg bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-teal-600" />
            Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {displayExpenses.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No expenses yet. Add your first expense above!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {displayExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-lg">
                      {categoryEmojis[expense.category]}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{expense.note || expense.category}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${categoryColors[expense.category]}`}>
                          {expense.category}
                        </span>
                        <span className="text-xs text-gray-500">
                          {format(expense.date, 'MMM d, yyyy')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-gray-900">
                      ${expense.amount.toFixed(2)}
                    </span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-500 hover:text-teal-600"
                        onClick={() => openEditDialog(expense)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-500 hover:text-red-600"
                        onClick={() => handleDelete(expense.id!)}
                        disabled={deleting === expense.id}
                      >
                        {deleting === expense.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!editingExpense} onOpenChange={() => setEditingExpense(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Expense</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Amount ($)</label>
              <Input
                type="number"
                step="0.01"
                value={editAmount}
                onChange={(e) => setEditAmount(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Category</label>
              <Select value={editCategory} onValueChange={(val) => setEditCategory(val as ExpenseCategory)}>
                <SelectTrigger>
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
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Note</label>
              <Input
                type="text"
                value={editNote}
                onChange={(e) => setEditNote(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingExpense(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
