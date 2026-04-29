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

      <main className="bg-[#f4f4f1] min-h-screen">
        <PublicMeetingsContent />
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