/**
 * Portfolio JavaScript - Modern shadcn/ui Interactions
 * Theme Management, Project Filtering, Modal Deep-Dives, Clipboard Toast, & Command Palette
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. Theme Management (Sleek Dark Default)
  // ==========================================
  const root = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  
  // Use a modern namespaced key to prevent old cached theme values
  const storedTheme = localStorage.getItem('portfolio_theme');

  function updateThemeUI(theme) {
    if (theme === 'light') {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
      if (themeToggle) {
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        themeToggle.setAttribute('aria-label', 'Switch to dark theme');
        themeToggle.setAttribute('title', 'Switch to dark theme');
      }
    } else {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
      if (themeToggle) {
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        themeToggle.setAttribute('aria-label', 'Switch to light theme');
        themeToggle.setAttribute('title', 'Switch to light theme');
      }
    }
  }

  // Signature shadcn aesthetic is dark; default to dark unless explicitly toggled
  let initialTheme = 'dark';
  if (storedTheme === 'light') {
    initialTheme = 'light';
  } else if (storedTheme === 'dark') {
    initialTheme = 'dark';
  }
  updateThemeUI(initialTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = root.classList.contains('dark');
      const nextTheme = isDark ? 'light' : 'dark';
      localStorage.setItem('portfolio_theme', nextTheme);
      updateThemeUI(nextTheme);
    });
  }

  // ==========================================
  // 2. Project Tabs Filter (All / AI & ML / Automation)
  // ==========================================
  const tabTriggers = document.querySelectorAll('.tab-trigger');
  const projectCards = document.querySelectorAll('.project-card');

  tabTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      tabTriggers.forEach((t) => t.classList.remove('active'));
      trigger.classList.add('active');

      const filter = trigger.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.transition = 'opacity 0.25s ease';
            card.style.opacity = '1';
          }, 20);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ==========================================
  // 3. Toast Notifications & Copy to Clipboard
  // ==========================================
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');
  let toastTimeout = null;

  function showToast(message) {
    if (!toast || !toastMessage) return;
    toastMessage.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  const copyEmailBtns = document.querySelectorAll('.copy-email-btn');
  copyEmailBtns.forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const email = btn.getAttribute('data-email') || 'vimaljoshy2011@gmail.com';
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(email);
        } else {
          const textarea = document.createElement('textarea');
          textarea.value = email;
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
        }
        showToast('Email address copied to clipboard!');
      } catch (err) {
        showToast('Email: ' + email);
      }
    });
  });

  // ==========================================
  // 4. Mobile Navigation Drawer
  // ==========================================
  const mobileNavToggle = document.getElementById('mobile-nav-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileNavToggle && mobileMenu) {
    mobileNavToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      mobileNavToggle.innerHTML = isOpen 
        ? '<i class="fas fa-times"></i>' 
        : '<i class="fas fa-bars"></i>';
    });

    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        mobileNavToggle.innerHTML = '<i class="fas fa-bars"></i>';
      });
    });
  }

  // ==========================================
  // 5. Active Link Highlight on Scroll
  // ==========================================
  const navLinks = document.querySelectorAll('.nav-links .nav-link');
  const sections = document.querySelectorAll('section[id], footer[id]');

  function updateActiveNavLink() {
    const scrollPos = window.scrollY + 120;
    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });

  // ==========================================
  // 6. Command Palette (⌘K / Ctrl+K)
  // ==========================================
  const cmdOverlay = document.getElementById('cmd-dialog-overlay');
  const cmdBtn = document.getElementById('cmd-k-btn');
  const cmdInput = document.getElementById('cmd-input');
  const cmdItems = document.querySelectorAll('.command-item');

  function openCommandMenu() {
    if (!cmdOverlay) return;
    cmdOverlay.classList.add('open');
    if (cmdInput) {
      cmdInput.value = '';
      cmdInput.focus();
      filterCommandItems('');
    }
  }

  function closeCommandMenu() {
    if (!cmdOverlay) return;
    cmdOverlay.classList.remove('open');
  }

  function filterCommandItems(query) {
    const q = query.toLowerCase().trim();
    cmdItems.forEach((item) => {
      const text = item.textContent.toLowerCase();
      if (!q || text.includes(q)) {
        item.style.display = 'flex';
      } else {
        item.style.display = 'none';
      }
    });
  }

  if (cmdBtn) {
    cmdBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openCommandMenu();
    });
  }

  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (cmdOverlay && cmdOverlay.classList.contains('open')) {
        closeCommandMenu();
      } else {
        openCommandMenu();
      }
    } else if (e.key === 'Escape') {
      if (cmdOverlay && cmdOverlay.classList.contains('open')) {
        closeCommandMenu();
      }
      if (modalOverlay && modalOverlay.classList.contains('open')) {
        closeProjectModal();
      }
    }
  });

  if (cmdOverlay) {
    cmdOverlay.addEventListener('click', (e) => {
      if (e.target === cmdOverlay) closeCommandMenu();
    });
  }

  if (cmdInput) {
    cmdInput.addEventListener('input', (e) => {
      filterCommandItems(e.target.value);
    });
  }

  cmdItems.forEach((item) => {
    item.addEventListener('click', () => {
      const action = item.getAttribute('data-action');
      closeCommandMenu();

      if (action === 'navigate') {
        const target = item.getAttribute('data-target');
        const el = document.querySelector(target);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      } else if (action === 'resume') {
        const link = document.createElement('a');
        link.href = 'resume.pdf';
        link.download = 'Vimal_Joshy_Resume.pdf';
        link.click();
      } else if (action === 'copy-email') {
        navigator.clipboard.writeText('vimaljoshy2011@gmail.com').then(() => {
          showToast('Email address copied to clipboard!');
        });
      } else if (action === 'toggle-theme') {
        if (themeToggle) themeToggle.click();
      } else if (action === 'link') {
        const url = item.getAttribute('data-url');
        if (url) window.open(url, '_blank');
      }
    });
  });

  // ==========================================
  // 7. Project Details Modal Dialog
  // ==========================================
  const modalOverlay = document.getElementById('project-modal-overlay');
  const modalTitle = document.getElementById('modal-project-title');
  const modalBadge = document.getElementById('modal-project-badge');
  const modalBody = document.getElementById('modal-project-body');
  const modalLink = document.getElementById('modal-project-link');
  const modalLinkText = document.getElementById('modal-project-link-text');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalCloseFooter = document.getElementById('modal-close-footer');
  const openModalBtns = document.querySelectorAll('.open-modal-btn');

  const projectDetailsData = {
    'ds-playground': {
      title: 'Data Science Playground',
      badge: 'Live Interactive App',
      badgeClass: 'badge-glow',
      link: 'https://vmljsy.github.io/ds-playground/',
      linkText: 'Launch Live App',
      content: `
        <div class="modal-metric-box">
          <i class="fas fa-play" style="color: #22c55e;"></i>
          <strong>Key Metric:</strong> 6+ interactive live statistical experiments in browser
        </div>
        <div>
          <div class="modal-section-h">Overview & Purpose</div>
          <p class="modal-text">An interactive browser-based simulation platform to help engineers, students, and practitioners build deep intuition for core statistics, probability theory, and machine learning concepts through real-time mathematical experimentation.</p>
        </div>
        <div>
          <div class="modal-section-h">Experiments Included</div>
          <p class="modal-text">Central Limit Theorem convergence, Law of Large Numbers stochastic stabilization, Interactive Probability Distributions (Normal, Student's t, Binomial, Poisson, Chi-square, Exponential), Confidence Intervals coverage mechanics, Hypothesis Testing workbench (z-test & t-test critical values and p-values), and A/B Testing lift analysis with sequential peeking tracking.</p>
        </div>
        <div>
          <div class="modal-section-h">Technologies Used</div>
          <div class="project-tags">
            <span class="tech-tag">JavaScript (ES6+)</span>
            <span class="tech-tag">Plotly.js</span>
            <span class="tech-tag">KaTeX (LaTeX)</span>
            <span class="tech-tag">Statistical Modeling</span>
            <span class="tech-tag">A/B Testing</span>
          </div>
        </div>
      `
    },
    'cohort-creator': {
      title: 'Patient Cohort Creator',
      badge: 'Hackathon Winner',
      badgeClass: 'badge-default',
      link: 'https://github.com/vmljsy',
      linkText: 'Source Code',
      content: `
        <div class="modal-metric-box">
          <i class="fas fa-trophy" style="color: #eab308;"></i>
          <strong>Key Impact:</strong> 1st Place IQVIA Hackathon &bull; Applied across enterprise LRX data
        </div>
        <div>
          <div class="modal-section-h">The Challenge</div>
          <p class="modal-text">Longitudinal prescription (LRX) datasets comprise millions of patient purchase journeys, complex co-prescriptions, and irregular refill intervals. Manually clustering patient groups by therapy line and adherence was slow and subjective.</p>
        </div>
        <div>
          <div class="modal-section-h">Architecture & Solution</div>
          <p class="modal-text">Architected an unsupervised machine learning clustering framework in Python using scikit-learn and pandas. The system extracts temporal patient trajectories, normalizes treatment gaps, and segments patients into clinically actionable cohorts using ML clustering algorithms coupled with diagnostic indication rules.</p>
        </div>
        <div>
          <div class="modal-section-h">Tech Stack</div>
          <div class="project-tags">
            <span class="tech-tag">Python</span>
            <span class="tech-tag">scikit-learn</span>
            <span class="tech-tag">pandas</span>
            <span class="tech-tag">Unsupervised ML</span>
            <span class="tech-tag">LRX Data</span>
          </div>
        </div>
      `
    },
    'genai-indication': {
      title: 'GenAI Indication Identifier',
      badge: 'Production ML',
      badgeClass: 'badge-secondary',
      link: 'https://github.com/vmljsy',
      linkText: 'Source Code',
      content: `
        <div class="modal-metric-box">
          <i class="fas fa-brain" style="color: #60a5fa;"></i>
          <strong>Key Impact:</strong> Scaled across 5+ enterprise client deliveries with 100% on-time SLA
        </div>
        <div>
          <div class="modal-section-h">The Challenge</div>
          <p class="modal-text">Prescription transaction databases often lack explicit diagnostic indications, making off-label usage and condition-specific analytics challenging for pharmaceutical clients.</p>
        </div>
        <div>
          <div class="modal-section-h">Architecture & Solution</div>
          <p class="modal-text">Spearheaded Generative AI initiatives at IQVIA, building a hybrid pipeline combining machine learning classifiers and LLM extraction techniques to infer underlying patient indications from longitudinal medication sequences and clinician notes.</p>
        </div>
        <div>
          <div class="modal-section-h">Tech Stack</div>
          <div class="project-tags">
            <span class="tech-tag">Python</span>
            <span class="tech-tag">Generative AI</span>
            <span class="tech-tag">LLMs</span>
            <span class="tech-tag">NLP</span>
            <span class="tech-tag">SQL</span>
            <span class="tech-tag">PySpark</span>
          </div>
        </div>
      `
    },
    'qc-engine': {
      title: 'Automated Clinical QC Engine',
      badge: 'IQVIA Bronze Award',
      badgeClass: 'badge-default',
      link: 'https://github.com/vmljsy',
      linkText: 'Source Code',
      content: `
        <div class="modal-metric-box">
          <i class="fas fa-clock" style="color: #f59e0b;"></i>
          <strong>Key Impact:</strong> 95% QC time reduction (~100 engineering hours saved monthly)
        </div>
        <div>
          <div class="modal-section-h">The Challenge</div>
          <p class="modal-text">Manual quality control across multi-country patient tables involved cross-referencing millions of rows against regulatory and business rule sheets, requiring ~100 analyst hours every month.</p>
        </div>
        <div>
          <div class="modal-section-h">Architecture & Solution</div>
          <p class="modal-text">Developed a high-throughput automated validation framework that applies automated schema assertion, statistical distribution checks, data drift monitoring, and anomaly detection. Recognized with the IQVIA Corporate Bronze Award for measurable operational efficacy.</p>
        </div>
        <div>
          <div class="modal-section-h">Tech Stack</div>
          <div class="project-tags">
            <span class="tech-tag">Python</span>
            <span class="tech-tag">Data Quality</span>
            <span class="tech-tag">Anomaly Detection</span>
            <span class="tech-tag">pandas</span>
            <span class="tech-tag">ETL Testing</span>
          </div>
        </div>
      `
    },
    'slidesync': {
      title: 'SlideSync Deck Generator',
      badge: 'Productivity Tool',
      badgeClass: 'badge-secondary',
      link: 'https://github.com/vmljsy',
      linkText: 'Source Code',
      content: `
        <div class="modal-metric-box">
          <i class="fas fa-bolt" style="color: #22c55e;"></i>
          <strong>Key Impact:</strong> 80% reduction in presentation assembly turnaround time
        </div>
        <div>
          <div class="modal-section-h">The Challenge</div>
          <p class="modal-text">After running complex analytical pipelines, data analysts manually assembled dozens of PowerPoint slides with formatted charts, tables, and narrative summaries for bi-weekly client meetings.</p>
        </div>
        <div>
          <div class="modal-section-h">Architecture & Solution</div>
          <p class="modal-text">Engineered SlideSync, a Python automation utility that connects to data outputs and automatically injects dynamically rendered charts, KPI callouts, and clean formatted tables into branded master deck templates.</p>
        </div>
        <div>
          <div class="modal-section-h">Tech Stack</div>
          <div class="project-tags">
            <span class="tech-tag">Python</span>
            <span class="tech-tag">python-pptx</span>
            <span class="tech-tag">Matplotlib</span>
            <span class="tech-tag">Data Visualization</span>
            <span class="tech-tag">Office Automation</span>
          </div>
        </div>
      `
    }
  };

  function openProjectModal(projectId) {
    const data = projectDetailsData[projectId];
    if (!data || !modalOverlay) return;

    modalTitle.textContent = data.title;
    modalBadge.textContent = data.badge;
    modalBadge.className = 'badge ' + (data.badgeClass || 'badge-default');
    modalBody.innerHTML = data.content;
    modalLink.href = data.link;
    modalLinkText.textContent = data.linkText || 'Source Code';

    modalOverlay.classList.add('open');
  }

  function closeProjectModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('open');
  }

  openModalBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const proj = btn.getAttribute('data-project');
      openProjectModal(proj);
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeProjectModal);
  if (modalCloseFooter) modalCloseFooter.addEventListener('click', closeProjectModal);
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeProjectModal();
    });
  }
});
