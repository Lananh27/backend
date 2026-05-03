export const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

export function getToken() {
  if (typeof window === "undefined") return null;

  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("adminToken") ||
    localStorage.getItem("accessToken");

  return token && token.trim() ? token.trim() : null;
}

async function readJsonSafely(res: Response) {
  return res.json().catch(() => null);
}

export async function authFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = getToken();
  const isFormData = options.body instanceof FormData;

  const headers: HeadersInit = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  return fetch(url, {
    ...options,
    headers,
  });
}

/* =========================
   HOME
========================= */

export async function getHomeContent() {
  const res = await fetch(`${API_URL}/api/home`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch home content");
  }

  return res.json();
}

export async function updateHomeContent(data: any) {
  const res = await authFetch(`${API_URL}/api/home`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

  const result = await readJsonSafely(res);

  if (!res.ok) {
    throw new Error(result?.message || `Request failed: ${res.status}`);
  }

  return result;
}

/* =========================
   ABOUT
========================= */

export type AboutPageData = {
  id?: number;
  slug?: string;
  title?: string | null;
  subtitle?: string | null;
  description?: string | null;
  mission?: string | null;
  vision?: string | null;
  content?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type PartnerLogoItem = {
  url: string;
};

export type CollaborationAreaItem = {
  title: string;
  desc: string;
};

export type PartnersContent = {
  partnerLogos: PartnerLogoItem[];
  collaborationAreas: CollaborationAreaItem[];
  details: string;
};

export type ContactContent = {
  organizationName: string;
  address: string;
  contactEmail: string;
  phoneNumber: string;
  workingHours: string;
  socialMedia: string;
  mapEmbedUrl: string;
  details: string;
};

export const defaultPartnersContent: PartnersContent = {
  partnerLogos: [],
  collaborationAreas: [
    {
      title: "Research collaboration",
      desc: "Joint studies, fieldwork, academic exchange, and shared research outputs.",
    },
    {
      title: "Training & education",
      desc: "Workshops, capacity building, student activities, and knowledge transfer.",
    },
    {
      title: "Events & networks",
      desc: "Conferences, seminars, technical meetings, and regional cooperation.",
    },
  ],
  details: "",
};

export const defaultContactContent: ContactContent = {
  organizationName: "International Mekong Research Working Group (IMRWG)",
  address: "",
  contactEmail: "",
  phoneNumber: "",
  workingHours: "Monday – Friday, 08:00 – 17:00",
  socialMedia: "",
  mapEmbedUrl:
    "https://www.google.com/maps?q=Ho%20Chi%20Minh%20City%2C%20Vietnam&output=embed",
  details: "",
};

export function parseAboutJsonContent<T>(content: unknown, fallback: T): T {
  if (!content) return fallback;

  if (typeof content === "object") {
    return {
      ...fallback,
      ...(content as object),
    } as T;
  }

  if (typeof content !== "string") return fallback;

  try {
    const parsed = JSON.parse(content);

    if (parsed && typeof parsed === "object") {
      return {
        ...fallback,
        ...parsed,
      };
    }

    return fallback;
  } catch {
    return fallback;
  }
}

export function stringifyAboutJsonContent(data: unknown) {
  return JSON.stringify(data || {});
}

export async function getAboutContent() {
  const res = await fetch(`${API_URL}/api/about`, {
    cache: "no-store",
  });

  const result = await readJsonSafely(res);

  if (!res.ok) {
    throw new Error(result?.message || "Failed to fetch about content");
  }

  return result;
}

export async function updateAboutContent(data: Partial<AboutPageData>) {
  const res = await authFetch(`${API_URL}/api/about`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

  const result = await readJsonSafely(res);

  if (!res.ok) {
    throw new Error(result?.message || `Request failed: ${res.status}`);
  }

  return result;
}

export async function getAllAboutPages() {
  const res = await fetch(`${API_URL}/api/about/all`, {
    cache: "no-store",
  });

  const result = await readJsonSafely(res);

  if (!res.ok) {
    throw new Error(result?.message || "Failed to fetch about pages");
  }

  return result;
}

export async function getAboutContentBySlug(slug: string) {
  const cleanSlug = slug.replace(/^\/+|\/+$/g, "");

  const res = await fetch(`${API_URL}/api/about/${cleanSlug}`, {
    cache: "no-store",
  });

  const result = await readJsonSafely(res);

  if (!res.ok) {
    throw new Error(result?.message || `Failed to fetch about page: ${slug}`);
  }

  return result;
}

export async function updateAboutContentBySlug(
  slug: string,
  data: Partial<AboutPageData>
) {
  const cleanSlug = slug.replace(/^\/+|\/+$/g, "");

  const res = await authFetch(`${API_URL}/api/about/${cleanSlug}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

  const result = await readJsonSafely(res);

  if (!res.ok) {
    throw new Error(result?.message || `Request failed: ${res.status}`);
  }

  return result;
}

/* =========================
   UPLOAD
========================= */

export async function uploadImage(file: File): Promise<{
  message: string;
  url: string;
  key?: string;
}> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await authFetch(`${API_URL}/api/upload`, {
    method: "POST",
    body: formData,
  });

  const result = await readJsonSafely(res);

  if (!res.ok) {
    throw new Error(result?.message || "Upload file thất bại");
  }

  if (!result?.url) {
    throw new Error("Upload thành công nhưng backend không trả về URL file");
  }

  return result;
}

/* =========================
   PEOPLE
========================= */

export type PeopleCategory = "speakers" | "guests" | "committee";

export type PersonItem = {
  id?: number;
  fullName: string;
  role?: string;
  institution?: string;
  email?: string;
  cvLink?: string;
  location?: string;
  avatar?: string;
  bio?: string;
  category?: PeopleCategory;

  phone?: string;
  website?: string;
  mapEmbedUrl?: string;
  specialties?: string[] | string;
  achievements?: string[] | string;

  createdAt?: string;
  updatedAt?: string;
};

export async function getPeople(params?: { category?: PeopleCategory }) {
  const query = new URLSearchParams();

  if (params?.category) {
    query.set("category", params.category);
  }

  const suffix = query.toString() ? `?${query.toString()}` : "";

  const res = await fetch(`${API_URL}/api/people${suffix}`, {
    cache: "no-store",
  });

  const result = await readJsonSafely(res);

  if (!res.ok) {
    throw new Error(result?.message || "Không lấy được danh sách people");
  }

  return result;
}

export async function createPerson(data: PersonItem) {
  const token = getToken();

  if (!token) {
    throw new Error("Bạn chưa đăng nhập hoặc token đã mất. Vui lòng đăng nhập lại.");
  }

  const res = await authFetch(`${API_URL}/api/people`, {
    method: "POST",
    body: JSON.stringify(data),
  });

  const result = await readJsonSafely(res);

  if (!res.ok) {
    throw new Error(result?.message || "Thêm people thất bại");
  }

  return result;
}

export async function updatePerson(id: number, data: PersonItem) {
  const token = getToken();

  if (!token) {
    throw new Error("Bạn chưa đăng nhập hoặc token đã mất. Vui lòng đăng nhập lại.");
  }

  const res = await authFetch(`${API_URL}/api/people/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

  const result = await readJsonSafely(res);

  if (!res.ok) {
    throw new Error(result?.message || "Cập nhật people thất bại");
  }

  return result;
}

export async function deletePerson(id: number) {
  const token = getToken();

  if (!token) {
    throw new Error("Bạn chưa đăng nhập hoặc token đã mất. Vui lòng đăng nhập lại.");
  }

  const res = await authFetch(`${API_URL}/api/people/${id}`, {
    method: "DELETE",
  });

  const result = await readJsonSafely(res);

  if (!res.ok) {
    throw new Error(result?.message || "Xóa people thất bại");
  }

  return result;
}

/* =========================
   EDUCATION
========================= */

export async function getEducationContent() {
  const res = await fetch(`${API_URL}/api/education`, {
    cache: "no-store",
  });

  const result = await readJsonSafely(res);

  if (!res.ok) {
    throw new Error(result?.message || "Failed to fetch education content");
  }

  return result;
}

export async function updateEducationContent(data: any) {
  const res = await authFetch(`${API_URL}/api/education`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

  const result = await readJsonSafely(res);

  if (!res.ok) {
    throw new Error(result?.message || `Request failed: ${res.status}`);
  }

  return result;
}

/* =========================
   DATA
========================= */

export type DataItem = {
  id: number;
  title: string;
  slug: string;
  category: string;
  description: string;
  value?: string | null;
  unit?: string | null;
  fileUrl?: string | null;
  imageUrl?: string | null;
  year?: number | null;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

export async function getDataItems(category?: string): Promise<DataItem[]> {
  const url = category
    ? `${API_URL}/api/data?category=${category}`
    : `${API_URL}/api/data`;

  const res = await fetch(url, {
    cache: "no-store",
  });

  const result = await readJsonSafely(res);

  if (!res.ok) {
    throw new Error(result?.message || "Failed to fetch data items");
  }

  return result?.data || result || [];
}

export async function getAdminDataItems(): Promise<DataItem[]> {
  const res = await fetch(`${API_URL}/api/data/admin`, {
    cache: "no-store",
  });

  const result = await readJsonSafely(res);

  if (!res.ok) {
    throw new Error(result?.message || "Failed to fetch admin data items");
  }

  return result?.data || result || [];
}

export async function createDataItem(payload: Partial<DataItem>) {
  const token = getToken();

  if (!token) {
    throw new Error("Bạn chưa đăng nhập hoặc token đã mất. Vui lòng đăng nhập lại.");
  }

  const res = await authFetch(`${API_URL}/api/data`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  const result = await readJsonSafely(res);

  if (!res.ok) {
    throw new Error(result?.message || "Failed to create data item");
  }

  return result;
}

export async function updateDataItem(id: number, payload: Partial<DataItem>) {
  const token = getToken();

  if (!token) {
    throw new Error("Bạn chưa đăng nhập hoặc token đã mất. Vui lòng đăng nhập lại.");
  }

  const res = await authFetch(`${API_URL}/api/data/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

  const result = await readJsonSafely(res);

  if (!res.ok) {
    throw new Error(result?.message || "Failed to update data item");
  }

  return result;
}

export async function deleteDataItem(id: number) {
  const token = getToken();

  if (!token) {
    throw new Error("Bạn chưa đăng nhập hoặc token đã mất. Vui lòng đăng nhập lại.");
  }

  const res = await authFetch(`${API_URL}/api/data/${id}`, {
    method: "DELETE",
  });

  const result = await readJsonSafely(res);

  if (!res.ok) {
    throw new Error(result?.message || "Failed to delete data item");
  }

  return result;
}

export async function getAllDataPages() {
  const res = await fetch(`${API_URL}/api/data`, {
    cache: "no-store",
  });

  const result = await readJsonSafely(res);

  if (!res.ok) {
    throw new Error(result?.message || "Failed to fetch data pages");
  }

  return result;
}

export async function getDataContentBySlug(slug: string) {
  const cleanSlug = slug.replace(/^\/+|\/+$/g, "");

  const res = await fetch(`${API_URL}/api/data/${cleanSlug}`, {
    cache: "no-store",
  });

  const result = await readJsonSafely(res);

  if (!res.ok) {
    throw new Error(result?.message || `Failed to fetch data page: ${slug}`);
  }

  return result;
}

export async function updateDataContentBySlug(slug: string, data: any) {
  const cleanSlug = slug.replace(/^\/+|\/+$/g, "");

  const res = await authFetch(`${API_URL}/api/data/${cleanSlug}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

  const result = await readJsonSafely(res);

  if (!res.ok) {
    throw new Error(result?.message || `Request failed: ${res.status}`);
  }

  return result;
}

/* =========================
   LIBRARY
========================= */

export type LibraryDocument = {
  id?: number;
  title: string;
  slug: string;
  description?: string;
  category?: string;
  author?: string;
  publishedAt?: string;
  fileType?: string;
  fileUrl?: string;
  coverImage?: string;
  status?: "PUBLISHED" | "DRAFT";
  isFeatured?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export async function getLibraryDocuments(params?: {
  q?: string;
  category?: string;
  year?: string;
  fileType?: string;
  status?: string;
}) {
  const query = new URLSearchParams();

  if (params?.q) query.set("q", params.q);
  if (params?.category) query.set("category", params.category);
  if (params?.year) query.set("year", params.year);
  if (params?.fileType) query.set("fileType", params.fileType);
  if (params?.status) query.set("status", params.status);

  const suffix = query.toString() ? `?${query.toString()}` : "";

  const res = await fetch(`${API_URL}/api/library${suffix}`, {
    cache: "no-store",
  });

  const result = await readJsonSafely(res);

  if (!res.ok) {
    throw new Error(result?.message || "Cannot fetch library documents");
  }

  return result;
}

export async function getLibraryDocumentBySlug(slug: string) {
  const cleanSlug = slug.replace(/^\/+|\/+$/g, "");

  const res = await fetch(`${API_URL}/api/library/${cleanSlug}`, {
    cache: "no-store",
  });

  const result = await readJsonSafely(res);

  if (!res.ok) {
    throw new Error(result?.message || "Cannot fetch library document");
  }

  return result;
}

export async function createLibraryDocument(data: LibraryDocument) {
  const token = getToken();

  if (!token) {
    throw new Error("Bạn chưa đăng nhập hoặc token đã mất. Vui lòng đăng nhập lại.");
  }

  const res = await authFetch(`${API_URL}/api/library`, {
    method: "POST",
    body: JSON.stringify(data),
  });

  const result = await readJsonSafely(res);

  if (!res.ok) {
    throw new Error(result?.message || "Cannot create library document");
  }

  return result;
}

export async function updateLibraryDocument(id: number, data: LibraryDocument) {
  const token = getToken();

  if (!token) {
    throw new Error("Bạn chưa đăng nhập hoặc token đã mất. Vui lòng đăng nhập lại.");
  }

  const res = await authFetch(`${API_URL}/api/library/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

  const result = await readJsonSafely(res);

  if (!res.ok) {
    throw new Error(result?.message || "Cannot update library document");
  }

  return result;
}

export async function deleteLibraryDocument(id: number) {
  const token = getToken();

  if (!token) {
    throw new Error("Bạn chưa đăng nhập hoặc token đã mất. Vui lòng đăng nhập lại.");
  }

  const res = await authFetch(`${API_URL}/api/library/${id}`, {
    method: "DELETE",
  });

  const result = await readJsonSafely(res);

  if (!res.ok) {
    throw new Error(result?.message || "Cannot delete library document");
  }

  return result;
}

export async function uploadLibraryAsset(file: File) {
  return uploadImage(file);
}

/* =========================
   MEETINGS
========================= */

export type MeetingItem = {
  id?: number;
  title: string;
  summary?: string | null;
  location?: string | null;
  startDate: string;
  endDate: string;
  heroImage?: string | null;
  agendaFileUrl?: string | null;
  reportFileUrl?: string | null;
  photosLink?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export async function getMeetings() {
  const res = await fetch(`${API_URL}/api/meetings`, {
    cache: "no-store",
  });

  const result = await readJsonSafely(res);

  if (!res.ok) {
    throw new Error(result?.message || "Failed to fetch meetings");
  }

  return result;
}

export async function createMeeting(data: Partial<MeetingItem>) {
  const token = getToken();

  if (!token) {
    throw new Error("Bạn chưa đăng nhập hoặc token đã mất. Vui lòng đăng nhập lại.");
  }

  const res = await authFetch(`${API_URL}/api/meetings`, {
    method: "POST",
    body: JSON.stringify(data),
  });

  const result = await readJsonSafely(res);

  if (!res.ok) {
    throw new Error(result?.message || "Failed to create meeting");
  }

  return result;
}

export async function updateMeeting(id: number, data: Partial<MeetingItem>) {
  const token = getToken();

  if (!token) {
    throw new Error("Bạn chưa đăng nhập hoặc token đã mất. Vui lòng đăng nhập lại.");
  }

  const res = await authFetch(`${API_URL}/api/meetings/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

  const result = await readJsonSafely(res);

  if (!res.ok) {
    throw new Error(result?.message || "Failed to update meeting");
  }

  return result;
}

export async function deleteMeeting(id: number) {
  const token = getToken();

  if (!token) {
    throw new Error("Bạn chưa đăng nhập hoặc token đã mất. Vui lòng đăng nhập lại.");
  }

  const res = await authFetch(`${API_URL}/api/meetings/${id}`, {
    method: "DELETE",
  });

  const result = await readJsonSafely(res);

  if (!res.ok) {
    throw new Error(result?.message || "Failed to delete meeting");
  }

  return result;
}

/* =========================
   PROJECTS
========================= */

export type ProjectItem = {
  id?: number;
  title: string;
  slug?: string;
  subtitle?: string;
  description?: string;
  content?: string;
  bullets?: string[];
  image?: string;
  readMoreLink?: string;
  publishedAt?: string;
  category?: string;
  researchArea?: string;
  status?: "In Progress" | "Completed" | "Planned";
  yearRange?: string;
  membersCount?: string;
  createdAt?: string;
  updatedAt?: string;
};

export async function getProjects() {
  const url = `${API_URL}/api/projects`;

  let res: Response;

  try {
    res = await fetch(url, {
      cache: "no-store",
    });
  } catch (error) {
    console.error("GET PROJECTS FETCH ERROR:", error);
    throw new Error(
      `Không kết nối được backend tại ${url}. Kiểm tra backend đã chạy và CORS.`
    );
  }

  const result = await readJsonSafely(res);

  if (!res.ok) {
    throw new Error(result?.message || `Failed to fetch projects: ${res.status}`);
  }

  return result;
}

export async function getProjectBySlug(slug: string) {
  const cleanSlug = slug.replace(/^\/+|\/+$/g, "");

  const res = await fetch(`${API_URL}/api/projects/${cleanSlug}`, {
    cache: "no-store",
  });

  const result = await readJsonSafely(res);

  if (!res.ok) {
    throw new Error(result?.message || "Failed to fetch project");
  }

  return result;
}

export async function createProject(payload: ProjectItem) {
  const token = getToken();

  if (!token) {
    throw new Error("Bạn chưa đăng nhập hoặc token đã mất. Vui lòng đăng nhập lại.");
  }

  const res = await authFetch(`${API_URL}/api/projects`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  const result = await readJsonSafely(res);

  if (!res.ok) {
    throw new Error(result?.message || "Failed to create project");
  }

  return result;
}

export async function updateProject(id: number, payload: ProjectItem) {
  const token = getToken();

  if (!token) {
    throw new Error("Bạn chưa đăng nhập hoặc token đã mất. Vui lòng đăng nhập lại.");
  }

  const res = await authFetch(`${API_URL}/api/projects/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

  const result = await readJsonSafely(res);

  if (!res.ok) {
    throw new Error(result?.message || "Failed to update project");
  }

  return result;
}

export async function deleteProject(id: number) {
  const token = getToken();

  if (!token) {
    throw new Error("Bạn chưa đăng nhập hoặc token đã mất. Vui lòng đăng nhập lại.");
  }

  const res = await authFetch(`${API_URL}/api/projects/${id}`, {
    method: "DELETE",
  });

  const result = await readJsonSafely(res);

  if (!res.ok) {
    throw new Error(result?.message || "Failed to delete project");
  }

  return result;
}