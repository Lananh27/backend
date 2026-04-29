"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/api";

export default function CreateMeetingPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [agendaFileUrl, setAgendaFileUrl] = useState("");
  const [reportFileUrl, setReportFileUrl] = useState("");
  const [photosLink, setPhotosLink] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/admin/login");
    }
  }, [router]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Bạn chưa đăng nhập.");
        return;
      }

      if (!title.trim()) {
        setError("Vui lòng nhập tiêu đề meeting.");
        return;
      }

      if (!startDate || !endDate) {
        setError("Vui lòng chọn ngày bắt đầu và ngày kết thúc.");
        return;
      }

      const start = new Date(startDate);
      const end = new Date(endDate);

      if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
        setError("Ngày bắt đầu hoặc ngày kết thúc không hợp lệ.");
        return;
      }

      if (end < start) {
        setError("Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu.");
        return;
      }

      let heroImage = "";

      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);

        const uploadRes = await fetch(`${API_URL}/api/upload/image`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        let uploadData: any = {};
        try {
          uploadData = await uploadRes.json();
        } catch {
          uploadData = {};
        }

        if (!uploadRes.ok) {
          setError(uploadData?.message || "Upload ảnh thất bại.");
          return;
        }

        heroImage = uploadData?.fileUrl || "";
      }

      const payload = {
        title: title.trim(),
        summary: summary.trim(),
        location: location.trim(),
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        heroImage,
        agendaFileUrl: agendaFileUrl.trim(),
        reportFileUrl: reportFileUrl.trim(),
        photosLink: photosLink.trim(),
      };

      const createRes = await fetch(`${API_URL}/api/meetings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      let createData: any = {};
      try {
        createData = await createRes.json();
      } catch {
        createData = {};
      }

      if (!createRes.ok) {
        setError(createData?.message || "Tạo meeting thất bại.");
        return;
      }

      setSuccess("Tạo meeting thành công.");

      setTimeout(() => {
        router.push("/admin/meetings");
      }, 700);
    } catch (error) {
      console.error("CREATE MEETING ERROR:", error);
      setError("Không thể kết nối backend.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f6f8] p-4 md:p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 md:px-8 py-6 border-b border-gray-100">
          <p className="text-sm uppercase tracking-[0.2em] text-gray-500 mb-2">
            Admin panel
          </p>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Tạo Meeting mới
          </h1>
          <p className="text-gray-500 mt-2">
            Nhập thông tin meeting để hiển thị ở frontend.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Tiêu đề
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:border-black"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhập tiêu đề"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Mô tả ngắn
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none min-h-[140px] focus:border-black"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Nhập mô tả ngắn cho meeting"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Địa điểm
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:border-black"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ví dụ: Iloilo City, the Philippines"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Ngày bắt đầu
              </label>
              <input
                type="datetime-local"
                className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:border-black"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Ngày kết thúc
              </label>
              <input
                type="datetime-local"
                className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:border-black"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Ảnh lớn giữa trang
            </label>
            <input
              type="file"
              accept="image/*"
              className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none file:mr-4 file:border-0 file:bg-transparent file:text-sm file:font-medium"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setImageFile(e.target.files[0]);
                } else {
                  setImageFile(null);
                }
              }}
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Link Agenda PDF
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:border-black"
              value={agendaFileUrl}
              onChange={(e) => setAgendaFileUrl(e.target.value)}
              placeholder="https://...pdf"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Link Report PDF
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:border-black"
              value={reportFileUrl}
              onChange={(e) => setReportFileUrl(e.target.value)}
              placeholder="https://...pdf"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Link album ảnh
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:border-black"
              value={photosLink}
              onChange={(e) => setPhotosLink(e.target.value)}
              placeholder="https://..."
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-2xl p-4">
              {error}
            </div>
          )}

          {success && (
            <div className="text-green-700 text-sm bg-green-50 border border-green-200 rounded-2xl p-4">
              {success}
            </div>
          )}

          <div className="flex gap-3 flex-wrap pt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-black text-white px-6 py-3 rounded-2xl hover:opacity-90 transition disabled:opacity-60"
            >
              {loading ? "Đang xử lý..." : "Tạo Meeting"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/admin/meetings")}
              className="border border-gray-300 px-6 py-3 rounded-2xl bg-white hover:bg-gray-50 transition"
            >
              Quay lại
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}