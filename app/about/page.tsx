"use client";

import { useEffect, useMemo, useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/layout/Container";
import { getAboutContent, getHomeContent } from "@/lib/api";

type HomeContent = {
  siteName?: string;
  headerLogo?: string;
  partnerLogos?: string[] | null;
  footerMailingText?: string;
  footerContactText?: string;
  footerSocialText?: string;
  footerLogo?: string;
};

type AboutContent = {
  content?: string | { html?: string };
};

function extractPlainText(input: string) {
  if (!input) return "";

  if (typeof window !== "undefined") {
    const parser = new DOMParser();
    const doc = parser.parseFromString(input, "text/html");
    const text = doc.body.textContent || "";
    return text.replace(/\s+/g, " ").trim();
  }

  return input.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export default function AboutPage() {
  const [home, setHome] = useState<HomeContent | null>(null);
  const [about, setAbout] = useState<AboutContent | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [homeRes, aboutRes] = await Promise.all([
          getHomeContent(),
          getAboutContent(),
        ]);

        if (homeRes?.data) setHome(homeRes.data);
        if (aboutRes?.data) setAbout(aboutRes.data);
      } catch (error) {
        console.error("FETCH ABOUT PAGE ERROR:", error);
      }
    };

    fetchData();
  }, []);

  const plainText = useMemo(() => {
    if (!about?.content) return "";

    const raw =
      typeof about.content === "string"
        ? about.content
        : about.content?.html || "";

    return extractPlainText(raw);
  }, [about]);

  return (
    <>
      <Header
        siteName={home?.siteName}
        headerLogo={home?.headerLogo}
        partnerLogos={home?.partnerLogos}
      />

      <main className="min-h-screen bg-[#f3f6fb] py-14 md:py-20">
        <Container>
          <section className="mx-auto max-w-5xl">
            <div className="rounded-[28px] bg-white px-6 py-10 shadow-[0_12px_40px_rgba(15,23,42,0.08)] md:px-12 md:py-14">
              <span className="inline-block rounded-full bg-lime-100 px-4 py-1 text-sm font-semibold uppercase tracking-[0.16em] text-lime-700">
                About us
              </span>

              <h1 className="mt-4 text-4xl font-bold text-slate-900 md:text-5xl">
                About IMRWG
              </h1>

              <div className="mt-5 h-1.5 w-24 rounded-full bg-lime-400" />

              <div className="mx-auto mt-10 max-w-3xl">
                <p className="text-left text-[18px] leading-9 text-slate-700">
                  {plainText}
                </p>
              </div>
            </div>
          </section>
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