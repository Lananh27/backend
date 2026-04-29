"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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

export default function PersonDetailPage() {
  const params = useParams();
  const id = Number(params?.id);

  const [home, setHome] = useState<HomeContent | null>(null);
  const [person, setPerson] = useState<PersonItem | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [homeRes, peopleRes] = await Promise.all([
          getHomeContent(),
          getPeople(),
        ]);

        if (homeRes?.data) {
          setHome(homeRes.data);
        }

        const people = Array.isArray(peopleRes?.data) ? peopleRes.data : [];
        const foundPerson = people.find((item: PersonItem) => item.id === id);
        setPerson(foundPerson || null);
      } catch (error) {
        console.error("FETCH PERSON DETAIL ERROR:", error);
      }
    };

    fetchData();
  }, [id]);

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
            <div className="mb-6">
              <Link
                href="/people"
                className="text-[16px] text-[#1d7bba] hover:underline"
              >
                ← Back to People
              </Link>
            </div>

            {person ? (
              <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
                <div className="flex justify-center lg:justify-start">
                  <div className="h-[220px] w-[220px] overflow-hidden rounded-full border">
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
                </div>

                <div>
                  <h1 className="text-[38px] font-bold text-[#2c3e50]">
                    {person.fullName}
                  </h1>

                  {person.role && (
                    <p className="mt-3 text-[22px] font-semibold text-[#1d7bba]">
                      {person.role}
                    </p>
                  )}

                  {person.institution && (
                    <p className="mt-2 text-[18px] text-gray-700">
                      {person.institution}
                    </p>
                  )}

                  <div className="mt-6 space-y-3 text-[17px] text-[#2c3e50]">
                    {person.email && (
                      <p>
                        <span className="font-semibold">Email:</span>{" "}
                        <a
                          href={
                            person.email.startsWith("mailto:")
                              ? person.email
                              : `mailto:${person.email}`
                          }
                          className="text-[#1d7bba] hover:underline"
                        >
                          {person.email.replace("mailto:", "")}
                        </a>
                      </p>
                    )}

                    {person.location && (
                      <p>
                        <span className="font-semibold">Location:</span>{" "}
                        {person.location}
                      </p>
                    )}

                    {person.cvLink && (
                      <p>
                        <span className="font-semibold">CV / Profile:</span>{" "}
                        <a
                          href={person.cvLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#1d7bba] hover:underline"
                        >
                          Open Link
                        </a>
                      </p>
                    )}
                  </div>

                  {person.bio && (
                    <div className="mt-8">
                      <h2 className="mb-3 text-[24px] font-bold text-[#2c3e50]">
                        Biography
                      </h2>
                      <p className="whitespace-pre-line text-[18px] leading-8 text-gray-700">
                        {person.bio}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-[20px] text-red-600">Person not found.</div>
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