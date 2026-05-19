import { api } from "../api/api";
import { escapeHtml, formatDate, messageHtml } from "../components/message";
import { clearCurrentUser, getCurrentUser } from "../state/authState";
import { getAvatarUrl } from "../utils/avatar";

export async function renderProfilePage(userId: string, message = "", messageType: "success" | "error" = "success"): Promise<string> {
  try {
    const currentUser = getCurrentUser();
    const profile = await api.getUser(userId);
    const isOwnProfile = currentUser?.id === profile.user.id;

    return `
      <section class="profile-layout">
        <aside class="profile-card">
          <img class="avatar avatar-large" src="${getAvatarUrl(profile.user.avatar)}" alt="${escapeHtml(profile.user.username)}" />
          <h1>${escapeHtml(profile.user.username)}</h1>
          <p>Medlem sedan ${formatDate(profile.user.createdAt)}</p>
          ${isOwnProfile ? `<button id="deleteAccountButton" class="danger-button">Ta bort mitt konto</button>` : ""}
        </aside>
        <div class="panel">
          <h2>Senaste 3 kommentarer</h2>
          ${messageHtml(message, messageType)}
          ${
            profile.latestComments.length > 0
              ? profile.latestComments
                  .map(
                    (comment) => `
                      <article class="profile-comment">
                        <p>${escapeHtml(comment.text)}</p>
                        <small>${formatDate(comment.createdAt)}${comment.forum ? ` i <a href="#/forums/${comment.forum.id}">${escapeHtml(comment.forum.title)}</a>` : ""}</small>
                      </article>
                    `
                  )
                  .join("")
              : `<p class="empty-state">Inga kommentarer ännu.</p>`
          }
        </div>
      </section>
    `;
  } catch (error) {
    return `
      <section class="panel">
        <h1>Profil</h1>
        ${messageHtml((error as Error).message, "error")}
      </section>
    `;
  }
}

export function bindProfilePage(userId: string): void {
  document.querySelector("#deleteAccountButton")?.addEventListener("click", async () => {
    const currentUser = getCurrentUser();

    if (!currentUser || currentUser.id !== userId) {
      return;
    }

    const confirmed = window.confirm("Vill du ta bort ditt konto och alla dina kommentarer?");

    if (!confirmed) {
      return;
    }

    try {
      await api.deleteUser(userId);
      clearCurrentUser();
      window.location.hash = "#/register";
    } catch (error) {
      document.querySelector("#page")!.innerHTML = await renderProfilePage(userId, (error as Error).message, "error");
      bindProfilePage(userId);
    }
  });
}
