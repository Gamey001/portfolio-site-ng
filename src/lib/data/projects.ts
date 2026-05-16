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
    title: 'WhisperBox',
    tagline: 'End-to-end encrypted messaging',
    description:
      'E2EE messaging client built against the WhisperBox API. Plaintext never leaves the browser — the server only ever sees ciphertext. RSA-OAEP-2048 + AES-GCM-256, password-derived key wrapping via PBKDF2.',
    stack: ['React', 'TypeScript', 'Web Crypto API', 'Vite'],
    live: 'https://incomparable-churros-927646.netlify.app/',
    repo: 'https://github.com/Gamey001/chatty-messge-app',
    category: 'security',
    accent: '#7c5cff'
  },
  {
    id: 'invoice',
    title: 'Invoice Manager',
    tagline: 'Offline-first invoicing',
    description:
      'A fully responsive invoice management app with client-side persistence via IndexedDB. Create, edit, filter, and export invoices without a backend.',
    stack: ['React', 'IndexedDB', 'TypeScript', 'CSS Modules'],
    live: 'https://inspiring-boba-3545a8.netlify.app/',
    repo: 'https://github.com/Gamey001/invoice-app',
    category: 'tools',
    accent: '#ff4d2e'
  },
  {
    id: 'people-dash',
    title: 'People Dashboard',
    tagline: 'Random users, real UX',
    description:
      'A dashboard that fetches random users and filters them through a richly considered interface — pagination, search, and crisp empty/loading states.',
    stack: ['React', 'REST', 'CSS'],
    live: 'https://gamalfb.netlify.app/',
    category: 'data',
    accent: '#19e6a0'
  },
  {
    id: 'students',
    title: 'Students Profile',
    tagline: 'Performance tracker',
    description:
      'A React app that tracks students’ performance across courses with sortable tables and quick-glance summary cards.',
    stack: ['React', 'JavaScript', 'CSS'],
    live: 'https://gameystudentsprofile.netlify.app/',
    category: 'ui',
    accent: '#ffb84d'
  }
];

export const categories = [
  { id: 'all', label: 'All' },
  { id: 'security', label: 'Security' },
  { id: 'tools', label: 'Tools' },
  { id: 'data', label: 'Data' },
  { id: 'ui', label: 'UI' }
] as const;
