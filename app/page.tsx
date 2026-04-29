"use client";

import { useEffect, useMemo, useState } from "react";
import Container from "@/components/layout/Container";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getPeople } from "@/lib/api";
import { useRef } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type InfoItem = {
  date: string;
  location: string;
};

type AttentionItem = {
  title: string;
  content: string;
  postSlug: string;
};

type HeroSlide = {
  image: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
};

type MapItem = {
  title: string;
  slug: string;
  content: string;
  link: string;
  buttonText: string;
  publishedAt: string;
};

type ProjectItem = {
  title: string;
  subtitle: string;
  description: string;
  bullets: string[];
  image: string;
  readMoreLink: string;
  publishedAt: string;
};

type HomeContent = {
  siteName?: string;
  headerLogo?: string;
  welcomeTitle?: string;
  welcomeText?: string;
  marqueeText?: string;
  heroImage?: string;
  heroTitle?: string;
  heroDescription?: string;
  heroButtonText?: string;
  heroButtonLink?: string;
  heroSlides?: HeroSlide[];
  infoItems?: InfoItem[];
  attentionItems?: AttentionItem[];
  projectsSectionTitle?: string;
  projectsItems?: ProjectItem[];
  mapsSectionTitle?: string;
  mapsItems?: MapItem[];
  footerMailingText?: string;
  footerContactText?: string;
  footerSocialText?: string;
  footerLogo?: string;
  partnerLogos?: string[] | null;
  
  
};

type PersonItem = {
  id: number;
  fullName: string;
  role?: string;
  institution?: string;
  email?: string;
  cvLink?: string;
  location?: string;
  avatar?: string | null;
  bio?: string;
};
export default function Home() {
  const [home, setHome] = useState<HomeContent | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentInfoPage, setCurrentInfoPage] = useState(0);
  const [people, setPeople] = useState<PersonItem[]>([]);
  const peopleSliderRef = useRef<HTMLDivElement>(null);

  const imgUrl = (url?: string | null) => {
    if (!url || !url.trim()) return "";
    return url.startsWith("http") ? url : `${API_URL}${url}`;
  };

  const scrollPeople = (direction: "left" | "right") => {
    if (!peopleSliderRef.current) return;

    peopleSliderRef.current.scrollBy({
      left: direction === "left" ? -1260 : 1260,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [homeRes, peopleRes] = await Promise.all([
          fetch(`${API_URL}/api/home`)
            .then((res) => (res.ok ? res.json() : null))
            .catch(() => null),
          getPeople(),
        ]);

        if (homeRes?.data) {
          setHome(homeRes.data);
        } else if (homeRes) {
          setHome(homeRes);
        } else {
          setHome(null);
        }

        if (Array.isArray(peopleRes?.data)) {
          setPeople(peopleRes.data);
        } else {
          setPeople([]);
        }

        console.log("HOME DATA:", homeRes);
        console.log("PEOPLE DATA:", peopleRes);
      } catch (error) {
        console.error("FETCH HOME PAGE ERROR:", error);
        setHome(null);
        setPeople([]);
      }
    };

    fetchData();
  }, []);


  const infoItems = Array.isArray(home?.infoItems) ? home.infoItems : [];

  const attentionItems: AttentionItem[] =
    Array.isArray(home?.attentionItems) && home.attentionItems.length > 0
      ? home.attentionItems
      : [
          {
            title: "01/31/2026: PI Transfer Requests",
            content:
              "Submit via email to tonssc-grants-pi-transfer@mail.nasa.gov",
            postSlug: "pi-transfer-requests",
          },
          {
            title: "01/30/2026: Administrative supplement requests",
            content:
              "No-Cost Extensions, Administrative Changes, Prior Approvals",
            postSlug: "administrative-supplement-requests",
          },
          {
            title: "01/29/2026: Final reports",
            content: "Submit via NSPIRES",
            postSlug: "final-reports",
          },
        ];

  const heroSlides = useMemo(() => {
    if (Array.isArray(home?.heroSlides) && home.heroSlides.length > 0) {
      return home.heroSlides;
    }

    if (home?.heroImage) {
      return [
        {
          image: home.heroImage,
          title: home.heroTitle || "Upcoming Events & Activities",
          description: home.heroDescription || "",
          buttonText: home.heroButtonText || "Know More",
          buttonLink: home.heroButtonLink || "#",
        },
      ];
    }

    return [];
  }, [home]);

  const itemsPerPage = 4;
  const totalInfoPages = Math.max(1, Math.ceil(infoItems.length / itemsPerPage));
  const paginatedInfoItems = infoItems.slice(
    currentInfoPage * itemsPerPage,
    currentInfoPage * itemsPerPage + itemsPerPage
  );

  useEffect(() => {
    if (currentSlide >= heroSlides.length && heroSlides.length > 0) {
      setCurrentSlide(0);
    }
  }, [heroSlides, currentSlide]);

  useEffect(() => {
    if (currentInfoPage >= totalInfoPages) {
      setCurrentInfoPage(0);
    }
  }, [totalInfoPages, currentInfoPage]);

  const goPrevSlide = () => {
    if (heroSlides.length === 0) return;
    setCurrentSlide((prev) =>
      prev === 0 ? heroSlides.length - 1 : prev - 1
    );
  };

  const goNextSlide = () => {
    if (heroSlides.length === 0) return;
    setCurrentSlide((prev) =>
      prev === heroSlides.length - 1 ? 0 : prev + 1
    );
  };

  const sortedProjects = Array.isArray(home?.projectsItems)
    ? [...home.projectsItems].sort(
        (a, b) =>
          new Date(b.publishedAt || "1970-01-01").getTime() -
          new Date(a.publishedAt || "1970-01-01").getTime()
      )
    : [];

  const featuredProject =
    sortedProjects.length > 0 ? sortedProjects[0] : null;

  const sortedMaps = Array.isArray(home?.mapsItems)
    ? [...home.mapsItems].sort(
        (a, b) =>
          new Date(b.publishedAt || "1970-01-01").getTime() -
          new Date(a.publishedAt || "1970-01-01").getTime()
      )
    : [];

  const homeMaps = sortedMaps.slice(0, 3);
  const currentHeroSlide = heroSlides[currentSlide];
  const currentHeroImage = imgUrl(currentHeroSlide?.image);

const [peopleStart, setPeopleStart] = useState(0);

const visiblePeople = useMemo(() => {
  if (!people || people.length === 0) return [];
  return people.slice(peopleStart, peopleStart + 5);
}, [people, peopleStart]);
const handlePrevPeople = () => {
  if (!people || people.length <= 5) return;
  setPeopleStart((prev) => Math.max(prev - 5, 0));
};

const handleNextPeople = () => {
  if (!people || people.length <= 5) return;
  setPeopleStart((prev) => {
    const next = prev + 5;
    return next >= people.length ? prev : next;
  });
};

  return (
    <>
      <Header
        siteName={home?.siteName}
        headerLogo={home?.headerLogo}
        partnerLogos={home?.partnerLogos}
      />

      <main className="bg-[#efefef] text-black">
        <section className="py-10">
          <Container>
            <div className="text-center">
              <h1 className="text-[56px] font-bold">
                {home?.welcomeTitle || "Welcome to IMRWG"}
              </h1>

              <p className="mx-auto mt-4 max-w-[1500px] text-[24px] leading-10">
                {home?.welcomeText || (
                  <>
                    <span className="font-bold">
                      The International Conference on the Mekong River System
                    </span>{" "}
                    marked an important milestone in understanding the Mekong
                    River system – a place where you can explore insights,
                    research, and diverse perspectives on one of the most
                    important rivers in the region.
                  </>
                )}
              </p>
            </div>

            <div className="mt-8 overflow-hidden border-y border-gray-400 py-4">
              <div className="animate-marquee inline-block whitespace-nowrap text-[22px] text-gray-700">
                {home?.marqueeText ||
                  "Programmatic Meeting at the HCMC University of Natural Resources and Environment (HCMUNRE) – 20-21 April 2026."}
              </div>
            </div>
          </Container>
        </section>

        <section className="pb-10">
          <Container>
            <div className="grid items-start gap-8 lg:grid-cols-[280px_minmax(0,1fr)_300px] xl:grid-cols-[320px_minmax(0,1fr)_340px]">
              <div>
                <h2 className="mb-5 text-[25px] font-bold">
                  IMRWG Scientific Group Meeting Schedule
                </h2>

                <div className="overflow-hidden border border-gray-300 bg-white">
                  <div className="grid grid-cols-2 bg-[#4b5a6f] text-white">
                    <div className="border-r border-gray-300 p-4 text-[16px] font-semibold">
                      Date
                    </div>
                    <div className="p-4 text-[16px] font-semibold">
                      Location
                    </div>
                  </div>

                  {paginatedInfoItems.length > 0 ? (
                    paginatedInfoItems.map((item, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-2 border-t border-gray-300"
                      >
                        <div className="border-r border-gray-300 p-4 text-[16px] font-semibold">
                          {item.date}
                        </div>
                        <div className="p-4 text-[16px]">{item.location}</div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-[16px] text-gray-500">
                      Meeting data is not available.
                    </div>
                  )}
                </div>

                {infoItems.length > itemsPerPage && (
                  <div className="mt-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          setCurrentInfoPage((prev) =>
                            prev === 0 ? totalInfoPages - 1 : prev - 1
                          )
                        }
                        className="rounded border bg-white px-4 py-2"
                      >
                        ‹
                      </button>

                      {Array.from({ length: totalInfoPages }).map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentInfoPage(index)}
                          className={`rounded border px-4 py-2 ${
                            currentInfoPage === index
                              ? "bg-[#9ac06f] text-white"
                              : "bg-white"
                          }`}
                        >
                          {index + 1}
                        </button>
                      ))}

                      <button
                        onClick={() =>
                          setCurrentInfoPage((prev) =>
                            prev === totalInfoPages - 1 ? 0 : prev + 1
                          )
                        }
                        className="rounded border bg-white px-4 py-2"
                      >
                        ›
                      </button>
                    </div>

                    <p className="mt-4 text-[18px] font-semibold">
                      {currentInfoPage + 1} of {totalInfoPages}
                    </p>
                  </div>
                )}
              </div>

              <div className="min-w-0">
                {heroSlides.length > 0 && currentHeroSlide && currentHeroImage ? (
                  <div className="relative h-[520px] overflow-hidden bg-black">
                    <img
                      src={currentHeroImage}
                      alt={currentHeroSlide.title || "Slide image"}
                      className="h-full w-full object-cover"
                    />

                    <div className="absolute inset-0 bg-black/30" />

                    <button
                      onClick={goPrevSlide}
                      className="absolute left-4 top-1/2 z-10 -translate-y-1/2 bg-black/50 px-4 py-3 text-2xl text-white"
                    >
                      ‹
                    </button>

                    <button
                      onClick={goNextSlide}
                      className="absolute right-4 top-1/2 z-10 -translate-y-1/2 bg-black/50 px-4 py-3 text-2xl text-white"
                    >
                      ›
                    </button>

                    <div className="absolute bottom-8 left-10 right-10 text-white">
                      <div className="mb-4 inline-block rounded-full bg-lime-400 px-5 py-2 font-semibold text-black">
                        Mới nhất
                      </div>

                      <h3 className="max-w-[700px] text-[42px] font-bold leading-tight xl:text-[54px]">
                        {currentHeroSlide.title}
                      </h3>

                      <p className="mt-4 max-w-[900px] text-[18px] leading-8">
                        {currentHeroSlide.description}
                      </p>

                      <a
                        href={currentHeroSlide.buttonLink || "#"}
                        className="mt-6 inline-block rounded bg-white px-8 py-4 text-[18px] font-semibold text-black"
                      >
                        {currentHeroSlide.buttonText || "Know More"}
                      </a>
                    </div>

                    {heroSlides.length > 1 && (
                      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-3">
                        {heroSlides.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`h-4 w-4 rounded-full ${
                              currentSlide === index
                                ? "bg-lime-400"
                                : "bg-white/70"
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex h-[430px] w-full items-center justify-center bg-gray-300 text-[20px] text-gray-600">
                    There is no image in the middle of the page.
                  </div>
                )}
              </div>

              <div className="h-fit border border-[#9ab27b] bg-[#e6ebde] p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-[28px] font-bold">Attention</h2>
                  <Link
                    href="/documents/attention"
                    className="text-[18px] text-[#648248] hover:underline"
                  >
                    View All
                  </Link>
                </div>

                <div className="mt-5 space-y-6 border-t border-[#b6c5a6] pt-5">
                  {attentionItems.map((item, index) => (
                    <div key={index} className="flex gap-3 text-[#6a8444]">
                      <span className="mt-2 h-3 w-3 shrink-0 bg-[#9ac06f]" />
                      <div className="text-[18px] leading-8">
                        <Link
                          href={`/documents/attention/${item.postSlug}`}
                          className="text-[#1d7bba] hover:underline"
                        >
                          {item.title}
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <section className="mt-6 bg-white py-10">
              <Container>
                <div className="space-y-8">
                  <h2 className="text-[32px] font-bold text-[#2c3e50]">
                    {home?.projectsSectionTitle || "Projects"}
                  </h2>

                  {featuredProject ? (
                    <div className="grid items-center gap-12 lg:grid-cols-[1fr_2fr]">
                      <div className="h-full overflow-hidden rounded-lg bg-gradient-to-br from-blue-500 to-green-500">
                        {imgUrl(featuredProject.image) ? (
                          <img
                            src={imgUrl(featuredProject.image) || undefined}
                            alt={featuredProject.title}
                            className="min-h-[320px] h-full w-full object-cover"
                          />
                        ) : null}
                      </div>

                      <div className="space-y-4">
                        <p className="text-[14px] text-gray-500">
                          {featuredProject.publishedAt
                            ? new Date(
                                featuredProject.publishedAt
                              ).toLocaleDateString("vi-VN")
                            : ""}
                        </p>

                        <h3 className="text-[28px] font-bold text-[#2c3e50]">
                          {featuredProject.title}
                        </h3>

                        {featuredProject.subtitle ? (
                          <h4 className="text-[24px] font-semibold text-[#2c3e50]">
                            {featuredProject.subtitle}
                          </h4>
                        ) : null}

                        <p className="text-[18px] text-[#7f8c8d]">
                          {featuredProject.description}
                        </p>

                        <ul className="list-disc space-y-2 pl-5 text-[16px] text-[#7f8c8d]">
                          {(Array.isArray(featuredProject.bullets)
                            ? featuredProject.bullets
                            : []
                          ).map((bullet, bulletIndex) => (
                            <li key={bulletIndex}>{bullet}</li>
                          ))}
                        </ul>

                        <Link
                          href={featuredProject.readMoreLink || "/projects"}
                          className="mt-6 inline-block text-[18px] text-[#1d7bba] hover:underline"
                        >
                          Read more
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="text-[18px] text-gray-500">
                      There are no projects yet.
                    </div>
                  )}
                </div>
              </Container>
            </section>
          </Container>
        </section>

        <section className="py-10 bg-[#9ac06f]">
  <Container>
    <div className="grid items-stretch gap-8 lg:grid-cols-3">
      {homeMaps.length > 0 ? (
        homeMaps.map((item, index) => (
          <div
            key={index}
            className="flex h-[380px] flex-col rounded-lg bg-white p-6 shadow-lg transition-all hover:shadow-xl"
          >
            <h3 className="min-h-[72px] line-clamp-2 text-[24px] font-bold leading-tight text-[#004b7f]">
              {item.title}
            </h3>

            <div className="mt-4 mb-4 h-[160px] overflow-hidden rounded-lg border bg-[#cce7ff]">
              {item.link ? (
                <iframe
                  src={item.link}
                  title={item.title}
                  className="pointer-events-none h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-500">
                  No map available.
                </div>
              )}
            </div>

            <div className="mt-auto flex justify-center">
              <Link
                href={`/maps/${item.slug}`}
                className="inline-block rounded-lg bg-[#cce7ff] px-4 py-2 font-semibold text-[#004b7f] hover:bg-[#b6d9f0]"
              >
                {item.buttonText || "View Map"}
              </Link>
            </div>
          </div>
        ))
      ) : (
        <>
          <div className="h-[380px] rounded-lg bg-white p-6 shadow-lg" />
          <div className="h-[380px] rounded-lg bg-white p-6 shadow-lg" />
          <div className="h-[380px] rounded-lg bg-white p-6 shadow-lg" />
        </>
      )}
    </div>
  </Container>
</section>

        <section className="bg-[#f5f5f5] py-10">
          <Container>
            <div className="flex flex-col justify-between lg:flex-row">
              <div className="w-full lg:w-[48%]">
                <h2 className="text-[32px] font-semibold text-[#2c3e50]">
                  What's New
                </h2>
                <div className="mt-6 space-y-4">
                  <div className="flex items-start">
                    <span className="mt-2 h-3 w-3 shrink-0 bg-[#9ac06f]" />
                    <div className="ml-3 text-[16px] text-[#2c3e50]">
                      <span className="font-semibold">02/07/2026: </span>
                      Special Issue: The NASA Land-Cover/Land-Use Change Program:
                      Past Achievements and Current Advances
                    </div>
                  </div>

                  <div className="flex items-start">
                    <span className="mt-2 h-3 w-3 shrink-0 bg-[#9ac06f]" />
                    <div className="ml-3 text-[16px] text-[#2c3e50]">
                      <span className="font-semibold">08/04/2025: </span>
                      New Book Released: Remote Sensing of Land Cover and Land
                      Use Changes in South and Southeast Asia
                    </div>
                  </div>

                  <div className="flex items-start">
                    <span className="mt-2 h-3 w-3 shrink-0 bg-[#9ac06f]" />
                    <div className="ml-3 text-[16px] text-[#2c3e50]">
                      <span className="font-semibold">05/09/2025: </span>
                      Dr. Compton J. Tucker Elected to National Academy of
                      Sciences
                    </div>
                  </div>

                  <div className="flex items-start">
                    <span className="mt-2 h-3 w-3 shrink-0 bg-[#9ac06f]" />
                    <div className="ml-3 text-[16px] text-[#2c3e50]">
                      <span className="font-semibold">04/22/2025: </span>
                      Earth Day Spotlight: NASA’s Mission to Understand Our
                      Planet
                    </div>
                  </div>
                </div>
                <div className="mt-6 text-[#1d7bba] hover:underline">
                  <a href="#">View All</a>
                </div>
              </div>

              <div className="mt-8 w-full lg:mt-0 lg:w-[48%]">
                <h2 className="text-[32px] font-semibold text-[#2c3e50]">
                  Social
                </h2>
                <div className="mt-6 space-y-4">
                  <div className="flex items-start">
                    <span className="mt-2 h-3 w-3 shrink-0 bg-[#9ac06f]" />
                    <div className="ml-3 text-[16px] text-[#2c3e50]">
                      <span className="font-semibold">02/05/2026: </span>
                      Meha Jain wins inaugural Arizona State University-Science
                      Prize
                    </div>
                  </div>

                  <div className="flex items-start">
                    <span className="mt-2 h-3 w-3 shrink-0 bg-[#9ac06f]" />
                    <div className="ml-3 text-[16px] text-[#2c3e50]">
                      <span className="font-semibold">01/22/2026: </span>
                      David Roy named Science Team Lead for the 2026–2030
                      Landsat Science Team
                    </div>
                  </div>

                  <div className="flex items-start">
                    <span className="mt-2 h-3 w-3 shrink-0 bg-[#9ac06f]" />
                    <div className="ml-3 text-[16px] text-[#2c3e50]">
                      <span className="font-semibold">12/15/2025: </span>
                      Randolph H. Wynne received the Garland Gray Forestry
                      Research Award
                    </div>
                  </div>

                  <div className="flex items-start">
                    <span className="mt-2 h-3 w-3 shrink-0 bg-[#9ac06f]" />
                    <div className="ml-3 text-[16px] text-[#2c3e50]">
                      <span className="font-semibold">11/28/2024: </span>
                      Jaguar at Risk from Drug Trafficking in Central America
                    </div>
                  </div>
                </div>
                <div className="mt-6 text-[#1d7bba] hover:underline">
                  <a href="#">View All</a>
                </div>
              </div>
            </div>
          </Container>
        </section>

    <section className="bg-[#efefef] py-12">
  <div className="mx-auto max-w-[1500px] px-12">
    <h2 className="mb-10 text-center text-[34px] font-bold uppercase text-[#1f3b63]">
      FEATURED SPEAKERS
    </h2>

    <div className="relative">
      {people.length > 0 && (
        <button
          onClick={() => scrollPeople("left")}
          className="absolute left-[-20px] top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[26px] shadow-md hover:bg-gray-100"
        >
          &#10094;
        </button>
      )}

      <div
        ref={peopleSliderRef}
        className="scrollbar-hide flex gap-6 overflow-x-auto scroll-smooth pb-4"
      >
        {people.length > 0 ? (
          people.map((person) => (
            <div
              key={person.id}
              className="basis-1/5 min-w-0 flex-shrink-0"
            >
              <div className="flex min-h-[260px] w-full flex-col items-center rounded-2xl bg-white p-6 text-center shadow-md transition hover:shadow-lg">
                <div className="mx-auto h-[110px] w-[110px] overflow-hidden rounded-full">
                  {person.avatar ? (
                    <img
                      src={imgUrl(person.avatar) || ""}
                      alt={person.fullName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-200 text-sm text-gray-500">
                      No image
                    </div>
                  )}
                </div>

                <h3 className="mt-5 text-[18px] font-bold text-black">
                  {person.fullName}
                </h3>

                {person.role && (
                  <p className="mt-3 text-[16px] text-gray-700">
                    {person.role}
                  </p>
                )}

                <Link
                  href={`/people/${person.id}`}
                  className="mt-4 inline-block text-[15px] font-medium text-[#1d7bba] hover:underline"
                >
                  Xem chi tiết
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="w-full py-8 text-center text-[18px] text-gray-500">
            Chưa có dữ liệu People.
          </div>
        )}
      </div>

      {people.length > 0 && (
        <button
          onClick={() => scrollPeople("right")}
          className="absolute right-[-20px] top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[26px] shadow-md hover:bg-gray-100"
        >
          &#10095;
        </button>
      )}
    </div>
  </div>
</section>
        <section className="mb-10 bg-[#FFFFFF] py-10">
  <Container>
    <div className="mb-10 text-center">
      <h2 className="text-[32px] font-semibold text-yellow-400">
        STRATEGIC PARTNERS
      </h2>
    </div>

    <div className="relative flex justify-center space-x-30"> <div className="absolute inset-x-0 top-[-20px] bg-cover bg-center" style={{ backgroundImage: "url('/images/s1.jfif')", backgroundPosition: "center", backgroundSize: "cover", height: "230px", width: "100%", }} />

      <div className="z-10 flex h-[200px] w-[160px] flex-col items-center rounded-[999px] bg-white px-6 py-5 shadow-lg transition-transform hover:scale-105">
        <div className="flex h-[110px] w-[110px] items-center justify-center">
          <img
            src="/images/S2.png"
            alt="HCMUNRE"
            className="max-h-full max-w-full object-contain"
          />
        </div>
        <p className="mt-4 text-[16px] font-semibold">HCMUNRE</p>
      </div>

      <div className="z-10 flex h-[200px] w-[160px] flex-col items-center rounded-[999px] bg-white px-6 py-5 shadow-lg transition-transform hover:scale-105">
        <div className="flex h-[110px] w-[110px] items-center justify-center">
          <img
            src="/images/S3.jpg"
            alt="ISP"
            className="max-h-full max-w-full object-contain"
          />
        </div>
        <p className="mt-4 text-[16px] font-semibold">ISP</p>
      </div>

      <div className="z-10 flex h-[200px] w-[160px] flex-col items-center rounded-[999px] bg-white px-6 py-5 shadow-lg transition-transform hover:scale-105">
        <div className="flex h-[110px] w-[110px] items-center justify-center">
          <img
            src="/images/S4.png"
            alt="UTT"
            className="max-h-full max-w-full object-contain"
          />
        </div>
        <p className="mt-4 text-[16px] font-semibold">UTT</p>
      </div>

      <div className="z-10 flex h-[200px] w-[160px] flex-col items-center rounded-[999px] bg-white px-6 py-5 shadow-lg transition-transform hover:scale-105">
        <div className="flex h-[110px] w-[110px] items-center justify-center">
          <img
            src="/images/S5.png"
            alt="VNSC"
            className="max-h-full max-w-full object-contain"
          />
        </div>
        <p className="mt-4 text-[16px] font-semibold">VNSC</p>
      </div>
    </div>
  </Container>
</section>

        <Footer
          footerLogo={home?.footerLogo}
          footerMailingText={home?.footerMailingText}
          footerContactText={home?.footerContactText}
          footerSocialText={home?.footerSocialText}
        />
      </main>
    </>
  );
}