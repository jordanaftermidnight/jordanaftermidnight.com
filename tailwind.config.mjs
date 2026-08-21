/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'bg': 'var(--bg)',
        'surface': 'var(--surface)',
        'border': 'var(--border)',
        'border-hover': 'var(--border-hover)',
        'neon-cyan': 'var(--neon-cyan)',
        'neon-violet': 'var(--neon-violet)',
        'text': 'var(--text)',
        'text-muted': 'var(--text-muted)',
      },
      fontFamily: {
        'mono': ["'Space Mono'", 'monospace'],
        'sans': ["'Inter'", 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan': 'var(--glow-cyan)',
        'glow-cyan-hover': 'var(--glow-cyan-hover)',
      },
    },
  },
  plugins: [],
};
