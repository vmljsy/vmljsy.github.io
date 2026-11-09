/**
 * Portfolio JavaScript - Modern shadcn/ui Interactions
 * Theme Management, Project Filtering, Clipboard Toast, & Navigation
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. Theme Management (Dark / Light Mode)
  // ==========================================
  const root = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  const storedTheme = localStorage.getItem('theme');

  function updateThemeUI(theme) {
    if (theme === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
      if (themeToggle) {
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        themeToggle.setAttribute('aria-label', 'Switch to light theme');
        themeToggle.setAttribute('title', 'Switch to light theme');
      }
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
      if (themeToggle) {
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        themeToggle.setAttribute('aria-label', 'Switch to dark theme');
        themeToggle.setAttribute('title', 'Switch to dark theme');
      }
    }
  }

  // Determine initial theme:
  // 1. Stored preference
  // 2. System preference
  // 3. Default to dark (classic sleek shadcn developer aesthetic)
  let initialTheme = 'dark';
  if (storedTheme === 'light' || storedTheme === 'dark') {
    initialTheme = storedTheme;
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    initialTheme = 'light';
  }
  updateThemeUI(initialTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = root.classList.contains('dark');
      const nextTheme = isDark ? 'light' : 'dark';
      localStorage.setItem('theme', nextTheme);
      updateThemeUI(nextTheme);
    });
  }

  // Listen to OS theme changes if user has not explicitly set a preference
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        updateThemeUI(e.matches ? 'dark' : 'light');
      }
    });
  }

  // ==========================================
  // 2. Project Tabs Filter (All / AI & ML / Automation)
  // ==========================================
  const tabTriggers = document.querySelectorAll('.tab-trigger');
  const projectCards = document.querySelectorAll('.project-card');

  tabTriggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      // Set active tab
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

  // Copy Email Buttons
  const copyEmailBtns = document.querySelectorAll('.copy-email-btn');
  copyEmailBtns.forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const email = btn.getAttribute('data-email') || 'vimaljoshy2011@gmail.com';
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(email);
        } else {
          // Fallback
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

  // Keyboard shortcut: Cmd+K / Ctrl+K and Esc
  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (cmdOverlay && cmdOverlay.classList.contains('open')) {
        closeCommandMenu();
      } else {
        openCommandMenu();
      }
    } else if (e.key === 'Escape' && cmdOverlay && cmdOverlay.classList.contains('open')) {
      closeCommandMenu();
    }
  });

  if (cmdOverlay) {
    cmdOverlay.addEventListener('click', (e) => {
      if (e.target === cmdOverlay) {
        closeCommandMenu();
      }
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
});
