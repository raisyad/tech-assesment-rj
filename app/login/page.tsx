"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setError(result.message || "Invalid credentials");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">IoTera Dashboard</h1>
          <p className="mt-2 text-sm text-gray-600">Please sign in to your account</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle className="text-xl text-center">Login</CardTitle>
              <CardDescription className="text-center">Enter your credentials to access the admin panel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Username"
                type="text"
                placeholder="Enter username"
                required
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
              <Input
                label="Password"
                type="password"
                placeholder="Enter password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              {error && (
                <div className="rounded-md bg-red-50 p-3 text-sm font-medium text-red-800">
                  {error}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" isLoading={isLoading}>
                Sign In
              </Button>
            </CardFooter>
          </form>
        </Card>

        <div className="mt-6 text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} IoTera Technical Test. All rights reserved. RJ.
        </div>
      </div>
    </div>
  );
}
