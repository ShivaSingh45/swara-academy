export interface Facility {
  id: string;
  title: string;
  description: string;
  icon: string;
  subtopics: string[];
}

export interface Birthday {
  id: string;
  name: string;
  date: string;
  grade: string;
  avatar: string;
}

export interface SchoolEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  category: "academic" | "sports" | "celebration" | "creative";
  description: string;
}

export interface Circular {
  id: string;
  title: string;
  date: string;
  priority: "High" | "Normal";
  content: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface Achievement {
  id: string;
  title: string;
  score: string;
  description: string;
  date: string;
}

export interface Faculty {
  id: string;
  name: string;
  role: string;
  photo: string;
  review: string;
  experience: string;
}

export interface BeyondAcademic {
  id: string;
  title: string;
  description: string;
  icon: string;
  activities: string[];
}

export interface GalleryMedia {
  id: string;
  type: "image" | "video";
  url: string;
  title: string;
  approved: boolean; // Managed by principal
  source: "default" | "user";
  topic?: string; // e.g. "Smart Playroom", "Playground", "Montessori Activity"
}

export interface SchoolData {
  name: string;
  logoText: string;
  logoDescription: string;
  logoImg?: string; // custom base64 or URL
  tagline: string;
  welcomeIntro: string;
  admissionBanner: {
    show: boolean;
    title: string;
    description: string;
    actionText: string;
    deadline: string;
    contactPhone: string;
  };
  mission: {
    heading: string;
    description: string;
    pillars: string[];
  };
  philosophies: {
    director: {
      name: string;
      role: string;
      photo: string;
      message: string;
    };
    principal: {
      name: string;
      role: string;
      photo: string;
      message: string;
    };
  };
  facilities: Facility[];
  birthdays: Birthday[];
  events: SchoolEvent[];
  circulars: Circular[];
  faqs: FAQ[];
  achievements: Achievement[];
  faculties: Faculty[];
  beyondAcademics: BeyondAcademic[];
  gallery?: GalleryMedia[];
  heroImages?: string[]; // Numerous background images of school
  contact: {
    address: string;
    phone: string;
    email: string;
    workingHours: string;
    mapLocationQuery: string;
    mapEmbedCode: string; // fallback if map embedding
  };
  themeDesign: {
    primaryColor: string; // Tailwind tint e.g. blue-600
    themeVibe: "vibrant" | "pastel" | "cosmic" | "indigo" | "teal" | "emerald" | "crimson" | "violet" | "amber";
  };
}

export const DEFAULT_SCHOOL_DATA: SchoolData = {
  name: "Swara Academy",
  logoText: "SWARA ACADEMY",
  logoDescription: "STATION ROAD BASTI (U.P.)",
  tagline: "Nurturing Curious Minds, Shaping Brighter Tomorrows",
  welcomeIntro: "Welcome to Swara Academy, where education meets playful discovery! Our multi-sensory curriculum, interactive classrooms, and expert mentors ignite standard excellence and moral leadership key to early childhood success.",
  admissionBanner: {
    show: true,
    title: "🎉 Pre-Admission Open for Academic Year 2026-27!",
    description: "Enroll your child in our smart interactive playgroup, nursery, or primary levels today. Limited childhood seats available with special sibling and early-bird fee concessions!",
    actionText: "Apply Online Now",
    deadline: "Admissions closing soon!",
    contactPhone: "+91 94541 XXXXX"
  },
  mission: {
    heading: "Our Vision & Mission",
    description: "To lay a sturdy foundation of critical thinking, physical coordination, and values of empathy and collaboration in toddlers. We blend state-of-the-art visual technology with time-tested instructional play styles.",
    pillars: [
      "100% Student-Centric Interactive Visual Classrooms",
      "Experiential Play-Way Coding and Arithmetic Systems",
      "Character Building and Value-Oriented Pre-Primary Guidance",
      "Safe and Monitored Campus with Live Nest Care Notifications"
    ]
  },
  philosophies: {
    director: {
      name: "Mr. Rajeev Kumar Sen",
      role: "Founder Director",
      photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=60",
      message: "At Swara Academy, we believe that children are not vessels to be filled, but fires to be ignited. Our objective is to guide them toward self-discovery in a dynamic, technology-rich environment that encourages curiosity."
    },
    principal: {
      name: "Mrs. Sneha Sen",
      role: "Academic Principal",
      photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=60",
      message: "Early childhood is the most crucial period for neurological development. By integrating Montessori techniques with visual gamification modules, we ensure that our pupils establish high cognitive agility while having immense joy."
    }
  },
  facilities: [
    {
      id: "fac-1",
      title: "Flex Smart Classrooms",
      description: "Interactive visual smart boards that respond to touch and custom pointer pens, rendering digital storybooks and physics-lite game-world problems in high definition.",
      icon: "Tv",
      subtopics: ["Touch Interactive Screens", "Animated Storybooks", "3D Alphabet Visualizers", "Smart Learning Kits"]
    },
    {
      id: "fac-2",
      title: "Modern Toddler Play-Hub",
      description: "A soft, safe, AC-monitored playground filled with sensory building blocks, creative kinetic sand boxes, and visual shape allocators to build muscular dexterity.",
      icon: "Gamepad",
      subtopics: ["Kinetic Activity Pods", "Soft Safety Turf flooring", "Interactive Projection Floor", "Dexterity Building blocks"]
    },
    {
      id: "fac-3",
      title: "Experienced Pre-primary Mentors",
      description: "Certified and loving development specialists trained specifically in child psychology, speech therapy foundations, and empathetic non-violent communication.",
      icon: "GraduationCap",
      subtopics: ["Certified Montessori Mentors", "Speech Growth Specialist", "Individual Child Growth Tracking", "Child Safety Marshals"]
    },
    {
      id: "fac-4",
      title: "Co-Curricular Arts Club",
      description: "Unlocking hidden motor skills and musical notes from an early age through clay shaping, toddler music keyboard panels, and hand-painting workshops.",
      icon: "Paintbrush",
      subtopics: ["Glow Hand Painting", "Keyboard & Rhythm Panels", "Origami & Papercraft Art", "Clay Shape Casting"]
    }
  ],
  birthdays: [
    { id: "bday-1", name: "Aaradhya Shukla", date: "June 08", grade: "Nursery A", avatar: "👧" },
    { id: "bday-2", name: "Vihaan Mishra", date: "June 10", grade: "Kindergarten B", avatar: "👦" },
    { id: "bday-3", name: "Ananya Pandey", date: "June 12", grade: "Playgroup", avatar: "👧" },
    { id: "bday-4", name: "Kshitij Yadav", date: "June 15", grade: "Prep-I", avatar: "👦" }
  ],
  events: [
    {
      id: "evt-1",
      title: "Monsoon Splash & Magic Carnival",
      date: "2026-06-18",
      time: "09:30 AM - 01:00 PM",
      category: "celebration",
      description: "An absolute wonder-session with a professional illusionist, splash pool activities (with continuous parent monitoring) and organic fruit ice creams!"
    },
    {
      id: "evt-2",
      title: "Swara Olympiad Spark 2026",
      date: "2026-06-25",
      time: "10:00 AM - 12:30 PM",
      category: "academic",
      description: "A friendly math-blocks and shape-fitting puzzle challenge. Encourages analytical sequencing and rewards every single champion with stellar medals."
    },
    {
      id: "evt-3",
      title: "Inter-School Toddler Athletics Meet",
      date: "2026-07-02",
      time: "08:30 AM - 12:00 PM",
      category: "sports",
      description: "Sack races, coordinate balancing tracks, and basic soft hurdles. An delightful day of focus and motor reflex achievements!"
    }
  ],
  circulars: [
    {
      id: "circ-1",
      title: "Uniform Guidelines and Monsoon Footwear Advisory",
      date: "2026-06-05",
      priority: "Normal",
      content: "Parents are requested to send corporate-coded water-resistant anti-slip sandals with secure buckles during the rainy weeks. Standard white canvas socks can be skipped in case of high precipitation."
    },
    {
      id: "circ-2",
      title: "CRITICAL: Health Screening and Immunity Checkup Camp",
      date: "2026-06-02",
      priority: "High",
      content: "Swara Academy is conducting a pediatric wellness evaluation and dental checks for all prep levels in partnership with St. Mary Hospital on June 11. Kindly fill the sign-off sheet in the parent handbook."
    },
    {
      id: "circ-3",
      title: "Smart App Login IDs Distribution",
      date: "2026-05-28",
      priority: "Normal",
      content: "Web accounts for Swara Parent App are live. The admin office is distributing sealed envelopes with individual username codes and secure passkeys via children today."
    }
  ],
  faqs: [
    {
      id: "faq-1",
      question: "What is the student-to-teacher ratio at Swara Academy?",
      answer: "We strictly preserve a 10:1 child-to-mentor index for standard learning groups, accompanied by a dedicated sub-nurse/care nanny in each room to guarantee utmost physical support."
    },
    {
      id: "faq-2",
      question: "Are your campus classrooms sanitized and secure under camera feed?",
      answer: "Absolutely! There is 24/7 high-fidelity CCTV surveillance. Entry points are guarded by bio-scanners, and we carry out a triple-tier sanitation sweep of all hand toys, desk panels, and learning assets daily."
    },
    {
      id: "faq-3",
      question: "Can payments of fees be split into flexible quarters?",
      answer: "Yes, our parent desk facilitates easy division of seasonal academic terms into four automated installments, with secure instant online receipts via standard UPI, major cards, and bank transfer channels."
    },
    {
      id: "faq-4",
      question: "How do you assist children who are in slow speech or emotional transitions?",
      answer: "Our specialized speech specialist and interactive sensory audio systems offer gentle personalized pacing. We run collaborative empathy programs where every child transitions naturally without pressure."
    }
  ],
  achievements: [
    {
      id: "ach-1",
      title: "Pristine Smart Pre-School Award",
      score: "Rank #1",
      description: "Conferred by UP Educational Guild for revolutionary integrations of visual smart panels and gaming-themed numeric systems at foundational levels.",
      date: "2025"
    },
    {
      id: "ach-2",
      title: "State Toddler Gymnastics Shield",
      score: "Gold Cup",
      description: "Our prep athletic relay team clinched the high-agility gold medal at the regional sports federation wellness meet.",
      date: "2026"
    },
    {
      id: "ach-3",
      title: "Visual Art & Young Creators Championship",
      score: "12 Medals",
      description: "Outstanding young artists of Swara kindergarten created beautiful mosaic prints, bagging maximum top-tier laurels.",
      date: "2025"
    }
  ],
  faculties: [
    {
      id: "fac-mem-1",
      name: "Miss Priya Chawla",
      role: "Lead Nursery Instructor",
      photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=60",
      review: "Swara Academy provides children with beautiful visual grids to explore freely. The smiles on their faces when they interact with our tactile games is truly rewarding!",
      experience: "5+ Years Pre-School"
    },
    {
      id: "fac-mem-2",
      name: "Mrs. Meenakshi Dutt",
      role: "Pre-Primary Language & Phonetics Guide",
      photo: "https://images.unsplash.com/photo-1580894732444-8fecef2271ff?w=400&auto=format&fit=crop&q=60",
      review: "Our sound-matching game boards have tripled the pacing of vocabulary retention in playgroups. Parents frequently note amazing phonetic improvements in weeks!",
      experience: "8+ Years Speech Development"
    },
    {
      id: "fac-mem-3",
      name: "Mr. Abhishek Varma",
      role: "Creative Arts & Clay Craft Coach",
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=60",
      review: "Unshackling young children to construct and paint glowing castles shapes creative problem solving keys. We encourage messy hands and happy hearts!",
      experience: "4+ Years Child Pedagogy"
    }
  ],
  beyondAcademics: [
    {
      id: "beyond-1",
      title: "Junior Olympiads & Coding Magic",
      description: "We introduce code logic via colorful toy bugs, wooden direction panels, and gamified block cards that teach sequencing without screens, developing peak analytical pathways.",
      icon: "Cpu",
      activities: ["Wooden Block Logic Sequencing", "Bug-Grid Pathfinding Cards", "Pattern Matching Spark Speedruns"]
    },
    {
      id: "beyond-2",
      title: "Little Champs Sports & Gymnastics",
      description: "Promoting cardiac vigor and physical balance with child-safe balance beams, high-flex trampoline bouncers, and coordinated rhythmic stretching workshops.",
      icon: "Activity",
      activities: ["Trampoline Balance Rhythms", "Safe Beam Walking", "Kids Mini Athletics Cup"]
    },
    {
      id: "beyond-3",
      title: "Swara Shrishti Social Initiatives",
      description: "Fostering empathy and deep eco-consciousness in young hearts through easy water-conservation drives, birdhouse seeding setups, and planting little saplings.",
      icon: "Leaf",
      activities: ["Organic Sapling Crafting", "Save Water Kids Workshops", "Sharing & Caring Toys Donation Drives"]
    }
  ],
  gallery: [
    {
      id: "media-1",
      type: "image",
      url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop&q=80",
      title: "Interactive Children's Circle Learning Time",
      approved: true,
      source: "default",
      topic: "Smart Classrooms"
    },
    {
      id: "media-2",
      type: "image",
      url: "https://images.unsplash.com/photo-1540479859204-7cd3ea94c1c1?w=800&auto=format&fit=crop&q=80",
      title: "Montessori Early Sensory & Color Matching Blocks",
      approved: true,
      source: "default",
      topic: "Montessori Plays"
    },
    {
      id: "media-3",
      type: "video",
      url: "https://assets.mixkit.co/videos/preview/mixkit-kids-playing-with-colorful-blocks-at-a-desk-40092-large.mp4",
      title: "Building Blocks Play & Discovery Video Highlight",
      approved: true,
      source: "default",
      topic: "Montessori Plays"
    },
    {
      id: "media-4",
      type: "image",
      url: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&auto=format&fit=crop&q=80",
      title: "Tactile Glow Hand-Painting Workshop",
      approved: true,
      source: "default",
      topic: "Creative Art & Craft"
    },
    {
      id: "media-5",
      type: "video",
      url: "https://assets.mixkit.co/videos/preview/mixkit-teacher-reading-a-story-to-her-pupils-40090-large.mp4",
      title: "Story Telling Session with Academic Mentors Video Highlight",
      approved: true,
      source: "default",
      topic: "Smart Classrooms"
    },
    {
      id: "media-6",
      type: "image",
      url: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=800&auto=format&fit=crop&q=80",
      title: "Interactive Smart Board Math Exercises",
      approved: true,
      source: "default",
      topic: "Smart Classrooms"
    }
  ],
  heroImages: [
    "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=1200&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&auto=format&fit=crop&q=80"
  ],
  contact: {
    address: "Station Road, near Railway Colony, Basti, Uttar Pradesh, Pin-272002",
    phone: "+91 94541 XXXXX, +91 88402 XXXXX",
    email: "admission@swaraacademy.edu",
    workingHours: "Mon - Sat: 08:30 AM - 02:00 PM",
    mapLocationQuery: "Station Road, Basti, Uttar Pradesh",
    mapEmbedCode: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3557.498421876543!2d82.683526!3d26.791535!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3990db58ffffff%3A0xabcdef12345!2sStation+Road%2C+Basti%2C+Uttar+Pradesh!5e0!3m2!1sen!2sin!4v1623000000000!5m2!1sen!2sin"
  },
  themeDesign: {
    primaryColor: "blue-600",
    themeVibe: "vibrant"
  }
};

const STORAGE_KEY = "swara_academy_website_state";

export function getSchoolData(): SchoolData {
  if (typeof window === "undefined") {
    return DEFAULT_SCHOOL_DATA;
  }
  const cached = localStorage.getItem(STORAGE_KEY);
  if (!cached) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SCHOOL_DATA));
    return DEFAULT_SCHOOL_DATA;
  }
  try {
    return JSON.parse(cached);
  } catch (e) {
    return DEFAULT_SCHOOL_DATA;
  }
}

export function saveSchoolData(data: SchoolData): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new Event("school_data_updated"));
  }
}

export function resetToDefaults(): SchoolData {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SCHOOL_DATA));
    window.dispatchEvent(new Event("school_data_updated"));
  }
  return DEFAULT_SCHOOL_DATA;
}
