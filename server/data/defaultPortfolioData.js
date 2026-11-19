export const defaultPortfolioData = {
  version: 1,
  hero: {
    name: 'Sana Fatma',
    headline: "I build web applications and work with AI.",
    supportingCopy: "I'm Sana Fatma, a final-year Computer Science and Engineering student passionate about web development, software engineering, and AI-powered applications.",
    roles: [
      'Computer Science Student',
      'Web Developer',
      'AI Enthusiast',
      'Full-Stack Developer'
    ],
    portraitUrl: '/images/sana_portrait.jpg',
    resumeUrl: '/Sana_Fatma_Resume.pdf',
    badges: [
      'B.Tech CSE • MANUU',
      'CGPA: 8.72',
      'Expected 2027',
      '3 Completed Internships'
    ],
    stats: [
      { label: "CGPA", value: '8.72', sublabel: "B.Tech Computer Science" },
      { label: 'Internships', value: '03', sublabel: "Web development and Java" },
      { label: "Projects", value: '05', sublabel: "Web applications and AI" },
      { label: "Graduation", value: '2027', sublabel: "MANUU, Hyderabad" },
    ]
  },
  about: {
    title: 'ABOUT ME',
    subtitle: "My background and what I’m working on",
    bio: "I'm studying Computer Science and Engineering at MANUU in Hyderabad. Through coursework, personal projects, and three internships, I've worked with React, Node.js, MongoDB, and Java. I enjoy building interfaces, connecting them to backend services, and working through the problems that come up along the way.",
    narrationScript: "Hi, I'm Sana Fatma. I'm studying Computer Science and Engineering at MANUU and expect to graduate in 2027. I've completed three internships in web development and Java programming. My projects include AURA, a voice assistant, and SnapShoes, an e-commerce application. You can read about my work below or get in touch to discuss an opportunity.",
    highlights: [
      {
        title: "Web development",
        description: "I build React interfaces and connect them to Express APIs and MongoDB.",
        icon: 'Layers'
      },
      {
        title: "AI projects",
        description: "I use language model APIs and browser speech tools in voice assistant projects.",
        icon: 'Brain'
      },
      {
        title: "Programming",
        description: "I practise data structures and algorithms in C, C++, and Java.",
        icon: 'Code'
      }
    ]
  },
  skills: [
    {
      id: 'frontend',
      category: "Frontend development",
      tag: 'UI & Interactivity',
      featured: false,
      description: "Building responsive interfaces with React, JavaScript, and CSS.",
      items: [
        { name: 'HTML5', icon: 'Code', focus: 'Semantic markup & Accessibility' },
        { name: 'CSS3', icon: 'Palette', focus: 'Modern styling & Animations' },
        { name: 'JavaScript (ES6+)', icon: 'Terminal', focus: 'DOM, Async, Event-Driven' },
        { name: 'React.js', icon: 'Atom', focus: 'Hooks, State & Component Design' },
        { name: 'Angular', icon: 'Shield', focus: 'Enterprise structural patterns' },
        { name: 'Tailwind CSS', icon: 'Wind', focus: 'Utility-first rapid design' },
        { name: 'Responsive Design', icon: 'Smartphone', focus: 'Mobile-first breakpoints' }
      ]
    },
    {
      id: 'data-ai',
      category: 'Data & Artificial Intelligence',
      tag: "AI & data",
      featured: true, // This card renders in warm cream surface with molten accents!
      description: "Working with language model APIs, Python, and data analysis tools.",
      items: [
        { name: 'LLM APIs', icon: 'Sparkles', focus: 'Model prompt integration & orchestration' },
        { name: 'Generative AI', icon: 'Brain', focus: 'Conversational agent architecture' },
        { name: 'NumPy', icon: 'Binary', focus: 'Array & mathematical computing' },
        { name: 'Pandas', icon: 'Database', focus: 'Structured dataset manipulation' },
        { name: 'Matplotlib & Seaborn', icon: 'BarChart', focus: 'Insightful data visual storytelling' },
        { name: 'Foundational ML', icon: 'Cpu', focus: 'Supervised concepts & data modeling' }
      ]
    },
    {
      id: 'backend',
      category: 'Backend & Databases',
      tag: 'Server & Storage',
      featured: false,
      description: "Building Express APIs and connecting them to MongoDB.",
      items: [
        { name: 'Node.js', icon: 'Server', focus: 'Asynchronous event runtime' },
        { name: 'Express.js', icon: 'Workflow', focus: 'Robust routing & middleware' },
        { name: 'MongoDB', icon: 'HardDrive', focus: 'NoSQL document models & aggregation' },
        { name: 'REST APIs', icon: 'Network', focus: 'Clean HTTP contract design' },
        { name: 'Git & GitHub', icon: 'GitBranch', focus: 'Version control & team workflows' },
        { name: 'VS Code', icon: 'Terminal', focus: 'Development workflow environment' }
      ]
    },
    {
      id: 'programming',
      category: 'Programming & Core Concepts',
      tag: 'Computer Science Core',
      featured: false,
      description: "Practising algorithms and object-oriented programming.",
      items: [
        { name: 'Java', icon: 'Coffee', focus: 'OOP (Encapsulation, Polymorphism)' },
        { name: 'C / C++', icon: 'Binary', focus: 'Memory, pointers & low-level concepts' },
        { name: 'Python', icon: 'FileCode', focus: 'Scripting, tooling & data workflows' },
        { name: 'Data Structures & Algorithms', icon: 'GitMerge', focus: 'Efficiency, search, sort, graphs' },
        { name: 'OOP Principles', icon: 'Box', focus: 'Design patterns & clean code' }
      ]
    }
  ],
  projects: [
    {
      id: 'aura-voice-assistant',
      title: 'AURA — Personalized AI Voice Assistant',
      subtitle: "Voice assistant with React and Node.js",
      type: 'Personal Project',
      status: 'Ongoing',
      category: 'Artificial Intelligence & Full-Stack',
      featured: true,
      description: "A voice assistant for spoken questions, notes, reminders, and weather updates.",
      longDescription: "I built AURA to handle spoken requests, save notes and reminders, and answer questions. It connects a React interface to an Express backend, language model APIs, and MongoDB.",
      challenge: "Keeping each user's saved notes separate.",
      result: "Notes are stored with a user ID. The API scopes reading, editing, and deleting notes to the signed-in user.",
      technologies: ['React.js', 'Vite', 'Tailwind CSS', 'Node.js', 'Express.js', 'MongoDB', 'LLM API', 'Axios', 'Web Speech API'],
      features: [
        "Spoken questions and responses",
        "Notes, reminders, and weather updates",
        "React frontend connected to Express APIs",
        "Saved preferences and conversation history",
        "MongoDB storage",
        "Responsive React interface"
      ],
      plannedFeatures: [
        "Multilingual voice support",
        "Email and calendar integration",
        "Smart-home controls"
      ],
      architecture: [
        "React handles voice input and displays responses.",
        "Express sends requests to the language model API.",
        "MongoDB stores notes, reminders, and preferences.",
        "Axios connects the frontend to the backend."
      ],
      githubUrl: 'https://github.com/Sunshine9693',
      liveUrl: '',
      imageUrl: '/images/hero.png'
    },
    {
      id: 'snapshoes-ecommerce',
      title: 'SnapShoes — Full-Stack E-Commerce Web App',
      subtitle: "Footwear shopping application",
      type: 'Personal Project',
      status: 'Ongoing',
      category: 'Frontend & E-Commerce',
      featured: false,
      description: "I'm building a shoe-shopping interface with product listings, a cart, a wishlist, and sign-in pages.",
      longDescription: "SnapShoes is an ongoing React project. My focus is the frontend: browsing and filtering products, managing a cart and wishlist, and building the account and checkout screens.",
      challenge: "Keeping cart quantities and totals consistent as items change.",
      result: "Shared React state tracks the cart, totals are calculated from its items, and local storage keeps the cart between visits.",
      technologies: ['React.js', 'JavaScript (ES6+)', 'Tailwind CSS', 'Responsive UI'],
      features: [
        "Product listings and detail pages",
        "Shopping cart and wishlist",
        "Sign-in and registration screens",
        "Responsive layouts for phones and desktops"
      ],
      plannedFeatures: [
        "Payment integration",
        "Order tracking and inventory updates"
      ],
      architecture: [
        "React components for products, cart, and account screens.",
        "Shared state keeps the cart in sync across pages.",
        "Tailwind CSS handles the responsive layouts."
      ],
      githubUrl: 'https://github.com/Sunshine9693',
      liveUrl: '',
      imageUrl: '/images/hero.png'
    },
    {
      id: 'hostel-allocation-system',
      title: 'Automated Hostel Allocation System',
      subtitle: "Academic group project",
      type: 'College Group Project',
      status: 'Completed',
      category: 'Database & Systems',
      featured: false,
      description: "A group project that assigns hostel rooms using student applications, available capacity, and allocation rules.",
      longDescription: "Built with a team at MANUU, this project brings student applications and hostel room allocation into one system. Students can apply for rooms, and administrators can review and manage allotments.",
      challenge: "Connecting the application screens, backend APIs, and database.",
      result: "The project connects student applications and room-allotment data through a shared API and database workflow.",
      technologies: ['HTML5', 'CSS3', 'JavaScript', 'Database Integration', 'Algorithmic Allocation Logic'],
      features: [
        "Student applications and eligibility checks",
        "Dashboard for room allotments",
        "Connected application forms and database",
        "Room assignments based on allocation rules"
      ],
      plannedFeatures: [
        "SMS notifications for room assignments"
      ],
      architecture: [
        "Students apply through a web form.",
        "A database stores applications and room availability.",
        "Allocation rules determine room assignments."
      ],
      githubUrl: 'https://github.com/Sunshine9693',
      liveUrl: '',
      imageUrl: '/images/hero.png'
    },
    {
      id: 'task-management-system',
      title: 'Intelligent Task Management System',
      subtitle: "Task list with priorities",
      type: 'Personal Project',
      status: 'Completed',
      category: 'Web Application',
      featured: false,
      description: "A JavaScript task manager that sorts tasks by priority and saves them in the browser.",
      longDescription: "I built this task manager with JavaScript, HTML, and CSS to practise DOM updates and local storage. Tasks can be organised by priority and remain saved after the page is closed.",
      challenge: "Keeping tasks and their priorities after a page refresh.",
      result: "Tasks are saved in local storage, restored on load, and sorted by priority and due date.",
      technologies: ['Vanilla JavaScript (ES6+)', 'HTML5', 'CSS3', 'Local Storage API'],
      features: [
        "Urgent, high, and normal priorities",
        "Updates without reloading the page",
        "Tasks saved in browser local storage",
        "Separate code for data, display, and events"
      ],
      plannedFeatures: [
        "Task categories and deadline reminders"
      ],
      architecture: [
        "JavaScript handles tasks, page updates, and user actions.",
        "Local storage saves changes when tasks are added, edited, or removed."
      ],
      githubUrl: 'https://github.com/Sunshine9693',
      liveUrl: '',
      imageUrl: '/images/hero.png'
    },
    {
      id: 'music-player-spotify-clone',
      title: 'User Interaction-Based Music Player',
      subtitle: "Web music player",
      type: 'Personal Project',
      status: 'Completed',
      category: 'Audio & Interactive UI',
      featured: false,
      description: "A browser music player with playlists, track seeking, and volume controls.",
      longDescription: "I built this player to practise the HTML audio API and JavaScript events. It includes a seek bar, track queue, playback status, and volume controls.",
      challenge: "Keeping the seek bar and play/pause controls in sync with the audio.",
      result: "Audio events update the seek bar, and seeking or changing tracks updates the playback position and controls.",
      technologies: ['HTML5 Audio API', 'CSS3 Animations', 'JavaScript ES6+', 'Event Handling'],
      features: [
        "Seek bar with playback time",
        "Playlists and a track queue",
        "Playback status and volume controls",
        "Controls that work on mobile"
      ],
      plannedFeatures: [
        "Audio visualiser and synced lyrics"
      ],
      architecture: [
        "HTML audio events track playback and song changes.",
        "JavaScript updates the seek bar and playback controls."
      ],
      githubUrl: 'https://github.com/Sunshine9693',
      liveUrl: '',
      imageUrl: '/images/hero.png'
    }
  ],
  internships: [
    {
      id: 'acmegrade',
      company: 'Acmegrade',
      role: 'Web Development Intern',
      period: 'Jul 2024 - Aug 2024',
      startDate: 'July 2024',
      endDate: 'August 2024',
      location: 'Remote',
      highlights: [
        'Built responsive web pages with HTML5 and CSS3, ensuring consistent rendering across desktop and mobile breakpoints.',
        'Partnered with senior developers to build and refine reusable UI components for client-facing projects.',
        'Applied web accessibility guidelines (WCAG) and agile workflow practices in a collaborative team setting.'
      ],
      technologies: ['HTML5', 'CSS3', 'JavaScript', 'Responsive Design', 'Agile']
    },
    {
      id: 'codealpha',
      company: 'CodeAlpha',
      role: 'Java Programming Intern',
      period: 'Jun 2024 - Jul 2024',
      startDate: 'June 2024',
      endDate: 'July 2024',
      location: 'Remote',
      highlights: [
        'Built multiple Java mini-projects applying core OOP principles (encapsulation, inheritance, polymorphism, abstraction).',
        'Solved algorithmic challenges to strengthen problem-solving efficiency and runtime optimization.',
        'Took part in peer code reviews, improving code readability, exception handling, and documentation practices.'
      ],
      technologies: ['Java', 'OOP', 'Data Structures', 'Algorithmic Problem Solving', 'Code Reviews']
    },
    {
      id: 'remarkskill',
      company: 'Remarkskill Education',
      role: 'Web Development Intern',
      period: 'Jun 2024 - Jul 2024',
      startDate: 'June 2024',
      endDate: 'July 2024',
      location: 'Remote',
      highlights: [
        'Delivered live web development projects under mentorship, following a real-world development workflow.',
        'Designed and deployed mobile-first, responsive interfaces tailored for optimal touch-screen navigation.',
        'Worked across the full project lifecycle from initial requirements gathering to final quality delivery.'
      ],
      technologies: ['HTML5', 'CSS3', 'Mobile-First Design', 'JavaScript', 'Client Delivery']
    }
  ],
  education: {
    degree: 'B.Tech in Computer Science & Engineering',
    university: 'Maulana Azad National Urdu University (MANUU)',
    location: 'Hyderabad, India',
    expectedGraduation: '2027',
    cgpa: '8.72',
    keyAreas: [
      'Data Structures & Algorithms',
      'Object-Oriented Programming (Java & C++)',
      'Database Management Systems & SQL',
      'Web Development & Modern Full-Stack Technologies',
      'Artificial Intelligence & Foundational Machine Learning'
    ]
  },
  achievements: [
    {
      id: 'cgpa',
      title: "Academic progress",
      metric: '8.72 CGPA',
      tag: 'Academic Track Record',
      description: 'Maintained a cumulative grade point average above 8.5 throughout the B.Tech CSE program at MANUU.',
      link: ''
    },
    {
      id: 'triple-internship',
      title: "Three internships",
      metric: '3 Internships',
      tag: "Web development and Java",
      description: "Completed three internships in web development and Java programming.",
      link: ''
    },
    {
      id: 'ssoc-contributor',
      title: 'Open Source Contributor — SSoC',
      metric: 'SSoC Contributor',
      tag: 'Developer Community',
      description: "Contributed documentation, guides, and translations through Social Summer of Code.",
      link: ''
    },
    {
      id: 'react-hyd',
      title: 'React Hyderabad Community',
      metric: 'Volunteer Member',
      tag: 'Tech Community',
      description: "Volunteer with React Hyderabad, taking part in meetups and technical sessions.",
      link: ''
    },
    {
      id: 'active-github',
      title: "Personal projects",
      metric: '5+ Projects',
      tag: 'Open Code',
      description: "My GitHub includes a voice assistant, web applications, and JavaScript projects.",
      link: 'https://github.com/Sunshine9693'
    }
  ],
  certificates: [
    {
      id: 'ibm-genai',
      title: 'Generative AI Completion Certificate',
      issuer: 'IBM SkillsBuild',
      date: 'August 2026',
      credentialUrl: '',
      fileUrl: '/certificates/ibm_genai.pdf',
      description: "Coursework in generative AI, prompting, language models, and responsible use.",
      verified: true
    },
    {
      id: 'ibm-github',
      title: 'Git and GitHub Mastery Certificate',
      issuer: 'IBM SkillsBuild',
      date: 'August 2026',
      credentialUrl: '',
      fileUrl: '/certificates/ibm_github.pdf',
      description: "Coursework in Git, branches, collaboration, and resolving merge conflicts.",
      verified: true
    },
    {
      id: 'neo4j-graph',
      title: 'Neo4j Graph Database Certification',
      issuer: 'Neo4j GraphAcademy',
      date: 'September 2026',
      credentialUrl: '',
      fileUrl: '/certificates/neo4j_cert.pdf',
      description: "Coursework in graph databases, Cypher queries, and data modelling.",
      verified: true
    }
  ],
  gallery: [
    {
      id: 'sana-prof',
      title: 'Sana Fatma — Developer Portrait',
      type: 'photo',
      url: '/images/sana_portrait.jpg',
      caption: 'Final-year Computer Science and Engineering student at MANUU.',
      category: 'Portrait'
    },
    {
      id: 'aura-preview',
      title: 'AURA AI Voice Assistant Interface',
      type: 'photo',
      url: '/images/hero.png',
      caption: 'Full-stack conversational assistant connecting voice input with LLM intelligence.',
      category: 'Projects'
    }
  ],
  socialLinks: {
    email: 'sanathesunshine9693@gmail.com',
    phone: '+91 7479895668',
    location: 'India',
    github: 'https://github.com/Sunshine9693',
    linkedin: 'https://www.linkedin.com/in/sana-fatma-a00b49294/'
  },
  sectionVisibility: {
    about: true,
    skills: true,
    projects: true,
    experience: true,
    education: true,
    achievements: true,
    certificates: true,
    gallery: true,
    contact: true,
    aiAssistant: true
  }
};
