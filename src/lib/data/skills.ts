export type SkillGroup = {
  heading: string;
  items: string[];
};

export const skillGroups: SkillGroup[] = [
  {
    heading: 'Frontend',
    items: ['React', 'TypeScript', 'JavaScript / ES6', 'HTML5 + CSS3', 'SASS', 'jQuery', 'Bootstrap', 'TailwindCSS']
  },
  {
    heading: 'Backend',
    items: ['Node.js / Express', 'Java', 'Spring Boot', 'PHP', 'MySQL', 'MongoDB', 'REST + SOAP APIs']
  },
  {
    heading: 'Tooling',
    items: ['Git / GitHub / GitLab', 'AWS', 'Figma', 'Adobe XD', 'AJAX', 'JSON / XML']
  },
  {
    heading: 'Off the keyboard',
    items: ['Guitar', 'Singing', 'Soccer', 'Movies']
  }
];

export const profile = {
  name: 'Gamaliel Dashua',
  role: 'Frontend Engineer · Full-stack-curious',
  blurb:
    'I build immersive, performant interfaces — from end-to-end encrypted clients to offline-first dashboards. BSc Computer Science.',
  email: 'gdashua@gmail.com',
  phone: '+234 806 837 7631',
  github: 'https://github.com/Gamey001',
  linkedin: 'https://www.linkedin.com/in/gamaliel-dashua-8bb056160',
  location: 'Nigeria'
};
