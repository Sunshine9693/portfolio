import { defaultPortfolioData } from '../data/defaultPortfolioData.js';

// Strict grounding knowledge context
const KNOWLEDGE_BASE = `
You are the official Portfolio AI Assistant for Sana Fatma.
Your role is to help visitors, recruiters, and collaborators learn accurately about Sana Fatma's background, projects, skills, education, and experience.

CRITICAL INSTRUCTIONS & ACCURACY RULES:
1. ONLY provide facts verified from Sana's resume and portfolio. NEVER invent or exaggerate skills, work experience, awards, certifications, or metrics.
2. If a visitor asks about something not in this knowledge base, politely state that the information is not currently documented in Sana's profile and recommend contacting her directly via email (sanathesunshine9693@gmail.com) or phone (+91 7479895668).
3. Always maintain a polite, articulate, professional, and helpful tone reflecting Sana's personal brand (dark, technical, high-craft).

VERIFIED PROFILE INFORMATION:
- Name: Sana Fatma
- Role: Computer Science and Engineering Undergraduate, Web Developer, AI Enthusiast
- Location: India
- Email: sanathesunshine9693@gmail.com
- Phone: +91 7479895668
- Degree: B.Tech in Computer Science and Engineering
- University: Maulana Azad National Urdu University (MANUU), Hyderabad, India
- Expected Graduation: 2027
- Current CGPA: 8.72 (Maintained above 8.5 consistently throughout her degree)

TECHNICAL SKILLS:
- Languages: C, C++, Java, Python
- Web Development: HTML5, CSS3, JavaScript (ES6+), React.js, Angular, Tailwind CSS, Node.js, Express.js
- Core CS Concepts: Data Structures & Algorithms, Object-Oriented Programming (OOP), DOM Manipulation, Event-Driven Programming, Responsive Design
- Databases & Tools: MongoDB, Git & GitHub, VS Code, REST APIs
- Data & AI: LLM APIs, NumPy, Pandas, Matplotlib, Seaborn, Generative AI, foundational Machine Learning concepts

INTERNSHIP EXPERIENCES (3 completed):
1. Acmegrade (Jul 2024 - Aug 2024) — Web Development Intern: Built responsive web pages with HTML5/CSS3, collaborated on reusable UI components, followed accessibility standards and agile workflows.
2. CodeAlpha (Jun 2024 - Jul 2024) — Java Programming Intern: Developed Java mini-projects implementing core OOP (encapsulation, inheritance, polymorphism), solved algorithmic challenges, and participated in peer code reviews.
3. Remarkskill Education (Jun 2024 - Jul 2024) — Web Development Intern: Mentored live web development projects, crafted mobile-first interfaces, and contributed across project requirements, coding, and delivery.

DOCUMENTED PROJECTS (5 total):
1. AURA — Personalized AI Voice Assistant (Personal Project, Ongoing):
   - Tech: React.js, Vite, Tailwind CSS, Node.js, Express.js, MongoDB, LLM API, Web Speech API, Axios.
   - Features: Natural language conversation, voice-based task interaction, notes, reminders, weather updates, information retrieval, user data persistence in MongoDB.
   - Future Planned Features: Multilingual translation, calendar integration, smart-home IoT.
2. SnapShoes — Full-Stack E-Commerce Web Application (Personal Project, Ongoing):
   - Tech: React.js, JavaScript, Tailwind CSS.
   - Features: Product listing, detailed product views, interactive cart, wishlist, login and registration UI flows, responsive layout.
3. Automated Hostel Allocation System (College Group Project, MANUU, Completed):
   - Features: Database-driven student allocation workflow, admin management panel, constraint-based fair allocation logic to eliminate manual seat allotment effort.
4. Intelligent Task Management System (Personal Project, Completed):
   - Tech: Vanilla JavaScript, HTML5, CSS3, LocalStorage API.
   - Features: Dynamic task prioritization, instant real-time UI updates, persistent local storage, modular code structure.
5. User Interaction-Based Music Player / Spotify Clone (Personal Project, Completed):
   - Tech: HTML5 Audio, JavaScript ES6+, CSS3.
   - Features: Custom interactive seek bar, dynamic playlist management, audio playback feedback, mobile-friendly navigation.

ACHIEVEMENTS & ENGAGEMENT:
- Maintained CGPA > 8.5 (Current: 8.72)
- Completed 3 technical internships in a single academic year
- Contributor at Social Summer of Code (SSoC) — technical content and developer guides
- Volunteer Member of React Hyderabad Community
- Actively maintains open-source repositories on GitHub

CERTIFICATIONS:
- IBM SkillsBuild — Generative AI Completion Certificate
- IBM SkillsBuild — Git and GitHub Completion Certificate
- Neo4j GraphAcademy — Graph Database Certification
`;

// Helper for local grounded fallback
const generateGroundedFallbackResponse = (query) => {
  const q = query.toLowerCase();

  if (q.includes('skill') || q.includes('stack') || q.includes('tech') || q.includes('language') || q.includes('react') || q.includes('python') || q.includes('java')) {
    return {
      text: "Sana Fatma possesses a strong technical foundation spanning full-stack web development and core computer science:\n\n• **Languages:** C, C++, Java, and Python.\n• **Frontend:** React.js, Angular, JavaScript (ES6+), HTML5, CSS3, and Tailwind CSS.\n• **Backend & Databases:** Node.js, Express.js, MongoDB, and REST APIs.\n• **Data & AI:** LLM APIs, Generative AI concepts, NumPy, Pandas, Matplotlib, Seaborn, and foundational Machine Learning.\n• **Core CS:** Data Structures & Algorithms, OOP principles, and responsive design.",
      sectionLink: '#skills',
      sectionName: 'Explore Skills Section'
    };
  }

  if (q.includes('aura') || q.includes('project') || q.includes('voice assistant') || q.includes('work') || q.includes('snapshoe')) {
    return {
      text: "Sana has 5 documented projects with **AURA** as her flagship AI innovation:\n\n1. **AURA — Personalized AI Voice Assistant** (Ongoing): React.js, Node.js, Express, MongoDB, and LLM APIs for voice-enabled notes, reminders, weather, and conversational intelligence.\n2. **SnapShoes** (Ongoing): Full-stack e-commerce shoe store with cart, wishlist, and product exploration.\n3. **Automated Hostel Allocation System**: College group project with constraint-based fairness algorithms.\n4. **Intelligent Task Manager**: Modular vanilla JavaScript task organizer with LocalStorage.\n5. **Music Player (Spotify Clone)**: Custom audio scrubber and playlist manager.",
      sectionLink: '#projects',
      sectionName: 'View Projects Section'
    };
  }

  if (q.includes('intern') || q.includes('experience') || q.includes('acmegrade') || q.includes('codealpha') || q.includes('remarkskill')) {
    return {
      text: "Sana completed **three internships** during 2024:\n\n• **Acmegrade** (Jul 2024 - Aug 2024): Web Development Intern — Built responsive web pages and reusable UI components with accessibility standards.\n• **CodeAlpha** (Jun 2024 - Jul 2024): Java Programming Intern — Developed Java mini-projects with core OOP and engaged in peer code reviews.\n• **Remarkskill Education** (Jun 2024 - Jul 2024): Web Development Intern — Built mobile-first responsive web apps under mentorship.",
      sectionLink: '#experience',
      sectionName: 'View Experience Timeline'
    };
  }

  if (q.includes('education') || q.includes('cgpa') || q.includes('university') || q.includes('college') || q.includes('degree') || q.includes('manuu') || q.includes('grade')) {
    return {
      text: "Sana is pursuing her **B.Tech in Computer Science and Engineering** at **Maulana Azad National Urdu University (MANUU)**, Hyderabad, India.\n\n• **Expected Graduation:** 2027\n• **Current CGPA:** **8.72** (consistently maintained above 8.5 throughout her degree)\n• **Key coursework:** Data Structures & Algorithms, OOP, Database Systems, Web Engineering, and Artificial Intelligence.",
      sectionLink: '#education',
      sectionName: 'View Education Section'
    };
  }

  if (q.includes('contact') || q.includes('email') || q.includes('phone') || q.includes('hire') || q.includes('reach') || q.includes('resume')) {
    return {
      text: "You can reach Sana Fatma directly through:\n\n• **Email:** sanathesunshine9693@gmail.com\n• **Phone:** +91 7479895668\n• **Location:** India\n• **Resume:** Available for direct download via the navigation and hero section.\n\nFeel free to send a message using the Contact section form!",
      sectionLink: '#contact',
      sectionName: 'Jump to Contact Form'
    };
  }

  if (q.includes('certificate') || q.includes('cert') || q.includes('ibm') || q.includes('neo4j')) {
    return {
      text: "Sana holds verified certifications in:\n\n• **IBM SkillsBuild:** Generative AI Completion Certificate (August 2026)\n• **IBM SkillsBuild:** Git and GitHub Mastery (August 2026)\n• **Neo4j GraphAcademy:** Graph Database Certification (September 2026)\n\nYou can inspect these credentials in the Certificates & Media gallery.",
      sectionLink: '#gallery',
      sectionName: 'View Certificates Gallery'
    };
  }

  return {
    text: "Sana Fatma is a final-year B.Tech Computer Science student at MANUU (CGPA 8.72) specializing in full-stack web development and AI-powered applications. She has built 5 documented projects including the AURA AI Voice Assistant and completed 3 industry internships.\n\nHow can I help you explore her skills, projects, or background?",
    sectionLink: '#about',
    sectionName: 'Read About Sana'
  };
};

export const chatWithAssistant = async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Message cannot be empty.' });
    }

    if (message.length > 500) {
      return res.status(400).json({ success: false, message: 'Message is too long. Please limit to 500 characters.' });
    }

    const geminiKey = process.env.GEMINI_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    // Check if an external LLM key is configured
    if (geminiKey) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: `${KNOWLEDGE_BASE}\n\nVisitor Question: ${message.trim()}` }]
              }
            ],
            generationConfig: {
              temperature: 0.2,
              maxOutputTokens: 500,
            }
          })
        });

        const data = await response.json();
        if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
          return res.json({
            success: true,
            reply: data.candidates[0].content.parts[0].text,
            isLiveLLM: true,
            model: 'Gemini 1.5 Flash'
          });
        }
      } catch (llmErr) {
        console.warn('Gemini API call failed, falling back to local grounded knowledge:', llmErr.message);
      }
    }

    if (openaiKey) {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openaiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: KNOWLEDGE_BASE },
              { role: 'user', content: message.trim() }
            ],
            temperature: 0.2,
            max_tokens: 400
          })
        });

        const data = await response.json();
        if (data.choices && data.choices[0]?.message?.content) {
          return res.json({
            success: true,
            reply: data.choices[0].message.content,
            isLiveLLM: true,
            model: 'GPT-4o-mini'
          });
        }
      } catch (llmErr) {
        console.warn('OpenAI API call failed, falling back to local grounded knowledge:', llmErr.message);
      }
    }

    // Explicit fallback grounded in verified data when no API key is present
    const fallback = generateGroundedFallbackResponse(message);
    return res.json({
      success: true,
      reply: fallback.text,
      sectionLink: fallback.sectionLink,
      sectionName: fallback.sectionName,
      isLiveLLM: false,
      infoNotice: 'Grounded Assistant active. Configure GEMINI_API_KEY in server/.env for external LLM inference.'
    });

  } catch (error) {
    console.error('chatWithAssistant error:', error);
    return res.status(500).json({ success: false, message: 'Assistant temporary error. Please try again.' });
  }
};
