import { api, Forum } from "../api/api";
import { messageHtml } from "../components/message";

export async function renderHomePage(): Promise<string> {
  try {
    const forums = await api.getForums();

    return `
      <section>
        <div class="page-heading">
          <h1>Forum</h1>
          <p>Välj ett forum och delta i diskussionen.</p>
        </div>
        <div class="forum-grid">
          ${forums.map(forumCard).join("")}
        </div>
      </section>
    `;
  } catch (error) {
    return messageHtml((error as Error).message, "error");
  }
}

function forumCard(forum: Forum): string {
  return `
    <a class="forum-card" href="#/forums/${forum.id}">
      <h2>${forum.title}</h2>
      <p>${forum.description}</p>
    </a>
  `;
}
