export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export async function authFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = getToken();

  return fetch(url, {
    ...options,
    headers: {
      ...(options.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
}

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

  const result = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(result?.message || `Request failed: ${res.status}`);
  }

  return result;
}

export async function getAboutContent() {
  const res = await fetch(`${API_URL}/api/about`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch about content");
  }

  return res.json();
}

export async function updateAboutContent(data: any) {
  const res = await authFetch(`${API_URL}/api/about`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

  const result = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(result?.message || `Request failed: ${res.status}`);
  }

  return result;
}

export async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await authFetch(`${API_URL}/api/upload`, {
    method: "POST",
    body: formData,
  });

  const result = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(result?.message || "Upload ảnh thất bại");
  }

  return result;
}

export async function getPeople() {
  const res = await authFetch(`${API_URL}/api/people`, {
    cache: "no-store",
  });

  if (!res.ok) {
    console.error(`Error fetching people from ${API_URL}/api/people: ${res.statusText}`);
    throw new Error("Failed to fetch people");
  }

  return res.json();
}

export async function createPerson(data: any) {
  const res = await authFetch(`${API_URL}/api/people`, {
    method: "POST",
    body: JSON.stringify(data),
  });

  const result = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(result?.message || `Request failed: ${res.status}`);
  }

  return result;
}

export async function updatePerson(id: number, data: any) {
  const res = await authFetch(`${API_URL}/api/people/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

  const result = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(result?.message || `Request failed: ${res.status}`);
  }

  return result;
}

export async function deletePerson(id: number) {
  const res = await authFetch(`${API_URL}/api/people/${id}`, {
    method: "DELETE",
  });

  const result = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(result?.message || `Request failed: ${res.status}`);
  }

  return result;
}