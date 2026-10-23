import mongoose from 'mongoose';

const portfolioDataSchema = new mongoose.Schema({
  version: {
    type: Number,
    default: 1,
  },
  hero: {
    name: { type: String, default: 'Sana Fatma' },
    headline: { type: String, default: 'BUILDING IDEAS INTO INTELLIGENT EXPERIENCES.' },
    supportingCopy: { type: String, default: 'Computer Science undergraduate exploring web development, software engineering, and AI-powered applications.' },
    roles: [{ type: String }],
    portraitUrl: { type: String, default: '/images/sana_portrait.jpg' },
    resumeUrl: { type: String, default: '/Sana_Fatma_Resume.pdf' },
    badges: [{ type: String }],
    stats: [
      { label: String, value: String, sublabel: String }
    ]
  },
  about: {
    title: { type: String, default: 'ABOUT ME' },
    subtitle: { type: String, default: 'Bridging Frontend Craftsmanship with AI Innovation' },
    bio: { type: String, default: "I'm Sana Fatma, a Computer Science and Engineering undergraduate passionate about building responsive web applications and exploring AI-powered experiences. Through personal projects, academic work, and three internships, I've been developing practical skills across frontend development, backend integration, databases, and Java programming. I enjoy turning ideas into functional products while continuously improving my problem-solving skills." },
    narrationScript: { type: String, default: "Hello, and welcome! I am Sana Fatma, a Computer Science and Engineering undergraduate passionate about crafting responsive web applications and exploring AI-powered experiences. Through my academic work, five projects including AURA, and three internships across web development and Java programming, I turn creative ideas into reliable, intelligent digital products." },
    highlights: [
      { title: String, description: String, icon: String }
    ]
  },
  skills: [
    {
      id: String,
      category: String,
      tag: String,
      featured: Boolean,
      description: String,
      items: [
        { name: String, icon: String, focus: String }
      ]
    }
  ],
  projects: [
    {
      id: String,
      title: String,
      subtitle: String,
      type: String, // 'Personal Project', 'College Group Project'
      status: String, // 'Ongoing', 'Completed'
      category: String,
      featured: Boolean,
      description: String,
      longDescription: String,
      technologies: [String],
      features: [String],
      plannedFeatures: [String],
      architecture: [String],
      githubUrl: String,
      liveUrl: String,
      imageUrl: String,
    }
  ],
  internships: [
    {
      id: String,
      company: String,
      role: String,
      period: String,
      startDate: String,
      endDate: String,
      location: String,
      highlights: [String],
      technologies: [String],
    }
  ],
  education: {
    degree: { type: String, default: 'B.Tech in Computer Science and Engineering' },
    university: { type: String, default: 'Maulana Azad National Urdu University (MANUU)' },
    location: { type: String, default: 'Hyderabad, India' },
    expectedGraduation: { type: String, default: '2027' },
    cgpa: { type: String, default: '8.72' },
    keyAreas: [String],
  },
  achievements: [
    {
      id: String,
      title: String,
      description: String,
      metric: String,
      tag: String,
      link: String,
    }
  ],
  certificates: [
    {
      id: String,
      title: String,
      issuer: String,
      date: String,
      credentialUrl: String,
      fileUrl: String,
      fileType: String,
      description: String,
      verified: Boolean,
    }
  ],
  gallery: [
    {
      id: String,
      title: String,
      type: { type: String, enum: ['photo', 'video', 'certificate'], default: 'photo' },
      url: String,
      caption: String,
      category: String,
    }
  ],
  socialLinks: {
    email: { type: String, default: 'sanathesunshine9693@gmail.com' },
    phone: { type: String, default: '+91 7479895668' },
    location: { type: String, default: 'India' },
    github: { type: String, default: 'https://github.com' },
    linkedin: { type: String, default: 'https://linkedin.com' },
  },
  sectionVisibility: {
    about: { type: Boolean, default: true },
    skills: { type: Boolean, default: true },
    projects: { type: Boolean, default: true },
    experience: { type: Boolean, default: true },
    education: { type: Boolean, default: true },
    achievements: { type: Boolean, default: true },
    certificates: { type: Boolean, default: true },
    gallery: { type: Boolean, default: true },
    contact: { type: Boolean, default: true },
    aiAssistant: { type: Boolean, default: true },
  }
}, { timestamps: true });

export const PortfolioData = mongoose.model('PortfolioData', portfolioDataSchema);
