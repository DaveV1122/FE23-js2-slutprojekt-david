import { clearCurrentUser, getCurrentUser } from "../state/authState";

export function renderNavbar(): string {
  const user = getCurrentUser();

  return `
    <header class="navbar">
      <a class="brand" href="#/">MiniForum</a>
      <nav>
        <a href="#/">Forum</a>
        <a href="#/users">Användare</a>
        ${user ? `<a href="#/me">Min profil</a>` : ""}
      </nav>
      <div class="nav-user">
        ${user ? `<span>Inloggad som <strong>${user.username}</strong></span><button id="logoutButton" class="secondary-button">Logga ut</button>` : `<a href="#/login">Logga in</a>`}
      </div>
    </header>
  `;
}

export function bindNavbarEvents(): void {
  document.querySelector("#logoutButton")?.addEventListener("click", () => {
    clearCurrentUser();
    window.location.hash = "#/login";
  });
}
