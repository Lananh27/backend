"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
  getAboutContent,
  updateAboutContent,
  uploadImage,
} from "@/lib/api";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
}) as any;

export default function AdminAboutPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const quillRef = useRef<any>(null);

  const [content, setContent] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAboutContent();
        const data = res?.data;

        if (data) {
          setContent(
            typeof data.content === "string"
              ? data.content
              : data.content?.html || ""
          );
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      try {
        const data = await uploadImage(file);
        const imageUrl = data?.url;

        if (!imageUrl) {
          throw new Error("Không upload được ảnh");
        }

        const quill = quillRef.current?.getEditor();
        const range = quill?.getSelection(true);

        if (!quill) return;

        const index = range ? range.index : quill.getLength();

        quill.insertEmbed(index, "image", imageUrl);
        quill.setSelection(index + 1);
      } catch (error) {
        console.error(error);
        alert("Upload ảnh thất bại");
      }
    };
  };

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          [{ font: [] }],
          [{ size: ["small", false, "large", "huge"] }],
          ["bold", "italic", "underline", "strike"],
          [{ color: [] }, { background: [] }],
          [{ align: [] }],
          [{ list: "ordered" }, { list: "bullet" }],
          ["blockquote", "link", "image"],
          ["clean"],
        ],
        handlers: {
          image: imageHandler,
        },
      },
    }),
    []
  );

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "align",
    "list",
    "blockquote",
    "link",
    "image",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);

      const payload = {
        content,
      };

      const result = await updateAboutContent(payload);
      alert(result?.message || "Lưu About thành công");
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Có lỗi khi lưu About");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="max-w-5xl">
      <h2 className="mb-6 text-3xl font-bold">Quản lý About us</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="mb-2 block font-semibold">Nội dung</label>
          <div className="overflow-hidden rounded-xl border bg-white">
            <ReactQuill
              ref={quillRef}
              theme="snow"
              value={content}
              onChange={(value: string) => setContent(value)}
              modules={modules}
              formats={formats}
              placeholder="Nhập nội dung About ở đây..."
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-black px-6 py-3 font-medium text-white disabled:opacity-60"
        >
          {saving ? "Đang lưu..." : "Lưu About"}
        </button>
      </form>
    </div>
  );
}