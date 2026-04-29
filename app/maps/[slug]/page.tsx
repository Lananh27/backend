"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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
  mapsItems?: MapItem[];
};

export default function MapDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [home, setHome] = useState<HomeContent | null>(null);
  const [mapItem, setMapItem] = useState<MapItem | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getHomeContent();
        const data = res?.data || null;
        setHome(data);

        const maps: MapItem[] =
          Array.isArray(data?.mapsItems) && data.mapsItems.length > 0
            ? data.mapsItems
            : [];

        const foundMap = maps.find((item) => item.slug === slug);
        setMapItem(foundMap || null);
      } catch (error) {
        console.error("Failed to fetch map detail:", error);
      }
    };

    fetchData();
  }, [slug]);

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
            <div className="mb-6">
              <Link
                href="/maps"
                className="text-[16px] text-[#1d7bba] hover:underline"
              >
                ← Back to Maps
              </Link>
            </div>

            {mapItem ? (
              <article>
                <p className="mb-3 text-[14px] text-gray-500">
                  {mapItem.publishedAt
                    ? new Date(mapItem.publishedAt).toLocaleDateString("vi-VN")
                    : ""}
                </p>

                <h1 className="text-[40px] font-bold text-[#2c3e50]">
                  {mapItem.title}
                </h1>

                <div className="mt-6 border-t pt-6">
                  <div className="overflow-hidden rounded-lg border shadow-sm bg-white">
                    <div className="h-[700px] w-full overflow-hidden">
                      <iframe
                        src={mapItem.link}
                        title={mapItem.title}
                        className="block h-[1100px] w-[100%] origin-top-left scale-[1.15] border-0"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <a
                      href={mapItem.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block rounded-lg bg-[#cce7ff] px-6 py-3 font-semibold text-[#004b7f] hover:bg-[#b6dcff]"
                    >
                      {mapItem.buttonText || "Open Map"}
                    </a>
                  </div>

                  {mapItem.content && (
                    <div
                      className="mt-8 text-[18px] leading-8 text-[#2c3e50] whitespace-pre-line"
                      dangerouslySetInnerHTML={{ __html: mapItem.content }}
                    />
                  )}
                </div>
              </article>
            ) : (
              <div className="text-[20px] text-red-600">Map not found.</div>
            )}
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