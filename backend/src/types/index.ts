export interface User {
  id: string;
  username: string;
  password: string;
  avatar: string;
  createdAt: string;
}

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
}

export interface CommentWithAuthor extends Comment {
  author: PublicUser | null;
}

export interface Database {
  users: User[];
  forums: Forum[];
  comments: Comment[];
}

export interface ApiError extends Error {
  status?: number;
  statusCode?: number;
  type?: string;
}
