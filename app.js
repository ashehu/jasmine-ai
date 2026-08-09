const creatorProfiles = {
  awareness: {
    scores: [94, 89, 86],
    labels: [
      ["Dermatology education", "68% audience age 25-34", "Premium visual language"],
      ["High save rate on routines", "Strong US audience match", "Inclusive beauty voice"],
      ["Ingredient-first reviews", "Above-benchmark engagement", "Emerging male skincare audience"],
    ],
  },
  launch: {
    scores: [91, 95, 84],
    labels: [
      ["Strong launch storytelling", "Trusted clinical voice", "Premium visual language"],
      ["High intent comment quality", "Strong US audience match", "Proven product reveals"],
      ["Ingredient-first reviews", "Fast early-view velocity", "Distinct audience segment"],
    ],
  },
  ugc: {
    scores: [88, 92, 96],
    labels: [
      ["Clear routine demonstrations", "High content completion", "Claims-aware language"],
      ["Natural product integration", "Strong save rate", "Inclusive beauty voice"],
      ["High-volume testing format", "Above-benchmark engagement", "Strong usage storytelling"],
    ],
  },
};

let selectedObjective = "awareness";

const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const menuButton = document.querySelector("[data-menu-button]");
const briefForm = document.querySelector("[data-brief-form]");
const analysisProgress = document.querySelector("[data-analysis-progress]");
const analysisLabel = document.querySelector("[data-analysis-label]");
const creatorRows = [...document.querySelectorAll(".creator-row")];
const objectiveButtons = [...document.querySelectorAll("[data-objective-control] button")];
const pilotDialog = document.querySelector("[data-pilot-dialog]");
const pilotForm = document.querySelector("[data-pilot-form]");
const dialogSuccess = document.querySelector("[data-dialog-success]");
const pilotEmailLink = document.querySelector("[data-pilot-email]");
const toast = document.querySelector("[data-toast]");

function renderIcons() {
  if (window.lucide) {
    window.lucide.createIcons({ attrs: { "aria-hidden": "true" } });
  }
}

function setMenu(open) {
  nav.classList.toggle("open", open);
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  menuButton.innerHTML = open ? '<i data-lucide="x"></i>' : '<i data-lucide="menu"></i>';
  renderIcons();
}

menuButton?.addEventListener("click", () => {
  setMenu(!nav.classList.contains("open"));
});

nav?.addEventListener("click", (event) => {
  if (event.target.matches("a")) setMenu(false);
});

window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 24);
});

objectiveButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedObjective = button.dataset.value;
    objectiveButtons.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
  });
});

creatorRows.forEach((row) => {
  const button = row.querySelector(".creator-summary");
  button.addEventListener("click", () => {
    creatorRows.forEach((item) => {
      const selected = item === row;
      item.classList.toggle("selected", selected);
      item.querySelector(".creator-summary").setAttribute("aria-expanded", String(selected));
    });
  });
});

function updateCreatorRows() {
  const profile = creatorProfiles[selectedObjective];
  creatorRows.forEach((row, index) => {
    row.querySelector("[data-score]").textContent = profile.scores[index];
    const reasonList = row.querySelector(".reason-list");
    reasonList.innerHTML = profile.labels[index]
      .map((label) => `<span><i data-lucide="check"></i>${label}</span>`)
      .join("");
  });
  renderIcons();
}

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("visible");
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => toast.classList.remove("visible"), 2600);
}

async function copyShareUrl(url) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(url);
    return;
  }

  const input = document.createElement("textarea");
  input.value = url;
  input.setAttribute("readonly", "");
  input.style.position = "fixed";
  input.style.opacity = "0";
  document.body.appendChild(input);
  input.select();
  document.execCommand("copy");
  input.remove();
}

const canonicalShareUrl = document.querySelector('link[rel="canonical"]')?.href || window.location.href;

document.querySelectorAll("[data-share-platform]").forEach((control) => {
  const platform = control.dataset.sharePlatform;

  if (platform === "x") {
    const title = control.dataset.shareTitle || document.title;
    control.href = `https://x.com/intent/post?text=${encodeURIComponent(title)}&url=${encodeURIComponent(canonicalShareUrl)}`;
  }

  if (platform === "linkedin") {
    control.href = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(canonicalShareUrl)}`;
  }

  if (platform === "instagram") {
    control.addEventListener("click", async () => {
      try {
        await copyShareUrl(canonicalShareUrl);
        showToast("Link copied. Paste it into Instagram.");
      } catch {
        showToast("Unable to copy the link. Please copy it from the address bar.");
      }
    });
  }
});

briefForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const messages = ["Reading campaign context...", "Checking audience alignment...", "Reviewing fit and safety...", "Ranking explainable matches..."];
  analysisProgress.hidden = false;
  analysisProgress.classList.remove("active");
  void analysisProgress.offsetWidth;
  analysisProgress.classList.add("active");

  let messageIndex = 0;
  analysisLabel.textContent = messages[messageIndex];
  const labelTimer = window.setInterval(() => {
    messageIndex = Math.min(messageIndex + 1, messages.length - 1);
    analysisLabel.textContent = messages[messageIndex];
  }, 350);

  window.setTimeout(() => {
    window.clearInterval(labelTimer);
    updateCreatorRows();
    analysisProgress.hidden = true;
    analysisProgress.classList.remove("active");
    showToast("Shortlist rebuilt for the new brief.");
  }, 1500);
});

document.querySelector("[data-reset-brief]")?.addEventListener("click", () => {
  briefForm.reset();
  selectedObjective = "awareness";
  objectiveButtons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.value === "awareness")));
  updateCreatorRows();
  showToast("Sample brief reset.");
});

function openPilotDialog() {
  pilotForm.hidden = false;
  dialogSuccess.hidden = true;
  pilotDialog.showModal();
  document.body.classList.add("dialog-open");
}

function closePilotDialog() {
  if (!dialogSuccess.hidden) pilotForm.reset();
  pilotDialog.close();
  document.body.classList.remove("dialog-open");
}

document.querySelectorAll("[data-open-pilot]").forEach((button) => button.addEventListener("click", openPilotDialog));
document.querySelectorAll("[data-close-pilot]").forEach((button) => button.addEventListener("click", closePilotDialog));
document.querySelectorAll("[data-social-placeholder]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    showToast(`${link.dataset.socialPlaceholder} profile link is ready to connect.`);
  });
});

pilotDialog?.addEventListener("click", (event) => {
  if (event.target === pilotDialog) closePilotDialog();
});

pilotDialog?.addEventListener("cancel", () => document.body.classList.remove("dialog-open"));

pilotForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!pilotForm.reportValidity()) return;

  const details = Object.fromEntries(new FormData(pilotForm).entries());
  const subject = `Jasmine pilot request - ${details.company}`;
  const body = [
    "Hello Jasmine team,",
    "",
    "I would like to discuss a Jasmine pilot.",
    "",
    `Name: ${details.name}`,
    `Work email: ${details.email}`,
    `Brand or company: ${details.company}`,
    `Next campaign: ${details.campaign}`,
  ].join("\n");
  pilotEmailLink.href = `mailto:info@byteflows.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  pilotForm.hidden = true;
  dialogSuccess.hidden = false;
  renderIcons();
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

window.addEventListener("DOMContentLoaded", renderIcons);
