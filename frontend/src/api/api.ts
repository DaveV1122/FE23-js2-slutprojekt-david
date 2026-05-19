const API_BASE_URL = "http://localhost:3000/api";

export interface PublicUser {
  id: string;
  username: string;
  avatar: string;
  createdAt: string;
}

export interface Forum {
  id: string;
  title: string;
  description: string;
}

export interface Comment {
  id: string;
  forumId: string;
  userId: string;
  text: string;
  likes: string[];
  createdAt: string;
  updatedAt: string;
  author: PublicUser | null;
  forum?: Forum | null;
}

export interface AuthResponse {
  user: PublicUser;
  message: string;
}

export interface UserProfileResponse {
  user: PublicUser;
  latestComments: Comment[];
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    },
    ...options
  });

  const data = (await response.json().catch(() => ({}))) as { message?: string };

  if (!response.ok) {
    throw new Error(data.message ?? "Något gick fel.");
  }

  return data as T;
}

export const api = {
  register(username: string, password: string, avatar: string) {
    return request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ username, password, avatar })
    });
  },
  login(username: string, password: string) {
    return request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password })
    });
  },
  getForums() {
    return request<Forum[]>("/forums");
  },
  getForumComments(forumId: string) {
    return request<Comment[]>(`/forums/${forumId}/comments`);
  },
  addComment(forumId: string, userId: string, text: string) {
    return request<{ comment: Comment; message: string }>(`/forums/${forumId}/comments`, {
      method: "POST",
      body: JSON.stringify({ userId, text })
    });
  },
  editComment(commentId: string, userId: string, text: string) {
    return request<{ comment: Comment; message: string }>(`/comments/${commentId}`, {
      method: "PUT",
      body: JSON.stringify({ userId, text })
    });
  },
  deleteComment(commentId: string, userId: string) {
    return request<{ message: string }>(`/comments/${commentId}`, {
      method: "DELETE",
      body: JSON.stringify({ userId })
    });
  },
  likeComment(commentId: string, userId: string) {
    return request<{ comment: Comment; message: string }>(`/comments/${commentId}/like`, {
      method: "POST",
      body: JSON.stringify({ userId })
    });
  },
  getUsers() {
    return request<PublicUser[]>("/users");
  },
  getUser(userId: string) {
    return request<UserProfileResponse>(`/users/${userId}`);
  },
  getUserComments(userId: string) {
    return request<Comment[]>(`/users/${userId}/comments`);
  },
  deleteUser(userId: string) {
    return request<{ message: string }>(`/users/${userId}`, {
      method: "DELETE",
      body: JSON.stringify({ userId })
    });
  }
};
