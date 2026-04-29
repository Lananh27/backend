"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { label: "Dashboard", href: "/admin" },
  { label: "Home", href: "/admin/home" },
  { label: "About us", href: "/admin/about" },
  { label: "Meetings", href: "/admin/meetings" },
  { label: "People", href: "/admin/people" },
  { label: "Projects", href: "/admin/projects" },
  { label: "Maps", href: "/admin/maps" },
  { label: "Data", href: "/admin/data" },
  { label: "Documents", href: "/admin/documents" },
  { label: "Education", href: "/admin/education" },
  { label: "Attention", href: "/admin/attention" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-black text-white p-6">
      <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-lg px-4 py-3 transition ${
                active
                  ? "bg-lime-400 text-black font-semibold"
                  : "hover:bg-white/10"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}