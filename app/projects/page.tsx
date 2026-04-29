"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/layout/Container";
import { API_URL, getHomeContent } from "@/lib/api";

type ProjectItem = {
  title: string;
  subtitle: string;
  description: string;
  bullets: string[];
  image: string;
  readMoreLink: string;
  publishedAt: string;
  slug?: string;
};

type HomeContent = {
  siteName?: string;
  headerLogo?: string;
  partnerLogos?: string[] | null;
  footerMailingText?: string;
  footerContactText?: string;
  footerSocialText?: string;
  footerLogo?: string;
  projectsSectionTitle?: string;
  projectsItems?: ProjectItem[];
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function ProjectsPage() {
  const [home, setHome] = useState<HomeContent | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getHomeContent();
        if (res?.data) {
          setHome(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch projects content:", error);
      }
    };

    fetchData();
  }, []);

  const imgUrl = (url?: string | null) => {
    if (!url || !url.trim()) return "";
    return url.startsWith("http") ? url : `${API_URL}${url}`;
  };

  const sortedProjects =
    Array.isArray(home?.projectsItems)
      ? [...home.projectsItems].sort(
          (a, b) =>
            new Date(b.publishedAt || "1970-01-01").getTime() -
            new Date(a.publishedAt || "1970-01-01").getTime()
        )
      : [];

  return (
    <>
      <Header
        siteName={home?.siteName}
        headerLogo={home?.headerLogo}
        partnerLogos={home?.partnerLogos}
      />

      <main className="min-h-screen bg-[#efefef] py-10">
        <Container>
          <div className="rounded-xl bg-white p-8 shadow-md">
            <h1 className="mb-8 text-[40px] font-bold text-[#2c3e50]">
              {home?.projectsSectionTitle || "Projects"}
            </h1>

            <div className="space-y-10">
              {sortedProjects.length > 0 ? (
                sortedProjects.map((item, index) => {
                  const projectSlug = item.slug || slugify(item.title || `project-${index + 1}`);

                  return (
                    <div
                      key={index}
                      className="overflow-hidden rounded-xl border bg-white shadow-sm"
                    >
                      <div className="grid gap-6 p-6 lg:grid-cols-[320px_1fr]">
                        <div className="overflow-hidden rounded-lg bg-[#cce7ff]">
                          {item.image ? (
                            <img
                              src={imgUrl(item.image)}
                              alt={item.title}
                              className="h-[260px] w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-[260px] items-center justify-center text-gray-500">
                              Chưa có ảnh project
                            </div>
                          )}
                        </div>

                        <div>
                          {item.subtitle && (
                            <h2 className="text-[24px] font-bold text-[#2c3e50]">
                              {item.subtitle}
                            </h2>
                          )}

                          <h3 className="mt-2 text-[34px] font-bold text-[#1f3b63]">
                            {item.title}
                          </h3>

                          {item.description && (
                            <p className="mt-4 text-[18px] leading-8 text-gray-700">
                              {item.description}
                            </p>
                          )}

                          {Array.isArray(item.bullets) && item.bullets.length > 0 && (
                            <ul className="mt-4 list-disc space-y-2 pl-6 text-[17px] leading-8 text-gray-700">
                              {item.bullets.map((bullet, bulletIndex) => (
                                <li key={bulletIndex}>{bullet}</li>
                              ))}
                            </ul>
                          )}

                          <div className="mt-6">
                            <Link
                              href={`/projects/${projectSlug}`}
                              className="font-semibold text-[#1d7bba] hover:underline"
                            >
                              Read more
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-[18px] text-gray-500">
                  Chưa có nội dung Projects.
                </div>
              )}
            </div>
          </div>
        </Container>
      </main>

      <Footer
        footerLogo={home?.footerLogo}
        footerMailingText={home?.footerMailingText}
        footerContactText={home?.footerContactText}
        footerSocialText={home?.footerSocialText}
      />
    </>
  );
}