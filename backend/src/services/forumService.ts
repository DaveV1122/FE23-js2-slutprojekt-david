import { Comment, CommentWithAuthor } from "../types";
import { createId, readDb, writeDb } from "../utils/db";
import { createHttpError, isNonEmptyString, toPublicUser } from "../utils/validation";

function getCommentWithAuthor(comment: Comment, db: Awaited<ReturnType<typeof readDb>>): CommentWithAuthor {
  const author = db.users.find((user) => user.id === comment.userId);
  return {
    ...comment,
    author: author ? toPublicUser(author) : null
  };
}

export async function getForums() {
  const db = await readDb();
  return db.forums;
}

export async function getForumComments(forumId: string) {
  const db = await readDb();
  const forum = db.forums.find((currentForum) => currentForum.id === forumId);

  if (!forum) {
    throw createHttpError("Forumet finns inte.", 404);
  }

  return db.comments
    .filter((comment) => comment.forumId === forumId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .map((comment) => getCommentWithAuthor(comment, db));
}

export async function addComment(forumId: string, userIdValue: unknown, textValue: unknown) {
  if (!isNonEmptyString(userIdValue) || !isNonEmptyString(textValue)) {
    throw createHttpError("Användare och kommentarstext krävs.");
  }

  const db = await readDb();
  const forum = db.forums.find((currentForum) => currentForum.id === forumId);
  const user = db.users.find((currentUser) => currentUser.id === userIdValue);

  if (!forum) {
    throw createHttpError("Forumet finns inte.", 404);
  }

  if (!user) {
    throw createHttpError("Du måste vara inloggad för att kommentera.", 401);
  }

  const now = new Date().toISOString();
  const comment: Comment = {
    id: createId("comment"),
    forumId,
    userId: user.id,
    text: textValue.trim(),
    likes: [],
    createdAt: now,
    updatedAt: now
  };

  db.comments.push(comment);
  await writeDb(db);

  return getCommentWithAuthor(comment, db);
}

export async function editComment(commentId: string, userIdValue: unknown, textValue: unknown) {
  if (!isNonEmptyString(userIdValue) || !isNonEmptyString(textValue)) {
    throw createHttpError("Användare och ny kommentarstext krävs.");
  }

  const db = await readDb();
  const comment = db.comments.find((currentComment) => currentComment.id === commentId);

  if (!comment) {
    throw createHttpError("Kommentaren finns inte.", 404);
  }

  if (comment.userId !== userIdValue) {
    throw createHttpError("Du kan bara redigera dina egna kommentarer.", 403);
  }

  comment.text = textValue.trim();
  comment.updatedAt = new Date().toISOString();
  await writeDb(db);

  return getCommentWithAuthor(comment, db);
}

export async function deleteComment(commentId: string, userIdValue: unknown) {
  if (!isNonEmptyString(userIdValue)) {
    throw createHttpError("Användare krävs.");
  }

  const db = await readDb();
  const comment = db.comments.find((currentComment) => currentComment.id === commentId);

  if (!comment) {
    throw createHttpError("Kommentaren finns inte.", 404);
  }

  if (comment.userId !== userIdValue) {
    throw createHttpError("Du kan bara ta bort dina egna kommentarer.", 403);
  }

  db.comments = db.comments.filter((currentComment) => currentComment.id !== commentId);
  await writeDb(db);
}

export async function toggleLike(commentId: string, userIdValue: unknown) {
  if (!isNonEmptyString(userIdValue)) {
    throw createHttpError("Du måste vara inloggad för att gilla.");
  }

  const db = await readDb();
  const user = db.users.find((currentUser) => currentUser.id === userIdValue);
  const comment = db.comments.find((currentComment) => currentComment.id === commentId);

  if (!user) {
    throw createHttpError("Användaren finns inte.", 401);
  }

  if (!comment) {
    throw createHttpError("Kommentaren finns inte.", 404);
  }

  const alreadyLiked = comment.likes.includes(user.id);
  comment.likes = alreadyLiked ? comment.likes.filter((id) => id !== user.id) : [...comment.likes, user.id];
  await writeDb(db);

  return getCommentWithAuthor(comment, db);
}
