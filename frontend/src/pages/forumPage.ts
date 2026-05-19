import { api, Comment } from "../api/api";
import { commentCard } from "../components/commentCard";
import { escapeHtml, messageHtml } from "../components/message";
import { getCurrentUser } from "../state/authState";

export async function renderForumPage(forumId: string, message = "", messageType: "success" | "error" = "success"): Promise<string> {
  const user = getCurrentUser();

  if (!user) {
    window.location.hash = "#/login";
    return "";
  }

  try {
    const [forums, comments] = await Promise.all([api.getForums(), api.getForumComments(forumId)]);
    const forum = forums.find((currentForum) => currentForum.id === forumId);

    if (!forum) {
      return renderNotFound("Forumet finns inte.");
    }

    return `
      <section>
        <div class="page-heading">
          <a href="#/">Tillbaka till forum</a>
          <h1>${escapeHtml(forum.title)}</h1>
          <p>${escapeHtml(forum.description)}</p>
        </div>
        ${messageHtml(message, messageType)}
        <form id="commentForm" class="comment-form">
          <label>Skriv kommentar<textarea name="text" required rows="4"></textarea></label>
          <button type="submit">Publicera</button>
        </form>
        <div class="comments-list">
          ${comments.length > 0 ? comments.map((comment) => commentCard(comment, user)).join("") : `<p class="empty-state">Inga kommentarer ännu.</p>`}
        </div>
      </section>
    `;
  } catch (error) {
    return messageHtml((error as Error).message, "error");
  }
}

export function bindForumPage(forumId: string): void {
  const user = getCurrentUser();

  document.querySelector("#commentForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const text = String(new FormData(form).get("text"));

    if (!user) {
      window.location.hash = "#/login";
      return;
    }

    try {
      const response = await api.addComment(forumId, user.id, text);
      await rerenderForum(forumId, response.message, "success");
    } catch (error) {
      await rerenderForum(forumId, (error as Error).message, "error");
    }
  });

  document.querySelectorAll(".like-comment").forEach((button) => {
    button.addEventListener("click", async () => {
      if (!user) {
        window.location.hash = "#/login";
        return;
      }

      try {
        const commentId = (button as HTMLButtonElement).dataset.commentId ?? "";
        await api.likeComment(commentId, user.id);
        await rerenderForum(forumId);
      } catch (error) {
        await rerenderForum(forumId, (error as Error).message, "error");
      }
    });
  });

  document.querySelectorAll(".delete-comment").forEach((button) => {
    button.addEventListener("click", async () => {
      if (!user) {
        return;
      }

      try {
        const commentId = (button as HTMLButtonElement).dataset.commentId ?? "";
        const response = await api.deleteComment(commentId, user.id);
        await rerenderForum(forumId, response.message, "success");
      } catch (error) {
        await rerenderForum(forumId, (error as Error).message, "error");
      }
    });
  });

  document.querySelectorAll(".edit-comment").forEach((button) => {
    button.addEventListener("click", async () => {
      if (!user) {
        return;
      }

      const commentId = (button as HTMLButtonElement).dataset.commentId ?? "";
      const card = document.querySelector(`[data-comment-id="${commentId}"]`);
      const currentText = card?.querySelector(".comment-text")?.textContent ?? "";
      const newText = window.prompt("Redigera kommentar", currentText);

      if (!newText || newText.trim() === currentText.trim()) {
        return;
      }

      try {
        const response = await api.editComment(commentId, user.id, newText);
        await rerenderForum(forumId, response.message, "success");
      } catch (error) {
        await rerenderForum(forumId, (error as Error).message, "error");
      }
    });
  });
}

async function rerenderForum(forumId: string, message = "", messageType: "success" | "error" = "success") {
  document.querySelector("#page")!.innerHTML = await renderForumPage(forumId, message, messageType);
  bindForumPage(forumId);
}

function renderNotFound(message: string): string {
  return `
    <section class="panel">
      <h1>Hittades inte</h1>
      ${messageHtml(message, "error")}
      <a href="#/">Gå till forumlistan</a>
    </section>
  `;
}
