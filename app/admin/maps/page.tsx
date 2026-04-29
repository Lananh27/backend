"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/lib/api";

type MapItem = {
  title: string;
  embedUrl: string;
  link: string;
  buttonText: string;
  publishedAt: string;
};

type HomeContent = {
  mapsSectionTitle?: string;
  mapsItems?: MapItem[];
};

const emptyMap = (): MapItem => ({
  title: "",
  embedUrl: "",
  link: "",
  buttonText: "View Map",
  publishedAt: new Date().toISOString().slice(0, 10),
});

export default function AdminMapsPage() {
  const [loading, setLoading] = useState(false);
  const [mapsSectionTitle, setMapsSectionTitle] = useState("Geographic");
  const [mapsItems, setMapsItems] = useState<MapItem[]>([emptyMap()]);

  useEffect(() => {
    fetchMapsData();
  }, []);

  const fetchMapsData = async () => {
    try {
      const res = await fetch(`${API_URL}/api/home`);
      const result = await res.json();
      const data: HomeContent = result?.data || {};

      setMapsSectionTitle(data.mapsSectionTitle || "Geographic");
      setMapsItems(
        Array.isArray(data.mapsItems) && data.mapsItems.length > 0
          ? data.mapsItems.map((item) => ({
              title: item.title || "",
              embedUrl: item.embedUrl || "",
              link: item.link || "",
              buttonText: item.buttonText || "View Map",
              publishedAt:
                item.publishedAt || new Date().toISOString().slice(0, 10),
            }))
          : [emptyMap()]
      );
    } catch (error) {
      console.error("FETCH MAPS ERROR:", error);
      alert("Không lấy được dữ liệu Maps");
    }
  };

  const updateMap = (index: number, field: keyof MapItem, value: string) => {
    const updated = [...mapsItems];
    updated[index] = { ...updated[index], [field]: value };
    setMapsItems(updated);
  };

  const addMap = () => {
    setMapsItems([...mapsItems, emptyMap()]);
  };

  const removeMap = (index: number) => {
    const updated = mapsItems.filter((_, i) => i !== index);
    setMapsItems(updated.length ? updated : [emptyMap()]);
  };

  const saveMaps = async () => {
    try {
      setLoading(true);

      const getRes = await fetch(`${API_URL}/api/home`);
      const getResult = await getRes.json();
      const currentData = getResult?.data || {};

      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("adminToken") ||
        localStorage.getItem("accessToken");

      const cleanedMaps = mapsItems.filter(
        (item) =>
          item.title.trim() !== "" ||
          item.embedUrl.trim() !== "" ||
          item.link.trim() !== "" ||
          item.buttonText.trim() !== ""
      );

      const body = {
        ...currentData,
        mapsSectionTitle,
        mapsItems: cleanedMaps,
      };

      const res = await fetch(`${API_URL}/api/home`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Lưu Maps thất bại");
      }

      alert("Lưu Maps thành công");
      fetchMapsData();
    } catch (error) {
      console.error("SAVE MAPS ERROR:", error);
      alert(error instanceof Error ? error.message : "Lưu Maps thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Quản lý Maps</h1>
        <button
          type="button"
          onClick={addMap}
          className="rounded bg-green-600 px-4 py-2 text-white"
        >
          + Thêm map
        </button>
      </div>

      <section className="rounded-xl border p-5">
        <label className="mb-1 block font-medium">Section title</label>
        <input
          className="w-full rounded border p-3"
          value={mapsSectionTitle}
          onChange={(e) => setMapsSectionTitle(e.target.value)}
        />
      </section>

      <div className="space-y-6">
        {mapsItems.map((item, index) => (
          <section key={index} className="rounded-xl border p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Map {index + 1}</h2>
              <button
                type="button"
                onClick={() => removeMap(index)}
                className="rounded bg-red-600 px-4 py-2 text-white"
              >
                Xóa map
              </button>
            </div>

            <div>
              <label className="mb-1 block font-medium">Title</label>
              <input
                className="w-full rounded border p-3"
                value={item.title}
                onChange={(e) => updateMap(index, "title", e.target.value)}
              />
            </div>

            <div>
              <label className="mb-1 block font-medium">Ngày đăng</label>
              <input
                type="date"
                className="w-full rounded border p-3"
                value={item.publishedAt || ""}
                onChange={(e) =>
                  updateMap(index, "publishedAt", e.target.value)
                }
              />
            </div>

            <div>
              <label className="mb-1 block font-medium">Embed URL</label>
              <input
                className="w-full rounded border p-3"
                value={item.embedUrl}
                onChange={(e) => updateMap(index, "embedUrl", e.target.value)}
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="mb-1 block font-medium">Link mở ngoài</label>
              <input
                className="w-full rounded border p-3"
                value={item.link}
                onChange={(e) => updateMap(index, "link", e.target.value)}
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="mb-1 block font-medium">Button text</label>
              <input
                className="w-full rounded border p-3"
                value={item.buttonText}
                onChange={(e) => updateMap(index, "buttonText", e.target.value)}
              />
            </div>
          </section>
        ))}
      </div>

      <button
        onClick={saveMaps}
        className="rounded bg-black px-6 py-3 text-white"
      >
        Lưu Maps
      </button>

      {loading && <p className="text-sm text-gray-500">Đang xử lý...</p>}
    </div>
  );
}