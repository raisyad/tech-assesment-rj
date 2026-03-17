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
  const errorLogs = logs.filter(l => l.type === "error").length;

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Error Logs Device</CardTitle>
            <Activity className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{errorLogs}</div>
            <p className="text-xs text-red-600 flex items-center mt-1">
              Attention
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Monitor latest transactions activity</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-10 text-center">
            <p className="text-sm text-gray-500 mb-4">
              {transactions.length > 0
                ? `${transactions.length} transactions recorded.`
                : "No transactions found yet."}
            </p>
            <Link href="/dashboard/transactions">
              <Button variant="outline">View All Transactions</Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Log Device Monitoring</CardTitle>
            <CardDescription>Check the status of device logs</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-10 text-center">
            <p className="text-sm text-gray-500 mb-4">
              {logs.length > 0
                ? `Monitoring ${logs.length} log entries.`
                : "No device logs available."}
            </p>
            <Link href="/dashboard/device-logs">
              <Button variant="outline">View Device Logs</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
