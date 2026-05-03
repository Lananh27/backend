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

type NavItem = {
  label: string;
  href?: string;
  children?: NavItem[];
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "About us",
    href: "/about",
    children: [
      { label: "About IMRWG", href: "/about" },
      { label: "Partenaires", href: "/about/partenaires" },
      { label: "Contact", href: "/about/contact" },
    ],
  },
  {
    label: "Meetings",
    href: "/meetings/past",
    children: [
      { label: "Past Meetings", href: "/meetings/past" },
      { label: "Upcoming Meetings", href: "/meetings/upcoming" },
      { label: "Registration", href: "/meetings/registration" },
    ],
  },
  { label: "People", href: "/people" },
  { label: "Projects", href: "/projects" },
  { label: "Maps", href: "/maps" },
  {
    label: "Data",
    children: [
      { label: "Conference data", href: "/data/conference-data" },
      { label: "Data download", href: "/data/data-download" },
    ],
  },
  {
    label: "Documents",
    href: "/documents",
    children: [
      { label: "Articles", href: "/documents" },
      { label: "Library", href: "/documents/library" }
    ],
    
  },
  { label: "Education", href: "/education" },
];

export default function Header({
  siteName,
  headerLogo,
  partnerLogos = [],
}: HeaderProps) {
  const pathname = usePathname();

  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const safePartnerLogos = Array.isArray(partnerLogos) ? partnerLogos : [];

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
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="flex min-w-0 flex-1 items-start gap-4">
            {headerLogo ? (
              <div className="flex h-[92px] w-[92px] shrink-0 items-center justify-center bg-white/10 p-2">
                <img
                  src={imgUrl(headerLogo)}
                  alt="Main logo"
                  className="max-h-full w-auto object-contain"
                />
              </div>
            ) : (
              <div className="h-[92px] w-[92px] shrink-0 border-2 border-cyan-400" />
            )}

            <div className="flex min-w-0 flex-1 items-start gap-3">
              <h1 className="max-w-[430px] text-[24px] font-semibold leading-tight xl:text-[28px]">
                {siteName ||
                  "International Mekong Research Working Group (IMRWG)"}
              </h1>

              <div className="hidden shrink-0 items-start gap-2 md:flex">
                {safePartnerLogos.length > 0 ? (
                  safePartnerLogos.slice(0, 4).map((logo, index) => (
                    <div
                      key={index}
                      className="flex h-[65px] w-[65px] items-center justify-center bg-white p-1 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                    >
                      <img
                        src={imgUrl(logo)}
                        alt={`Sub logo ${index + 1}`}
                        className="max-h-full w-auto object-contain"
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

          <div className="w-full shrink-0 xl:ml-auto xl:flex xl:w-[260px] xl:justify-end">
            <div className="flex h-[42px] w-full items-center rounded-full bg-white/95 px-5 text-[15px] text-gray-500 shadow-md transition duration-300 focus-within:ring-2 focus-within:ring-lime-300 xl:w-[230px]">
              Search
            </div>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/15 transition duration-300 hover:bg-white/10 xl:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? "×" : "☰"}
          </button>
        </div>

        <nav
          className={`mt-6 ${
            mobileOpen ? "flex" : "hidden"
          } flex-col gap-3 xl:flex xl:flex-row xl:flex-wrap xl:items-center xl:justify-end xl:gap-3 xl:text-[17px] xl:font-medium`}
        >
          {navItems.map((item) => {
            const hasChildren = Boolean(item.children?.length);

            const isActive = item.href
              ? item.href === "/"
                ? pathname === "/"
                : pathname === item.href ||
                  pathname.startsWith(`${item.href}/`)
              : item.children?.some(
                  (child) =>
                    pathname === child.href ||
                    pathname.startsWith(`${child.href}/`)
                );

            const toggleMenu = () => {
              if (hasChildren) {
                setOpenMenu(openMenu === item.label ? null : item.label);
              }
            };

            return (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => {
                  if (hasChildren) setOpenMenu(item.label);
                }}
                onMouseLeave={() => {
                  if (hasChildren) setOpenMenu(null);
                }}
              >
                <div
                  className={`group relative flex items-center gap-1 rounded-full px-3.5 py-2 transition-all duration-300 ${
                    isActive
                      ? "bg-[#9ac06f] text-black shadow-[0_8px_22px_rgba(154,192,111,0.35)]"
                      : "text-white hover:-translate-y-0.5 hover:bg-white/10 hover:text-lime-200"
                  }`}
                >
                  {hasChildren ? (
                    <button
                      type="button"
                      onClick={toggleMenu}
                      className="relative z-10 cursor-pointer"
                    >
                      {item.label}
                    </button>
                  ) : (
                    <Link
                      href={item.href || "#"}
                      onClick={() => {
                        setMobileOpen(false);
                        setOpenMenu(null);
                      }}
                      className="relative z-10"
                    >
                      {item.label}
                    </Link>
                  )}

                  {hasChildren && (
                    <button
                      type="button"
                      onClick={toggleMenu}
                      className={`relative z-10 text-xs transition duration-300 ${
                        openMenu === item.label ? "rotate-180" : ""
                      }`}
                      aria-label={`Toggle ${item.label} menu`}
                    >
                      ▼
                    </button>
                  )}

                  {!isActive && (
                    <span className="absolute bottom-1 left-1/2 h-[2px] w-0 -translate-x-1/2 rounded-full bg-lime-300 transition-all duration-300 group-hover:w-[70%]" />
                  )}
                </div>

                {hasChildren && openMenu === item.label ? (
                  <div className="pt-2 xl:absolute xl:right-0 xl:top-full xl:z-50 xl:min-w-[250px]">
                    <div className="animate-dropdown overflow-hidden rounded-xl border border-white/10 bg-[#111] shadow-2xl">
                      {(item.children ?? []).map((child) => {
                        const childActive =
                          pathname === child.href ||
                          pathname.startsWith(`${child.href}/`);

                        return (
                          <Link
                            key={child.label}
                            href={child.href || "#"}
                            onClick={() => {
                              setOpenMenu(null);
                              setMobileOpen(false);
                            }}
                            className={`block border-b border-white/10 px-5 py-3 text-[15px] font-semibold transition-all duration-300 last:border-b-0 ${
                              childActive
                                ? "bg-[#9ac06f] text-black"
                                : "text-white hover:bg-[#9ac06f] hover:pl-7 hover:text-black"
                            }`}
                          >
                            {child.label}
                          </Link>
                        );
                      })}
                    </div>
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