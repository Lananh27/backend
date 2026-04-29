"use client";

import { useEffect, useState } from "react";
import {
  API_URL,
  getPeople,
  createPerson,
  updatePerson,
  deletePerson,
} from "@/lib/api";

type PersonItem = {
  id?: number;
  fullName: string;
  role: string;
  institution: string;
  email: string;
  cvLink: string;
  location: string;
  avatar: string;
  bio: string;
};

const emptyPerson = (): PersonItem => ({
  fullName: "",
  role: "",
  institution: "",
  email: "",
  cvLink: "",
  location: "",
  avatar: "",
  bio: "",
});

export default function AdminPeoplePage() {
  const [people, setPeople] = useState<PersonItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPeople();
  }, []);

  const fetchPeople = async () => {
    try {
      const res = await getPeople();
      setPeople(Array.isArray(res?.data) ? res.data : []);
    } catch (error) {
      console.error("FETCH PEOPLE ERROR:", error);
      alert("Không lấy được danh sách people");
    }
  };

  const addPerson = () => {
    setPeople([...people, emptyPerson()]);
  };

  const updateField = (
    index: number,
    field: keyof PersonItem,
    value: string
  ) => {
    const updated = [...people];
    updated[index] = { ...updated[index], [field]: value };
    setPeople(updated);
  };

  const removePerson = async (index: number) => {
    const item = people[index];

    if (item.id) {
      try {
        setLoading(true);
        await deletePerson(item.id);
        await fetchPeople();
      } catch (error) {
        console.error("DELETE PERSON ERROR:", error);
        alert("Xóa person thất bại");
      } finally {
        setLoading(false);
      }
      return;
    }

    const updated = people.filter((_, i) => i !== index);
    setPeople(updated);
  };

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API_URL}/api/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Upload thất bại");
    }

    return data.url as string;
  };

  const handleAvatarUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const url = await uploadFile(file);

      const updated = [...people];
      updated[index] = { ...updated[index], avatar: url };
      setPeople(updated);
    } catch (error) {
      console.error("UPLOAD AVATAR ERROR:", error);
      alert("Upload avatar thất bại");
    } finally {
      setLoading(false);
    }
  };

  const saveAll = async () => {
    try {
      setLoading(true);

      for (const item of people) {
        const payload = {
          fullName: item.fullName,
          role: item.role,
          institution: item.institution,
          email: item.email,
          cvLink: item.cvLink,
          location: item.location,
          avatar: item.avatar,
          bio: item.bio,
        };

        if (item.id) {
          await updatePerson(item.id, payload);
        } else if (item.fullName.trim() !== "") {
          await createPerson(payload);
        }
      }

      alert("Lưu People thành công");
      await fetchPeople();
    } catch (error) {
      console.error("SAVE PEOPLE ERROR:", error);
      alert("Lưu People thất bại");
    } finally {
      setLoading(false);
    }
  };

  const imgUrl = (url?: string) => {
    if (!url) return "";
    return url.startsWith("http") ? url : `${API_URL}${url}`;
  };

  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Quản lý People</h1>
        <button
          type="button"
          onClick={addPerson}
          className="rounded bg-green-600 px-4 py-2 text-white"
        >
          + Thêm người
        </button>
      </div>

      <div className="space-y-6">
        {people.map((person, index) => (
          <section key={index} className="rounded-xl border p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Person {index + 1}</h2>
              <button
                type="button"
                onClick={() => removePerson(index)}
                className="rounded bg-red-600 px-4 py-2 text-white"
              >
                Xóa
              </button>
            </div>

            <div>
              <label className="mb-1 block font-medium">Họ tên</label>
              <input
                className="w-full rounded border p-3"
                value={person.fullName}
                onChange={(e) => updateField(index, "fullName", e.target.value)}
              />
            </div>

            <div>
              <label className="mb-1 block font-medium">Chức danh</label>
              <input
                className="w-full rounded border p-3"
                value={person.role}
                onChange={(e) => updateField(index, "role", e.target.value)}
              />
            </div>

            <div>
              <label className="mb-1 block font-medium">Cơ quan / Công ty</label>
              <input
                className="w-full rounded border p-3"
                value={person.institution}
                onChange={(e) =>
                  updateField(index, "institution", e.target.value)
                }
              />
            </div>

            <div>
              <label className="mb-1 block font-medium">Email</label>
              <input
                className="w-full rounded border p-3"
                value={person.email}
                onChange={(e) => updateField(index, "email", e.target.value)}
              />
            </div>

            <div>
              <label className="mb-1 block font-medium">CV link</label>
              <input
                className="w-full rounded border p-3"
                value={person.cvLink}
                onChange={(e) => updateField(index, "cvLink", e.target.value)}
              />
            </div>

            <div>
              <label className="mb-1 block font-medium">Địa điểm</label>
              <input
                className="w-full rounded border p-3"
                value={person.location}
                onChange={(e) => updateField(index, "location", e.target.value)}
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">Avatar</label>
              <input type="file" accept="image/*" onChange={(e) => handleAvatarUpload(e, index)} />
              {person.avatar && (
                <img
                  src={imgUrl(person.avatar)}
                  alt={person.fullName}
                  className="mt-3 h-32 w-32 rounded-full object-cover border"
                />
              )}
            </div>

            <div>
              <label className="mb-1 block font-medium">Mô tả chi tiết</label>
              <textarea
                className="w-full rounded border p-3"
                rows={6}
                value={person.bio}
                onChange={(e) => updateField(index, "bio", e.target.value)}
              />
            </div>
          </section>
        ))}
      </div>

      <button
        onClick={saveAll}
        className="rounded bg-black px-6 py-3 text-white"
      >
        Lưu People
      </button>

      {loading && <p className="text-sm text-gray-500">Đang xử lý...</p>}
    </div>
  );
}