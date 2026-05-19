export type SkillGroup = {
  heading: string;
  items: string[];
};

export const skillGroups: SkillGroup[] = [
  {
    heading: 'Frontend',
    items: [
      'React',
      'TypeScript',
      'Material UI',
      'TailwindCSS',
      'Bootstrap',
      'Formik · Yup',
      'react-intl (i18n)',
      'Responsive Design'
    ]
  },
  {
    heading: 'Backend',
    items: [
      'Java · Spring Boot · Spring Web · JPA',
      'Node.js / Express',
      'Python / Django',
      'Ruby on Rails',
      'PHP · MySQL',
      'MongoDB',
      'RESTful APIs',
      'OAuth2 · OpenID Connect'
    ]
  },
  {
    heading: 'AI Development',
    items: ['FastAPI', 'LangChain', 'LangGraph']
  },
  {
    heading: 'DevOps & Tooling',
    items: [
      'Git · GitHub · GitLab',
      'CI/CD workflows',
      'Docker',
      'Webpack · npm · yarn',
      'AWS',
      'Performance tuning',
      'Deployment automation'
    ]
  },
  {
    heading: 'Quality & Design',
    items: [
      'Unit & regression testing',
      'Code reviews',
      'Linting & style enforcement',
      'Figma',
      'Adobe XD'
    ]
  },
  {
    heading: 'Off the keyboard',
    items: ['Guitar', 'Singing', 'Soccer', 'Movies']
  }
];

export const profile = {
  name: 'Gamaliel Dashua',
  role: 'Full-Stack Developer · Java/Spring Boot · React/TypeScript',
  blurb:
    'Full-stack developer with 4+ years of production experience — 2 of them in Java/Spring Boot backends. I design and consume reliable APIs, build polished React/TypeScript front ends, and ship the lot end to end.',
  email: 'gdashua@gmail.com',
  phone: '+234 806 837 7631',
  github: 'https://github.com/Gamey001',
  linkedin: 'https://www.linkedin.com/in/gamaliel-dashua-8bb056160',
  location: 'Nigeria'
};
