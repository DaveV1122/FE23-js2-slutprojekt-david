import { api } from "../api/api";
import { escapeHtml, formatDate, messageHtml } from "../components/message";
import { getAvatarUrl } from "../utils/avatar";

export async function renderUsersPage(): Promise<string> {
  try {
    const users = await api.getUsers();

    return `
      <section>
        <div class="page-heading">
          <h1>Användare</h1>
          <p>Alla registrerade konton.</p>
        </div>
        <div class="user-grid">
          ${users
            .map(
              (user) => `
                <a class="user-card" href="#/users/${user.id}">
                  <img class="avatar" src="${getAvatarUrl(user.avatar)}" alt="${escapeHtml(user.username)}" />
                  <strong>${escapeHtml(user.username)}</strong>
                  <small>Medlem sedan ${formatDate(user.createdAt)}</small>
                </a>
              `
            )
            .join("")}
        </div>
      </section>
    `;
  } catch (error) {
    return messageHtml((error as Error).message, "error");
  }
}
