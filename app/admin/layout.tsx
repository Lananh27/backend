"use client";

import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      setChecked(true);
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/admin/login");
      return;
    }

    setChecked(true);
  }, [isLoginPage, router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.replace("/admin/login");
  };

  if (!checked) return null;

  if (isLoginPage) {
    return <>{children}</>;
  }

  const menuItems = [
    { key: "dashboard", label: "Dashboard", href: "/admin" },
    { key: "home", label: "Home", href: "/admin/home" },
    { key: "about", label: "About us", href: "/admin/about" },
    { key: "meetings", label: "Meetings", href: "/admin/meetings" },
    { key: "people", label: "People", href: "/admin/people" },
    { key: "projects", label: "Projects", href: "/admin/projects" },
    { key: "maps", label: "Maps", href: "/admin/maps" },
    { key: "data", label: "Data", href: "/admin/data" },
    { key: "documents", label: "Documents", href: "/admin/documents" },
    { key: "education", label: "Education", href: "/admin/education" },
    { key: "attention", label: "Attention", href: "/admin/attention" },
  ];

  return (
    <div className="min-h-screen bg-[#efefef]">
      <div className="flex min-h-screen">
        <aside className="w-[230px] bg-black text-white">
          <div className="px-6 py-6 text-[22px] font-bold">Admin Panel</div>

          <nav className="space-y-2 px-4 py-4">
            {menuItems.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/admin" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`block rounded-xl px-4 py-3 text-[16px] transition ${
                    active
                      ? "bg-lime-400 font-semibold text-black"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <div className="flex-1">
          <header className="flex items-start justify-between border-b border-black/20 bg-[#efefef] px-8 py-5">
            <div>
              <h1 className="text-[20px] font-bold text-[#1f2d3d]">
                Quản trị website
              </h1>
              <p className="text-[14px] text-gray-500">
                Quản lý nội dung toàn bộ website IMRWG
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="rounded-xl border border-black px-5 py-3 text-[16px] hover:bg-black hover:text-white"
            >
              Đăng xuất
            </button>
          </header>

          <main className="p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}