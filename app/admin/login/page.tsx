"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/api";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("admin@gmail.com");
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("Vui lòng nhập đầy đủ email và mật khẩu.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim(),
        }),
      });

      let data: any = {};
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      if (!res.ok) {
        setError(data?.message || "Đăng nhập thất bại.");
        return;
      }

      if (!data?.token) {
        setError("Backend không trả về token.");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user || {}));

      router.replace("/admin/home");
    } catch (err) {
      console.error("LOGIN FETCH ERROR:", err);
      setError("Không thể kết nối backend.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f4f4f1] px-4">
      <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Admin Login</h1>
          <p className="mt-2 text-gray-500">
            Sign in to manage website content
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Nhập email"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Mật khẩu
            </label>
            <input
              type="password"
              className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
            />
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-black py-3 text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>
      </div>
    </div>
  );
}