import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { createSession } from "@/lib/session";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: "Username and password are required" },
        { status: 400 }
      );
    }

    const externalResponse = await fetch(env.LOGIN_API_URL || '', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await externalResponse.json();

    const isValid = externalResponse.ok;

    if (!isValid) {
      return NextResponse.json(
        { success: false, message: data.message || "Invalid credentials" },
        { status: 401 }
      );
    }

    await createSession(username, password);

    return NextResponse.json({
      success: true,
      message: "Login successful",
      data: data,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred during login" },
      { status: 500 }
    );
  }
}
