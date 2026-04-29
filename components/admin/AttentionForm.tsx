"use client";

import { useEffect, useMemo, useState } from "react";
import { API_URL } from "@/lib/api";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

type AttentionItem = {
  title: string;
  content: string;
  postSlug: string;
};

type HomeContent = {
  attentionItems?: AttentionItem[];
};

const emptyAttention = (): AttentionItem => ({
  title: "",
  content: "",
  postSlug: "",
});

export default function AttentionForm() {
  const [loading, setLoading] = useState(false);
  const [attentionItems, setAttentionItems] = useState<AttentionItem[]>([
    emptyAttention(),
  ]);

  useEffect(() => {
    fetchAttentionData();
  }, []);

  const fetchAttentionData = async () => {
    try {
      const res = await fetch(`${API_URL}/api/home`);
      const result = await res.json();
      const data: HomeContent = result?.data || {};

      if (Array.isArray(data.attentionItems) && data.attentionItems.length > 0) {
        setAttentionItems(
          data.attentionItems.map((item) => ({
            title: item.title || "",
            content: item.content || "",
            postSlug: item.postSlug || "",
          }))
        );
      } else {
        setAttentionItems([emptyAttention()]);
      }
    } catch (error) {
      console.error("FETCH ATTENTION ERROR:", error);
      alert("Không lấy được dữ liệu Attention");
    }
  };

  const makeSlug = (value: string) => {
    return value
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const updateAttentionItem = (
    index: number,
    field: keyof AttentionItem,
    value: string
  ) => {
    const updated = [...attentionItems];
    updated[index] = { ...updated[index], [field]: value };

    if (field === "title") {
      updated[index].postSlug = makeSlug(value);
    }

    setAttentionItems(updated);
  };

  const addAttentionItem = () => {
    setAttentionItems([...attentionItems, emptyAttention()]);
  };

  const removeAttentionItem = (index: number) => {
    const updated = attentionItems.filter((_, i) => i !== index);
    setAttentionItems(updated.length ? updated : [emptyAttention()]);
  };

  const uploadEditorImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API_URL}/api/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.message || "Upload ảnh thất bại");
    }

    return data.url.startsWith("http") ? data.url : `${API_URL}${data.url}`;
  };

  const handleInsertImage = (index: number) => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      try {
        setLoading(true);
        const imageUrl = await uploadEditorImage(file);

        const currentContent = attentionItems[index]?.content || "";
        const imageHtml = `<p><img src="${imageUrl}" alt="Uploaded image" /></p>`;
        updateAttentionItem(index, "content", `${currentContent}${imageHtml}`);
      } catch (error) {
        console.error("EDITOR IMAGE UPLOAD ERROR:", error);
        alert(error instanceof Error ? error.message : "Upload ảnh thất bại");
      } finally {
        setLoading(false);
      }
    };
  };

  const quillModules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ color: [] }, { background: [] }],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ align: [] }],
          ["link", "image"],
          ["clean"],
        ],
        handlers: {
          image: function (this: unknown) {
            const editorIndex = Number(
              (this as { quill?: { container?: HTMLElement } })?.quill?.container
                ?.closest("[data-attention-index]")
                ?.getAttribute("data-attention-index")
            );

            if (!Number.isNaN(editorIndex)) {
              handleInsertImage(editorIndex);
            }
          },
        },
      },
    }),
    [attentionItems]
  );

  const quillFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "list",
    "align",
    "link",
    "image",
  ];

  const saveAttention = async () => {
    try {
      setLoading(true);

      const cleanedAttentionItems = attentionItems.filter(
        (item) =>
          item.title.trim() !== "" ||
          item.content.trim() !== "" ||
          item.postSlug.trim() !== ""
      );

      const getRes = await fetch(`${API_URL}/api/home`);
      const getResult = await getRes.json();
      const currentData = getResult?.data || {};

      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("adminToken") ||
        localStorage.getItem("accessToken");

      const body = {
        ...currentData,
        attentionItems: cleanedAttentionItems,
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
        throw new Error(result.message || "Lưu Attention thất bại");
      }

      alert("Lưu Attention thành công");
      fetchAttentionData();
    } catch (error) {
      console.error("SAVE ATTENTION ERROR:", error);
      alert(error instanceof Error ? error.message : "Lưu Attention thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Quản lý Attention</h1>
        <button
          type="button"
          onClick={addAttentionItem}
          className="rounded bg-green-600 px-4 py-2 text-white"
        >
          + Thêm bài
        </button>
      </div>

      <div className="space-y-6">
        {attentionItems.map((item, index) => (
          <div key={index} className="rounded-xl border p-5 bg-white">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Bài {index + 1}</h2>
              <button
                type="button"
                onClick={() => removeAttentionItem(index)}
                className="rounded bg-red-600 px-4 py-2 text-white"
              >
                Xóa
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block font-medium">Tiêu đề</label>
                <input
                  className="w-full rounded border p-3"
                  value={item.title}
                  onChange={(e) =>
                    updateAttentionItem(index, "title", e.target.value)
                  }
                  placeholder="Nhập tiêu đề"
                />
              </div>

              <div>
                <label className="mb-1 block font-medium">Slug</label>
                <input
                  className="w-full rounded border p-3"
                  value={item.postSlug}
                  onChange={(e) =>
                    updateAttentionItem(index, "postSlug", e.target.value)
                  }
                  placeholder="vi-du-ten-bai-viet"
                />
              </div>

              <div data-attention-index={index}>
                <label className="mb-1 block font-medium">Nội dung</label>
                <div className="overflow-hidden rounded border bg-white">
                  <ReactQuill
                    theme="snow"
                    value={item.content}
                    onChange={(value) =>
                      updateAttentionItem(index, "content", value)
                    }
                    modules={quillModules}
                    formats={quillFormats}
                    placeholder="Nhập nội dung bài viết..."
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={saveAttention}
        className="rounded bg-black px-6 py-3 text-white"
      >
        Lưu Attention
      </button>

      {loading && <p className="text-sm text-gray-500">Đang xử lý...</p>}
    </div>
  );
}