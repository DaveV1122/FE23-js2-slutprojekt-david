import { Comment } from "../api/api";
import { PublicUser } from "../api/api";
import { getAvatarUrl } from "../utils/avatar";
import { escapeHtml, formatDate } from "./message";

export function commentCard(comment: Comment, currentUser: PublicUser | null): string {
  const isOwner = currentUser?.id === comment.userId;
  const likedByCurrentUser = currentUser ? comment.likes.includes(currentUser.id) : false;
  const author = comment.author;
  const edited = comment.updatedAt !== comment.createdAt ? " · redigerad" : "";

  return `
    <article class="comment-card" data-comment-id="${comment.id}">
      <div class="comment-meta">
        <a class="avatar-link" href="#/users/${comment.userId}">
          <img class="avatar avatar-small" src="${getAvatarUrl(author?.avatar ?? "avatar1.png")}" alt="${escapeHtml(author?.username ?? "Borttagen användare")}" />
        </a>
        <div>
          <a href="#/users/${comment.userId}" class="comment-author">${escapeHtml(author?.username ?? "Borttagen användare")}</a>
          <p>${formatDate(comment.createdAt)}${edited}</p>
        </div>
      </div>
      <p class="comment-text">${escapeHtml(comment.text)}</p>
      <div class="comment-actions">
        <button class="secondary-button like-comment" data-comment-id="${comment.id}">${likedByCurrentUser ? "Gillad" : "Gilla"} (${comment.likes.length})</button>
        ${isOwner ? `<button class="secondary-button edit-comment" data-comment-id="${comment.id}">Redigera</button><button class="danger-button delete-comment" data-comment-id="${comment.id}">Ta bort</button>` : ""}
      </div>
    </article>
  `;
}
