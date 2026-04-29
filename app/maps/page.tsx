"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/layout/Container";
import { getHomeContent } from "@/lib/api";

type MapItem = {
  title: string;
  slug: string;
  content: string;
  link: string;
  buttonText: string;
  publishedAt: string;
};

type HomeContent = {
  siteName?: string;
  headerLogo?: string;
  partnerLogos?: string[] | null;
  footerMailingText?: string;
  footerContactText?: string;
  footerSocialText?: string;
  footerLogo?: string;
  mapsSectionTitle?: string;
  mapsItems?: MapItem[];
};

export default function MapsPage() {
  const [home, setHome] = useState<HomeContent | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getHomeContent();
        if (res?.data) {
          setHome(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch maps content:", error);
      }
    };

    fetchData();
  }, []);

  const sortedMaps =
    Array.isArray(home?.mapsItems)
      ? [...home.mapsItems].sort(
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
              {home?.mapsSectionTitle || "Maps"}
            </h1>

            <div className="space-y-10">
              {sortedMaps.length > 0 ? (
                sortedMaps.map((item, index) => (
                  <div key={index} className="rounded-lg border p-6">
                    <p className="mb-2 text-[14px] text-gray-500">
                      {item.publishedAt
                        ? new Date(item.publishedAt).toLocaleDateString("vi-VN")
                        : ""}
                    </p>

                    <h2 className="text-[28px] font-bold text-[#004b7f]">
                      {item.title}
                    </h2>

                    <div className="mt-5 overflow-hidden rounded-lg border bg-white shadow-sm">
                      {item.link ? (
                        <div className="h-[420px] w-full overflow-hidden">
                          <iframe
                            src={item.link}
                            title={item.title}
                            className="h-full w-full border-0"
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                          />
                        </div>
                      ) : (
                        <div className="flex h-[420px] items-center justify-center bg-[#cce7ff] text-[18px] text-gray-600">
                          Chưa có link map
                        </div>
                      )}
                    </div>

                    <div className="mt-5 flex gap-4">
                      <Link
                        href={`/maps/${item.slug}`}
                        className="inline-block rounded-lg bg-[#cce7ff] px-5 py-3 font-semibold text-[#004b7f] hover:bg-[#b6d9f0]"
                      >
                        {item.buttonText || "View Map"}
                      </Link>

                      {item.link && (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block rounded-lg border border-[#004b7f] px-5 py-3 font-semibold text-[#004b7f] hover:bg-[#f4faff]"
                        >
                          Open External Map
                        </a>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-[18px] text-gray-500">
                  Chưa có nội dung Maps.
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