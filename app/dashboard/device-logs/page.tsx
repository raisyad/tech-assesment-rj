"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { formatDate, cn } from "@/lib/utils";
import { DeviceLog } from "@/types/device-log";
import { RefreshCw, AlertTriangle, Info, CheckCircle2, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DeviceLogsPage() {
  const [logs, setLogs] = useState<DeviceLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add pagination logic
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10

  // add filter logic
  const [typeFilter, setTypeFilter] = useState("all");
  const [deviceFilter, setDeviceFilter] = useState("all");

  const fetchLogs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/device-logs");
      const result = await response.json();
      if (result.success) {
        setLogs(result.data);
      } else {
        setError(result.message || "Failed to load device logs");
      }
    } catch (err) {
      setError("An unexpected error occurred while fetching device logs.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const deviceIds = Array.from(new Set(logs.map(l => l.deviceId)));

  const filteredLogs = logs.filter(log => {
    const matchesType = typeFilter === "all" || log.type === typeFilter;
    const matchesDevice = deviceFilter === "all" || log.deviceId === deviceFilter;
    return matchesType && matchesDevice;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredLogs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);

  const getLogIcon = (type: string) => {
    switch (type) {
      case "error":
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      default:
        return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  if (error) {
    return <ErrorState onRetry={fetchLogs} description={error} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 mb-6">
        <select
          className="p-2 border rounded-md bg-white text-sm text-black"
          value={deviceFilter}
          onChange={(e) => { setDeviceFilter(e.target.value); setCurrentPage(1); }}
        >
          <option value="all">All Devices</option>
          {deviceIds.map(id => (
            <option key={id} value={id}>Device {id}</option>
          ))}
        </select>
        <select
          className="p-2 border rounded-md bg-white text-sm text-black"
          value={typeFilter}
          onChange={(e) => { setTypeFilter(e.target.value); setCurrentPage(1); }}
        >
          <option value="all">All Types</option>
          <option value="info">Info</option>
          <option value="warning">Warning</option>
          <option value="error">Error</option>
        </select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Device Monitoring Logs</CardTitle>
          <CardDescription>
            Logs device monitoring activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : logs.length === 0 ? (
            <EmptyState
              title={"No device logs"}
              description={"No activity recorded for your devices yet."}
            />
          ) : (
            <div className="space-y-4">
              {currentItems.map((log) => (
                <div
                  key={log.id}
                  className={cn(
                    "flex items-start gap-4 rounded-lg border p-4 transition-colors",
                    log.type === "error" ? "border-red-100 bg-red-50/30" :
                      log.type === "warning" ? "border-yellow-100 bg-yellow-50/30" :
                        "border-gray-100 bg-white"
                  )}
                >
                  <div className="mt-0.5">{getLogIcon(log.type)}</div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-gray-900">{log.deviceId}</p>
                      <time className="text-xs text-gray-500">{formatDate(log.timestamp)}</time>
                    </div>
                    <p className="text-sm text-gray-700">{log.message}</p>
                    {log.metadata && Object.keys(log.metadata).length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {Object.entries(log.metadata).map(([key, value]) => (
                          <span key={key} className="inline-flex items-center rounded bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600">
                            {key}: {String(value)}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <div className="flex items-center justify-between px-2 py-4 border-t">
          <p className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
