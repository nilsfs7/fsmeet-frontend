import type { Config } from 'tailwindcss';

/** Maps CSS variables (RGB triplet) to utilities with opacity, e.g. `text-primary/80` */
const channel = (name: string) => `rgb(var(${name}) / <alpha-value>)` as const;

const neutral = Object.fromEntries(
  (['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'] as const).map(n => [n, channel(`--neutral-${n}`)]),
) as Record<string, string>;

const config: Config = {
  darkMode: ['class'],
  content: ['./src/pages/**/*.{js,ts,jsx,tsx,mdx}', './src/components/**/*.{js,ts,jsx,tsx,mdx}', './src/app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        /* Core (see src/app/globals.css) */
        background: channel('--background'),
        foreground: channel('--foreground'),
        primary: channel('--primary'),
        'primary-foreground': channel('--primary-foreground'),
        border: channel('--border'),
        input: channel('--input'),
        ring: channel('--ring'),
        muted: channel('--muted'),
        'muted-foreground': channel('--muted-foreground'),

        /* Legacy names — keep for existing classNames */
        secondary: channel('--secondary'),
        'secondary-light': channel('--secondary-light'),
        'secondary-dark': channel('--secondary-dark'),

        success: channel('--success'),
        'success-foreground': channel('--success-foreground'),
        warning: channel('--warning'),
        'warning-foreground': channel('--warning-foreground'),
        critical: channel('--critical'),
        'critical-dark': channel('--critical-dark'),
        'critical-foreground': channel('--critical-foreground'),
        destructive: channel('--destructive'),
        'destructive-foreground': channel('--destructive-foreground'),

        bronze: channel('--bronze'),
        silver: channel('--silver'),
        gold: channel('--gold'),

        neutral,
      },
      fontFamily: {
        sans: ['"Roboto"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.45' }],
        base: ['1rem', { lineHeight: '1.625' }],
        /* Semantic aliases (same as base / sm) */
        body: ['1rem', { lineHeight: '1.625' }],
        'body-sm': ['0.875rem', { lineHeight: '1.45' }],
        'body-xs': ['0.8125rem', { lineHeight: '1.4' }],
        lead: ['1.125rem', { lineHeight: '1.6' }],
        /* Legacy scale (unchanged line steps — prefer `text-heading-*` / `text-lead` for new UI) */
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        display: ['2.25rem', { lineHeight: '1.2', fontWeight: '700' }],
        'heading-1': ['1.875rem', { lineHeight: '1.25', fontWeight: '600' }],
        'heading-2': ['1.5rem', { lineHeight: '1.3', fontWeight: '600' }],
        'heading-3': ['1.25rem', { lineHeight: '1.4', fontWeight: '600' }],
        'heading-4': ['1.125rem', { lineHeight: '1.45', fontWeight: '600' }],
      },
      maxWidth: {
        /** ~65ch; same idea as `max-w-prose`, useful for `mx-auto` copy blocks */
        copy: '65ch',
      },
      typography: {
        DEFAULT: {
          css: {
            color: 'rgb(var(--foreground) / 1)',
            a: { color: 'rgb(var(--primary) / 1)' },
            'a:hover': { textDecoration: 'underline' },
            'h2, h3, h4': { color: 'rgb(var(--foreground) / 1)' },
          },
        },
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
        full: 'var(--radius-full)',
      },
      boxShadow: {
        xs: 'var(--shadow-xs)',
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
};

export default config;
