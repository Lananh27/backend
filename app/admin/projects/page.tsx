"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/lib/api";

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
  projectsSectionTitle?: string;
  projectsItems?: ProjectItem[];
};

const emptyProject = (): ProjectItem => ({
  title: "",
  subtitle: "",
  description: "",
  bullets: [""],
  image: "",
  readMoreLink: "/projects",
  publishedAt: new Date().toISOString().slice(0, 10),
});

export default function AdminProjectsPage() {
  const [loading, setLoading] = useState(false);
  const [projectsSectionTitle, setProjectsSectionTitle] = useState("Projects");
  const [projectsItems, setProjectsItems] = useState<ProjectItem[]>([
    emptyProject(),
  ]);

  useEffect(() => {
    fetchProjectData();
  }, []);

  const fetchProjectData = async () => {
    try {
      const res = await fetch(`${API_URL}/api/home`);
      const result = await res.json();
      const data: HomeContent = result?.data || {};

      setProjectsSectionTitle(data.projectsSectionTitle || "Projects");
      setProjectsItems(
  Array.isArray(data.projectsItems) && data.projectsItems.length > 0
    ? data.projectsItems.map((item) => ({
        title: item.title || "",
        subtitle: item.subtitle || "",
        description: item.description || "",
        bullets:
          Array.isArray(item.bullets) && item.bullets.length > 0
            ? item.bullets
            : [""],
        image: item.image || "",
        readMoreLink: item.readMoreLink || "/projects",
        publishedAt: item.publishedAt || new Date().toISOString().slice(0, 10),
      }))
    : [emptyProject()]
);
    } catch (error) {
      console.error("FETCH PROJECT ERROR:", error);
      alert("Không lấy được dữ liệu Projects");
    }
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

  const handleProjectImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const url = await uploadFile(file);

      const updated = [...projectsItems];
      updated[index] = { ...updated[index], image: url };
      setProjectsItems(updated);

      alert("Upload ảnh project thành công. Nhớ bấm Lưu Projects.");
    } catch (error) {
      console.error("PROJECT IMAGE UPLOAD ERROR:", error);
      alert(error instanceof Error ? error.message : "Upload thất bại");
    } finally {
      setLoading(false);
    }
  };

  const updateProject = (
    index: number,
    field: keyof ProjectItem,
    value: string | string[]
  ) => {
    const updated = [...projectsItems];
    updated[index] = { ...updated[index], [field]: value } as ProjectItem;
    setProjectsItems(updated);
  };

  const addProject = () => {
    setProjectsItems([...projectsItems, emptyProject()]);
  };

  const removeProject = (index: number) => {
    const updated = projectsItems.filter((_, i) => i !== index);
    setProjectsItems(updated.length ? updated : [emptyProject()]);
  };

  const updateBullet = (
    projectIndex: number,
    bulletIndex: number,
    value: string
  ) => {
    const updated = [...projectsItems];
    const bullets = [...updated[projectIndex].bullets];
    bullets[bulletIndex] = value;
    updated[projectIndex].bullets = bullets;
    setProjectsItems(updated);
  };

  const addBullet = (projectIndex: number) => {
    const updated = [...projectsItems];
    updated[projectIndex].bullets = [...updated[projectIndex].bullets, ""];
    setProjectsItems(updated);
  };

  const removeBullet = (projectIndex: number, bulletIndex: number) => {
    const updated = [...projectsItems];
    const bullets = updated[projectIndex].bullets.filter(
      (_, i) => i !== bulletIndex
    );
    updated[projectIndex].bullets = bullets.length ? bullets : [""];
    setProjectsItems(updated);
  };

  const saveProjects = async () => {
    try {
      setLoading(true);

      const getRes = await fetch(`${API_URL}/api/home`);
      const getResult = await getRes.json();
      const currentData = getResult?.data || {};

      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("adminToken") ||
        localStorage.getItem("accessToken");

      const cleanedProjects = projectsItems
        .map((item) => ({
          ...item,
          bullets: item.bullets.filter((bullet) => bullet.trim() !== ""),
        }))
        .filter(
          (item) =>
            item.title.trim() !== "" ||
            item.subtitle.trim() !== "" ||
            item.description.trim() !== "" ||
            item.image.trim() !== "" ||
            item.readMoreLink.trim() !== "" ||
            item.bullets.length > 0
        );

      const body = {
        ...currentData,
        projectsSectionTitle,
        projectsItems: cleanedProjects,
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
        throw new Error(result.message || "Lưu Projects thất bại");
      }

      alert("Lưu Projects thành công");
      fetchProjectData();
    } catch (error) {
      console.error("SAVE PROJECTS ERROR:", error);
      alert(error instanceof Error ? error.message : "Lưu Projects thất bại");
    } finally {
      setLoading(false);
    }
  };

  const previewUrl = (url: string) => {
    if (!url) return "";
    return url.startsWith("http") ? url : `${API_URL}${url}`;
  };

  return (
    <div className="space-y-8 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Quản lý Projects</h1>
        <button
          type="button"
          onClick={addProject}
          className="rounded bg-green-600 px-4 py-2 text-white"
        >
          + Thêm project
        </button>
      </div>

      <section className="rounded-xl border p-5">
        <label className="mb-1 block font-medium">Section title</label>
        <input
          className="w-full rounded border p-3"
          value={projectsSectionTitle}
          onChange={(e) => setProjectsSectionTitle(e.target.value)}
        />
      </section>

      <div className="space-y-6">
        {projectsItems.map((project, projectIndex) => (
          <section key={projectIndex} className="rounded-xl border p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Project {projectIndex + 1}
              </h2>
              <button
                type="button"
                onClick={() => removeProject(projectIndex)}
                className="rounded bg-red-600 px-4 py-2 text-white"
              >
                Xóa project
              </button>
            </div>

            <div>
              <label className="mb-1 block font-medium">Project title</label>
              <input
                className="w-full rounded border p-3"
                value={project.title}
                onChange={(e) =>
                  updateProject(projectIndex, "title", e.target.value)
                }
              />
            </div>

            <div>
  <label className="mb-1 block font-medium">Ngày đăng</label>
  <input
    type="date"
    className="w-full rounded border p-3"
    value={project.publishedAt}
    onChange={(e) =>
      updateProject(projectIndex, "publishedAt", e.target.value)
    }
  />
</div>

            <div>
              <label className="mb-1 block font-medium">Project subtitle</label>
              <input
                className="w-full rounded border p-3"
                value={project.subtitle}
                onChange={(e) =>
                  updateProject(projectIndex, "subtitle", e.target.value)
                }
              />
            </div>

            <div>
              <label className="mb-1 block font-medium">Description</label>
              <textarea
                className="w-full rounded border p-3"
                rows={4}
                value={project.description}
                onChange={(e) =>
                  updateProject(projectIndex, "description", e.target.value)
                }
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="block font-medium">Bullet points</label>
                <button
                  type="button"
                  onClick={() => addBullet(projectIndex)}
                  className="rounded bg-green-600 px-4 py-2 text-white"
                >
                  + Thêm bullet
                </button>
              </div>

              <div className="space-y-3">
                {project.bullets.map((bullet, bulletIndex) => (
                  <div key={bulletIndex} className="flex gap-3">
                    <input
                      className="flex-1 rounded border p-3"
                      value={bullet}
                      onChange={(e) =>
                        updateBullet(projectIndex, bulletIndex, e.target.value)
                      }
                      placeholder={`Bullet ${bulletIndex + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeBullet(projectIndex, bulletIndex)}
                      className="rounded bg-red-600 px-4 py-2 text-white"
                    >
                      Xóa
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block font-medium">Project image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleProjectImageUpload(e, projectIndex)}
              />
              {project.image && (
                <img
                  src={previewUrl(project.image)}
                  alt="project"
                  className="mt-3 h-48 w-full rounded border object-cover"
                />
              )}
            </div>

            <div>
              <label className="mb-1 block font-medium">Read more link</label>
              <input
                className="w-full rounded border p-3"
                value={project.readMoreLink}
                onChange={(e) =>
                  updateProject(projectIndex, "readMoreLink", e.target.value)
                }
                placeholder="/projects"
              />
            </div>
          </section>
        ))}
      </div>

      <button
        onClick={saveProjects}
        className="rounded bg-black px-6 py-3 text-white"
      >
        Lưu Projects
      </button>

      {loading && <p className="text-sm text-gray-500">Đang xử lý...</p>}
    </div>
  );
}