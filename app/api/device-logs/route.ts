import { NextResponse } from "next/server";
import { env } from "@/lib/env";

export async function GET() {
  try {
    const response = await fetch(env.DEVICE_LOG_API_URL || '', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
      next: { revalidate: 30 },
    });

    if (!response.ok) {
      console.warn(`Device log API returned ${response.status}`);
      return NextResponse.json({
        success: true,
        data: [],
      });
    }

    const rawData = await response.json();

    const dataObject = rawData || {};

    const logs = Object.entries(dataObject).flatMap(([key, deviceData]: [any, any]) => {
      const deviceId = deviceData.device_id || key;
      const logString = deviceData.log || "";
      const cleanLog = logString.replace(/^b"|"$/g, '').replace(/\\n\\t/g, '\n');
      const lines = cleanLog.split('\n').filter((line: string) => line.trim().length > 0);

      return lines.map((line: string, index: number) => {
        const parts = line.split(' - ');
        const timestamp = parts[0] ? parts[0].split(',')[0] : new Date().toISOString();
        const typeStr = parts[1]?.toLowerCase() || "info";
        const message = parts.slice(2).join(' - ') || line;

        return {
          id: `${deviceId}-${index}`,
          deviceId: deviceId,
          type: typeStr.includes("error") ? "error" : typeStr.includes("warning") ? "warning" : "info",
          message: message,
          timestamp: timestamp,
          metadata: { deviceType: deviceData.device_type }
        };
      });
    });


    logs.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return NextResponse.json({
      success: true,
      data: logs,
    });
  } catch (error) {
    console.error("Device logs fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load device logs" },
      { status: 500 }
    );
  }
}
