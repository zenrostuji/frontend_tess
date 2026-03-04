const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function fetchStories() {
  const response = await fetch(`${API_URL}/api/stories`);
  if (!response.ok) {
    throw new Error("Không tải được danh sách truyện.");
  }
  return response.json();
}

export async function fetchStoriesFiltered({ search = "", tag = "", sort = "newest" }) {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (tag) params.set("tag", tag);
  if (sort) params.set("sort", sort);
  const response = await fetch(`${API_URL}/api/stories?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Không tải được danh sách truyện.");
  }
  return response.json();
}

export async function fetchStoryById(id) {
  const response = await fetch(`${API_URL}/api/stories/${id}`);
  if (!response.ok) {
    throw new Error("Không tải được truyện.");
  }
  return response.json();
}

export async function fetchCategories() {
  const response = await fetch(`${API_URL}/api/categories`);
  if (!response.ok) {
    throw new Error("Không tải được thể loại.");
  }
  return response.json();
}

export async function registerAccount(payload) {
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message || "Đăng ký thất bại.");
  }
  return data;
}

export async function loginAccount(payload) {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message || "Đăng nhập thất bại.");
  }
  return data;
}

export async function fetchLibrary(token) {
  const response = await fetch(`${API_URL}/api/library`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!response.ok) {
    throw new Error("Không tải được thư viện.");
  }
  return response.json();
}

export async function addToLibrary(token, storyId) {
  const response = await fetch(`${API_URL}/api/library/${storyId}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!response.ok) {
    throw new Error("Không thể thêm vào thư viện.");
  }
  return response.json();
}

export async function removeFromLibrary(token, storyId) {
  const response = await fetch(`${API_URL}/api/library/${storyId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!response.ok) {
    throw new Error("Không thể xóa khỏi thư viện.");
  }
  return response.json();
}

export async function fetchCurrentUser(token) {
  const response = await fetch(`${API_URL}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!response.ok) {
    throw new Error("Token không hợp lệ.");
  }
  return response.json();
}
