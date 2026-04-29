"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/layout/Container";
import { API_URL, getHomeContent, getPeople } from "@/lib/api";

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

  const imgUrl = (url?: string) => {
    if (!url) return "";
    return url.startsWith("http") ? url : `${API_URL}${url}`;
  };

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
            <h1 className="mb-10 text-center text-[40px] font-bold text-[#2c3e50]">
              FEATURED SPEAKERS
            </h1>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {people.length > 0 ? (
                people.map((person) => (
                  <div
                    key={person.id}
                    className="rounded-2xl bg-white p-6 text-center shadow-md"
                  >
                    <div className="mx-auto h-[170px] w-[170px] overflow-hidden rounded-full">
                      {person.avatar ? (
                        <img
                          src={imgUrl(person.avatar)}
                          alt={person.fullName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gray-200">
                          No image
                        </div>
                      )}
                    </div>

                    <h2 className="mt-6 text-[20px] font-bold text-[#2c3e50]">
                      {person.fullName}
                    </h2>

                    <Link
                      href={`/people/${person.id}`}
                      className="mt-4 inline-block text-[15px] font-medium text-[#1d7bba] hover:underline"
                    >
                      Xem chi tiết
                    </Link>
                  </div>
                ))
              ) : (
                <div className="text-[18px] text-gray-500">
                  Chưa có dữ liệu people.
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