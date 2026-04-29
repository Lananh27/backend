"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/layout/Container";
import { getHomeContent } from "@/lib/api";

type AttentionItem = {
  title: string;
  content: string;
  postSlug: string;
};

type HomeContent = {
  siteName?: string;
  headerLogo?: string;
  partnerLogos?: string[] | null;
  attentionItems?: AttentionItem[];
  footerMailingText?: string;
  footerContactText?: string;
  footerSocialText?: string;
  footerLogo?: string;
};

export default function AttentionPage() {
  const [home, setHome] = useState<HomeContent | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getHomeContent();
        if (res?.data) {
          setHome(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch attention data:", error);
      }
    };

    fetchData();
  }, []);

  const attentionItems: AttentionItem[] =
    Array.isArray(home?.attentionItems) && home.attentionItems.length > 0
      ? home.attentionItems
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
            <div className="mb-8 flex items-center justify-between border-b pb-4">
              <h1 className="text-[36px] font-bold text-[#2c3e50]">Attention</h1>
              <Link
                href="/"
                className="text-[18px] text-[#1d7bba] hover:underline"
              >
                Back to Home
              </Link>
            </div>

            <div className="space-y-6">
              {attentionItems.map((item, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-[#d7dfcc] bg-[#f8fbf4] p-5"
                >
                  <Link href={`/documents/attention/${item.postSlug}`}>
                    <h2 className="text-[24px] font-semibold text-[#1d7bba] hover:underline">
                      {item.title}
                    </h2>
                  </Link>

                  <div
                    className="mt-3 line-clamp-3 text-[18px] leading-8 text-[#2c3e50]"
                    dangerouslySetInnerHTML={{ __html: item.content }}
                  />
                </div>
              ))}
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