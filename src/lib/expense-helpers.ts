import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
  getDocs,
} from 'firebase/firestore';
import { db } from './firebase';

export type ExpenseCategory = 'Food' | 'Travel' | 'Shopping' | 'Subscriptions' | 'Others';

export interface Expense {
  id?: string;
  userId: string;
  amount: number;
  category: ExpenseCategory;
  note: string;
  date: Date;
  createdAt: Date;
}

export interface UserSettings {
  monthlyBudget: number;
  currency: string;
}

const DEMO_MODE = !process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

let demoExpenses: Expense[] = [];
let demoListeners: ((expenses: Expense[]) => void)[] = [];

function generateDemoData(userId: string): Expense[] {
  const categories: ExpenseCategory[] = ['Food', 'Travel', 'Shopping', 'Subscriptions', 'Others'];
  const foodItems = ['Coffee', 'Lunch', 'Dinner', 'Snacks', 'Groceries'];
  const travelItems = ['Uber', 'Bus', 'Metro', 'Gas', 'Parking'];
  const shoppingItems = ['Clothes', 'Books', 'Electronics', 'Gifts', 'Accessories'];
  const subscriptionItems = ['Netflix', 'Spotify', 'Gym', 'Cloud Storage', 'Magazine'];
  const otherItems = ['Medicine', 'Repair', 'Laundry', 'Haircut', 'Misc'];

  const expenses: Expense[] = [];
  const now = new Date();

  for (let i = 0; i < 30; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    
    const category = categories[Math.floor(Math.random() * categories.length)];
    let note = '';
    let amount = 0;

    switch (category) {
      case 'Food':
        note = foodItems[Math.floor(Math.random() * foodItems.length)];
        amount = Math.floor(Math.random() * 30) + 5;
        break;
      case 'Travel':
        note = travelItems[Math.floor(Math.random() * travelItems.length)];
        amount = Math.floor(Math.random() * 25) + 3;
        break;
      case 'Shopping':
        note = shoppingItems[Math.floor(Math.random() * shoppingItems.length)];
        amount = Math.floor(Math.random() * 100) + 20;
        break;
      case 'Subscriptions':
        note = subscriptionItems[Math.floor(Math.random() * subscriptionItems.length)];
        amount = Math.floor(Math.random() * 15) + 5;
        break;
      default:
        note = otherItems[Math.floor(Math.random() * otherItems.length)];
        amount = Math.floor(Math.random() * 40) + 10;
    }

    expenses.push({
      id: `demo-${i}`,
      userId,
      amount,
      category,
      note,
      date,
      createdAt: date,
    });
  }

  return expenses.sort((a, b) => b.date.getTime() - a.date.getTime());
}

export async function addExpense(expense: Omit<Expense, 'id' | 'createdAt'>): Promise<string> {
  if (DEMO_MODE) {
    const newExpense: Expense = {
      ...expense,
      id: `demo-${Date.now()}`,
      createdAt: new Date(),
    };
    demoExpenses = [newExpense, ...demoExpenses];
    demoListeners.forEach(listener => listener([...demoExpenses]));
    return newExpense.id!;
  }

  const docRef = await addDoc(collection(db, 'expenses'), {
    ...expense,
    date: Timestamp.fromDate(expense.date),
    createdAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function updateExpense(id: string, data: Partial<Expense>): Promise<void> {
  if (DEMO_MODE) {
    demoExpenses = demoExpenses.map(exp => 
      exp.id === id ? { ...exp, ...data } : exp
    );
    demoListeners.forEach(listener => listener([...demoExpenses]));
    return;
  }

  const docRef = doc(db, 'expenses', id);
  const updateData: Record<string, unknown> = { ...data };
  if (data.date) {
    updateData.date = Timestamp.fromDate(data.date);
  }
  await updateDoc(docRef, updateData);
}

export async function deleteExpense(id: string): Promise<void> {
  if (DEMO_MODE) {
    demoExpenses = demoExpenses.filter(exp => exp.id !== id);
    demoListeners.forEach(listener => listener([...demoExpenses]));
    return;
  }

  const docRef = doc(db, 'expenses', id);
  await deleteDoc(docRef);
}

export function subscribeToExpenses(
  userId: string,
  callback: (expenses: Expense[]) => void
): () => void {
  if (DEMO_MODE) {
    if (demoExpenses.length === 0) {
      demoExpenses = generateDemoData(userId);
    }
    callback([...demoExpenses]);
    demoListeners.push(callback);
    return () => {
      demoListeners = demoListeners.filter(l => l !== callback);
    };
  }

  const q = query(
    collection(db, 'expenses'),
    where('userId', '==', userId),
    orderBy('date', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const expenses: Expense[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId,
        amount: data.amount,
        category: data.category,
        note: data.note,
        date: data.date.toDate(),
        createdAt: data.createdAt.toDate(),
      };
    });
    callback(expenses);
  });
}

export function autoCategorizExpense(note: string): ExpenseCategory {
  const lowNote = note.toLowerCase();
  
  const foodKeywords = ['food', 'lunch', 'dinner', 'breakfast', 'coffee', 'cafe', 'restaurant', 'pizza', 'burger', 'snack', 'grocery', 'meal', 'eat'];
  const travelKeywords = ['uber', 'lyft', 'bus', 'train', 'metro', 'gas', 'fuel', 'parking', 'taxi', 'flight', 'travel', 'trip'];
  const shoppingKeywords = ['shop', 'amazon', 'clothes', 'shoes', 'electronics', 'gift', 'store', 'mall', 'buy', 'purchase'];
  const subscriptionKeywords = ['netflix', 'spotify', 'hulu', 'gym', 'membership', 'subscription', 'monthly', 'annual', 'premium'];

  if (foodKeywords.some(kw => lowNote.includes(kw))) return 'Food';
  if (travelKeywords.some(kw => lowNote.includes(kw))) return 'Travel';
  if (shoppingKeywords.some(kw => lowNote.includes(kw))) return 'Shopping';
  if (subscriptionKeywords.some(kw => lowNote.includes(kw))) return 'Subscriptions';
  
  return 'Others';
}
