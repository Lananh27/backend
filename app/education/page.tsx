"use client";

import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/layout/Container";
import { getHomeContent, getPeople } from "@/lib/api";
import PublicMeetingsContent from "@/components/layout/PublicMeetingsContent";
import Link from "next/link";

type PersonItem = {
  id: number;
  fullName: string;
  role?: string;
  institution?: string;
  email?: string;
  cvLink?: string;
  location?: string;
  avatar?: string;
  bio?: string;
};

type HomeContent = {
  siteName?: string;
  headerLogo?: string;
  partnerLogos?: string[] | null;
  footerMailingText?: string;
  footerContactText?: string;
  footerSocialText?: string;
  footerLogo?: string;
};

export default function PeoplePage() {
  const [home, setHome] = useState<HomeContent | null>(null);
  const [people, setPeople] = useState<PersonItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [homeRes, peopleRes] = await Promise.all([
          getHomeContent(),
          getPeople(),
        ]);

        if (homeRes?.data) setHome(homeRes.data);
        if (peopleRes?.data) setPeople(peopleRes.data);
      } catch (error) {
        console.error("FETCH PEOPLE PAGE ERROR:", error);
      }
    };

    fetchData();
  }, []);


  return (
    <>
      <Header
        siteName={home?.siteName}
        headerLogo={home?.headerLogo}
        partnerLogos={home?.partnerLogos}
      />

      <main className="min-h-screen bg-white py-16">
  <Container>
    <section className="mx-auto max-w-6xl">
      <h1 className="text-3xl font-bold text-black md:text-4xl">
        EDUCTION
      </h1>

      <div className="mt-4 mb-8 h-[2px] w-32 bg-lime-400" />

      <p className="mt-8 text-justify text-base leading-8 text-gray-700 md:text-lg">
        Chưa có dữ liệu
      </p>
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