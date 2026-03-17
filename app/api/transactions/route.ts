import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { getSession } from "@/lib/session";

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const response = await fetch(env.LOGIN_API_URL || '', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: session.user.username,
        password: session.user.password,
      }),
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch transactions: ${response.status}`);
    }

    const rawData = await response.json();

    const dataObject = rawData.data || {};

    const transactions = Object.entries(dataObject).map(([key, value]: [string, any]) => ({
      id: key,
      amount: value.payment?.amount || value.product?.price || 0,
      status: value.detail?.transaction_status === "settlement" ? "success" : "pending",
      createdAt: value.payment?.detail?.transaction_time || new Date(value.time?.timestamp || Date.now()).toISOString(),
      customerName: value.payment?.detail?.issuer || "Unknown",
      productName: value.product?.name || "Unknown Product",
    }));

    return NextResponse.json({
      success: true,
      data: transactions,
    });
  } catch (error) {
    console.error("Transactions fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load transactions" },
      { status: 500 }
    );
  }
}
