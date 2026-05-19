import { readDb, writeDb } from "../utils/db";
import { createHttpError, isNonEmptyString, toPublicUser } from "../utils/validation";

export async function getUsers() {
  const db = await readDb();
  return db.users.map(toPublicUser).sort((a, b) => a.username.localeCompare(b.username));
}

export async function getUserById(userId: string) {
  const db = await readDb();
  const user = db.users.find((currentUser) => currentUser.id === userId);

  if (!user) {
    throw createHttpError("Användaren finns inte.", 404);
  }

  return toPublicUser(user);
}

export async function getUserComments(userId: string, limit?: number) {
  const db = await readDb();
  const user = db.users.find((currentUser) => currentUser.id === userId);

  if (!user) {
    throw createHttpError("Användaren finns inte.", 404);
  }

  const comments = db.comments
    .filter((comment) => comment.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .map((comment) => ({
      ...comment,
      author: toPublicUser(user),
      forum: db.forums.find((forum) => forum.id === comment.forumId) ?? null
    }));

  return typeof limit === "number" ? comments.slice(0, limit) : comments;
}

export async function deleteUser(userId: string, requesterIdValue: unknown) {
  if (!isNonEmptyString(requesterIdValue)) {
    throw createHttpError("Du måste vara inloggad.", 401);
  }

  if (requesterIdValue !== userId) {
    throw createHttpError("Du kan bara ta bort ditt eget konto.", 403);
  }

  const db = await readDb();
  const userExists = db.users.some((user) => user.id === userId);

  if (!userExists) {
    throw createHttpError("Användaren finns inte.", 404);
  }

  db.users = db.users.filter((user) => user.id !== userId);
  db.comments = db.comments
    .filter((comment) => comment.userId !== userId)
    .map((comment) => ({
      ...comment,
      likes: comment.likes.filter((likedByUserId) => likedByUserId !== userId)
    }));

  await writeDb(db);
}
