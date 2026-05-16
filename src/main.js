import { mountChatWidget } from "./assistant/chat-widget.js";

const stats = [
  {
    value: "100+",
    label: "AI Video Models\nIntegrated",
  },
  {
    value: "50K+",
    label: "Creators Worldwide\nChoose Videoinu",
  },
  {
    value: "∞",
    label: "Infinite Canvas\nCreative Freedom",
  },
];

const features = [
  {
    icon: "nodes",
    title: "Levels in the game",
    subtitle: "Full-Pipeline Control",
    description:
      "From script and storyboard to assets and final video, every step stays editable and under your control.",
  },
  {
    icon: "spark",
    title: "Continuity",
    subtitle: "High-Volume Output",
    description:
      "Storyboard workflows built for shorts, explainers, and marketing videos, with one-click batch generation from script to shot to video.",
  },
  {
    icon: "leaf",
    title: "Friendly ecosystem",
    subtitle: "Open & Creative Ecosystem",
    description:
      "Support custom nodes, external models, and shared workflow templates so creators can build their own production systems.",
  },
];

const partners = ["Sora", "Kling", "Wan 2.6", "Seedance 2.0", "Gemini", "OpenAI", "Suno"];

const communityPosts = [
  {
    name: "@Alice_Studio",
    handle: "Creator Community Member",
    text: "Videoinu 2.0 boosted my short-form output by 10x. The multi-model workflow feels incredibly smooth.",
  },
  {
    name: "@FilmMaker_X",
    handle: "Independent Director / Story Creator",
    text: "The level of control is exceptional. Every detail of short-form production stays manageable from concept to delivery.",
  },
  {
    name: "@Visionary_Z",
    handle: "Brand Video Studio",
    text: "Open ecosystem, flexible pace, real creative freedom. Videoinu 2.0 is the best collaborative video platform I have used.",
  },
];

const socialLinks = [
  {
    label: "Telegram",
    icon: "telegram",
  },
  {
    label: "Twitter",
    icon: "twitter",
  },
  {
    label: "Discord",
    icon: "discord",
  },
  {
    label: "GitHub",
    icon: "github",
  },
];

function renderIcon(name) {
  const icons = {
    gift: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 9.5h16v10H4z"></path>
        <path d="M12 9.5v10"></path>
        <path d="M3 9.5h18v-3H3z"></path>
        <path d="M8.3 6.5c-.9-.7-1.1-1.9-.5-2.7.8-1 2.3-1 3.2-.1L12 5l1-1.3c.8-.9 2.4-.9 3.2.1.6.8.4 2-.5 2.7"></path>
      </svg>
    `,
    grid: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="4" width="6" height="6" rx="1.5"></rect>
        <rect x="14" y="4" width="6" height="6" rx="1.5"></rect>
        <rect x="4" y="14" width="6" height="6" rx="1.5"></rect>
        <rect x="14" y="14" width="6" height="6" rx="1.5"></rect>
      </svg>
    `,
    success: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 18V9.5"></path>
        <path d="M12 18V6"></path>
        <path d="M18 18v-4.5"></path>
        <path d="M4 18.5h16"></path>
      </svg>
    `,
    nodes: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="7" cy="12" r="2.3"></circle>
        <circle cx="17" cy="7" r="2.3"></circle>
        <circle cx="17" cy="17" r="2.3"></circle>
        <path d="M8.9 10.8 15 8.1"></path>
        <path d="M8.9 13.2 15 15.9"></path>
      </svg>
    `,
    spark: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m12 4 1.7 4.3L18 10l-4.3 1.7L12 16l-1.7-4.3L6 10l4.3-1.7z"></path>
        <path d="m19 4 .8 1.9L22 6.7l-2.2.8L19 9.3l-.8-1.8L16 6.7l2.2-.8z"></path>
      </svg>
    `,
    leaf: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M18.5 5.5c-6 0-10 4.4-10 10.8 0 1.1.2 2 .5 2.7 5.1-.4 9.6-4.4 9.6-10.5 0-1.3 0-2-.1-3z"></path>
        <path d="M8.7 17.5c2.8-3.4 5.6-5.9 8.8-7.9"></path>
      </svg>
    `,
    telegram: `
      <svg class="icon-solid" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.6 4.2 3.8 10.7c-1.1.4-1 2 .1 2.3l4.1 1.2 1.6 5c.3 1 1.6 1.2 2.2.4l2.4-3 4.7 3.4c.8.6 2 .2 2.2-.9L23 5.9c.2-1.2-1.1-2.1-2.4-1.7Z"></path>
      </svg>
    `,
    twitter: `
      <svg class="icon-solid" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M18.9 4H22l-6.7 7.6L23 20h-6.1l-4.8-5.7L7 20H4l7.2-8.1L3 4h6.3L13.6 9z"></path>
      </svg>
    `,
    discord: `
      <svg class="icon-solid" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M18.8 6.4a15 15 0 0 0-3.8-1.2l-.2.5a13 13 0 0 1 3.4 1.2c-2.2-1-4.7-1.5-7.2-1.5S6 6 3.8 7a13 13 0 0 1 3.4-1.3l-.2-.5a15 15 0 0 0-3.8 1.2C.8 10 .2 13.4.4 16.7c1.6 1.2 3.1 2 4.6 2.5l1.1-1.7c-.7-.3-1.4-.7-2-1.2.2.1.3.2.5.3 3.8 1.8 8.1 1.8 11.9 0 .2-.1.3-.2.5-.3-.6.5-1.3.9-2 1.2l1.1 1.7c1.5-.5 3-1.3 4.6-2.5.3-3.8-.5-7.2-2.4-10.3ZM9.3 14.7c-.9 0-1.5-.8-1.5-1.7 0-1 .7-1.8 1.5-1.8.9 0 1.6.8 1.5 1.8 0 1-.7 1.7-1.5 1.7Zm5.4 0c-.9 0-1.5-.8-1.5-1.7 0-1 .7-1.8 1.5-1.8.9 0 1.6.8 1.5 1.8 0 1-.6 1.7-1.5 1.7Z"></path>
      </svg>
    `,
    github: `
      <svg class="icon-solid" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 .8a11.2 11.2 0 0 0-3.5 21.8c.6.1.8-.2.8-.6v-2.2c-3.3.7-4-1.4-4-1.4-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7 0-.7 0-.7 1.2.1 1.9 1.3 1.9 1.3 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.6-1.4-5.6-6A4.7 4.7 0 0 1 6.6 7c-.1-.3-.5-1.6.1-3.2 0 0 1-.3 3.4 1.3a11.5 11.5 0 0 1 6.2 0c2.3-1.6 3.4-1.3 3.4-1.3.6 1.6.2 2.9.1 3.2a4.7 4.7 0 0 1 1.3 3.3c0 4.6-2.8 5.7-5.6 6 .4.3.9 1 .9 2.2V22c0 .4.2.7.8.6A11.2 11.2 0 0 0 12 .8Z"></path>
      </svg>
    `,
  };

  return icons[name] || "";
}

function renderStat(stat) {
  return `
    <article class="stat-card">
      <strong>${stat.value}</strong>
      <span>${stat.label.replace("\n", "<br />")}</span>
    </article>
  `;
}

function renderFeature(feature, index) {
  const extraClass = index === 2 ? "feature-card feature-card-wide" : "feature-card";

  return `
    <article class="${extraClass}">
      <span class="feature-badge">${renderIcon(feature.icon)}</span>
      <h3>${feature.title}</h3>
      <h4>${feature.subtitle}</h4>
      <p>${feature.description}</p>
    </article>
  `;
}

function renderPartner(partner) {
  return `<span class="partner-mark">${partner}</span>`;
}

function renderCommunityPost(post, index) {
  return `
    <article class="community-card community-card-${index + 1}">
      <div class="community-head">
        <div class="avatar avatar-${index + 1}" aria-hidden="true"></div>
        <div>
          <strong>${post.name}</strong>
          <span>${post.handle}</span>
        </div>
        <span class="social-mini">${renderIcon("twitter")}</span>
      </div>
      <p>${post.text}</p>
    </article>
  `;
}

function renderSocialLink(item) {
  return `
    <a href="#" aria-label="${item.label}" class="social-link">
      ${renderIcon(item.icon)}
    </a>
  `;
}

const app = document.getElementById("app");
document.body.dataset.currentPage = "homepage";

app.innerHTML = `
  <div class="cursor-glow" aria-hidden="true"></div>
  <div class="page-shell">
    <div class="page-grid"></div>
    <div class="page-glow page-glow-left"></div>
    <div class="page-glow page-glow-bottom"></div>
    <span class="decor-asterisk decor-asterisk-right" aria-hidden="true">*</span>
    <span class="decor-asterisk decor-asterisk-left" aria-hidden="true">*</span>

    <div class="header-inner">
      <a href="#top" class="brand" aria-label="VIDEOINU 2.0 home">
        <span class="brand-icon" aria-hidden="true">
          <svg class="icon-solid" viewBox="0 0 32 32">
            <path d="M27.5 7.4A13.8 13.8 0 1 0 28 16h-5A8.8 8.8 0 1 1 20.4 9Z"></path>
            <path d="M18 10.2h10v3.7H18z"></path>
            <path d="m18 15 8.2 6H20L12 15.2"></path>
          </svg>
        </span>
        <span class="brand-text">VIDEOINU 2.0</span>
      </a>

      <button
        class="menu-toggle"
        type="button"
        aria-expanded="false"
        aria-controls="mobile-menu"
        aria-label="Open navigation menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <nav class="site-nav" aria-label="Main navigation">
        <a href="#overview">WHAT IS VIDEOINU</a>
        <a href="#community">COMMUNITY</a>
        <a href="#documentation">DOCUMENTATION</a>
      </nav>
    </div>

    <div class="mobile-drawer" id="mobile-menu" aria-label="Mobile navigation">
      <a href="#overview">WHAT IS VIDEOINU</a>
      <a href="#community">COMMUNITY</a>
      <a href="#documentation">DOCUMENTATION</a>
    </div>

    <main id="top">
      <section class="hero-section">
        <div class="section-frame hero-frame">
          <div class="hero-copy">
            <p class="launching-badge">\\\\ LAUNCHING SOON //</p>
            <h1>
              <span class="hero-line">DISCOVER <span>THE</span></span>
              <span class="hero-line hero-line-accent">VIDEOINU</span>
              <span class="hero-line">UNIVERSE</span>
            </h1>
            <p class="hero-lead">
              Empowering creators worldwide with a truly open AI video creation tool.<br />
              From spark to screen, create without template limits.
            </p>

            <a class="intro-link" href="#overview">
              <span class="intro-icon">${renderIcon("gift")}</span>
              <span>
                <strong>INTRODUCTION ONE FOR ALL</strong>
                <small>Scan or jump in to explore product details, workflows, and new ways to create with AI video.</small>
              </span>
            </a>
          </div>

          <div class="hero-visual">
            <div class="hero-video-shell" aria-label="Videoinu hero video">
              <video
                class="hero-video"
                src="https://videoinu.oss-cn-beijing.aliyuncs.com/video.mp4"
                poster="https://videoinu.oss-cn-beijing.aliyuncs.com/video_cover.png"
                autoplay
                muted
                loop
                playsinline
                preload="auto"
              ></video>
            </div>
          </div>
        </div>
      </section>

      <section class="overview-section" id="overview">
        <div class="section-frame overview-frame">
          <div class="section-kicker">
            <span class="section-icon">
              ${renderIcon("grid")}
            </span>
            <div>
              <h2>WHAT IS A <span>VIDEOINU?</span></h2>
              <p>
                Videoinu 2.0 is an AI video collaboration platform built for creators worldwide.<br />
                With an infinite canvas, multi-model workflows, and AI Agents, it defines a new generation of video production.
              </p>
            </div>
          </div>

          <div class="stats-row">
            ${stats.map(renderStat).join("")}
          </div>
        </div>
      </section>

      <section class="freedom-section">
        <div class="section-frame freedom-frame">
          <div class="freedom-copy">
            <h2>
              <span>VIDEOINU</span><br />
              COME FOR <span>CREATIVE</span><br />
              <span>FREEDOM</span>
            </h2>
            <p>
              Built around what creators actually need, refined to make AI video creation freer, faster, and more controllable.<br />
              Creative freedom should also mean production efficiency.
            </p>
            <a class="register-card" href="#">
              <strong>REGISTER</strong>
              <span>Sign up free and start creating</span>
            </a>
          </div>

          <div class="freedom-content">
            <article class="feature-card feature-card-emphasis">
              <span class="feature-badge">${renderIcon("success")}</span>
              <h3>Creation Success Rate</h3>
              <p>
                Powered by top-tier video models including Seedance 2.0, Kling, and Wan 2.6, with synchronized control and automated compliance checks for more reliable outputs.
              </p>
            </article>

            <div class="feature-grid">
              ${features.map(renderFeature).join("")}
            </div>

            <div class="partner-strip">
              ${partners.map(renderPartner).join("")}
            </div>

            <div class="blob blob-secondary"></div>
          </div>
        </div>
      </section>

      <section class="signature-section" id="documentation">
        <div class="section-frame signature-frame">
          <div class="signature-visual">
            <div class="blob blob-signature"></div>
          </div>

          <div class="signature-copy">
            <h2>
              VIDEO THAT WILL<br />
              BECOME <span>YOUR SIGNATURE</span>
            </h2>
            <p>
              Create with a platform where every idea can become a real piece of work.<br />
              From short clips to serialized content, from solo creation to commercial delivery, your workflow scales naturally.
            </p>
            <a href="#" class="text-link">
              EXPLORE NOW
              <span>Explore features</span>
            </a>
          </div>
        </div>
      </section>

      <section class="manifesto-strip" aria-label="Platform manifesto">
        <div class="section-frame manifesto-frame">
          Every video can become your signature work \\ Every creation can grow into a reusable asset \\ Every idea can be fully captured, expanded, and refined.
        </div>
      </section>

      <section class="community-section" id="community">
        <div class="section-frame community-frame">
          <div class="community-copy">
            <h2>
              CREATORS ARE <span>THE</span><br />
              <span>HEART</span> OF US
            </h2>
            <p>
              Join the creator community for the latest tutorials, templates, and model updates.<br />
              Connect with creators worldwide, exchange ideas, and keep pushing the craft forward.
            </p>
          </div>

          <div class="community-feed">
            ${communityPosts.map(renderCommunityPost).join("")}
          </div>
        </div>
      </section>
    </main>

    <footer class="site-footer">
      <div class="footer-inner">
        <div class="footer-brand">
          <a href="#top" class="brand brand-footer" aria-label="VIDEOINU 2.0 home">
            <span class="brand-icon" aria-hidden="true">
              <svg class="icon-solid" viewBox="0 0 32 32">
                <path d="M27.5 7.4A13.8 13.8 0 1 0 28 16h-5A8.8 8.8 0 1 1 20.4 9Z"></path>
                <path d="M18 10.2h10v3.7H18z"></path>
                <path d="m18 15 8.2 6H20L12 15.2"></path>
              </svg>
            </span>
            <span class="brand-text">VIDEOINU 2.0</span>
          </a>
          <p>AI Video Creation Platform</p>
        </div>

        <div class="footer-socials">
          ${socialLinks.map(renderSocialLink).join("")}
        </div>
      </div>
    </footer>

    <div class="footer-meta">
      <div class="footer-inner footer-meta-inner">
        <span>&copy;${new Date().getFullYear()} Videoinu. All rights reserved.</span>
      </div>
    </div>
  </div>
`;

const cursorGlow = document.querySelector(".cursor-glow");
const supportsDesktopPointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const menuToggle = document.querySelector(".menu-toggle");
const mobileDrawer = document.querySelector(".mobile-drawer");

if (menuToggle && mobileDrawer) {
  const closeMenu = () => {
    document.body.classList.remove("menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
  };

  menuToggle.addEventListener("click", () => {
    const nextExpanded = menuToggle.getAttribute("aria-expanded") !== "true";
    menuToggle.setAttribute("aria-expanded", String(nextExpanded));
    document.body.classList.toggle("menu-open", nextExpanded);
  });

  mobileDrawer.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 767) {
      closeMenu();
    }
  });
}

if (cursorGlow && supportsDesktopPointer) {
  document.body.classList.add("has-cursor-glow");

  const interactiveSelector =
    'a, button, input, textarea, select, summary, [role="button"], [data-clickable="true"]';
  let pointerX = window.innerWidth / 2;
  let pointerY = window.innerHeight / 2;
  let currentX = pointerX;
  let currentY = pointerY;
  let frameId = 0;

  const isInteractiveTarget = (target) =>
    target instanceof Element && Boolean(target.closest(interactiveSelector));

  const renderGlow = () => {
    currentX += (pointerX - currentX) * 0.2;
    currentY += (pointerY - currentY) * 0.2;
    cursorGlow.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;

    if (Math.abs(pointerX - currentX) > 0.1 || Math.abs(pointerY - currentY) > 0.1) {
      frameId = window.requestAnimationFrame(renderGlow);
    } else {
      frameId = 0;
    }
  };

  const updateInteractiveState = (target) => {
    document.body.classList.toggle("cursor-over-interactive", isInteractiveTarget(target));
  };

  document.addEventListener("mousemove", (event) => {
    pointerX = event.clientX;
    pointerY = event.clientY;
    cursorGlow.classList.add("is-visible");
    updateInteractiveState(event.target);

    if (!frameId) {
      frameId = window.requestAnimationFrame(renderGlow);
    }
  });

  document.addEventListener("mouseover", (event) => {
    updateInteractiveState(event.target);
  });

  document.addEventListener("mouseleave", () => {
    cursorGlow.classList.remove("is-visible");
    document.body.classList.remove("cursor-over-interactive");
  });

  window.addEventListener("blur", () => {
    cursorGlow.classList.remove("is-visible");
    document.body.classList.remove("cursor-over-interactive");
  });
} else {
  cursorGlow?.remove();
}

mountChatWidget().catch(() => {
  console.warn("Videoinu assistant widget failed to mount.");
});
