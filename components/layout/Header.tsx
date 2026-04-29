"use client";

import { useState } from "react";
import Link from "next/link";
import Container from "./Container";
import { usePathname } from "next/navigation";

type HeaderProps = {
  siteName?: string;
  headerLogo?: string;
  partnerLogos?: string[] | null;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About us", href: "/about" },
  { label: "Meetings", href: "/meetings" },
  { label: "People", href: "/people" },
  { label: "Projects", href: "/projects" },
  { label: "Maps", href: "/maps" },
  { label: "Data", href: "/data" },
  {
    label: "Documents",
    href: "/documents",
    children: [{ label: "Attention", href: "/documents" }],
  },
  { label: "Education", href: "/education" },
];

export default function Header({
  siteName,
  headerLogo,
  partnerLogos = [],
}: HeaderProps) {
  const safePartnerLogos = Array.isArray(partnerLogos) ? partnerLogos : [];
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const imgUrl = (url?: string) => {
    if (!url) return "";
    return url.startsWith("http") ? url : `${API_URL}${url}`;
  };

  return (
    <header
      className="py-6 text-white"
      style={{
        backgroundImage: "url('/images/background.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Container>
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="flex min-w-0 flex-1 items-start gap-5">
            {headerLogo ? (
              <div className="flex shrink-0 items-center justify-center bg-white/10 p-2">
                <img
                  src={imgUrl(headerLogo)}
                  alt="Main logo"
                  className="max-h-[92px] w-auto object-contain"
                />
              </div>
            ) : (
              <div className="h-[85px] w-[85px] shrink-0 border-2 border-cyan-400" />
            )}

            <div className="flex min-w-0 items-start gap-5">
              <h1 className="max-w-[520px] text-[28px] font-semibold leading-tight xl:text-[32px]">
                {siteName || "International Mekong Research Working Group (IMRWG)"}
              </h1>

              <div className="mt-1 hidden items-center gap-4 md:flex">
                {safePartnerLogos.length > 0 ? (
                  safePartnerLogos.slice(0, 4).map((logo, index) => (
                    <div
                      key={index}
                      className="flex min-h-[65px] min-w-[65px] items-center justify-center bg-white p-1"
                    >
                      <img
                        src={imgUrl(logo)}
                        alt={`Sub logo ${index + 1}`}
                        className="max-h-[65px] w-auto object-contain"
                      />
                    </div>
                  ))
                ) : (
                  <>
                    <div className="h-[65px] w-[65px] bg-white" />
                    <div className="h-[65px] w-[65px] bg-white" />
                    <div className="h-[65px] w-[65px] bg-white" />
                    <div className="h-[65px] w-[65px] bg-white" />
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="w-full shrink-0 xl:ml-auto xl:w-[380px]">
            <div className="flex h-[60px] w-full items-center rounded-full bg-white px-6 text-[18px] text-gray-500">
              Search
            </div>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/15 xl:hidden"
          >
            ☰
          </button>
        </div>

        <nav
          className={`mt-6 ${
            mobileOpen ? "flex" : "hidden"
          } flex-col gap-3 xl:flex xl:flex-row xl:flex-wrap xl:items-center xl:justify-end xl:gap-8 xl:text-[18px] xl:font-medium`}
        >
          {navItems.map((item, index) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setOpenMenu(item.label)}
                onMouseLeave={() => setOpenMenu(null)}
              >
                <div
                  className={`flex items-center gap-1 ${
                    index === 0 && pathname === "/"
                      ? "rounded bg-[#9ac06f] px-3 py-2 text-black"
                      : ""
                  }`}
                >
                  <Link
                    href={item.href}
                    className={isActive ? "text-lime-300" : "text-white"}
                  >
                    {item.label}
                  </Link>

                  {"children" in item && item.children ? (
                    <button
                      type="button"
                      onClick={() =>
                        setOpenMenu(openMenu === item.label ? null : item.label)
                      }
                      className="text-xs text-white"
                    >
                      ▼
                    </button>
                  ) : null}
                </div>

                {"children" in item && item.children && openMenu === item.label ? (
                  <div className="mt-2 overflow-hidden rounded-xl border border-white/10 bg-[#111] shadow-2xl xl:absolute xl:right-0 xl:top-full xl:min-w-[220px]">
                    {item.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        onClick={() => {
                          setOpenMenu(null);
                          setMobileOpen(false);
                        }}
                        className="block border-b border-white/10 px-5 py-3 text-white hover:bg-[#1c1c1c] hover:text-lime-300 last:border-b-0"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
        </nav>
      </Container>
    </header>
  );
}