"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { CreditCard, Activity, ArrowUpRight, ArrowDownRight, RefreshCw } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Transaction } from "@/types/transaction";
import { DeviceLog } from "@/types/device-log";

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [logs, setLogs] = useState<DeviceLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [transRes, logsRes] = await Promise.all([
          fetch("/api/transactions"),
          fetch("/api/device-logs")
        ]);

        const transData = await transRes.json();
        const logsData = await logsRes.json();

        if (transData.success) setTransactions(transData.data);
        if (logsData.success) setLogs(logsData.data);
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalTransactions = transactions.length;
  const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
  const activeDevices = new Set(logs.map(l => l.deviceId)).size || (logs.length > 0 ? 1 : 0);

  const paymentDistribution = transactions.reduce((acc, t) => {
    const method = t.customerName || "Unknown";
    acc[method] = (acc[method] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sortedPayments = Object.entries(paymentDistribution)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5); // Top 5

  const logDistribution = logs.reduce((acc, l) => {
    acc[l.type] = (acc[l.type] || 0) + 1;
    return acc;
  }, { info: 0, warning: 0, error: 0 } as Record<string, number>);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Transactions</CardTitle>
            <CreditCard className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTransactions}</div>
            <p className="text-xs text-gray-500 mt-1">
              Volume: {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(totalAmount)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Active Devices</CardTitle>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeDevices}</div>
            <p className="text-xs text-gray-500 mt-1">
              Total Logs: {logs.length}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Customer Payments</CardTitle>
            <CardDescription>Distribution of customer payments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sortedPayments.length > 0 ? (
                sortedPayments.map(([method, count]) => {
                  const percentage = totalTransactions > 0 ? (count / totalTransactions) * 100 : 0;
                  return (
                    <div key={method} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-gray-700">{method}</span>
                        <span className="text-gray-500">{count} ({percentage.toFixed(1)}%)</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-100">
                        <div
                          className="h-2 rounded-full bg-blue-600 transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-10 text-center text-sm text-gray-500">No payment data available</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Logs Device Distribution</CardTitle>
            <CardDescription>Log status levels summary</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex h-4 items-center gap-1 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full bg-blue-500 transition-all"
                  style={{ width: `${logs.length > 0 ? (logDistribution.info / logs.length) * 100 : 0}%` }}
                />
                <div
                  className="h-full bg-yellow-400 transition-all"
                  style={{ width: `${logs.length > 0 ? (logDistribution.warning / logs.length) * 100 : 0}%` }}
                />
                <div
                  className="h-full bg-red-500 transition-all"
                  style={{ width: `${logs.length > 0 ? (logDistribution.error / logs.length) * 100 : 0}%` }}
                />
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="space-y-1">
                  <div className="text-sm font-medium text-gray-500">Info</div>
                  <div className="text-xl font-semibold text-blue-600">{logDistribution.info}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-gray-500">Warning</div>
                  <div className="text-xl font-semibold text-yellow-500">{logDistribution.warning}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium text-gray-500">Error</div>
                  <div className="text-xl font-semibold text-red-600">{logDistribution.error}</div>
                </div>
              </div>

              <div className="flex justify-center">
                <Link href="/dashboard/device-logs">
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                    View Detailed Logs
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
