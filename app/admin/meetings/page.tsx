"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { API_URL, authFetch } from "@/lib/api";
import { useRouter } from "next/navigation";

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
  createdAt?: string;
  updatedAt?: string;
};

function getFileUrl(url?: string) {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${API_URL}${url}`;
}

export default function AdminMeetingsPage() {
  const router = useRouter();

  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  async function fetchMeetings() {
    try {
      setLoading(true);
      setPageError("");

      const res = await fetch(`${API_URL}/api/meetings`);
      const data = await res.json();

      const meetingsData = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
        ? data.data
        : [];

      setMeetings(meetingsData);
    } catch (error) {
      console.error("Lỗi lấy meetings:", error);
      setMeetings([]);
      setPageError("Không thể tải dữ liệu meetings từ backend.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    const ok = window.confirm("Bạn có chắc muốn xóa meeting này?");
    if (!ok) return;

    try {
      const res = await authFetch(`${API_URL}/api/meetings/${id}`, {
        method: "DELETE",
      });

      let data: any = {};
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      if (!res.ok) {
        alert(data?.message || "Xóa thất bại");
        return;
      }

      alert("Xóa thành công");
      fetchMeetings();
    } catch (error) {
      console.error("DELETE MEETING ERROR:", error);
      alert("Không thể kết nối backend");
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/admin/login");
  }

  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;

    if (!token) {
      router.push("/admin/login");
      return;
    }

    fetchMeetings();
  }, [router]);

  return (
    <div className="min-h-screen bg-[#f5f6f8] p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 rounded-3xl bg-white border border-gray-200 shadow-sm p-5 md:p-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-gray-500 mb-2">
                Admin panel
              </p>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Quản lý Meetings
              </h1>
              <p className="text-gray-500 mt-2">
                Xem, thêm, sửa và xóa nội dung meetings.
              </p>
            </div>

            <div className="flex gap-3 flex-wrap">
              <Link
                href="/admin/meetings/create"
                className="bg-black text-white px-4 py-2.5 rounded-2xl hover:opacity-90 transition"
              >
                + Thêm Meeting
              </Link>

              <button
                onClick={handleLogout}
                className="border border-gray-300 px-4 py-2.5 rounded-2xl bg-white hover:bg-gray-50 transition"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-5 md:px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900">
              Danh sách meetings
            </h2>
          </div>

          {loading ? (
            <div className="py-16 text-center text-gray-500">
              Đang tải dữ liệu...
            </div>
          ) : pageError ? (
            <div className="p-6">
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-red-600">
                {pageError}
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50 text-left">
                    <th className="py-4 px-4 font-semibold text-gray-700">ID</th>
                    <th className="py-4 px-4 font-semibold text-gray-700">
                      Tiêu đề
                    </th>
                    <th className="py-4 px-4 font-semibold text-gray-700">
                      Địa điểm
                    </th>
                    <th className="py-4 px-4 font-semibold text-gray-700">
                      Ngày bắt đầu
                    </th>
                    <th className="py-4 px-4 font-semibold text-gray-700">
                      Ngày kết thúc
                    </th>
                    <th className="py-4 px-4 font-semibold text-gray-700">Ảnh</th>
                    <th className="py-4 px-4 font-semibold text-gray-700">
                      Hành động
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {meetings.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-10 px-4 text-center text-gray-500"
                      >
                        Chưa có meeting nào
                      </td>
                    </tr>
                  ) : (
                    meetings.map((meeting) => (
                      <tr
                        key={meeting.id}
                        className="border-b last:border-b-0 align-top hover:bg-gray-50/70"
                      >
                        <td className="py-4 px-4 text-gray-700">{meeting.id}</td>

                        <td className="py-4 px-4">
                          <div className="font-semibold text-gray-900 leading-6">
                            {meeting.title}
                          </div>
                          {meeting.summary && (
                            <div className="text-sm text-gray-500 mt-2 line-clamp-2 max-w-[360px]">
                              {meeting.summary}
                            </div>
                          )}
                        </td>

                        <td className="py-4 px-4 text-gray-700">
                          {meeting.location || "-"}
                        </td>

                        <td className="py-4 px-4 whitespace-nowrap text-gray-700">
                          {meeting.startDate
                            ? new Date(meeting.startDate).toLocaleDateString(
                                "vi-VN"
                              )
                            : "-"}
                        </td>

                        <td className="py-4 px-4 whitespace-nowrap text-gray-700">
                          {meeting.endDate
                            ? new Date(meeting.endDate).toLocaleDateString(
                                "vi-VN"
                              )
                            : "-"}
                        </td>

                        <td className="py-4 px-4">
                          {meeting.heroImage ? (
                            <img
                              src={getFileUrl(meeting.heroImage)}
                              alt={meeting.title}
                              className="w-28 h-20 object-cover rounded-xl border border-gray-200 bg-gray-50"
                            />
                          ) : (
                            <div className="w-28 h-20 rounded-xl border border-dashed border-gray-300 flex items-center justify-center text-sm text-gray-400 bg-gray-50">
                              No image
                            </div>
                          )}
                        </td>

                        <td className="py-4 px-4">
                          <div className="flex gap-2 flex-wrap">
                            <Link
                              href={`/admin/meetings/edit/${meeting.id}`}
                              className="bg-blue-600 text-white px-3 py-2 rounded-xl hover:bg-blue-700 transition"
                            >
                              Sửa
                            </Link>

                            <button
                              onClick={() => handleDelete(meeting.id)}
                              className="bg-red-600 text-white px-3 py-2 rounded-xl hover:bg-red-700 transition"
                            >
                              Xóa
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}