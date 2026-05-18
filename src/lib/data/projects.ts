export type Project = {
  id: string;
  title: string;
  tagline: string;
  description: string;
  stack: string[];
  live: string;
  repo?: string;
  category: 'security' | 'tools' | 'ui' | 'data';
  accent: string;
};

export const projects: Project[] = [
  {
    id: 'whisperbox',
    title: 'WhisperBox — Chat App',
    tagline: 'End-to-end encrypted messaging',
    description:
      'E2EE messaging client built against the WhisperBox API. Plaintext never leaves the browser — the server only ever sees ciphertext. RSA-OAEP-2048 + AES-GCM-256 with password-derived key wrapping via PBKDF2.',
    stack: ['React', 'TypeScript', 'Web Crypto API', 'Vite'],
    live: 'https://incomparable-churros-927646.netlify.app/',
    repo: 'https://github.com/Gamey001/chatty-messge-app',
    category: 'security',
    accent: '#a78bfa'
  },
  {
    id: 'invoice',
    title: 'Invoice Manager',
    tagline: 'Offline-first invoicing',
    description:
      'A fully responsive invoice management app with client-side persistence via IndexedDB. Create, edit, filter, and export invoices without a backend — fast, durable, and installable.',
    stack: ['React', 'IndexedDB', 'TypeScript', 'CSS Modules'],
    live: 'https://inspiring-boba-3545a8.netlify.app/',
    repo: 'https://github.com/Gamey001/invoice-app',
    category: 'tools',
    accent: '#c084fc'
  },
  {
    id: 'people-dash',
    title: 'User Dashboard',
    tagline: 'Random users, real UX',
    description:
      'A user-directory dashboard that consumes a public REST API and filters results through a richly considered interface — pagination, search, and crisp empty/loading states.',
    stack: ['React', 'REST APIs', 'CSS'],
    live: 'https://gamalfb.netlify.app/',
    category: 'data',
    accent: '#8b5cf6'
  },
  {
    id: 'students',
    title: 'Students Profile',
    tagline: 'Performance tracker',
    description:
      'A React app that tracks students’ performance across courses with sortable tables, filtering, and quick-glance summary cards.',
    stack: ['React', 'JavaScript', 'CSS'],
    live: 'https://gameystudentsprofile.netlify.app/',
    category: 'ui',
    accent: '#ddd6fe'
  }
];

export const categories = [
  { id: 'all', label: 'All' },
  { id: 'security', label: 'Security' },
  { id: 'tools', label: 'Tools' },
  { id: 'data', label: 'Data' },
  { id: 'ui', label: 'UI' }
] as const;
