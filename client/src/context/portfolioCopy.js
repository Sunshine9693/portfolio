// Exact matches update legacy starter wording while preserving custom portfolio text.
const legacyCopy = {
  "BUILDING IDEAS INTO INTELLIGENT EXPERIENCES.": "I build web applications and work with AI.",
  "Computer Science undergraduate exploring web development, software engineering, and AI-powered applications.": "I'm a Computer Science student at MANUU, graduating in 2027. My work includes React applications, backend services, and a voice assistant built with language model APIs.",
  "Bridging Frontend Craftsmanship with AI Innovation": "My background and what I’m working on",
  "I'm Sana Fatma, a Computer Science and Engineering undergraduate passionate about building responsive web applications and exploring AI-powered experiences. Through personal projects, academic work, and three internships, I've been developing practical skills across frontend development, backend integration, databases, and Java programming. I enjoy turning ideas into functional products while continuously improving my problem-solving skills.": "I'm studying Computer Science and Engineering at MANUU in Hyderabad. Through coursework, personal projects, and three internships, I've worked with React, Node.js, MongoDB, and Java. I enjoy building interfaces, connecting them to backend services, and working through the problems that come up along the way.",
  "Hello, and welcome! I am Sana Fatma, a Computer Science and Engineering undergraduate passionate about crafting responsive web applications and exploring AI-powered experiences. Through my academic work, five projects including AURA, and three internships across web development and Java programming, I turn creative ideas into reliable, intelligent digital products.": "Hi, I'm Sana Fatma. I'm studying Computer Science and Engineering at MANUU and expect to graduate in 2027. I've completed three internships in web development and Java programming. My projects include AURA, a voice assistant, and SnapShoes, an e-commerce application. You can read about my work below or get in touch to discuss an opportunity.",
  "Building thoughtful software and exploring intelligent experiences.": "I build web applications and work with AI.",
  "Academic CGPA": "CGPA",
  "Consistent >8.5": "B.Tech Computer Science",
  "Industry Experience": "Web development and Java",
  "Documented Projects": "Projects",
  "AI & Web Solutions": "Web applications and AI",
  "Expected Year": "Graduation",
  "B.Tech CSE MANUU": "MANUU, Hyderabad",
  "Voice-Driven Full-Stack Productivity Assistant": "Voice assistant with React and Node.js",
  "Modern Footwear Catalog & Cart Experience": "Footwear shopping application",
  "Fairness-Driven Academic Group Solution": "Academic group project",
  "Leveraging LLM APIs, Generative AI architectures, and Python data tooling for practical analytics and smart automation.": "Working with language model APIs, Python, and data analysis tools.",
  "Architecting RESTful services, integrating persistent NoSQL databases, and managing secure API endpoints.": "Building REST APIs with Node.js and Express, and storing data in MongoDB.",
  "Strengthening algorithmic efficiency, modular object-oriented programming, and low-level memory concepts.": "Practising algorithms, object-oriented programming, and memory management.",
  "Building responsive, accessible user interfaces with clean component architectures, modern CSS, and state management.": "Building responsive interfaces with React, JavaScript, and CSS."
};
export function updatePortfolioCopy(value) {
  if (typeof value === 'string') return legacyCopy[value] ?? value;
  if (Array.isArray(value)) return value.map(updatePortfolioCopy);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, updatePortfolioCopy(item)]));
  return value;
}
