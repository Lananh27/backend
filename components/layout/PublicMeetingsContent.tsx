"use client";

import { useEffect, useMemo, useState } from "react";
import { API_URL } from "@/lib/api";

type Meeting = {
  id: number;
  title: string;
  summary?: string;
  location?: string;
  startDate: string;
  endDate: string;
  heroImage?: string;
  agendaFileUrl?: string;
  reportFileUrl?: string;
  photosLink?: string;
};

const demoMeetings: Meeting[] = [
  {
    id: 1,
    title: "Earth Observation and Geospatial Intelligence in Sustainable Development for Urban and Mekong Delta Region",
    summary:
      "This annual meeting brings together researchers, partners, and stakeholders to review ongoing work, share findings, and discuss future directions for collaborative research across the Mekong region. The event highlights recent scientific progress, regional partnerships, and new opportunities for interdisciplinary engagement.",
    location: "Ho Chi Minh City, Vietnam",
    startDate: "2026-04-20",
    endDate: "2026-04-20",
    heroImage: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1600&auto=format&fit=crop",
    agendaFileUrl: "#",
    reportFileUrl: "#",
    photosLink: "#",
  },
  {
    id: 2,
    title: "Training Workshop “Remote Sensing and Geospatial Intelligence for Water Resource and Ecosystem Management”",
    summary:
      "A regional workshop focused on environmental change, research synthesis, and cross-border collaboration. Participants exchange datasets, policy insights, and methodological approaches to support sustainable development planning in the Mekong subregion.",
    location: "Ho Chi Minh City, Vietnam",
    startDate: "2026-04-21",
    endDate: "2026-04-21",
    heroImage: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1600&auto=format&fit=crop",
    agendaFileUrl: "#",
    reportFileUrl: "#",
    photosLink: "#",
  },
];

function formatDateRange(startDate: string, endDate: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const s = start.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });

  const e = end.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });

  return `${s} to ${e}`;
}

function formatSingleDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function getFileUrl(url?: string) {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://") || url === "#") {
    return url;
  }
  return `${API_URL}${url}`;
}

export default function PublicMeetingsContent() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMeetings() {
      try {
        const res = await fetch(`${API_URL}/api/meetings`);
        const data = await res.json();

        const meetingsData = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
          ? data.data
          : [];

        if (meetingsData.length > 0) {
          setMeetings(meetingsData);
          setSelectedId(meetingsData[0].id);
        } else {
          setMeetings(demoMeetings);
          setSelectedId(demoMeetings[0].id);
        }
      } catch (error) {
        console.error("Lỗi lấy meetings:", error);
        setMeetings(demoMeetings);
        setSelectedId(demoMeetings[0].id);
      } finally {
        setLoading(false);
      }
    }

    fetchMeetings();
  }, []);

  const selectedMeeting = useMemo(() => {
    return meetings.find((m) => m.id === selectedId) || null;
  }, [meetings, selectedId]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full border-4 border-gray-300 border-t-[#9ab86f] animate-spin"></div>
          <p className="text-lg text-gray-600">Loading meetings...</p>
        </div>
      </div>
    );
  }

  if (!selectedMeeting) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-6">
        <div className="text-center bg-white rounded-2xl shadow-sm border border-gray-200 px-10 py-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            No meetings found
          </h2>
          <p className="text-gray-600">
            There is no meeting data from the backend to display yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-[#f4f4f1] min-h-screen">
      <div className="max-w-[1600px] mx-auto px-4 md:px-6 xl:px-10 py-8 md:py-10">
        <div className="grid grid-cols-1 xl:grid-cols-[360px_minmax(0,1fr)_320px] gap-8 xl:gap-10">
          <aside className="xl:sticky xl:top-6 self-start">
            <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-[#f6f8f1] to-white">
                <p className="text-sm uppercase tracking-[0.2em] text-[#89a35d] font-semibold mb-2">
                  Archive
                </p>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Meetings
                </h2>
              </div>

              <div className="max-h-[75vh] overflow-y-auto p-4 space-y-4">
                {meetings.map((meeting) => {
                  const isActive = selectedId === meeting.id;

                  return (
                    <button
                      key={meeting.id}
                      onClick={() => setSelectedId(meeting.id)}
                      className={`w-full text-left rounded-2xl border p-4 transition-all duration-200 ${
                        isActive
                          ? "bg-[#eef5e4] border-[#a8c47b] shadow-sm"
                          : "bg-[#fafbf8] border-gray-200 hover:bg-[#f2f6ec] hover:border-[#c9d9ad]"
                      }`}
                    >
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <h3
                          className={`text-base md:text-lg font-semibold leading-snug ${
                            isActive ? "text-[#4f6630]" : "text-gray-900"
                          }`}
                        >
                          {meeting.title}
                        </h3>

                        {isActive && (
                          <span className="mt-1 h-3 w-3 shrink-0 rounded-full bg-[#9ab86f]"></span>
                        )}
                      </div>

                      <div className="space-y-1 text-sm md:text-[15px]">
                        <p className="text-gray-600">
                          {formatDateRange(meeting.startDate, meeting.endDate)}
                        </p>
                        <p className="text-[#7b9460] font-medium">
                          {meeting.location || "Updating..."}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          <main className="min-w-0">
            <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden">
              <div className="px-6 md:px-8 xl:px-10 pt-8 md:pt-10 pb-6 border-b border-gray-100">
                <p className="text-sm uppercase tracking-[0.25em] text-[#89a35d] font-semibold mb-3">
                  Featured meeting
                </p>
                <h1 className="text-3xl md:text-4xl xl:text-5xl font-bold leading-tight text-gray-900 max-w-5xl">
                  {selectedMeeting.title}
                </h1>

                <div className="mt-5 flex flex-wrap gap-3">
                  <span className="inline-flex items-center rounded-full bg-[#eef5e4] px-4 py-2 text-sm font-medium text-[#5d7440]">
                    {selectedMeeting.location || "Location updating"}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700">
                    {formatDateRange(
                      selectedMeeting.startDate,
                      selectedMeeting.endDate
                    )}
                  </span>
                </div>
              </div>

              <div className="px-6 md:px-8 xl:px-10 py-8">
                {selectedMeeting.heroImage ? (
                  <div className="overflow-hidden rounded-[28px] border border-gray-200 bg-gray-50">
                    <img
                      src={getFileUrl(selectedMeeting.heroImage)}
                      alt={selectedMeeting.title}
                      className="w-full max-h-[720px] object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-full h-[420px] rounded-[28px] border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center text-gray-500 text-lg">
                    No image available
                  </div>
                )}

                <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1fr_220px] gap-8 items-start">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Overview
                    </h3>

                    <div className="text-[17px] md:text-[18px] leading-8 text-gray-700 whitespace-pre-line">
                      {selectedMeeting.summary ||
                        "Summary is being updated. You can connect the backend summary content here to show full meeting details, highlights, goals, participants, and key outcomes."}
                    </div>
                  </div>

                  <div className="bg-[#f8faf4] border border-[#e3ecd4] rounded-2xl p-5">
                    <p className="text-sm uppercase tracking-[0.18em] text-[#88a15e] font-semibold mb-4">
                      Quick info
                    </p>

                    <div className="space-y-4 text-sm">
                      <div>
                        <p className="text-gray-500 mb-1">Start</p>
                        <p className="font-semibold text-gray-900">
                          {formatSingleDate(selectedMeeting.startDate)}
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-500 mb-1">End</p>
                        <p className="font-semibold text-gray-900">
                          {formatSingleDate(selectedMeeting.endDate)}
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-500 mb-1">Location</p>
                        <p className="font-semibold text-gray-900">
                          {selectedMeeting.location || "-"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>

          <aside className="xl:sticky xl:top-6 self-start">
            <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-white to-[#f6f8f1]">
                <p className="text-sm uppercase tracking-[0.2em] text-[#89a35d] font-semibold mb-2">
                  Resources
                </p>
                <h2 className="text-2xl font-bold text-gray-900">
                  Meeting Details
                </h2>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <p className="text-sm uppercase tracking-[0.12em] text-gray-500 mb-2">
                    Location
                  </p>
                  <p className="text-2xl font-bold text-gray-900 leading-snug">
                    {selectedMeeting.location || "-"}
                  </p>
                </div>

                <div className="border-t border-gray-100 pt-6">
                  <p className="text-sm uppercase tracking-[0.12em] text-gray-500 mb-2">
                    Meeting Date
                  </p>
                  <p className="text-base text-gray-800 font-medium leading-7">
                    {formatDateRange(
                      selectedMeeting.startDate,
                      selectedMeeting.endDate
                    )}
                  </p>
                </div>

                <div className="border-t border-gray-100 pt-6">
                  <p className="text-sm uppercase tracking-[0.12em] text-gray-500 mb-3">
                    Agenda File
                  </p>
                  {selectedMeeting.agendaFileUrl ? (
                    <a
                      href={getFileUrl(selectedMeeting.agendaFileUrl)}
                      target="_blank"
                      rel="noreferrer"
                      className="block rounded-2xl border border-[#d8e5c1] bg-[#f6faee] px-4 py-4 text-[#5f7840] font-semibold hover:bg-[#eef5e2] transition break-all"
                    >
                      Open Agenda PDF
                    </a>
                  ) : (
                    <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 text-gray-500">
                      No agenda file
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-100 pt-6">
                  <p className="text-sm uppercase tracking-[0.12em] text-gray-500 mb-3">
                    Meeting Report
                  </p>
                  {selectedMeeting.reportFileUrl ? (
                    <a
                      href={getFileUrl(selectedMeeting.reportFileUrl)}
                      target="_blank"
                      rel="noreferrer"
                      className="block rounded-2xl border border-[#d8e5c1] bg-[#f6faee] px-4 py-4 text-[#5f7840] font-semibold hover:bg-[#eef5e2] transition break-all"
                    >
                      Open Meeting Report
                    </a>
                  ) : (
                    <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 text-gray-500">
                      No report file
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-100 pt-6">
                  <p className="text-sm uppercase tracking-[0.12em] text-gray-500 mb-3">
                    Meeting Photos
                  </p>
                  {selectedMeeting.photosLink ? (
                    <a
                      href={getFileUrl(selectedMeeting.photosLink)}
                      target="_blank"
                      rel="noreferrer"
                      className="block rounded-2xl border border-[#d8e5c1] bg-[#f6faee] px-4 py-4 text-[#5f7840] font-semibold hover:bg-[#eef5e2] transition break-all"
                    >
                      View Meeting Photos
                    </a>
                  ) : (
                    <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 text-gray-500">
                      No photo link
                    </div>
                  )}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}