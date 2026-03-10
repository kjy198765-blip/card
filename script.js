const root = document.documentElement;
const themeToggleBtn = document.getElementById('themeToggle');
const copyPhoneBtn = document.querySelector('.copy-phone');
const tagline = document.getElementById('tagline');

const TAGLINE_TEXT = '"AI와 함께 놀고 있습니다. 같이 노실 분?"';

function setTheme(theme) {
  root.setAttribute('data-theme', theme);
  try {
    localStorage.setItem('dain-card-theme', theme);
  } catch (_) {}
}

function getStoredTheme() {
  try {
    return localStorage.getItem('card-theme');
  } catch (_) {
    return null;
  }
}

function initTheme() {
  const stored = getStoredTheme();
  if (stored === 'light' || stored === 'dark') {
    setTheme(stored);
  } else {
    const prefersDark = window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'dark' : 'light');
  }
  updateThemeButtonLabel();
}

function updateThemeButtonLabel() {
  const current = root.getAttribute('data-theme');
  themeToggleBtn.textContent = current === 'light' ? '다크 테마' : '라이트 테마';
}

themeToggleBtn.addEventListener('click', () => {
  const current = root.getAttribute('data-theme') || 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  setTheme(next);
  updateThemeButtonLabel();
});

copyPhoneBtn.addEventListener('click', async () => {
  const phone = copyPhoneBtn.dataset.phone;
  let success = false;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(phone);
      success = true;
    } catch (_) {
      success = false;
    }
  }

  if (!success) {
    const textarea = document.createElement('textarea');
    textarea.value = phone;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      success = true;
    } catch (_) {
      success = false;
    } finally {
      document.body.removeChild(textarea);
    }
  }

  const original = copyPhoneBtn.querySelector('.value').textContent;
  copyPhoneBtn.querySelector('.value').textContent = success ? '복사 완료!' : original;

  if (success) {
    copyPhoneBtn.classList.add('copied');
    setTimeout(() => {
      copyPhoneBtn.classList.remove('copied');
      copyPhoneBtn.querySelector('.value').textContent = original;
    }, 1200);
  }
});

function typeTagline() {
  tagline.textContent = '';
  let i = 0;

  const interval = setInterval(() => {
    tagline.textContent += TAGLINE_TEXT[i] ?? '';
    i += 1;
    if (i >= TAGLINE_TEXT.length) {
      clearInterval(interval);
    }
  }, 80);
}

window.addEventListener('DOMContentLoaded', () => {
  initTheme();
  typeTagline();
});

