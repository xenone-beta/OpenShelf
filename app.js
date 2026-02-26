const repositories = [];

const issues = [];

const pullRequests = [];

const activities = ["Пока нет активности. Создайте первый репозиторий или задачу."];

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

function renderRepositories(list = repositories) {
  const repoList = $("#repoList");

  if (!list.length) {
    repoList.innerHTML = '<li class="repo-item"><strong>No repositories yet</strong><p class="muted">Создайте первый репозиторий, чтобы начать работу.</p></li>';
  } else {
    repoList.innerHTML = list
      .map(
        (repo) => `
      <li class="repo-item">
        <strong>${repo.name}</strong>
        <p>${repo.description}</p>
        <small>${repo.language} • ★ ${repo.stars} • Updated ${repo.updated}</small>
      </li>`
      )
      .join("");
  }

  $("#repoShortList").innerHTML = list.length
    ? list
        .slice(0, 5)
        .map((repo) => `<li><strong>${repo.name}</strong><br/><span class="muted">${repo.language}</span></li>`)
        .join("")
    : '<li class="muted">No repositories yet</li>';
}

function renderIssues() {
  $("#issueList").innerHTML = issues.length
    ? issues
        .map(
          (item) => `<li class="repo-item"><strong>${item.title}</strong><p class="muted">${item.repo} • ${item.status}</p></li>`
        )
        .join("")
    : '<li class="repo-item"><strong>No issues yet</strong><p class="muted">Создайте первую задачу в проекте.</p></li>';
}

function renderPRs() {
  $("#prList").innerHTML = pullRequests.length
    ? pullRequests
        .map(
          (item) => `<li class="repo-item"><strong>${item.title}</strong><p class="muted">${item.repo} • ${item.status}</p></li>`
        )
        .join("")
    : '<li class="repo-item"><strong>No pull requests yet</strong><p class="muted">Откройте первый pull request после изменений в коде.</p></li>';
}

function renderActivity() {
  $("#activityFeed").innerHTML = activities.map((entry) => `<li>${entry}</li>`).join("");
}

function setupTabs() {
  $$(".nav-link").forEach((button) => {
    button.addEventListener("click", () => {
      $$(".nav-link").forEach((b) => b.classList.remove("active"));
      button.classList.add("active");
      const tab = button.dataset.tab;
      $$(".tab").forEach((panel) => panel.classList.remove("active"));
      $(`#${tab}`).classList.add("active");
    });
  });
}

function setupSearchAndFilters() {
  $("#globalSearch").addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase();
    const language = $("#languageFilter").value;
    const filtered = repositories.filter((repo) => {
      const byName = repo.name.toLowerCase().includes(query) || repo.description.toLowerCase().includes(query);
      const byLang = language === "all" || repo.language === language;
      return byName && byLang;
    });
    renderRepositories(filtered);
  });

  $("#languageFilter").addEventListener("change", () => {
    const query = $("#globalSearch").value.toLowerCase();
    const language = $("#languageFilter").value;
    const filtered = repositories.filter((repo) => {
      const byName = repo.name.toLowerCase().includes(query) || repo.description.toLowerCase().includes(query);
      const byLang = language === "all" || repo.language === language;
      return byName && byLang;
    });
    renderRepositories(filtered);
  });
}

function setupModals() {
  const issueModal = $("#issueModal");
  const prModal = $("#prModal");

  $("#openIssueModal").addEventListener("click", () => issueModal.showModal());
  $("#openPRModal").addEventListener("click", () => prModal.showModal());

  $("#issueForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const title = formData.get("title");
    if (title) {
      issues.unshift({ title, repo: "local/project", status: "open" });
      renderIssues();
    }
    issueModal.close();
    e.target.reset();
  });

  $("#prForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const title = formData.get("title");
    if (title) {
      pullRequests.unshift({ title, repo: "local/project", status: "open" });
      renderPRs();
    }
    prModal.close();
    e.target.reset();
  });
}

renderRepositories();
renderIssues();
renderPRs();
renderActivity();
setupTabs();
setupSearchAndFilters();
setupModals();
