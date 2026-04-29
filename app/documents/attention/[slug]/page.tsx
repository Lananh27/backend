"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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

export default function AttentionDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [home, setHome] = useState<HomeContent | null>(null);
  const [post, setPost] = useState<AttentionItem | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getHomeContent();
        const data = res?.data || null;
        setHome(data);

        const attentionItems: AttentionItem[] =
          Array.isArray(data?.attentionItems) && data.attentionItems.length > 0
            ? data.attentionItems
            : [];

        const foundPost = attentionItems.find((item) => item.postSlug === slug);
        setPost(foundPost || null);
      } catch (error) {
        console.error("Failed to fetch attention detail:", error);
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
                href="/documents/attention"
                className="text-[16px] text-[#1d7bba] hover:underline"
              >
                ← Back to Attention
              </Link>
            </div>

            {post ? (
              <article>
                <h1 className="text-[36px] font-bold text-[#2c3e50]">
                  {post.title}
                </h1>

                <div className="mt-6 border-t pt-6">
                  <div
                    className="max-w-none break-words text-[20px] leading-9 text-[#2c3e50] [&_img]:my-4 [&_img]:max-w-full [&_img]:rounded-lg [&_img]:shadow-md [&_p]:break-words [&_*]:break-words"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                </div>
              </article>
            ) : (
              <div className="text-[20px] text-red-600">Article not found.</div>
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