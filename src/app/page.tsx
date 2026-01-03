"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Wallet,
  TrendingUp,
  PieChart,
  Brain,
  Shield,
  Smartphone,
  ArrowRight,
  Loader2,
} from 'lucide-react';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-cyan-50 to-emerald-50">
        <Loader2 className="w-10 h-10 animate-spin text-teal-600" />
      </div>
    );
  }

  const features = [
    {
      icon: TrendingUp,
      title: 'Track Expenses',
      description: 'Log daily spending with auto-categorization',
    },
    {
      icon: PieChart,
      title: 'Visual Analytics',
      description: 'Beautiful charts showing spending patterns',
    },
    {
      icon: Brain,
      title: 'AI Insights',
      description: 'Smart tips and predictions powered by AI',
    },
    {
      icon: Shield,
      title: 'Budget Alerts',
      description: 'Stay on track with real-time budget warnings',
    },
    {
      icon: Smartphone,
      title: 'Mobile First',
      description: 'Designed for on-the-go expense tracking',
    },
    {
      icon: Wallet,
      title: 'Student Friendly',
      description: 'Built for college students budget needs',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-emerald-50">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-teal-200/40 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-200/40 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-200/30 rounded-full blur-3xl" />
      </div>

      <nav className="relative z-10 p-4 lg:p-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">SpendSmart AI</span>
          </Link>
          <div className="flex gap-3">
            <Link href="/login">
              <Button variant="ghost" className="text-gray-700 hover:text-gray-900">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        <section className="px-4 py-16 lg:py-24">
          <div className="max-w-6xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full text-sm text-teal-700 font-medium mb-6 shadow-sm">
              <Brain className="w-4 h-4" />
              AI-Powered Expense Tracking
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Track Smarter,
              <br />
              <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                Spend Wiser
              </span>
            </h1>
            <p className="text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              The intelligent expense tracker designed for college students. 
              Stop wondering where your money went - let AI help you understand and control your spending.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button className="h-12 px-8 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white text-lg font-medium shadow-lg shadow-teal-500/25">
                  Start Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" className="h-12 px-8 text-lg border-gray-300 text-gray-700">
                  Try Demo
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Everything You Need to Manage Your Finances
              </h2>
              <p className="text-gray-600 max-w-xl mx-auto">
                Built specifically for college students who want to track spending and save money.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="p-6 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 hover:shadow-xl transition-shadow"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4 shadow-md">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-3xl p-8 lg:p-12 text-center text-white shadow-2xl shadow-teal-500/30">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Ready to Take Control?
              </h2>
              <p className="text-lg text-white/90 mb-8 max-w-xl mx-auto">
                Join thousands of students who are already tracking their expenses smarter.
              </p>
              <Link href="/signup">
                <Button className="h-12 px-8 bg-white text-teal-600 hover:bg-gray-100 text-lg font-medium shadow-lg">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 px-4 py-8 border-t border-gray-200/50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <Wallet className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-gray-900">SpendSmart AI</span>
          </div>
          <p className="text-sm text-gray-500">
            Built for GDG TechSprint Hackathon 2024
          </p>
        </div>
      </footer>
    </div>
  );
}
