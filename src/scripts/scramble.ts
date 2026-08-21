const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%';

export function scramble(
  el: HTMLElement,
  finalText: string,
  duration: number = 800
): void {
  const len = finalText.length;
  const start = Date.now();

  const interval = setInterval(() => {
    const elapsed = Date.now() - start;
    const progress = Math.min(elapsed / duration, 1);
    const lockedChars = Math.floor(progress * len);

    el.textContent = finalText
      .split('')
      .map((char, i) => {
        if (i < lockedChars) return char;
        if (char === ' ') return ' ';
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      })
      .join('');

    if (progress >= 1) {
      clearInterval(interval);
      el.textContent = finalText;
    }
  }, 40);
}

export function setupScrollScramble(selector: string, duration: number = 800): void {
  const elements = document.querySelectorAll(selector);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !entry.target.classList.contains('scrambled')) {
        const el = entry.target as HTMLElement;
        const finalText = el.textContent || '';
        el.classList.add('scrambled');
        scramble(el, finalText, duration);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  elements.forEach((el) => observer.observe(el));
}

export function setupHoverScramble(selector: string, duration: number = 300): void {
  const elements = document.querySelectorAll(selector);

  elements.forEach((el) => {
    const htmlEl = el as HTMLElement;
    const finalText = htmlEl.textContent || '';

    htmlEl.addEventListener('mouseenter', () => {
      scramble(htmlEl, finalText, duration);
    });

    htmlEl.addEventListener('mouseleave', () => {
      htmlEl.textContent = finalText;
    });
  });
}
