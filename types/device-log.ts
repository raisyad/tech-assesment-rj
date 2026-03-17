export interface DeviceLog {
  id: string;
  deviceId: string;
  type: "info" | "warning" | "error" | "success";
  message: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface DeviceLogResponse {
  success: boolean;
  message?: string;
  data: DeviceLog[];
}
