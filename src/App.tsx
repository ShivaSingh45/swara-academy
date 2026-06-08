import React, { useState, useEffect } from 'react';
import { 
  getSchoolData, 
  saveSchoolData, 
  resetToDefaults, 
  SchoolData, 
  Circular, 
  SchoolEvent, 
  Birthday, 
  FAQ, 
  Faculty, 
  Facility, 
  BeyondAcademic,
  GalleryMedia
} from './data/schoolData';
import SwaraLogo from './components/SwaraLogo';
import ActivePlayground from './components/ActivePlayground';
import SwaraChatbot from './components/SwaraChatbot';
import ImmersiveMediaPage from './components/ImmersiveMediaPage';
import { 
  Tv, 
  Gamepad, 
  GraduationCap, 
  Paintbrush, 
  Award, 
  AlertCircle, 
  Calendar, 
  Cake, 
  BookOpen, 
  Phone, 
  Mail, 
  Clock, 
  MapPin, 
  UserCheck, 
  Settings, 
  Plus, 
  Trash2, 
  Heart, 
  Cpu, 
  Activity, 
  Leaf, 
  ArrowRight, 
  ShieldCheck, 
  HelpCircle, 
  CheckCircle, 
  ExternalLink,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Sparkles,
  Info,
  X
} from 'lucide-react';

export interface AdmissionApplication {
  id: string;
  studentName: string;
  studentDob: string;
  gender: string;
  grade: string;
  parentName: string;
  phone: string;
  email: string;
  address: string;
  submittedAt: string;
  status: "Pending" | "Approved" | "Rejected";
  remarks?: string;
}

export default function App() {
  const [data, setData] = useState<SchoolData>(getSchoolData());
  const [activeTab, setActiveTab] = useState<"parents" | "admin">("parents");
  const [parentsView, setParentsView] = useState<"home" | "apply" | "gallery">("home");
  const [mounted, setMounted] = useState<boolean>(false);
  
  // Slideshow and Gallery Filter states
  const [activeHeroBgIdx, setActiveHeroBgIdx] = useState<number>(0);
  const [gallerySearch, setGallerySearch] = useState<string>("");
  const [galleryTopicFilter, setGalleryTopicFilter] = useState<string>("All Moments");
  const [galleryTypeFilter, setGalleryTypeFilter] = useState<"all" | "image" | "video">("all");
  const [lightboxItem, setLightboxItem] = useState<GalleryMedia | null>(null);

  // Dynamic Popup Banner Controls
  const [showPopup, setShowPopup] = useState<boolean>(false);
  
  // Accordion active FAQ state
  const [openFaqId, setOpenFaqId] = useState<string | null>("faq-1");

  // Parent application submission form keys
  const [formData, setFormData] = useState({
    studentName: "",
    studentDob: "",
    gender: "Male",
    grade: "Playgroup",
    parentName: "",
    phone: "",
    email: "",
    address: "",
    comments: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedAppId, setSubmittedAppId] = useState("");

  // Admin and filter states
  const [applications, setApplications] = useState<AdmissionApplication[]>([]);
  const [appFilter, setAppFilter] = useState<string>("All");

  // Admin lock security
  const [adminPassword, setAdminPassword] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [adminTab, setAdminTab] = useState<"branding" | "editorial" | "gallery" | "calendars" | "faculties" | "applications">("branding");
  const [showProspectusPreview, setShowProspectusPreview] = useState(false);

  // Mount animation trigger & lazy database loading
  useEffect(() => {
    setMounted(true);
    
    // Bind school storage reload event
    const handleStorageUpdate = () => {
      setData(getSchoolData());
    };
    window.addEventListener("school_data_updated", handleStorageUpdate);

    // Load admissions applications
    const cachedApps = localStorage.getItem("swara_admissions_applications");
    if (cachedApps) {
      try {
        setApplications(JSON.parse(cachedApps));
      } catch (e) {
        console.error("Failed to parse cached applications", e);
      }
    } else {
      // Seed with some classic, high quality sample records
      const seedApps: AdmissionApplication[] = [
        {
          id: "SW-2026-1402",
          studentName: "Aarav Mishra",
          studentDob: "2022-04-12",
          gender: "Male",
          grade: "Playgroup",
          parentName: "Dinesh Mishra",
          phone: "+91 94541 23412",
          email: "dinesh.mishra@gmail.com",
          address: "Station Road, near Nehru Crossing, Basti, UP",
          submittedAt: "2026-06-05 10:24",
          status: "Pending",
          remarks: "Awaiting initial sibling verification code."
        },
        {
          id: "SW-2026-5801",
          studentName: "Riya Verma",
          studentDob: "2021-08-22",
          gender: "Female",
          grade: "Nursery",
          parentName: "Alok Verma",
          phone: "+91 88402 98765",
          email: "alok.verma@outlook.com",
          address: "Railway Colony, Ward 4, Basti, UP",
          submittedAt: "2026-06-06 14:15",
          status: "Approved",
          remarks: "Birth certificate authenticated successfully by office registrars."
        }
      ];
      setApplications(seedApps);
      localStorage.setItem("swara_admissions_applications", JSON.stringify(seedApps));
    }

    // Trigger Popup Admission Banner after 2 seconds
    const timer = setTimeout(() => {
      const liveData = getSchoolData();
      if (liveData.admissionBanner.show) {
        setShowPopup(true);
      }
    }, 2000);

    return () => {
      window.removeEventListener("school_data_updated", handleStorageUpdate);
      clearTimeout(timer);
    };
  }, []);

  // Slideshow effect for hero background
  useEffect(() => {
    const list = (data.heroImages && data.heroImages.length > 0) ? data.heroImages : [
      "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&auto=format&fit=crop&q=80"
    ];
    if (list.length <= 1) return;
    
    const interval = setInterval(() => {
      setActiveHeroBgIdx((prev) => (prev + 1) % list.length);
    }, 4500);
    
    return () => clearInterval(interval);
  }, [data.heroImages]);

  // Sync state modifications to master memory
  const updateData = (newData: SchoolData) => {
    setData(newData);
    saveSchoolData(newData);
  };

  const handleResetData = () => {
    if (confirm("Are you sure you want to restore Swara Academy to default pre-school state settings? All current edits will be cleared.")) {
      const defaults = resetToDefaults();
      setData(defaults);
      alert("Swara Academy has been restored back to clean default visual states!");
    }
  };

  const handleNavClick = (sectionId: string, e: React.MouseEvent) => {
    e.preventDefault();
    setActiveTab("parents");
    setParentsView("home");
    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentName || !formData.parentName || !formData.phone || !formData.address) {
      alert("Kindly fill out all necessary fields (*) properly to submit.");
      return;
    }
    const appId = `SW-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newApp: AdmissionApplication = {
      id: appId,
      studentName: formData.studentName,
      studentDob: formData.studentDob || new Date().toISOString().substring(0, 10),
      gender: formData.gender,
      grade: formData.grade,
      parentName: formData.parentName,
      phone: formData.phone,
      email: formData.email || "not-provided@example.com",
      address: formData.address,
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: "Pending",
      remarks: formData.comments ? `Parent Comments: ${formData.comments}` : "Awaiting review."
    };

    const updated = [newApp, ...applications];
    setApplications(updated);
    localStorage.setItem("swara_admissions_applications", JSON.stringify(updated));

    setSubmittedAppId(appId);
    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleResetForm = () => {
    setFormData({
      studentName: "",
      studentDob: "",
      gender: "Male",
      grade: "Playgroup",
      parentName: "",
      phone: "",
      email: "",
      address: "",
      comments: ""
    });
    setIsSubmitted(false);
    setSubmittedAppId("");
  };

  // Helper mapping string icon names to Lucide elements
  const renderIcon = (iconName: string, className: string = "w-6 h-6") => {
    switch (iconName) {
      case "Tv": return <Tv className={className} />;
      case "Gamepad": return <Gamepad className={className} />;
      case "GraduationCap": return <GraduationCap className={className} />;
      case "Paintbrush": return <Paintbrush className={className} />;
      case "Cpu": return <Cpu className={className} />;
      case "Activity": return <Activity className={className} />;
      case "Leaf": return <Leaf className={className} />;
      default: return <BookOpen className={className} />;
    }
  };

  const getThemeStyles = () => {
    switch (data.themeDesign?.themeVibe) {
      case "emerald":
        return {
          bgPrimary: "#16a34a",
          bgHover: "#15803d",
          bgLight: "#f0fdf4",
          accent: "#eab308",
          textPrimary: "#15803d"
        };
      case "crimson":
        return {
          bgPrimary: "#be123c",
          bgHover: "#9f1239",
          bgLight: "#fff1f2",
          accent: "#eab308",
          textPrimary: "#be123c"
        };
      case "violet":
        return {
          bgPrimary: "#7c3aed",
          bgHover: "#6d28d9",
          bgLight: "#f5f3ff",
          accent: "#84cc16",
          textPrimary: "#6d28d9"
        };
      case "amber":
        return {
          bgPrimary: "#d97706",
          bgHover: "#b45309",
          bgLight: "#fef3c7",
          accent: "#2563eb",
          textPrimary: "#b45309"
        };
      case "teal":
        return {
          bgPrimary: "#0d9488",
          bgHover: "#0f766e",
          bgLight: "#f0fdfa",
          accent: "#f97316",
          textPrimary: "#0f766e"
        };
      case "vibrant":
      default:
        return {
          bgPrimary: "#2563eb",
          bgHover: "#1d4ed8",
          bgLight: "#eff6ff",
          accent: "#f43f5e",
          textPrimary: "#1d4ed8"
        };
    }
  };

  const themeStyles = getThemeStyles();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-lime-200 selection:text-slate-900 scroll-smooth flex flex-col font-sans overflow-x-hidden">
      <style>{`
        :root {
          --primary-color: ${themeStyles.bgPrimary};
          --primary-hover: ${themeStyles.bgHover};
          --primary-light: ${themeStyles.bgLight};
          --accent-color: ${themeStyles.accent};
          --primary-text: ${themeStyles.textPrimary};
        }
        .theme-bg-primary { background-color: var(--primary-color) !important; }
        .theme-bg-hover:hover { background-color: var(--primary-hover) !important; }
        .theme-bg-light { background-color: var(--primary-light) !important; }
        .theme-text-primary { color: var(--primary-color) !important; }
        .theme-text-hover:hover { color: var(--primary-hover) !important; }
        .theme-text-accent { color: var(--accent-color) !important; }
        .theme-border-primary { border-color: var(--primary-color) !important; }
        
        .bg-blue-50 { background-color: var(--primary-light) !important; }
        .bg-blue-100 { background-color: var(--primary-light) !important; border-color: var(--primary-color) !important; color: var(--primary-text) !important; }
        .text-blue-500, .text-blue-650, .text-blue-600 { color: var(--primary-text) !important; }
        .hover\\:text-blue-600:hover { color: var(--primary-hover) !important; }
        .border-blue-200 { border-color: var(--primary-color) !important; opacity: 0.35; }
        
        @media print {
          /* Full page print setup */
          @page {
            size: A4 portrait;
            margin: 1.2cm;
          }
          body * {
            visibility: hidden !important;
          }
          #print-prospectus-modal, #print-prospectus-modal * {
            visibility: visible !important;
          }
          #print-prospectus-modal {
            display: block !important;
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            background: white !important;
            color: black !important;
            z-index: 100000 !important;
          }
          body {
            background-color: white !important;
          }
        }
      `}</style>
      
      {/* MONUMENTAL AND PRINTER-FRIENDLY ACADEMY PROSPECTUS & FORM PREVIEW OVERLAY */}
      {showProspectusPreview && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex justify-center p-4 select-none animate-in fade-in duration-300">
          <div className="bg-white border-4 border-slate-900 rounded-3xl w-full max-w-4xl p-6 md:p-8 flex flex-col justify-between shadow-2xl animate-in zoom-in-95 duration-300">
            {/* Header controls (Non-printable) */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b-4 border-slate-900 pb-4 mb-6">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-650 flex items-center gap-1.5 theme-text-primary">
                  📁 PRINTABLE ACADEMY DOSSIER
                </span>
                <h3 className="text-xl md:text-2xl font-black uppercase text-slate-900">Prospectus & Admission Slip</h3>
                <p className="text-xs text-slate-500 font-medium font-sans">
                  Below is the formatted printer dossier. You can click "Print Questionnaire / Save PDF" to file on physical paper or review offline.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => {
                    window.print();
                  }}
                  className="bg-lime-400 hover:bg-lime-500 text-slate-950 px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider border-2 border-slate-900 flex items-center gap-2 cursor-pointer shadow-md"
                >
                  🖨️ Print Dossier / Save PDF
                </button>
                <button
                  onClick={() => setShowProspectusPreview(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-3 rounded-xl text-xs font-black uppercase border border-slate-200 cursor-pointer"
                >
                  Close Preview
                </button>
              </div>
            </div>

            {/* Actual printable sheets wrapper */}
            <div 
              id="print-prospectus-modal" 
              className="bg-white text-slate-900 p-6 md:p-10 border border-slate-250 rounded-2xl overflow-y-auto max-h-[60vh] space-y-8 font-sans scrollbar-thin text-left border-3 border-slate-900 shadow-inner"
            >
              {/* SHEET 1: PROSPECTUS & WELCOME OVERVIEW */}
              <div className="space-y-8 page-break-after">
                {/* Header brand crest */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b-4 border-slate-950">
                  <div className="text-left space-y-2">
                    <span className="text-[10px] bg-slate-900 text-white font-black px-2.5 py-1 rounded-md uppercase tracking-wider">
                      ACADEMIC PROSPECTUS • TERM 2026-27
                    </span>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-950 tracking-tight leading-none uppercase">
                      {data.name}
                    </h1>
                    <p className="text-xs md:text-sm text-rose-600 font-extrabold uppercase tracking-wider leading-tight">
                      {data.logoDescription}
                    </p>
                    <p className="text-[10px] text-slate-500 font-medium">
                      Address: {data.contact.address} | Support: {data.contact.phone}
                    </p>
                  </div>
                  <div className="flex-shrink-0 select-none">
                    {data.logoImg ? (
                      <img 
                        src={data.logoImg} 
                        alt="School Logo" 
                        className="h-28 md:h-36 lg:h-44 w-auto object-contain transition-all duration-300 hover:scale-105" 
                        referrerPolicy="no-referrer" 
                      />
                    ) : (
                      <SwaraLogo 
                        size={120} 
                        interactive={false} 
                      />
                    )}
                  </div>
                </div>

                {/* Slogan Intro */}
                <div className="space-y-3">
                  <h2 className="text-lg font-black uppercase text-slate-900 border-l-4 border-slate-950 pl-3">
                    Mission Statement & Pedagogy
                  </h2>
                  <p className="text-xs text-slate-705 leading-relaxed font-semibold italic">
                    "{data.tagline}"
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans font-medium">
                    {data.welcomeIntro}
                  </p>
                </div>

                {/* Academic programs details (Facilities) */}
                <div className="space-y-3">
                  <h3 className="text-sm font-black uppercase text-slate-950 border-b-2 border-slate-950 pb-1.5">
                    1. Integrated Foundational Learning Systems
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    {(data.facilities || []).map((fac) => (
                      <div key={fac.id} className="p-3 bg-slate-50 border-2 border-slate-400 rounded-xl space-y-1.5">
                        <strong className="text-slate-950 uppercase text-xs block">{fac.title}</strong>
                        <p className="text-[11px] text-slate-600 leading-snug">{fac.description}</p>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {fac.subtopics.map((sub, sIdx) => (
                            <span key={sIdx} className="bg-slate-200 text-slate-800 text-[8px] font-bold uppercase px-1.5 py-0.5 rounded">
                              {sub}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Beyond academics */}
                <div className="space-y-3">
                  <h3 className="text-sm font-black uppercase text-slate-950 border-b-2 border-slate-950 pb-1.5">
                    2. Co-Curricular Agility Clubs
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-sans">
                    {(data.beyondAcademics || []).map((b) => (
                      <div key={b.id} className="p-3 bg-slate-50 border-2 border-slate-400 rounded-xl space-y-1">
                        <strong className="text-slate-950 uppercase text-[11px] block">{b.title}</strong>
                        <p className="text-[10px] text-slate-500 leading-tight">{b.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Admissions details */}
                <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-2 border-2 border-slate-950">
                  <span className="text-[10px] font-black uppercase tracking-widest text-lime-400 block">Registration Code / Checklists</span>
                  <h4 className="text-xs font-black uppercase">Schedule within 48 hours for childhood play assessments</h4>
                  <ul className="text-[10px] text-slate-350 space-y-1 list-disc pl-4 font-sans leading-relaxed">
                    <li>Required Document: Candidate's verified original birth certificate printout.</li>
                    <li>Required Document: Two clean passport format portrait photographs.</li>
                    <li>Physical evaluation: Interactive playroom test with certified mentors.</li>
                    <li>Official Admission Contact Helpline: <strong className="text-lime-300 font-mono font-black">{data.admissionBanner.contactPhone}</strong></li>
                  </ul>
                </div>
              </div>

              {/* SHEET 2: THE FORM INPUT FOR WRITTEN INSCRIPTIONS */}
              <div className="border-t-4 border-dashed border-slate-300 pt-8 space-y-6 page-break-before">
                <div className="text-center space-y-1">
                  <h3 className="text-xl font-black uppercase text-slate-950 tracking-wide">
                    OFFICIAL APPLICATION FOR ADMISSION
                  </h3>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Please use dark blue ink ballpoint pen to fill standard candidate records in capital blocks.
                  </p>
                </div>

                <div className="border-2 border-slate-900 p-6 rounded-2xl space-y-6 font-sans">
                  {/* Student Details */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-950 border-b border-slate-900 pb-1">
                      Part A: Student Candidate Parameters
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-xs text-slate-700">
                      <div>
                        <span className="text-[9px] font-black uppercase text-slate-400 block mb-1">1. Full Name of Pupil</span>
                        <div className="border-b-2 border-slate-900 h-6"></div>
                      </div>
                      <div>
                        <span className="text-[9px] font-black uppercase text-slate-400 block mb-1">2. Class / level Selected</span>
                        <div className="flex gap-4 items-center pt-1 text-[10px] font-bold">
                          {["Playgroup", "Nursery", "Prep-I", "Prep-II"].map((gr) => (
                            <label key={gr} className="flex items-center gap-1.5">
                              <span className="w-3 h-3 rounded-full border border-slate-900 inline-block"></span>
                              <span>{gr}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="text-[9px] font-black uppercase text-slate-400 block mb-1">3. Date of Birth (DD / MM / YYYY)</span>
                        <div className="border-b-2 border-slate-900 h-6"></div>
                      </div>
                      <div>
                        <span className="text-[9px] font-black uppercase text-slate-400 block mb-1">4. Gender of Child</span>
                        <div className="flex gap-6 items-center pt-1 text-[10px] font-bold font-sans">
                          {["Male", "Female", "Other"].map((ge) => (
                            <label key={ge} className="flex items-center gap-1.5">
                              <span className="w-3 h-3 rounded-full border border-slate-900 inline-block"></span>
                              <span>{ge}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Parent Details */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-950 border-b border-slate-900 pb-1">
                      Part B: Father / Mother / Legal Guardian
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-xs text-slate-700">
                      <div>
                        <span className="text-[9px] font-black uppercase text-slate-400 block mb-1">5. Full Name of Guardian</span>
                        <div className="border-b-2 border-slate-900 h-6"></div>
                      </div>
                      <div>
                        <span className="text-[9px] font-black uppercase text-slate-400 block mb-1">6. Helpline Mobile Number</span>
                        <div className="border-b-2 border-slate-900 h-6"></div>
                      </div>

                      <div className="sm:col-span-2">
                        <span className="text-[9px] font-black uppercase text-slate-400 block mb-1">7. Complete Home Residential Address</span>
                        <div className="border-b-2 border-slate-900 h-6 mb-4"></div>
                        <div className="border-b-2 border-slate-900 h-6"></div>
                      </div>

                      <div className="sm:col-span-2">
                        <span className="text-[9px] font-black uppercase text-slate-400 block mb-1">8. Developmental Dietary / Medical Comments</span>
                        <div className="border-b-2 border-slate-900 h-6"></div>
                      </div>
                    </div>
                  </div>

                  {/* Sign-off boxes */}
                  <div className="grid grid-cols-2 gap-8 pt-8 text-xs text-center font-bold text-slate-900">
                    <div className="space-y-12">
                      <div className="border-b border-slate-900 mx-auto w-3/4"></div>
                      <span>Parent / Guardian Signature</span>
                    </div>
                    <div className="space-y-12">
                      <div className="border-b border-slate-900 mx-auto w-3/4"></div>
                      <span>Admissions Officer Stamp</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Print advice footer (Non-printable) */}
            <div className="mt-4 pt-4 border-t border-slate-200 text-center text-[10px] text-slate-400 font-bold font-sans uppercase">
              {data.name} Basti Uttar Pradesh • Printed systems verified offline
            </div>
          </div>
        </div>
      )}

      {/* GLOWING POPUP ADMISSION BANNER RIBBON */}
      {showPopup && data.admissionBanner.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md select-none animate-in fade-in duration-300">
          <div 
            className="relative w-full max-w-xl bg-white border-8 border-slate-900 rounded-3xl p-6 md:p-8 shadow-2xl text-slate-900 animate-in zoom-in-95 duration-400"
            style={{ backgroundImage: "linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)" }}
          >
            {/* Playful ribbon designs */}
            <div className="absolute -top-10 -left-6 z-10 bg-yellow-400 border-4 border-slate-900 text-slate-900 font-black text-xs px-4 py-2.5 rounded-2xl shadow-md rotate-[-6deg] uppercase flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-slate-900 fill-slate-900 animate-pulse" /> ADMISSIONS OPEN
            </div>

            <button 
              onClick={() => setShowPopup(false)}
              className="absolute top-4 right-4 p-1 rounded-full border-2 border-slate-900 bg-slate-100 hover:bg-slate-200 hover:scale-105 active:scale-95 transition-all text-slate-800"
              title="Close window"
            >
              <X size={18} />
            </button>

            <div className="mt-4 space-y-4">
              <div className="flex items-center gap-2">
                <span className="p-2.5 rounded-full bg-blue-100 border-2 border-slate-900 text-blue-600">
                  <Award size={22} className="fill-blue-100 animate-bounce" />
                </span>
                <span className="text-[10px] uppercase font-black text-slate-500 tracking-wider">SWARA PRE-PRIMARY CAMPAIGN</span>
              </div>

              <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-none uppercase">
                {data.admissionBanner.title}
              </h3>

              <p className="text-sm font-medium leading-relaxed text-slate-700">
                {data.admissionBanner.description}
              </p>

              <div className="bg-yellow-100 border-2 border-dashed border-yellow-500 rounded-2xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-yellow-800 uppercase tracking-wide">Pre-Enrollment Status</div>
                  <div className="text-xs font-semibold text-slate-700 mt-0.5">
                    {data.admissionBanner.deadline} • Helpline: <span className="underline font-bold text-slate-900">{data.admissionBanner.contactPhone}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={() => {
                    setShowPopup(false);
                    setActiveTab("parents");
                    setParentsView("apply");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="flex-grow text-center bg-lime-500 hover:bg-lime-600 text-slate-950 font-black text-sm tracking-wide uppercase px-6 py-4 rounded-2xl border-4 border-slate-900 hover:-translate-y-0.5 active:translate-y-0 transition-all shadow-md cursor-pointer"
                >
                  {data.admissionBanner.actionText}
                </button>
                <button 
                  onClick={() => setShowPopup(false)}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase px-5 py-4 rounded-xl hover:-translate-y-0.5 active:translate-y-0 transition-all"
                >
                  Dismiss Banner
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SWARA ACADEMY FLOATING UTILITY HEADER BAR */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-4 border-slate-900 px-4 py-3 md:py-4 select-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo Brand aligned horizontally */}
          <a href="#" className="flex items-center gap-5 group py-1">
            {data.logoImg ? (
              <img 
                src={data.logoImg} 
                alt="School Logo" 
                className="h-24 md:h-32 lg:h-36 w-auto object-contain transition-transform duration-300 group-hover:scale-105 flex-shrink-0 select-none" 
                referrerPolicy="no-referrer" 
              />
            ) : (
              <SwaraLogo 
                size={120} 
                className="transition-transform duration-300 group-hover:scale-105 flex-shrink-0" 
                interactive={false} 
              />
            )}
            <div className="space-y-1.5 md:space-y-2">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 leading-none group-hover:text-rose-600 transition-colors uppercase">
                {data.name}
              </h1>
              <span className="text-xs md:text-sm font-black uppercase text-rose-500 tracking-widest block leading-tight">
                {data.logoDescription}
              </span>
            </div>
          </a>

          {/* Centered navigation items */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-extrabold uppercase text-slate-700">
            <button 
              onClick={() => {
                setActiveTab("parents");
                setParentsView("home");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`hover:text-blue-600 transition-colors cursor-pointer ${activeTab === "parents" && parentsView === "home" ? 'text-blue-600 underline underline-offset-4 decoration-2 font-black' : ''}`}
            >
              School Home
            </button>
            <button 
              onClick={() => {
                setActiveTab("parents");
                setParentsView("gallery");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`hover:text-amber-500 transition-colors cursor-pointer flex items-center gap-1.5 ${activeTab === "parents" && parentsView === "gallery" ? 'text-amber-500 underline underline-offset-4 decoration-2 font-black' : ''}`}
            >
              🎬 Media Gallery Hub
            </button>
            <button 
              onClick={() => {
                setActiveTab("parents");
                setParentsView("apply");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`hover:text-blue-600 transition-colors cursor-pointer flex items-center gap-1 ${activeTab === "parents" && parentsView === "apply" ? 'text-blue-500 underline underline-offset-4 decoration-2 font-black' : ''}`}
            >
              <Sparkles size={12} className="text-rose-500 fill-rose-500 animate-pulse" /> Apply Online
            </button>
            <button 
              onClick={(e) => handleNavClick("circulars", e)}
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              Circulars & Notice
            </button>
            <button 
              onClick={(e) => handleNavClick("calendars", e)}
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              Events Calendar
            </button>
            <button 
              onClick={(e) => handleNavClick("innovations", e)}
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              Innovative Classes
            </button>
            <button 
              onClick={(e) => handleNavClick("leadership", e)}
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              Philosophies
            </button>
            <button 
              onClick={(e) => handleNavClick("playground", e)}
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              3D Playground
            </button>
            <button 
              onClick={(e) => handleNavClick("contact", e)}
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              Location Map
            </button>
          </nav>

          {/* Header Action Elements */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => {
                if (activeTab === "parents") {
                  setActiveTab("admin");
                } else {
                  setActiveTab("parents");
                }
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl border-3 border-slate-900 text-xs font-black uppercase tracking-wide transition-all shadow-md hover:-translate-y-0.5 active:translate-y-0 ${
                activeTab === "admin" 
                  ? 'bg-yellow-400 text-slate-950' 
                  : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
            >
              <Settings size={15} className={activeTab === "admin" ? "animate-spin" : ""} />
              {activeTab === "parents" ? "Principal Portal" : "Parents Desk"}
            </button>
            
            {/* Small Quick Admission Trigger button */}
            {data.admissionBanner.show && (
              <button 
                onClick={() => {
                  setActiveTab("parents");
                  setParentsView("apply");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="hidden sm:inline-flex bg-lime-500 hover:bg-lime-600 text-slate-950 px-4 py-2.5 rounded-2xl border-3 border-slate-900 text-xs font-black uppercase tracking-wider hover:-translate-y-0.5 active:translate-y-0 transition-transform shadow-md"
              >
                APPLY 2026-27
              </button>
            )}
          </div>
        </div>
      </header>

      {/* RENDER DYNAMIC ADMISSIONS QUICK BANNER OVER MAIN SECTION IF HIDDEN IN SCROLL */}
      {data.admissionBanner.show && (
        <div className="bg-yellow-400 border-b-4 border-slate-900 px-4 py-2.5 text-center text-xs font-black tracking-wider text-slate-950 select-none flex items-center justify-center gap-2 flex-wrap">
          <span>📢 {data.admissionBanner.title}</span>
          <button 
            onClick={() => setShowPopup(true)} 
            className="underline hover:text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-950 text-[10px]"
          >
            VIEW PROSPECTUS
          </button>
        </div>
      )}

      {/* MAIN LAYOUT GATEWAYS: PARENTS DESK LANDING OR MANAGEMENT CONSOLE */}
      <main className="flex-grow font-sans">
        {activeTab === "parents" ? (
          parentsView === "apply" ? (
            /* ONLINE ADMISSION APPLICATION FORM VIEW */
            <div className={`transition-all duration-700 bg-slate-50 min-h-screen ${mounted ? 'opacity-100' : 'opacity-0'}`}>
              
              {/* Back to Home banner */}
              <div className="bg-slate-900 py-10 px-4 text-center select-none text-white relative overflow-hidden"
                style={{ backgroundImage: "radial-gradient(ellipse at bottom, #113061 0%, #030812 100%)" }}
              >
                <div className="absolute top-4 left-6">
                  <button 
                    onClick={() => setParentsView("home")}
                    className="bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl transition-all border border-white/20 inline-flex items-center gap-1 cursor-pointer"
                  >
                    ← Go Back to Home
                  </button>
                </div>
                
                <div className="max-w-2xl mx-auto space-y-2 mt-4 md:mt-0">
                  <span className="bg-lime-500/20 text-lime-400 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-lime-500/30">
                    Admission Form Academic Term 2026-27
                  </span>
                  <h2 className="text-3xl md:text-4xl font-black uppercase text-white">Online Application Desk</h2>
                  <p className="text-xs text-slate-300 font-medium font-sans">
                    Enter candidate records down below. Our administrative team registers applications and schedules child playground interaction tests within 48 hours.
                  </p>
                </div>
              </div>

              {/* INTERACTIVE PROSPECTUS DOWNLOAD INCENTIVE BANNER */}
              <div className="mt-8 px-4 max-w-3xl mx-auto">
                <div className="bg-gradient-to-r from-amber-400 to-yellow-300 border-4 border-slate-900 rounded-3xl p-5 md:p-6 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 relative select-none text-left">
                  <div className="space-y-1.5 text-slate-900">
                    <span className="text-[9px] bg-slate-900 text-yellow-400 font-mono font-black uppercase tracking-widest px-2.5 py-1 rounded-md">
                      RECRUITMENT DOSSIER • TERM 2026-27
                    </span>
                    <h3 className="text-lg md:text-xl font-black uppercase text-slate-900 leading-snug">
                      Download PDF Prospectus & Written Form
                    </h3>
                    <p className="text-xs text-slate-800 font-medium leading-relaxed font-sans">
                      Need a physical, offline printed copy of our school syllabus, play guides, and admission forms for home discussion?
                    </p>
                  </div>
                  
                  <button
                    onClick={() => setShowProspectusPreview(true)}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-5 py-3.5 rounded-2xl transition-all border-2 border-slate-900 flex items-center gap-2 cursor-pointer shadow-md whitespace-nowrap"
                  >
                    📝 Get Printer Dossier / PDF
                  </button>
                </div>
              </div>

              <div className="py-10 px-4 max-w-3xl mx-auto">
                <div className="bg-white border-4 border-slate-900 rounded-3xl p-6 md:p-8 shadow-2xl relative">
                  
                  {isSubmitted ? (
                    /* SUCCESS STATUS CARD WRAPPER */
                    <div className="text-center py-8 space-y-6 animate-in zoom-in-95 duration-300">
                      <div className="w-20 h-20 bg-lime-100 border-4 border-slate-150 text-lime-650 rounded-full flex items-center justify-center mx-auto text-4xl shadow-md border-slate-900">
                        ✔
                      </div>
                      
                      <div className="space-y-2">
                        <span className="text-[10px] font-mono tracking-widest uppercase text-slate-400 block">Registration Code</span>
                        <span className="bg-slate-900 text-white px-4 py-2 rounded-2xl text-lg font-black tracking-wider border-2 border-slate-900 select-all font-mono">
                          {submittedAppId}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-2xl font-black uppercase text-slate-900">Application Submitted!</h3>
                        <p className="text-xs text-slate-600 font-medium max-w-md mx-auto leading-relaxed">
                          Your online registration for <strong className="text-slate-900 uppercase">{formData.studentName}</strong> has been saved successfully to Basti's Swara Academy admissions database.
                        </p>
                      </div>

                      <div className="bg-blue-50 border-2 border-slate-900 rounded-2xl p-4 text-left space-y-2.5 max-w-lg mx-auto text-xs">
                        <div className="font-extrabold uppercase text-blue-800 flex items-center gap-1.5">
                          <span>💡</span> NEXT ACTIONS FOR PARENTS & APPLICANTS:
                        </div>
                        <ul className="space-y-1.5 font-semibold text-slate-700 list-disc list-inside">
                          <li>Save and write down the above Registration Code: <strong>{submittedAppId}</strong>.</li>
                          <li>Our admission desk will call or email you at <strong>{formData.phone}</strong> to confirm scheduling.</li>
                          <li>Bring copies of candidate's birth certificate & passport size photos on test day.</li>
                        </ul>
                      </div>

                      <div className="pt-4 flex items-center justify-center gap-3 flex-wrap">
                        <button 
                          onClick={handleResetForm}
                          className="bg-lime-500 hover:bg-lime-600 text-slate-950 font-black text-xs uppercase px-5 py-3 rounded-xl border-3 border-slate-900 shadow-sm active:translate-y-0 hover:-translate-y-0.5 transition-all cursor-pointer"
                        >
                          Submit Another Candidate Application
                        </button>
                        <button 
                          onClick={() => setParentsView("home")}
                          className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase px-5 py-3 rounded-xl hover:-translate-y-0.5 transition-all cursor-pointer"
                        >
                          Return Home
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* INTERACTIVE FORM ENGINE */
                    <form onSubmit={handleFormSubmit} className="space-y-6">
                      
                      {/* Section 1 */}
                      <div className="space-y-3">
                        <div className="border-b border-slate-200 pb-1.5 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                          <h3 className="text-xs font-black uppercase text-slate-500 tracking-wider">Candidate Particulars</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[11px] font-black uppercase text-slate-700 mb-1">
                              Pupil Full Name <span className="text-red-500">*</span>
                            </label>
                            <input 
                              type="text" 
                              required
                              placeholder="e.g. Advik Mishra"
                              value={formData.studentName}
                              onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                              className="w-full bg-slate-50 border-2 border-slate-200 focus:border-slate-900 rounded-xl px-3.5 py-2.5 text-xs font-bold outline-none focus:bg-white"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-[11px] font-black uppercase text-slate-700 mb-1">Candidate's Date of Birth *</label>
                            <input 
                              type="date" 
                              required
                              value={formData.studentDob}
                              onChange={(e) => setFormData({ ...formData, studentDob: e.target.value })}
                              className="w-full bg-slate-50 border-2 border-slate-200 focus:border-slate-900 rounded-xl px-3.5 py-2.5 text-xs font-bold outline-none focus:bg-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-black uppercase text-slate-700 mb-1">Select Candidate Gender *</label>
                            <div className="grid grid-cols-3 gap-2">
                              {["Male", "Female", "Other"].map(g => (
                                <button
                                  type="button"
                                  key={g}
                                  onClick={() => setFormData({ ...formData, gender: g })}
                                  className={`py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                                    formData.gender === g 
                                      ? "bg-slate-900 border-slate-900 text-white" 
                                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                                  }`}
                                >
                                  {g}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="block text-[11px] font-black uppercase text-slate-700 mb-1">Grade Level Applied *</label>
                            <select 
                              value={formData.grade}
                              onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                              className="w-full bg-slate-50 border-2 border-slate-200 focus:border-slate-900 rounded-xl px-3.5 py-2.5 text-xs font-bold outline-none focus:bg-white cursor-pointer"
                            >
                              <option value="Playgroup">Playgroup Montessori (Ages 2-3)</option>
                              <option value="Nursery">Nursery Logic (Ages 3-4)</option>
                              <option value="Kindergarten-I">Kindergarten Prep-I (Ages 4-5)</option>
                              <option value="Kindergarten-II">Kindergarten Prep-II (Ages 5-6)</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Section 2 */}
                      <div className="space-y-3 pt-2">
                        <div className="border-b border-slate-200 pb-1.5 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-lime-500"></span>
                          <h3 className="text-xs font-black uppercase text-slate-500 tracking-wider">Guardian Profile & Contact Details</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[11px] font-black uppercase text-slate-700 mb-1">
                              Parent / Guardian Name <span className="text-red-500">*</span>
                            </label>
                            <input 
                              type="text" 
                              required
                              placeholder="e.g. Dr. Dinesh Mishra"
                              value={formData.parentName}
                              onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                              className="w-full bg-slate-50 border-2 border-slate-200 focus:border-slate-900 rounded-xl px-3.5 py-2.5 text-xs font-bold outline-none focus:bg-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-black uppercase text-slate-700 mb-1">
                              Helpline Contact Telephone <span className="text-red-500">*</span>
                            </label>
                            <input 
                              type="tel" 
                              required
                              placeholder="e.g. +91 94541 XXXXX"
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              className="w-full bg-slate-50 border-2 border-slate-200 focus:border-slate-900 rounded-xl px-3.5 py-2.5 text-xs font-bold outline-none focus:bg-white font-mono"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-[11px] font-black uppercase text-slate-700 mb-1">Guardian Email Address (Optional)</label>
                            <input 
                              type="email" 
                              placeholder="e.g. parent@example.com"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              className="w-full bg-slate-50 border-2 border-slate-200 focus:border-slate-900 rounded-xl px-3.5 py-2.5 text-xs font-bold outline-none focus:bg-white font-mono"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-[11px] font-black uppercase text-slate-700 mb-1">
                              Registered Residential Address <span className="text-red-500">*</span>
                            </label>
                            <textarea 
                              required
                              rows={2}
                              placeholder="e.g. Station Road, sector 3 opposite railway office, Basti, UP"
                              value={formData.address}
                              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                              className="w-full bg-slate-50 border-2 border-slate-200 focus:border-slate-900 rounded-xl px-3.5 py-2.5 text-xs font-semibold outline-none focus:bg-white font-sans"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-[11px] font-black uppercase text-slate-700 mb-1">Development or Dietary comments (Optional)</label>
                            <input 
                              type="text" 
                              placeholder="e.g. Speeds of phonetic reading are excellent, milk sensitive..."
                              value={formData.comments}
                              onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                              className="w-full bg-slate-50 border-2 border-slate-200 focus:border-slate-900 rounded-xl px-3.5 py-2.5 text-xs font-semibold outline-none focus:bg-white"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="bg-yellow-50 p-4 border border-yellow-200 rounded-2xl text-[10px] text-yellow-800 font-bold leading-relaxed">
                        ⚠️ By submitting this form, you authorize Swara Academy's registrar department of Basti to verify the entered parameters and trigger email reports or automated telephone briefing schedules on the specified phone contact.
                      </div>

                      <div className="pt-3">
                        <button 
                          type="submit"
                          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase py-4 rounded-2xl border-4 border-slate-950 shadow hover:-translate-y-1 active:translate-y-0 transition-all cursor-pointer text-center font-sans"
                        >
                          Verify & Submit Admissions Application →
                        </button>
                      </div>

                    </form>
                  )}

                </div>
              </div>

            </div>
          ) : parentsView === "gallery" ? (
            /* DEDICATED SEPARATE IMMERSIVE MEDIA GALLERY PAGE (READ-ONLY) */
            <ImmersiveMediaPage data={data} setParentsView={setParentsView} />
          ) : (
            /* PARENTS DESK LANDING VIEW (THE COMPOSITE RESORT WEBPAGE) */
            <div className={`transition-all duration-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
            
            {/* HERO SEGMENT — FEATURING SLIDING ANIMATED HEADER AND PARALLAX ELEMENT */}
            <section 
              className="relative py-16 md:py-24 px-4 bg-slate-950 overflow-hidden text-center text-white"
            >
              {/* Dynamic sliding Background Carousel set by Academic Principal Sneha Sen */}
              {(() => {
                const heroBgs = (data.heroImages && data.heroImages.length > 0) ? data.heroImages : [
                  "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=1200&auto=format&fit=crop&q=80",
                  "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=1200&auto=format&fit=crop&q=80",
                  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&auto=format&fit=crop&q=80"
                ];
                return (
                  <>
                    {heroBgs.map((imgSrc, idx) => (
                      <div
                        key={idx}
                        className="absolute inset-0 z-0 bg-cover bg-center transition-opacity duration-[1500ms] ease-in-out"
                        style={{
                          backgroundImage: `url(${imgSrc})`,
                          opacity: idx === activeHeroBgIdx ? 1 : 0,
                        }}
                        referrerPolicy="no-referrer"
                      />
                    ))}

                    {/* Floating Manual Slide Controls */}
                    {heroBgs.length > 1 && (
                      <>
                        {/* Slide Left Button */}
                        <button
                          onClick={() => {
                            setActiveHeroBgIdx((prev) => (prev - 1 + heroBgs.length) % heroBgs.length);
                          }}
                          className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 bg-slate-950/60 hover:bg-slate-950/85 border-2 border-white/40 hover:border-lime-400 text-white hover:text-lime-400 p-2 md:p-3 rounded-full transition-all cursor-pointer backdrop-blur-xs flex items-center justify-center group"
                          aria-label="Previous Slide"
                        >
                          <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 group-hover:-translate-x-0.5 transition-transform" />
                        </button>

                        {/* Slide Right Button */}
                        <button
                          onClick={() => {
                            setActiveHeroBgIdx((prev) => (prev + 1) % heroBgs.length);
                          }}
                          className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 bg-slate-950/60 hover:bg-slate-950/85 border-2 border-white/40 hover:border-lime-400 text-white hover:text-lime-400 p-2 md:p-3 rounded-full transition-all cursor-pointer backdrop-blur-xs flex items-center justify-center group"
                          aria-label="Next Slide"
                        >
                          <ChevronRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-0.5 transition-transform" />
                        </button>

                        {/* Interactive Pagination Indicators centered at the bottom of the hero segment */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                          {heroBgs.map((_, i) => (
                            <button
                              key={i}
                              onClick={() => {
                                setActiveHeroBgIdx(i);
                              }}
                              className={`h-2 rounded-full transition-all cursor-pointer ${
                                i === activeHeroBgIdx 
                                  ? "w-8 bg-lime-400 border border-lime-500" 
                                  : "w-2 bg-white/60 hover:bg-white border border-transparent"
                              }`}
                              title={`Go to slide ${i + 1}`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                );
              })()}

              {/* Outer decorative items floating inside background with slide-in traits */}
              <div className="absolute top-10 left-12 w-24 h-24 bg-blue-500/10 rounded-full blur-xl animate-pulse z-10"></div>
              <div className="absolute bottom-16 right-20 w-36 h-36 bg-lime-500/5 rounded-full blur-2xl animate-bounce z-10"></div>

              <div className="max-w-4xl mx-auto relative z-10 space-y-6 select-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.95)]">
                
                {/* Stunning Sliding Entrance Text: Left-to-Right */}
                <div className={`transition-all duration-1000 transform ${mounted ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'}`}>
                  <span className="bg-lime-500/20 text-lime-400 border border-lime-500/30 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest">
                    🏆 STATION ROAD’S ELITE PRE-PRIMARY HUB
                  </span>
                </div>

                {/* Stunning Sliding Entrance Object: Down-to-Up */}
                <div className={`transition-all duration-1000 delay-200 transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}`}>
                  <h2 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase text-white tracking-tight leading-[1] drop-shadow-md">
                    WELCOMING <span className="text-lime-400">PLAYFUL</span> DISCOVERY
                  </h2>
                </div>

                {/* Tagline */}
                <p className={`text-base md:text-xl font-bold text-slate-200 max-w-2xl mx-auto tracking-normal transition-all duration-1000 delay-400 transform ${mounted ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
                  {data.tagline}
                </p>

                {/* Intro welcome copy */}
                <p className="text-xs md:text-sm font-medium leading-relaxed text-slate-300 max-w-3xl mx-auto">
                  {data.welcomeIntro}
                </p>

                <div className="pt-4 flex items-center justify-center gap-4 flex-wrap">
                  <button 
                    onClick={() => {
                      setActiveTab("parents");
                      setParentsView("apply");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="bg-lime-500 hover:bg-lime-600 text-slate-950 font-black text-xs tracking-wider uppercase px-7 py-4 rounded-2xl border-4 border-slate-950 shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-transform cursor-pointer"
                  >
                    Quick Tour & Application 📝
                  </button>
                  <button 
                    onClick={(e) => handleNavClick("playground", e)}
                    className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs tracking-wider uppercase px-7 py-4 rounded-2xl border-4 border-slate-700 hover:-translate-y-0.5 active:translate-y-0 transition-transform cursor-pointer"
                  >
                    Play in Toy Box 🕹️
                  </button>
                </div>
              </div>
            </section>

            {/* DYNAMIC TIMELINES & DIRECTIVES: CIRCULARS, EVENT CALENDAR, & STUDENT BIRTHDAYS (MOVED FIRST AS REQUESTED!) */}
            <section id="circulars" className="py-14 px-4 bg-white border-y-4 border-slate-900 select-none scroll-mt-20">
              <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  
                  {/* SCHOOL CIRCULAR BOARD notices */}
                  <div className="lg:col-span-1 space-y-4 font-sans">
                    <div className="flex items-center gap-2">
                      <span className="p-2 rounded-full bg-rose-100 border-2 border-slate-900 text-rose-500">
                        <BookOpen size={18} />
                      </span>
                      <h3 className="text-xl font-bold uppercase tracking-tight text-slate-900">Circular Board</h3>
                    </div>
                    <p className="text-xs text-slate-500 font-bold leading-relaxed">
                      Official notifications and guidelines published by the administrative principal office.
                    </p>

                    <div className="space-y-4 max-h-[450px] overflow-y-auto pr-1">
                      {data.circulars.map(c => (
                        <div key={c.id} className="p-4 bg-slate-50 rounded-2xl border-3 border-slate-900 shadow-xs relative">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">{c.date}</span>
                            <span className={`px-2 py-0.5 rounded text-[8px] uppercase font-bold border ${
                              c.priority === "High" 
                                ? 'bg-red-100 text-red-600 border-red-200 animate-pulse' 
                                : 'bg-slate-200 text-slate-600 border-slate-300'
                            }`}>
                              {c.priority} Priority
                            </span>
                          </div>
                          
                          <h4 className="text-sm font-extrabold text-slate-900 mb-1 leading-tight">{c.title}</h4>
                          <p className="text-xs font-medium leading-relaxed text-slate-600">{c.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ACTIVE SCHOOL EVENT CALENDAR */}
                  <div className="lg:col-span-1 space-y-4" id="calendars">
                    <div className="flex items-center gap-2 font-sans">
                      <span className="p-2 rounded-full bg-blue-100 border-2 border-slate-900 text-blue-500">
                        <Calendar size={18} />
                      </span>
                      <h3 className="text-xl font-bold uppercase tracking-tight text-slate-900">Events Directory</h3>
                    </div>
                    <p className="text-xs text-slate-500 font-bold leading-relaxed font-sans">
                      Join our lively celebrations, friendly competitions, and health monitoring schedules.
                    </p>

                    <div className="space-y-4 max-h-[450px] overflow-y-auto pr-1">
                      {data.events.map(ev => (
                        <div key={ev.id} className="p-4 bg-blue-50/50 rounded-2xl border-3 border-slate-900 shadow-xs">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] text-blue-600 font-mono font-bold uppercase">{ev.date} • {ev.time}</span>
                            <span className="text-[8px] font-mono tracking-wider bg-white border border-slate-900 px-2 py-0.5 rounded-full uppercase font-bold">
                              {ev.category}
                            </span>
                          </div>
                          <h4 className="text-sm font-extrabold text-slate-900 mb-1 leading-tight font-sans">{ev.title}</h4>
                          <p className="text-xs font-medium leading-relaxed text-slate-600">
                            {ev.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ADORABLE STUDENT BIRTHDAY TIMELINE (With animated cakes) */}
                  <div className="lg:col-span-1 space-y-4">
                    <div className="flex items-center gap-2 font-sans">
                      <span className="p-2 rounded-full bg-pink-100 border-2 border-slate-900 text-pink-500">
                        <Cake size={18} />
                      </span>
                      <h3 className="text-xl font-bold uppercase tracking-tight text-slate-900">Toddler Birthdays</h3>
                    </div>
                    <p className="text-xs text-slate-500 font-bold leading-relaxed font-sans">
                      We celebrate every child's seasonal milestone with organic cupcakes and personalized greetings!
                    </p>

                    <div className="bg-pink-100/30 border-3 border-dashed border-pink-400 rounded-3xl p-4 md:p-6 space-y-3 font-sans">
                      <div className="text-center font-bold text-xs uppercase text-pink-700 tracking-widest mb-2 flex items-center justify-center gap-1">
                        <span>⭐ CELEBRATING LIFE STAGES ⭐</span>
                      </div>

                      {data.birthdays.map(b => (
                        <div key={b.id} className="flex items-center justify-between p-3 bg-white border-2 border-slate-900 rounded-2xl shadow-xs hover:-translate-x-1 hover:border-pink-500 transition-all">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{b.avatar}</span>
                            <div>
                              <div className="text-sm font-extrabold text-slate-900 leading-none">{b.name}</div>
                              <span className="text-[10px] font-bold text-slate-500">{b.grade}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="bg-pink-500 text-white text-[10px] font-black px-2 mt-1 py-1 rounded-lg border border-pink-600 tracking-wider">
                              {b.date}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            </section>

            {/* THE INNOVATIVE AREA: SMART CLASSES, TODDLER PLAY-HUB, CERTIFIED MENTORS */}
            <section id="innovations" className="py-14 px-4 bg-slate-100 border-y-4 border-slate-900">
              <div className="max-w-7xl mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-12">
                  <span className="text-xs font-black uppercase tracking-widest text-lime-600">🔬 INNOVATIONS INDEX</span>
                  <h3 className="text-3xl md:text-4xl font-extrabold uppercase text-slate-900 mt-1">What Makes Us Extraordinary?</h3>
                  <p className="text-xs text-slate-500 font-bold mt-1">We host high technology installations specifically calibrated to boost toddler cognitive parameters.</p>
                </div>

                {/* Flex grids of Facilities showcasing cute subtopics lists sliding in */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {data.facilities.map((fac, idx) => (
                    <div 
                      key={fac.id}
                      className={`bg-white border-4 border-slate-900 rounded-3xl p-6 shadow-lg hover:scale-[1.02] hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row gap-6 ${
                        idx % 2 === 0 ? "md:translate-x-0" : "md:translate-x-0"
                      }`}
                    >
                      {/* Left icon banner */}
                      <div className="flex-shrink-0">
                        <div className="p-4 rounded-2xl bg-blue-100 border-2 border-slate-900 text-blue-600 inline-block">
                          {renderIcon(fac.icon, "w-8 h-8")}
                        </div>
                      </div>

                      {/* Right facets content details */}
                      <div className="flex-grow space-y-3">
                        <h4 className="text-lg font-black uppercase text-slate-900">{fac.title}</h4>
                        <p className="text-xs font-semibold leading-relaxed text-slate-600">
                          {fac.description}
                        </p>
                        
                        {/* Subtopics bullet layout */}
                        <div>
                          <span className="text-[10px] font-black uppercase text-indigo-500 tracking-wider">Programs Included:</span>
                          <div className="grid grid-cols-2 gap-2 mt-1.5">
                            {fac.subtopics.map((sub, sIdx) => (
                              <div key={sIdx} className="flex items-center gap-1.5 text-xs font-medium text-slate-700">
                                <span className="w-1.5 h-1.5 rounded-full bg-lime-500"></span>
                                <span>{sub}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ACADEMIC ENRICHMENTS & BEYOND ACADEMIC INITIATIVES */}
            <section className="py-14 px-4 max-w-7xl mx-auto">
              <div className="text-center max-w-2xl mx-auto mb-10">
                <span className="text-xs font-black uppercase tracking-widest text-indigo-600">🚀 CO-CURRICULAR EXPONENT</span>
                <h3 className="text-3xl md:text-4xl font-extrabold uppercase text-slate-900 mt-1">Beyond Standard Academics</h3>
                <p className="text-xs text-slate-500 font-bold mt-1">Swara childhood curriculum stretches into high cognitive gymnastics and climate empathy.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {data.beyondAcademics.map((b, idx) => (
                  <div key={b.id} className="bg-slate-900 text-white border-4 border-slate-900 rounded-3xl p-6 flex flex-col justify-between shadow-lg relative overflow-hidden">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="p-3 bg-slate-800 rounded-2xl text-lime-400 border border-slate-700 inline-block">
                          {renderIcon(b.icon, "w-6 h-6")}
                        </div>
                        <span className="text-[9px] font-mono tracking-widest text-slate-400">STAGE {idx+1}</span>
                      </div>

                      <h4 className="text-xl font-black uppercase text-white">{b.title}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                        {b.description}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-800">
                      <span className="text-[10px] font-mono tracking-wider uppercase text-yellow-400 block mb-2">Clubs Available:</span>
                      <div className="space-y-1.5">
                        {b.activities.map((act, actIdx) => (
                          <div key={actIdx} className="flex items-center gap-2 text-xs font-bold text-slate-200">
                            <span className="text-lime-400">✔</span>
                            <span>{act}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* THE DYNAMIC SCHOOL GALLERY & KIDS PLAY TOUR SECTION */}
            <section id="gallery" className="py-14 px-4 bg-white border-y-4 border-slate-900 scroll-mt-20">
              <div className="max-w-7xl mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-10">
                  <span className="text-xs font-black uppercase tracking-widest text-indigo-600 font-sans">🎬 PRINCIPAL APPROVED MEDIA FEED</span>
                  <h3 className="text-3xl md:text-4xl font-extrabold uppercase text-slate-900 mt-1 font-sans">Campus Life & Play Tour</h3>
                  <p className="text-xs text-slate-500 font-bold mt-1 font-sans">
                    Real-time snapshots and video highlights from our smart playrooms and creative playgrounds, approved directly by our Academic Principal sneha Sen. No mock placeholders!
                  </p>
                </div>

                {/* ADVANCED SEPARATE MEDIA GALLERY HUB CALLOUT BANNER */}
                <div className="bg-gradient-to-r from-indigo-900 to-slate-950 text-white rounded-3xl p-6 mb-10 border-4 border-slate-900 shadow-md flex flex-col md:flex-row items-center justify-between gap-6 text-left">
                  <div className="space-y-1 md:max-w-xl">
                    <span className="bg-amber-400 text-slate-905 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md tracking-wider inline-block">
                      DEDICATED PORTAL
                    </span>
                    <h4 className="text-xl font-black uppercase text-white">Standalone Topic-Based Media Hub</h4>
                    <p className="text-xs text-slate-300 font-sans leading-relaxed">
                      Parents can search specifically by designated topics (e.g., Art Festivals, Outdoor Playgrounds, Montessori Days) and access high-definition theatrical video lightboxes on our standalone media screen!
                    </p>
                  </div>
                  <button 
                    onClick={() => {
                      setParentsView("gallery");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase px-5 py-3.5 rounded-2xl border-3 border-slate-950 tracking-wider shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer whitespace-nowrap animate-bounce"
                  >
                    🎬 Open standalone Media Hub ↗
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 font-sans">
                  {(data.gallery || []).filter(item => item.approved).map((item) => (
                    <div 
                      key={item.id} 
                      className="bg-slate-50 border-4 border-slate-900 rounded-3xl overflow-hidden shadow-lg flex flex-col group relative hover:scale-[1.01] transition-transform duration-300"
                    >
                      {/* Media container */}
                      <div className="relative h-56 w-full bg-slate-950 overflow-hidden flex-shrink-0 border-b-4 border-slate-900">
                        {item.type === "video" ? (
                          <video 
                            src={item.url} 
                            controls 
                            loop 
                            muted
                            playsInline
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <img 
                            src={item.url} 
                            alt={item.title} 
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                          />
                        )}
                        
                        {/* Type indicator badge */}
                        <div className="absolute top-3 left-3 bg-slate-900/95 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-lg border border-slate-700">
                          {item.type === "video" ? "🎥 Video Clip" : "📸 Snapshot"}
                        </div>

                        {/* Approved Badge */}
                        <div className="absolute top-3 right-3 bg-lime-400 text-slate-950 text-[9px] font-black uppercase px-2.5 py-1 rounded-lg border-2 border-slate-900 shadow-sm flex items-center gap-1 font-extrabold select-none">
                          Approved by Principal ✓
                        </div>
                      </div>

                      {/* Content descriptor details */}
                      <div className="p-4 flex-grow flex flex-col justify-between space-y-3">
                        <p className="text-xs font-black uppercase text-slate-900 leading-snug font-sans">
                          {item.title}
                        </p>
                        
                        {/* Direct moderation option if principal unlocked */}
                        {isUnlocked && (
                          <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                            <span className="text-[9px] font-mono font-bold text-amber-500 uppercase tracking-widest bg-amber-50 px-1 py-0.5 rounded border border-amber-200 select-none">
                              Principal Mode Active
                            </span>
                            <button
                              onClick={() => {
                                const list = (data.gallery || []).map(g => g.id === item.id ? { ...g, approved: false } : g);
                                updateData({ ...data, gallery: list });
                              }}
                              className="bg-rose-100 hover:bg-rose-200 text-rose-700 px-2.5 py-1 rounded-xl text-[9px] font-black uppercase border border-rose-200 cursor-pointer transition-all"
                            >
                              Disapprove ✘
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* State when no items are approved */}
                {(!data.gallery || data.gallery.filter(item => item.approved).length === 0) && (
                  <div className="text-center py-12 bg-slate-50 border-4 border-dashed border-slate-200 rounded-3xl font-sans">
                    <span className="text-4xl">🔐</span>
                    <h4 className="text-sm font-extrabold text-slate-750 uppercase mt-2">Gallery Feeds Modifiable</h4>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                      No media is currently approved by the principal. Please unlock the Admin console above to browse the media pool and approve photos/videos.
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* INTENTIONAL MOOD: PRINCIPAL & FOUNDER DIRECTOR PHILOSOPHIES */}
            <section id="leadership" className="py-14 px-4 bg-blue-50/50 border-t-4 border-slate-900">
              <div className="max-w-7xl mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-12">
                  <span className="text-xs font-black uppercase tracking-widest text-blue-600">📜 GUIDING PILOT WORDS</span>
                  <h3 className="text-3xl md:text-4xl font-extrabold uppercase text-slate-900 mt-1">Our Leadership Philosophy</h3>
                  <p className="text-xs text-slate-500 font-bold mt-1">Driven by visionaries combining childhood wisdom with robust visual infrastructure systems.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  
                  {/* Director philosophy block */}
                  <div className="bg-white border-4 border-slate-900 rounded-3xl p-6 md:p-8 shadow-md flex flex-col md:flex-row gap-6 relative">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl border-3 border-slate-900 overflow-hidden flex-shrink-0 bg-slate-300">
                      <img src={data.philosophies.director.photo} alt={data.philosophies.director.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="space-y-3">
                      <span className="bg-rose-100 text-rose-600 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border border-rose-200 inline-block">
                        {data.philosophies.director.role}
                      </span>
                      <h4 className="text-xl font-black text-slate-900">{data.philosophies.director.name}</h4>
                      <p className="text-xs font-medium italic text-slate-600 leading-relaxed">
                        "{data.philosophies.director.message}"
                      </p>
                    </div>
                  </div>

                  {/* Principal philosophy block */}
                  <div className="bg-white border-4 border-slate-900 rounded-3xl p-6 md:p-8 shadow-md flex flex-col md:flex-row gap-6 relative">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl border-3 border-slate-900 overflow-hidden flex-shrink-0 bg-slate-300">
                      <img src={data.philosophies.principal.photo} alt={data.philosophies.principal.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="space-y-3">
                      <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border border-blue-200 inline-block">
                        {data.philosophies.principal.role}
                      </span>
                      <h4 className="text-xl font-black text-slate-900">{data.philosophies.principal.name}</h4>
                      <p className="text-xs font-medium italic text-slate-600 leading-relaxed">
                        "{data.philosophies.principal.message}"
                      </p>
                    </div>
                  </div>

                </div>

                {/* SCHOOL MISSION BLOCK — EDITABLE IN CODES */}
                <div className="mt-10 bg-slate-900 text-white rounded-3xl border-4 border-slate-900 p-6 md:p-8 shadow-xl">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                    <div className="lg:col-span-1 space-y-3">
                      <span className="bg-lime-500/20 text-lime-400 text-xs px-2.5 py-1 rounded border border-lime-500/20 font-black uppercase tracking-wider inline-block">
                        FOUNDATIONAL ARCH
                      </span>
                      <h4 className="text-2xl md:text-3xl font-black uppercase leading-tight">
                        {data.mission.heading}
                      </h4>
                      <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                        {data.mission.description}
                      </p>
                    </div>

                    <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {data.mission.pillars.map((pil, pilIdx) => (
                        <div key={pilIdx} className="bg-slate-800 rounded-2xl p-4 border border-slate-700/60 flex items-start gap-3">
                          <span className="text-lime-400 text-lg flex-shrink-0 mt-0.5">⭐</span>
                          <span className="text-xs font-bold leading-relaxed text-slate-200">{pil}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* PRE-PRIMARY SCHOOL ACHIEVEMENTS PORTFOLIO */}
            <section id="achievements" className="py-14 px-4 bg-slate-50 md:py-16 select-none">
              <div className="max-w-7xl mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-10">
                  <span className="text-xs font-black uppercase tracking-widest text-yellow-600">🏆 LOCAL REPUTATIONS</span>
                  <h3 className="text-3xl md:text-4xl font-extrabold uppercase text-slate-900 mt-1">Our Stellar Achievements</h3>
                  <p className="text-xs text-slate-500 font-bold mt-1">Reflecting standard milestones and gold class credentials built securely year after year.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {data.achievements.map(ach => (
                    <div key={ach.id} className="bg-white border-4 border-slate-900 rounded-3xl p-6 shadow-md relative overflow-hidden flex flex-col justify-between">
                      {/* Star glow overlay */}
                      <span className="absolute top-4 right-4 text-3xl opacity-20">🏆</span>
                      
                      <div className="space-y-3">
                        <span className="bg-yellow-100 text-yellow-800 border border-yellow-200 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase inline-block">
                          {ach.score}
                        </span>
                        <h4 className="text-lg font-black text-slate-900 uppercase leading-snug">{ach.title}</h4>
                        <p className="text-xs font-semibold leading-relaxed text-slate-600">
                          {ach.description}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] font-mono font-bold text-slate-400">
                        CONFERRED IN: {ach.date}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* FACULTY AND CO-INSTRUCTORS CAROUSEL */}
            <section className="py-14 px-4 bg-slate-900 text-white border-t-4 border-slate-900">
              <div className="max-w-7xl mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-12">
                  <span className="text-xs font-black uppercase tracking-widest text-lime-400">👩‍🏫 THE MENTORS ROW</span>
                  <h3 className="text-3xl md:text-4xl font-extrabold uppercase mt-1">Our Empathetic Faculties</h3>
                  <p className="text-xs text-slate-400 font-bold mt-1">Specialists certified in foundational childhood psychology, phonetic grids, and safe caretaking.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {data.faculties.map(t => (
                    <div key={t.id} className="bg-slate-950 border-3 border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-lime-400 transition-colors">
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-full border-2 border-lime-400 overflow-hidden bg-slate-850 flex-shrink-0">
                            <img src={t.photo} alt={t.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <h4 className="text-base font-black text-white">{t.name}</h4>
                            <div className="text-xs font-semibold text-lime-400">{t.role}</div>
                            <span className="text-[9px] font-mono text-slate-500 uppercase">{t.experience}</span>
                          </div>
                        </div>
                        <p className="text-xs font-medium italic text-slate-300 leading-relaxed">
                          "{t.review}"
                        </p>
                      </div>

                      <div className="mt-4 pt-4 border-t border-slate-900 flex items-center justify-between text-[11px] font-medium text-slate-500">
                        <span>🛡 Certified Safeguarder</span>
                        <span>⭐ Solid Care</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* POPULAR PARENTS QUESTIONS & FAQS (ACCORDION STYLE) */}
            <section className="py-14 px-4 max-w-5xl mx-auto select-none">
              <div className="text-center max-w-2xl mx-auto mb-10">
                <span className="text-xs font-black uppercase tracking-widest text-indigo-600">❓ CONCERN SOLVERS</span>
                <h3 className="text-3xl md:text-4xl font-extrabold uppercase text-slate-900 mt-1">Popular Parents Questions</h3>
                <p className="text-xs text-slate-500 font-bold mt-1">Clear insights on security indexes, fees schedules, and child speech support systems.</p>
              </div>

              <div className="space-y-3">
                {data.faqs.map(faq => {
                  const isOpened = openFaqId === faq.id;
                  return (
                    <div 
                      key={faq.id} 
                      className="bg-white border-3 border-slate-900 rounded-2xl shadow-sm overflow-hidden transition-all text-xs"
                    >
                      <button 
                        onClick={() => setOpenFaqId(isOpened ? null : faq.id)}
                        className="w-full text-left p-4 md:p-5 font-black text-slate-900 text-sm md:text-base flex items-center justify-between gap-4 hover:bg-slate-50"
                      >
                        <span className="leading-tight uppercase">{faq.question}</span>
                        <ChevronDown 
                          size={18} 
                          className={`flex-shrink-0 transform transition-transform duration-300 ${isOpened ? 'rotate-180 text-blue-600' : 'text-slate-500'}`} 
                        />
                      </button>

                      {isOpened && (
                        <div className="px-5 pb-5 pt-1 text-slate-600 font-medium leading-relaxed border-t-2 border-dashed border-slate-100">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* INTERACTIVE 3D TOY-BOX SANDBOX PLAYGROUND */}
            <section id="playground" className="py-12 px-4 max-w-7xl mx-auto select-none scroll-mt-24">
              <div className="text-center max-w-2xl mx-auto mb-8">
                <span className="text-xs font-black uppercase tracking-widest text-blue-600">🎮 GAMIFIED GYROSCOPE MECHANIC</span>
                <h3 className="text-3xl md:text-4xl font-extrabold uppercase text-slate-900 mt-1 font-sans">Interactive 3D Play-Yard</h3>
                <p className="text-xs text-slate-500 font-bold mt-1 font-sans">The mouse cursor is a magical gravity wand. Hover near toy vectors to tilt them, click to trigger bursts!</p>
              </div>

              {/* RENDER THE MAJESTIC INTERACTIVE CANVAS PLAYGROUND */}
              <ActivePlayground />
            </section>

          </div>
        )) : (
          
          /* ADMINISTRATIVE CONSOLE PANEL VIEW */
          <div className="py-8 px-4 max-w-7xl mx-auto select-none">
            
            {/* Password verification banner if not logged in */}
            {!isUnlocked ? (
              <div className="max-w-md mx-auto bg-white border-4 border-slate-900 rounded-3xl p-6 shadow-2xl text-center space-y-4">
                <span className="text-3xl">🔐</span>
                <h3 className="text-2xl font-black text-slate-900 uppercase">Principal Portal Gateway</h3>
                <p className="text-xs text-slate-500 font-semibold">
                  This administrative panel is password protected by Swara Basti systems. Enter passkey below to edit anything including maps and logo structures.
                </p>
                
                <div className="bg-blue-50 border border-blue-200 text-blue-800 text-[10px] font-bold p-2.5 rounded-lg">
                  💡 Hint: Enter <span className="underline font-mono">basti2026</span> as passkey!
                </div>

                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (adminPassword.trim() === "basti2026") {
                    setIsUnlocked(true);
                  } else {
                    alert("Invalid administrative passkey! Please try again.");
                  }
                }} className="space-y-3">
                  <input 
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Enter passkey..."
                    className="w-full bg-slate-100 border-2 border-slate-900 rounded-xl px-3 py-2 text-center text-sm font-semibold outline-none focus:bg-white"
                  />
                  <button 
                    type="submit"
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase py-3 rounded-xl shadow border border-slate-950"
                  >
                    Unlock Administrative Console
                  </button>
                </form>
              </div>
            ) : (
              
              /* UNLOCKED MANAGEMENT WORKSPACE */
              <div className="bg-white border-4 border-slate-900 rounded-3xl p-4 md:p-6 shadow-xl space-y-6">
                
                {/* Heading details */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b-2 border-slate-100 pb-4">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 uppercase flex items-center gap-2">
                      <span>👑</span> Administrative Core Control
                    </h2>
                    <span className="text-xs text-slate-500 font-bold">
                      Any text, address, or calendar modified here updates the website live and grounds the AI Bot context.
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button 
                      onClick={handleResetData}
                      className="bg-rose-100 hover:bg-rose-200 text-rose-700 px-3.5 py-2 rounded-xl text-xs font-black uppercase border border-rose-200 transition-colors"
                    >
                      Reset Defaults
                    </button>
                    <button 
                      onClick={() => setIsUnlocked(false)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-black uppercase border border-slate-200 transition-colors"
                    >
                      Lock Console
                    </button>
                  </div>
                </div>

                {/* Sub-navigation tabs in Admin workspace */}
                <div className="flex overflow-x-auto gap-2 bg-slate-100 p-1.5 rounded-2xl scrollbar-none font-bold text-xs uppercase pt-2">
                  <button 
                    onClick={() => setAdminTab("branding")}
                    className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${adminTab === "branding" ? 'bg-slate-905 text-white shadow-sm bg-slate-900' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    Branding & Admissions
                  </button>
                  <button 
                    onClick={() => setAdminTab("editorial")}
                    className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${adminTab === "editorial" ? 'bg-slate-905 text-white shadow-sm bg-slate-900' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    Mission & Philosophies
                  </button>
                  <button 
                    onClick={() => setAdminTab("gallery")}
                    className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${adminTab === "gallery" ? 'bg-slate-905 text-white shadow-sm bg-slate-900' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    🎬 Media & Galleries
                  </button>
                  <button 
                    onClick={() => setAdminTab("calendars")}
                    className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${adminTab === "calendars" ? 'bg-slate-905 text-white shadow-sm bg-slate-900' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    Calendars & FAQ
                  </button>
                  <button 
                    onClick={() => setAdminTab("faculties")}
                    className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${adminTab === "faculties" ? 'bg-slate-905 text-white shadow-sm bg-slate-900' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    Faculties & Mentors
                  </button>
                  <button 
                    onClick={() => setAdminTab("applications")}
                    className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${adminTab === "applications" ? 'bg-slate-905 text-white shadow-sm bg-slate-900' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    📝 Admissions Desk ({applications.length})
                  </button>
                </div>

                {/* SUB TAB CONTENT: BRANDING & GENERAL SETTINGS */}
                {adminTab === "branding" && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-black uppercase text-indigo-600 tracking-wider">Configure General Slogans & Admissions</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-black uppercase text-slate-600 mb-1">Corporate Academy Name</label>
                        <input 
                          type="text" 
                          value={data.name} 
                          onChange={(e) => updateData({ ...data, name: e.target.value })}
                          className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-3 py-2 text-xs font-bold font-mono outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black uppercase text-slate-600 mb-1">Station Address Line Seal</label>
                        <input 
                          type="text" 
                          value={data.logoDescription} 
                          onChange={(e) => updateData({ ...data, logoDescription: e.target.value })}
                          className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-3 py-2 text-xs font-bold font-mono outline-none"
                        />
                      </div>

                      <div className="col-span-1 md:col-span-2">
                        <label className="block text-xs font-black uppercase text-slate-600 mb-1">Hero Title Slogan Tagline</label>
                        <input 
                          type="text" 
                          value={data.tagline} 
                          onChange={(e) => updateData({ ...data, tagline: e.target.value })}
                          className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-3 py-2 text-xs font-bold font-mono outline-none"
                        />
                      </div>

                      <div className="col-span-1 md:col-span-2">
                        <label className="block text-xs font-black uppercase text-slate-600 mb-1">Welcome Preface Body Draft</label>
                        <textarea 
                          rows={3}
                          value={data.welcomeIntro} 
                          onChange={(e) => updateData({ ...data, welcomeIntro: e.target.value })}
                          className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold leading-relaxed font-mono outline-none"
                        />
                      </div>
                    </div>

                    <div className="bg-yellow-50 p-4 border-2 border-dashed border-yellow-300 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase text-yellow-800 flex items-center gap-1.5">
                          ⭐ ACTIVE PUBLIC ADMISSION POPUP BANNER PROPERTIES
                        </span>
                        
                        <label className="inline-flex items-center cursor-pointer select-none">
                          <input 
                            type="checkbox" 
                            checked={data.admissionBanner.show} 
                            onChange={(e) => updateData({ 
                              ...data, 
                              admissionBanner: { ...data.admissionBanner, show: e.target.checked } 
                            })}
                            className="sr-only peer" 
                          />
                          <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-lime-500 relative"></div>
                          <span className="ml-2 text-xs font-semibold text-slate-700">Show Popup on Load</span>
                        </label>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                        <div>
                          <label className="block text-[10px] font-black uppercase text-slate-600">Banner Alert Heading Title</label>
                          <input 
                            type="text" 
                            value={data.admissionBanner.title} 
                            onChange={(e) => updateData({ 
                              ...data, 
                              admissionBanner: { ...data.admissionBanner, title: e.target.value } 
                            })}
                            className="w-full bg-white border border-slate-350 rounded-lg px-2.5 py-1.5 text-xs font-semibold"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black uppercase text-slate-600">Call-to-Action Link Text</label>
                          <input 
                            type="text" 
                            value={data.admissionBanner.actionText} 
                            onChange={(e) => updateData({ 
                              ...data, 
                              admissionBanner: { ...data.admissionBanner, actionText: e.target.value } 
                            })}
                            className="w-full bg-white border border-slate-350 rounded-lg px-2.5 py-1.5 text-xs font-semibold"
                          />
                        </div>
                        <div className="col-span-1 md:col-span-2">
                          <label className="block text-[10px] font-black uppercase text-slate-600">Alert description message</label>
                          <input 
                            type="text" 
                            value={data.admissionBanner.description} 
                            onChange={(e) => updateData({ 
                              ...data, 
                              admissionBanner: { ...data.admissionBanner, description: e.target.value } 
                            })}
                            className="w-full bg-white border border-slate-350 rounded-lg px-2.5 py-1.5 text-xs font-semibold"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black uppercase text-slate-600">Deadline date warning label</label>
                          <input 
                            type="text" 
                            value={data.admissionBanner.deadline} 
                            onChange={(e) => updateData({ 
                              ...data, 
                              admissionBanner: { ...data.admissionBanner, deadline: e.target.value } 
                            })}
                            className="w-full bg-white border border-slate-350 rounded-lg px-2.5 py-1.5 text-xs font-semibold"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black uppercase text-slate-600">Admission Campaign Telephone</label>
                          <input 
                            type="text" 
                            value={data.admissionBanner.contactPhone} 
                            onChange={(e) => updateData({ 
                              ...data, 
                              admissionBanner: { ...data.admissionBanner, contactPhone: e.target.value } 
                            })}
                            className="w-full bg-white border border-slate-350 rounded-lg px-2.5 py-1.5 text-xs font-semibold"
                          />
                        </div>
                      </div>
                    </div>

                    {/* CUSTOM LOGO AND ACTIVE THEME DESIGN VIBE CONFIGURATION */}
                    <div className="border-t-4 border-slate-900 pt-6 space-y-6">
                      <h4 className="text-xs font-black uppercase text-slate-800 flex items-center gap-1.5">
                        🎨 CUSTOM LOGO & COLOR THEMES (PRINCIPAL CONTROLS)
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-5 border-4 border-slate-900 rounded-3xl">
                        
                        {/* Section A: Custom uploaded school logo */}
                        <div className="space-y-4 text-left">
                          <div>
                            <strong className="text-xs font-black uppercase text-slate-900 block">A. Custom School logo</strong>
                            <p className="text-[11px] text-slate-500 font-sans mt-0.5">
                              Upload a custom emblem or icon from local storage or select one of our premium pre-primary designs. Let it highlight throughout the website!
                            </p>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="w-24 h-24 rounded-3xl bg-white border-2 border-slate-900 flex items-center justify-center p-2 overflow-hidden shadow-sm flex-shrink-0">
                              {data.logoImg ? (
                                <img src={data.logoImg} alt="Preview Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                              ) : (
                                <SwaraLogo size={80} interactive={false} />
                              )}
                            </div>

                            <div className="space-y-2 flex-grow">
                              <input
                                id="logo-uploader-input"
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onload = (readerEvent) => {
                                      const base64Src = readerEvent.target?.result as string;
                                      updateData({
                                        ...data,
                                        logoImg: base64Src,
                                      });
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                                className="hidden"
                              />
                              <div className="flex flex-col gap-2 w-full">
                                <div className="flex flex-wrap gap-2">
                                  <button
                                    onClick={() => document.getElementById("logo-uploader-input")?.click()}
                                    className="bg-yellow-400 hover:bg-yellow-500 text-slate-950 px-3 py-2 rounded-xl text-[10px] font-black uppercase border border-slate-900 cursor-pointer shadow-sm"
                                  >
                                    Upload From Device / Gallery
                                  </button>
                                  {data.logoImg && (
                                    <button
                                      onClick={() => updateData({ ...data, logoImg: undefined })}
                                      className="bg-rose-100 hover:bg-rose-200 text-rose-700 px-3 py-2 rounded-xl text-[10px] font-black uppercase border border-rose-200 cursor-pointer"
                                    >
                                      Reset to Default logo
                                    </button>
                                  )}
                                </div>
                                
                                <div className="space-y-1">
                                  <label className="block text-[8px] font-black uppercase text-slate-500">Or Paste Custom Logo Image URL</label>
                                  <input 
                                    type="text" 
                                    placeholder="e.g. https://images.unsplash.com/your-logo"
                                    value={data.logoImg || ""}
                                    onChange={(e) => updateData({ ...data, logoImg: e.target.value || undefined })}
                                    className="w-full bg-white border border-slate-250 rounded-lg px-2.5 py-1 text-[10px] font-mono outline-none focus:border-slate-900"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Section B: Theme Vibe palette selection */}
                        <div className="space-y-4 text-left">
                          <div>
                            <strong className="text-xs font-black uppercase text-slate-900 block">B. Active Theme Color Vibe</strong>
                            <p className="text-[11px] text-slate-500 font-sans mt-0.5">
                              Change the dynamic styling of buttons, widgets, accents, and components right now. Select a pre-primary mood!
                            </p>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-black uppercase text-[10px]">
                            {[
                              { id: "vibrant", name: "Vibrant Sky Blue", color: "#2563eb", badge: "bg-blue-600" },
                              { id: "emerald", name: "Emerald Montessori", color: "#16a34a", badge: "bg-emerald-600" },
                              { id: "crimson", name: "Crimson Berry", color: "#be123c", badge: "bg-rose-700" },
                              { id: "violet", name: "Violet Playroom", color: "#7c3aed", badge: "bg-violet-600" },
                              { id: "amber", name: "Amber Sunflower", color: "#d97706", badge: "bg-amber-600" },
                              { id: "teal", name: "Teal Oceans", color: "#0d9488", badge: "bg-teal-600" },
                            ].map((v) => (
                              <button
                                key={v.id}
                                onClick={() => {
                                  updateData({
                                    ...data,
                                    themeDesign: {
                                      ...data.themeDesign,
                                      themeVibe: v.id as any,
                                      primaryColor: v.color
                                    }
                                  });
                                }}
                                className={`p-2 rounded-xl flex flex-col items-center gap-1 border-2 text-center cursor-pointer transition-all ${
                                  data.themeDesign?.themeVibe === v.id
                                    ? "bg-slate-900 text-white border-slate-900 shadow-md"
                                    : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                                }`}
                              >
                                <span className={`w-3.5 h-3.5 rounded-full ${v.badge} border border-white/20 shadow-inner`}></span>
                                <span className="leading-none text-[8px]">{v.name}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                      </div>
                    </div>

                  </div>
                )}

                {/* SUB TAB CONTENT: MISSION & PHILOSOPHICAL EDITORIALS */}
                {adminTab === "editorial" && (
                  <div className="space-y-6">
                    <h3 className="text-sm font-black uppercase text-indigo-600 tracking-wider">Configure School Mission & Leadership</h3>

                    <div className="p-4 bg-slate-50 rounded-2xl space-y-4">
                      <h4 className="text-xs font-black uppercase text-slate-800">Founder Director’s Speech</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-left">
                        <div>
                          <label className="block text-[10px] font-black uppercase text-slate-600">Full Name</label>
                          <input 
                            type="text" 
                            value={data.philosophies.director.name} 
                            onChange={(e) => updateData({ 
                              ...data, 
                              philosophies: { 
                                ...data.philosophies, 
                                director: { ...data.philosophies.director, name: e.target.value } 
                              } 
                            })}
                            className="w-full bg-white border border-slate-250 rounded-lg px-2.5 py-1.5 text-xs font-semibold"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-[10px] font-black uppercase text-slate-600">Director Photo (Upload or Paste URL)</label>
                          <div className="flex gap-2 items-center">
                            <input 
                              type="text" 
                              value={data.philosophies.director.photo} 
                              onChange={(e) => updateData({ 
                                ...data, 
                                philosophies: { 
                                  ...data.philosophies, 
                                  director: { ...data.philosophies.director, photo: e.target.value } 
                                } 
                              })}
                              placeholder="Paste public image URL..."
                              className="flex-grow bg-white border border-slate-250 rounded-lg px-2.5 py-1.5 text-xs font-mono font-semibold"
                            />
                            <input 
                              id="director-photo-file-picker"
                              type="file" 
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = (re) => {
                                    updateData({
                                      ...data,
                                      philosophies: {
                                        ...data.philosophies,
                                        director: { ...data.philosophies.director, photo: re.target?.result as string }
                                      }
                                    });
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => document.getElementById("director-photo-file-picker")?.click()}
                              className="bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold uppercase py-2 px-3 rounded-lg border border-slate-950 whitespace-nowrap cursor-pointer"
                            >
                              📁 Upload
                            </button>
                          </div>
                        </div>
                        <div className="md:col-span-3">
                          <label className="block text-[10px] font-black uppercase text-slate-600">Philosophy Message</label>
                          <textarea 
                            rows={3}
                            value={data.philosophies.director.message} 
                            onChange={(e) => updateData({ 
                              ...data, 
                              philosophies: { 
                                ...data.philosophies, 
                                director: { ...data.philosophies.director, message: e.target.value } 
                              } 
                            })}
                            className="w-full bg-white border border-slate-250 rounded-lg p-2 text-xs font-semibold"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-2xl space-y-4">
                      <h4 className="text-xs font-black uppercase text-slate-800">Academic Principal’s Thoughts</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-left">
                        <div>
                          <label className="block text-[10px] font-black uppercase text-slate-600">Full Name</label>
                          <input 
                            type="text" 
                            value={data.philosophies.principal.name} 
                            onChange={(e) => updateData({ 
                              ...data, 
                              philosophies: { 
                                ...data.philosophies, 
                                principal: { ...data.philosophies.principal, name: e.target.value } 
                              } 
                            })}
                            className="w-full bg-white border border-slate-250 rounded-lg px-2.5 py-1.5 text-xs font-semibold"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-[10px] font-black uppercase text-slate-600">Principal Photo (Upload or Paste URL)</label>
                          <div className="flex gap-2 items-center">
                            <input 
                              type="text" 
                              value={data.philosophies.principal.photo} 
                              onChange={(e) => updateData({ 
                                ...data, 
                                philosophies: { 
                                  ...data.philosophies, 
                                  principal: { ...data.philosophies.principal, photo: e.target.value } 
                                } 
                              })}
                              placeholder="Paste public image URL..."
                              className="flex-grow bg-white border border-slate-250 rounded-lg px-2.5 py-1.5 text-xs font-mono font-semibold"
                            />
                            <input 
                              id="principal-photo-file-picker"
                              type="file" 
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = (re) => {
                                    updateData({
                                      ...data,
                                      philosophies: {
                                        ...data.philosophies,
                                        principal: { ...data.philosophies.principal, photo: re.target?.result as string }
                                      }
                                    });
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => document.getElementById("principal-photo-file-picker")?.click()}
                              className="bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold uppercase py-2 px-3 rounded-lg border border-slate-950 whitespace-nowrap cursor-pointer"
                            >
                              📁 Upload
                            </button>
                          </div>
                        </div>
                        <div className="md:col-span-3">
                          <label className="block text-[10px] font-black uppercase text-slate-600">Message</label>
                          <textarea 
                            rows={3}
                            value={data.philosophies.principal.message} 
                            onChange={(e) => updateData({ 
                              ...data, 
                              philosophies: { 
                                ...data.philosophies, 
                                principal: { ...data.philosophies.principal, message: e.target.value } 
                              } 
                            })}
                            className="w-full bg-white border border-slate-250 rounded-lg p-2 text-xs font-semibold"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* SUB TAB CONTENT: PRINCIPAL MEDIA GALLERY MODERATION */}
                {adminTab === "gallery" && (
                  <div className="space-y-6 font-sans">
                    <div className="bg-slate-900 text-white rounded-3xl p-5 border-4 border-slate-900 flex flex-col md:flex-row items-center justify-between gap-6 relative select-none">
                      <div className="space-y-1 text-left">
                        <span className="bg-lime-400 text-slate-900 text-[9px] font-black uppercase px-2 py-0.5 rounded-md tracking-wider">
                          REAL-TIME MEDIA HUB
                        </span>
                        <h3 className="text-xl font-black uppercase tracking-tight">Principal’s Gallery Approving Station</h3>
                        <p className="text-xs text-slate-350 leading-relaxed max-w-xl font-medium">
                          Parents can only view photos/videos that you explicitly **approve** in this panel. You can delete outdated media or instantly **upload new imagery directly from your computer or phone!**
                        </p>
                      </div>
                      
                      <div className="flex-shrink-0 bg-yellow-400 text-slate-950 font-black text-xs uppercase tracking-wider border-2 border-slate-900 shadow-md p-3 rounded-2xl">
                        Total Pool: {(data.gallery || []).length} Clips
                      </div>
                    </div>

                    {/* DYNAMIC MEDIA UPLOADER CARD */}
                    <div className="bg-white border-4 border-slate-900 rounded-3xl p-6 space-y-4">
                      <div className="border-b-2 border-slate-200 pb-2 flex items-center justify-between">
                        <h4 className="text-sm font-black uppercase text-slate-950 flex items-center gap-1.5 whitespace-nowrap">
                          📤 REGISTER NEW PHOTO/VIDEO MOMENT TO HUB
                        </h4>
                        <span className="text-[9px] text-slate-400 uppercase tracking-widest font-mono font-bold">Principal Moderation Active</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                        {/* Interactive drag area/file picker */}
                        <div className="md:col-span-5 space-y-3">
                          <label className="block text-[10px] font-black uppercase text-slate-600 mb-1">Upload Media From Device Gallery</label>
                          <input
                            id="admin-gallery-file-field"
                            type="file"
                            accept="image/*,video/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const isVideo = file.type.startsWith("video/");
                                const reader = new FileReader();
                                reader.onload = (readerEvent) => {
                                  const base64Src = readerEvent.target?.result as string;
                                  
                                  // Update file-state
                                  (window as any)._pendingMediaFile = base64Src;
                                  (window as any)._pendingMediaType = isVideo ? "video" : "image";
                                  
                                  // Preview helper
                                  const previewEl = document.getElementById("admin-media-file-preview");
                                  if (previewEl) {
                                    previewEl.innerHTML = isVideo 
                                      ? `<video src="${base64Src}" controls class="w-full h-full object-cover" />`
                                      : `<img src="${base64Src}" class="w-full h-full object-cover" />`;
                                  }

                                  // Set recommended heading in title input based on filename
                                  const titleInput = document.getElementById("admin-media-title-field") as HTMLInputElement;
                                  if (titleInput && !titleInput.value) {
                                    titleInput.value = file.name.split(".")[0].replace(/[-_]/g, " ");
                                  }
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="hidden"
                          />
                          
                          <div 
                            onClick={() => document.getElementById("admin-gallery-file-field")?.click()}
                            className="border-4 border-dashed border-slate-200 hover:border-slate-400 rounded-2xl h-44 cursor-pointer flex flex-col items-center justify-center p-4 bg-slate-50 transition-colors relative overflow-hidden text-center"
                          >
                            <div id="admin-media-file-preview" className="absolute inset-0 z-0"></div>
                            
                            <div className="relative z-10 space-y-1">
                              <span className="text-3xl animate-bounce">📁</span>
                              <strong className="text-xs font-black uppercase text-slate-900 block">Click to upload image/video</strong>
                              <p className="text-[10px] text-slate-500 font-medium">Accepts PNG, JPG, WEBP & MP4 Clips</p>
                            </div>
                          </div>
                        </div>

                        {/* Text form inputs and URL specification */}
                        <div className="md:col-span-7 space-y-3.5 text-left">
                          <div>
                            <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                              Title / Description Caption
                            </label>
                            <input 
                              id="admin-media-title-field"
                              type="text" 
                              placeholder="e.g. Smart Playroom Sensory Counting Games"
                              className="w-full bg-slate-50 border-2 border-slate-200 focus:border-slate-900 rounded-xl px-3 py-2 text-xs font-bold outline-none"
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                                Topic / Category Tag
                              </label>
                              <input 
                                id="admin-media-topic-field"
                                type="text" 
                                placeholder="e.g. Montessori Playrooms"
                                defaultValue="Montessori Playrooms"
                                className="w-full bg-slate-50 border-2 border-slate-200 focus:border-slate-900 rounded-xl px-3 py-2 text-xs font-bold outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                                Media Type (If using URL)
                              </label>
                              <select 
                                id="admin-media-type-field"
                                className="w-full bg-slate-50 border-2 border-slate-200 focus:border-slate-900 rounded-xl px-3 py-2 text-xs font-bold outline-none"
                              >
                                <option value="image">Photo / Image Highlight</option>
                                <option value="video">Video clip highlight</option>
                              </select>
                            </div>
                          </div>

                          {/* Quick topic helper tag buttons */}
                          <div className="space-y-1">
                            <span className="text-[9px] font-black uppercase text-slate-400">Or Select Standard Topic Hint:</span>
                            <div className="flex flex-wrap gap-1.5">
                              {["Montessori Playrooms", "Smart Classrooms", "Water Sports", "Art & Painting Gallery", "Outdoor Playgrounds"].map((tag) => (
                                <button
                                  key={tag}
                                  type="button"
                                  onClick={() => {
                                    const field = document.getElementById("admin-media-topic-field") as HTMLInputElement;
                                    if (field) field.value = tag;
                                  }}
                                  className="bg-slate-100 hover:bg-slate-200 dark:hover:bg-slate-300 text-slate-700 px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase transition-colors"
                                >
                                  #{tag}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-black uppercase text-slate-700 mb-1">
                              Alternative: Public Image/Video URL Source
                            </label>
                            <input 
                              id="admin-media-url-field"
                              type="text" 
                              placeholder="e.g. https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800"
                              className="w-full bg-slate-50 border-2 border-slate-200 focus:border-slate-900 rounded-xl px-3 py-2 text-xs font-bold outline-none font-mono"
                            />
                            <p className="text-[10px] text-slate-400 mt-1">If specified, we use this URL instead of the device file upload.</p>
                          </div>

                          <div className="pt-2">
                            <button
                              onClick={() => {
                                const titleInput = document.getElementById("admin-media-title-field") as HTMLInputElement;
                                const topicInput = document.getElementById("admin-media-topic-field") as HTMLInputElement;
                                const urlInput = document.getElementById("admin-media-url-field") as HTMLInputElement;
                                const typeSelect = document.getElementById("admin-media-type-field") as HTMLSelectElement;

                                const title = titleInput?.value || "Kids Play Interaction highlights";
                                const topic = topicInput?.value || "General Moments";
                                const urlSource = urlInput?.value;
                                
                                let fileData = (window as any)._pendingMediaFile;
                                let fileType = (window as any)._pendingMediaType || "image";

                                // If the URL is specified, prioritize it
                                if (urlSource && urlSource.trim().length > 0) {
                                  fileData = urlSource.trim();
                                  fileType = typeSelect?.value || "image";
                                }

                                if (!fileData) {
                                  alert("Please upload a file OR paste a public URL!");
                                  return;
                                }

                                const newItem: GalleryMedia = {
                                  id: "g-" + Date.now(),
                                  title: title,
                                  type: fileType as any,
                                  url: fileData,
                                  topic: topic,
                                  approved: true, // Approved immediately as it comes direct from principal
                                  source: "user"
                                };

                                updateData({
                                  ...data,
                                  gallery: [newItem, ...(data.gallery || [])]
                                });

                                // Clean up fields
                                if (titleInput) titleInput.value = "";
                                if (urlInput) urlInput.value = "";
                                if (topicInput) topicInput.value = "Montessori Playrooms";
                                (window as any)._pendingMediaFile = null;
                                const previewEl = document.getElementById("admin-media-file-preview");
                                if (previewEl) previewEl.innerHTML = "";
                              }}
                              className="w-full bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-2xl text-xs font-black uppercase cursor-pointer text-center"
                            >
                              Add Moment & Auto Approve ✓
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* DESIGNATED REGION: HERO SLIDESHOW IMAGES MANAGER */}
                    <div className="bg-white border-4 border-slate-900 rounded-3xl p-6 space-y-4">
                      <div className="border-b-2 border-slate-200 pb-2 flex items-center justify-between">
                        <div className="text-left">
                          <h4 className="text-sm font-black uppercase text-slate-950 flex items-center gap-1.5">
                            🖼️ DESIGNATED REGION: WELCOMING PLAYFUL DISCOVERY SLIDESHOW CANVAS
                          </h4>
                          <p className="text-[10px] text-slate-400 font-sans mt-0.5">
                            Upload multiple photos of the school that automatically slide in the background of your welcome hero banner.
                          </p>
                        </div>
                        <span className="text-[10px] bg-indigo-500 text-white font-black px-2.5 py-1 rounded-lg">
                          Active Slides: {data.heroImages?.length || 0}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        {/* Area A: Upload background image */}
                        <div className="md:col-span-5 bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3 text-left">
                          <strong className="text-xs font-black uppercase text-slate-900 block">Add New Background Card</strong>
                          
                          <input 
                            id="admin-hero-bg-file"
                            type="file" 
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (fileEvent) => {
                                  const base64Str = fileEvent.target?.result as string;
                                  const currentBgs = data.heroImages || [];
                                  updateData({
                                    ...data,
                                    heroImages: [...currentBgs, base64Str]
                                  });
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />

                          <button
                            type="button"
                            onClick={() => document.getElementById("admin-hero-bg-file")?.click()}
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black uppercase text-[10px] py-4 px-4 rounded-xl border border-slate-950 flex items-center justify-center gap-2 cursor-pointer shadow-md"
                          >
                            📁 Selected From Gallery Device
                          </button>

                          <div className="relative flex py-2 items-center">
                            <div className="flex-grow border-t border-slate-200"></div>
                            <span className="flex-shrink mx-2 text-[9px] uppercase font-black text-slate-400">Or Paste Image URL</span>
                            <div className="flex-grow border-t border-slate-200"></div>
                          </div>

                          <div className="space-y-2">
                            <input 
                              id="admin-hero-bg-url"
                              type="text" 
                              placeholder="e.g. https://images.unsplash.com/your-campus-image"
                              className="w-full bg-white border-2 border-slate-200 rounded-lg p-2 text-xs font-mono font-bold"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const el = document.getElementById("admin-hero-bg-url") as HTMLInputElement;
                                if (el && el.value.trim().length > 0) {
                                  const currentBgs = data.heroImages || [];
                                  updateData({
                                    ...data,
                                    heroImages: [...currentBgs, el.value.trim()]
                                  });
                                  el.value = "";
                                } else {
                                  alert("Please paste a valid image URL first!");
                                }
                              }}
                              className="w-full bg-lime-500 hover:bg-lime-600 text-slate-950 font-black uppercase text-[10px] py-2.5 rounded-lg border border-slate-900 cursor-pointer transition-colors"
                            >
                              Add Image URL Highlight ✓
                            </button>
                          </div>
                        </div>

                        {/* Area B: Current Slides list */}
                        <div className="md:col-span-7 bg-slate-50 rounded-2xl p-4 border border-slate-200 text-left space-y-3">
                          <strong className="text-xs font-black uppercase text-slate-900 block">Manage Background Queue (Live Slideshow)</strong>
                          
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-60 overflow-y-auto pr-1">
                            {(data.heroImages || []).map((img, index) => (
                              <div key={index} className="relative aspect-video rounded-xl border-2 border-slate-900 bg-slate-900 overflow-hidden group">
                                <img src={img} alt="Campus Background Thumb" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <button
                                    onClick={() => {
                                      const currentBgs = (data.heroImages || []).filter((_, i) => i !== index);
                                      updateData({
                                        ...data,
                                        heroImages: currentBgs
                                      });
                                    }}
                                    className="bg-red-500 hover:bg-red-600 text-white rounded-lg font-black text-[9px] px-2 py-1 uppercase border border-red-700 cursor-pointer"
                                  >
                                    Delete slide
                                  </button>
                                </div>
                                <span className="absolute top-1 left-1 bg-slate-950 text-white text-[8px] px-1 rounded">
                                  Slide {index + 1}
                                </span>
                              </div>
                            ))}
                          </div>

                          {(data.heroImages || []).length === 0 && (
                            <div className="text-center py-6 text-slate-400 text-xs font-medium">
                              No backgrounds uploaded yet. Standard fallback school slides are showing. Please upload a slide to start personalizing the background!
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* CURRENT REGISTERED MEDIA TABLE */}
                    <div className="bg-white border-4 border-slate-900 rounded-3xl p-6 space-y-4">
                      <div className="border-b border-slate-200 pb-2">
                        <h4 className="text-sm font-black uppercase text-slate-950">
                          Current Registered Photo & Video Pool
                        </h4>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {(data.gallery || []).map((item) => (
                          <div 
                            key={item.id} 
                            className={`border-4 rounded-2xl overflow-hidden p-2.5 space-y-3 flex flex-col justify-between ${
                              item.approved ? "border-slate-900 bg-white" : "border-slate-300 bg-slate-50/50"
                            }`}
                          >
                            <div className="space-y-2">
                              {/* Thumbnail preview */}
                              <div className="h-28 rounded-xl bg-slate-950 overflow-hidden relative border-2 border-slate-900">
                                {item.type === "video" ? (
                                  <video src={item.url} muted className="w-full h-full object-cover" />
                                ) : (
                                  <img src={item.url} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                                )}
                                <span className="absolute bottom-2 left-2 bg-slate-900/95 text-white text-[8px] font-black px-1.5 py-0.5 rounded">
                                  {item.type === "video" ? "VIDEO" : "PHOTO"}
                                </span>
                              </div>

                              <div className="space-y-1 text-left">
                                <span className="bg-indigo-100 text-indigo-800 border border-indigo-200 text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                  #{item.topic || "General"}
                                </span>
                                <h5 className="text-[11px] font-black uppercase text-slate-900 leading-snug line-clamp-2 mt-1">
                                  {item.title}
                                </h5>
                              </div>
                            </div>

                            {/* Controls */}
                            <div className="space-y-2 pt-2 border-t border-slate-150">
                              <div className="flex items-center justify-between text-[10px] font-bold">
                                <span className="text-slate-400">Approval Status</span>
                                <span className={item.approved ? "text-lime-650" : "text-amber-600"}>
                                  {item.approved ? "Active Live ✓" : "Pending / Hidden 🔐"}
                                </span>
                              </div>

                              <div className="grid grid-cols-2 gap-1.5 font-black uppercase text-[9px]">
                                <button
                                  onClick={() => {
                                    const list = (data.gallery || []).map(g => g.id === item.id ? { ...g, approved: !g.approved } : g);
                                    updateData({ ...data, gallery: list });
                                  }}
                                  className={`p-1.5 rounded-lg border text-center cursor-pointer transition-all ${
                                    item.approved 
                                      ? "bg-slate-100 text-slate-650 hover:bg-slate-250 border-slate-200" 
                                      : "bg-lime-100 text-lime-800 hover:bg-lime-200 border-lime-300"
                                  }`}
                                >
                                  {item.approved ? "Disapprove" : "Approve ✓"}
                                </button>
                                <button
                                  onClick={() => {
                                    const list = (data.gallery || []).filter(g => g.id !== item.id);
                                    updateData({ ...data, gallery: list });
                                  }}
                                  className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-800 border-rose-200 hover:border-rose-300 border text-center cursor-pointer transition-all"
                                >
                                  Delete 🗑️
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {(!data.gallery || data.gallery.length === 0) && (
                        <div className="text-center py-8 text-xs text-slate-400 font-bold uppercase">
                          No media registered in pool! Please upload a file above.
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* SUB TAB CONTENT: CALENDARS, FAQS, AND CIRCULARS TIMELINES */}
                {adminTab === "calendars" && (
                  <div className="space-y-6">
                    <h3 className="text-sm font-black uppercase text-indigo-600 tracking-wider font-mono">Real-time Timelines Management</h3>

                    {/* DYNAMIC BIRTHDAYS LIST UPDATER */}
                    <div className="p-4 bg-slate-50 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase text-slate-800 flex items-center gap-1">🎂 Birthday Calendar Master List</span>
                        <button 
                          onClick={() => {
                            const kidName = prompt("Enter Student Full Name:");
                            if (!kidName) return;
                            const gr = prompt("Enter Section / Nursery grade:") || "Playgroup";
                            const dt = prompt("Celebrative Date (e.g. June 19):") || "June 19";
                            const faces = ["👦", "👧", "👶", "🎈", "🦁", "🐼"];
                            const av = faces[Math.floor(Math.random() * faces.length)];

                            const newBdays: Birthday[] = [...data.birthdays, {
                              id: `bday-${Date.now()}`,
                              name: kidName,
                              date: dt,
                              grade: gr,
                              avatar: av
                            }];
                            updateData({ ...data, birthdays: newBdays });
                          }}
                          className="bg-slate-900 text-white hover:bg-slate-800 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase flex items-center gap-1"
                        >
                          <Plus size={12} /> Add Birthday Kid
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                        {data.birthdays.map(b => (
                          <div key={b.id} className="bg-white border-2 border-slate-200 rounded-xl p-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{b.avatar}</span>
                              <div>
                                <div className="text-xs font-black text-slate-800 leading-none">{b.name}</div>
                                <span className="text-[9px] font-semibold text-slate-500">{b.grade} ({b.date})</span>
                              </div>
                            </div>
                            <button 
                              onClick={() => {
                                const list = data.birthdays.filter(item => item.id !== b.id);
                                updateData({ ...data, birthdays: list });
                              }}
                              className="text-red-500 hover:text-red-700 p-1"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* DYNAMIC EVENTS LIST DIRECTORY */}
                    <div className="p-4 bg-slate-50 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase text-slate-800 flex items-center gap-1">📅 Academic, Celebration, and Sports Events</span>
                        <button 
                          onClick={() => {
                            const name = prompt("Enter Event Heading:");
                            if (!name) return;
                            const desc = prompt("Short event descriptions:") || "Fun pre-school adventure!";
                            const dt = prompt("Event Date (YYYY-MM-DD):") || "2026-06-21";
                            const time = prompt("Hours Duration (e.g. 10:00 AM - 12:00 PM):") || "10:00 AM - 12:00 PM";
                            
                            const newEvents: SchoolEvent[] = [...data.events, {
                              id: `evt-${Date.now()}`,
                              title: name,
                              description: desc,
                              date: dt,
                              time: time,
                              category: "celebration"
                            }];
                            updateData({ ...data, events: newEvents });
                          }}
                          className="bg-slate-900 text-white hover:bg-slate-800 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase flex items-center gap-1"
                        >
                          <Plus size={12} /> Add School Event
                        </button>
                      </div>

                      <div className="space-y-2">
                        {data.events.map(ev => (
                          <div key={ev.id} className="bg-white border-2 border-slate-200 rounded-xl p-3 flex items-center justify-between text-xs">
                            <div>
                              <span className="bg-indigo-100 text-indigo-700 font-mono text-[9px] font-bold px-1.5 py-0.5 rounded uppercase mr-2">{ev.category}</span>
                              <span className="font-extrabold text-slate-900">{ev.title}</span>
                              <span className="text-slate-400 text-[10px] ml-2">({ev.date})</span>
                            </div>
                            <button 
                              onClick={() => {
                                const list = data.events.filter(item => item.id !== ev.id);
                                updateData({ ...data, events: list });
                              }}
                              className="text-red-500 hover:text-red-700 p-1"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* DYNAMIC CIRCULAR NOTICES */}
                    <div className="p-4 bg-slate-50 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase text-slate-800 flex items-center gap-1">📢 Circular Timelines Notices</span>
                        <button 
                          onClick={() => {
                            const title = prompt("Enter Notification Slogan:");
                            if (!title) return;
                            const copy = prompt("Draft full advisory content text:") || "";
                            
                            const list: Circular[] = [...data.circulars, {
                              id: `circ-${Date.now()}`,
                              title,
                              content: copy,
                              date: new Date().toISOString().substring(0, 10),
                              priority: "Normal"
                            }];
                            updateData({ ...data, circulars: list });
                          }}
                          className="bg-slate-900 text-white hover:bg-slate-800 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase flex items-center gap-1"
                        >
                          <Plus size={12} /> Publish Circular Notice
                        </button>
                      </div>

                      <div className="space-y-2">
                        {data.circulars.map(c => (
                          <div key={c.id} className="bg-white border-2 border-slate-200 rounded-xl p-3 flex items-center justify-between text-xs">
                            <div>
                              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase mr-2 ${c.priority === "High" ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-700"}`}>{c.priority}</span>
                              <span className="font-extrabold text-slate-900">{c.title}</span>
                            </div>
                            <button 
                              onClick={() => {
                                const list = data.circulars.filter(item => item.id !== c.id);
                                updateData({ ...data, circulars: list });
                              }}
                              className="text-red-500 hover:text-red-700 p-1"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}

                {/* SUB TAB CONTENT: FACULTIES & INSTRUCTORS */}
                {adminTab === "faculties" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-black uppercase text-indigo-600 tracking-wider">Configure Faculties Portfolio & Testimonials</h3>
                      <button 
                        onClick={() => {
                          const name = prompt("Enter Instructor Name:");
                          if (!name) return;
                          const role = prompt("Enter Title (e.g. Prep Class Guide):") || "Instructor";
                          const exp = prompt("Enter Tenure text (e.g. 5+ Years):") || "2+ Years Experience";
                          const docReview = prompt("Enter Personal Testimonial Quote:") || "";
                          
                          const list: Faculty[] = [...data.faculties, {
                            id: `fac-${Date.now()}`,
                            name,
                            role,
                            experience: exp,
                            review: docReview,
                            photo: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=60"
                          }];
                          updateData({ ...data, faculties: list });
                        }}
                        className="bg-slate-900 text-white hover:bg-slate-800 px-3.5 py-2 rounded-xl text-xs font-black uppercase flex items-center gap-1"
                      >
                        <Plus size={14} /> Add Faculty Specialist
                      </button>
                    </div>

                    <p className="text-xs text-slate-500 font-semibold">
                      Copy paste standard picture URLs directly from Unsplash down below to update child care taker display images dynamically!
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {data.faculties.map((f, idx) => (
                        <div key={f.id} className="bg-slate-50 rounded-2xl p-4 border-2 border-slate-200">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-[10px] font-mono uppercase text-slate-400 font-black">SPECIALIST #{idx+1}</span>
                            <button 
                              onClick={() => {
                                const list = data.faculties.filter(item => item.id !== f.id);
                                updateData({ ...data, faculties: list });
                              }}
                              className="text-red-500 hover:text-red-700 flex items-center gap-1 text-[10px] font-bold"
                            >
                              <Trash2 size={13} /> REMOVE
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <div>
                              <label className="block text-[9px] uppercase font-black text-slate-500">Teacher's Name</label>
                              <input 
                                type="text" 
                                value={f.name} 
                                onChange={(e) => {
                                  const list = [...data.faculties];
                                  list[idx].name = e.target.value;
                                  updateData({ ...data, faculties: list });
                                }}
                                className="w-full bg-white border border-slate-250 rounded p-1.5 font-bold"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] uppercase font-black text-slate-500">Caretaking Role</label>
                              <input 
                                type="text" 
                                value={f.role} 
                                onChange={(e) => {
                                  const list = [...data.faculties];
                                  list[idx].role = e.target.value;
                                  updateData({ ...data, faculties: list });
                                }}
                                className="w-full bg-white border border-slate-250 rounded p-1.5 font-bold"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] uppercase font-black text-slate-500">Tenure experience</label>
                              <input 
                                type="text" 
                                value={f.experience} 
                                onChange={(e) => {
                                  const list = [...data.faculties];
                                  list[idx].experience = e.target.value;
                                  updateData({ ...data, faculties: list });
                                }}
                                className="w-full bg-white border border-slate-250 rounded p-1.5 font-bold font-mono"
                              />
                            </div>
                            <div className="sm:col-span-2">
                              <label className="block text-[9px] uppercase font-black text-slate-500 font-bold">Faculty Photo (Upload or Paste URL)</label>
                              <div className="flex gap-2 items-center mt-1">
                                <input 
                                  type="text" 
                                  value={f.photo} 
                                  placeholder="Paste image URL..."
                                  onChange={(e) => {
                                    const list = [...data.faculties];
                                    list[idx].photo = e.target.value;
                                    updateData({ ...data, faculties: list });
                                  }}
                                  className="flex-grow bg-white border border-slate-250 rounded p-1.5 font-mono text-xs outline-none"
                                />
                                <input 
                                  id={`faculty-photo-file-picker-${f.id}`}
                                  type="file" 
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const reader = new FileReader();
                                      reader.onload = (fileEvent) => {
                                        const list = [...data.faculties];
                                        list[idx].photo = fileEvent.target?.result as string;
                                        updateData({ ...data, faculties: list });
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }}
                                />
                                <button
                                  type="button"
                                  onClick={() => document.getElementById(`faculty-photo-file-picker-${f.id}`)?.click()}
                                  className="bg-slate-900 hover:bg-slate-800 text-white text-[9px] font-bold uppercase py-2.5 px-3 rounded border border-slate-950 whitespace-nowrap cursor-pointer transition-colors"
                                >
                                  📁 Upload
                                </button>
                              </div>
                            </div>
                            <div className="sm:col-span-2">
                              <label className="block text-[9px] uppercase font-black text-slate-500">Testimonial citation text</label>
                              <textarea 
                                rows={2}
                                value={f.review} 
                                onChange={(e) => {
                                  const list = [...data.faculties];
                                  list[idx].review = e.target.value;
                                  updateData({ ...data, faculties: list });
                                }}
                                className="w-full bg-white border border-slate-250 rounded p-1.5 text-xs font-semibold"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SUB TAB CONTENT: ADMISSION APPLICATIONS REGISTER */}
                {adminTab === "applications" && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans">
                      <div>
                        <h3 className="text-sm font-black uppercase text-indigo-650 tracking-wider">Submitted Admission Applications Register</h3>
                        <p className="text-xs text-slate-500 font-medium">Review and process parent submissions registered online via the Admission Form segment.</p>
                      </div>

                      {/* Filter by Grade */}
                      <div className="flex items-center gap-2">
                        <label className="text-xs font-bold text-slate-600 uppercase">Class Filter:</label>
                        <select
                          value={appFilter}
                          onChange={(e) => setAppFilter(e.target.value)}
                          className="bg-slate-100 border-2 border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold outline-none focus:bg-white cursor-pointer"
                        >
                          <option value="All">All Grades ({applications.length})</option>
                          <option value="Playgroup">Playgroup Montessori</option>
                          <option value="Nursery">Nursery Logic</option>
                          <option value="Kindergarten-I">Kindergarten Prep-I</option>
                          <option value="Kindergarten-II">Kindergarten Prep-II</option>
                        </select>
                      </div>
                    </div>

                    {/* Applications Table/List rendering */}
                    {applications.length === 0 ? (
                      <div className="text-center py-12 border-4 border-dashed border-slate-200 rounded-3xl space-y-2">
                        <span className="text-4xl">📭</span>
                        <h4 className="text-sm font-extrabold text-slate-700 uppercase">No Applications Registered</h4>
                        <p className="text-xs text-slate-400 max-w-xs mx-auto">Either head back to the parent landing page to register a child, or wait for admissions.</p>
                      </div>
                    ) : (
                      (() => {
                        const filtered = applications.filter(a => appFilter === "All" || a.grade === appFilter);
                        if (filtered.length === 0) {
                          return (
                            <div className="text-center py-8 bg-slate-50 rounded-2xl">
                              <p className="text-xs font-semibold text-slate-500">No applications match the grade "{appFilter}".</p>
                            </div>
                          );
                        }
                        return (
                          <div className="grid grid-cols-1 gap-4 font-sans">
                            {filtered.map((app) => (
                              <div key={app.id} className="bg-slate-50 border-3 border-slate-900 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row justify-between gap-6 relative overflow-hidden">
                                
                                <div className="space-y-4 flex-grow">
                                  {/* Header and Grade label */}
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="bg-slate-900 text-white font-mono text-[9px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wider select-all">
                                      ID: {app.id}
                                    </span>
                                    <span className="bg-indigo-100 text-indigo-850 px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-wider">
                                      Class: {app.grade}
                                    </span>
                                    <span className="bg-slate-200 text-slate-700 font-mono text-[9px] px-2.5 py-1 rounded-md font-bold">
                                      Registered: {new Date(app.timestamp).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                                    </span>
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-4 text-xs">
                                    <div>
                                      <span className="text-[10px] font-black uppercase text-slate-400 block leading-tight">Student Name</span>
                                      <strong className="text-slate-900 text-sm uppercase">{app.studentName}</strong>
                                    </div>
                                    <div>
                                      <span className="text-[10px] font-black uppercase text-slate-400 block leading-tight">Birthdate (D.O.B)</span>
                                      <span className="font-semibold text-slate-800">{app.studentDob}</span>
                                    </div>
                                    <div>
                                      <span className="text-[10px] font-black uppercase text-slate-400 block leading-tight">Gender</span>
                                      <span className="font-semibold text-slate-800">{app.gender}</span>
                                    </div>

                                    <div>
                                      <span className="text-[10px] font-black uppercase text-slate-400 block leading-tight">Parent / Guardian</span>
                                      <strong className="text-slate-900 font-bold">{app.parentName}</strong>
                                    </div>
                                    <div>
                                      <span className="text-[10px] font-black uppercase text-slate-400 block leading-tight">Helpline Mobile Phone</span>
                                      <a href={`tel:${app.phone}`} className="text-blue-600 underline font-extrabold font-mono hover:text-blue-800">
                                        {app.phone}
                                      </a>
                                    </div>
                                    <div>
                                      <span className="text-[10px] font-black uppercase text-slate-400 block leading-tight font-sans">Email Contact</span>
                                      <span className="font-mono text-slate-600 font-bold">{app.email || "—"}</span>
                                    </div>

                                    <div className="sm:col-span-2">
                                      <span className="text-[10px] font-black uppercase text-slate-400 block leading-tight">Registered Residential Address</span>
                                      <span className="font-medium text-slate-700">{app.address}</span>
                                    </div>
                                    <div>
                                      <span className="text-[10px] font-black uppercase text-slate-400 block leading-tight">Development Dietary Comment</span>
                                      <span className="italic font-bold text-rose-500">{app.comments || "—"}</span>
                                    </div>
                                  </div>
                                </div>

                                {/* Right quick action sidebar menu */}
                                <div className="border-t-2 md:border-t-0 md:border-l-2 border-slate-200 pt-4 md:pt-0 md:pl-6 flex flex-row md:flex-col justify-end md:justify-center gap-2 flex-shrink-0 min-w-[150px]">
                                  <button 
                                    onClick={() => {
                                      alert(`Approval ticket sent to scheduling queue for ${app.studentName}. Code assigned: ${app.id}. Telephone notifications will occur shortly!`);
                                    }}
                                    className="flex-grow bg-lime-505 hover:bg-lime-600 text-slate-950 px-3 py-2 rounded-xl text-[10px] font-black uppercase border-2 border-slate-900 transition-transform active:translate-y-0 bg-lime-400 cursor-pointer text-center"
                                  >
                                    Approve Test Ticket ✔
                                  </button>
                                  <button 
                                    onClick={() => {
                                      if (confirm(`Are you sure you want to permanently discard candidate application ${app.studentName}?`)) {
                                        const list = applications.filter(item => item.id !== app.id);
                                        setApplications(list);
                                        localStorage.setItem("swara_admissions_applications", JSON.stringify(list));
                                      }
                                    }}
                                    className="bg-rose-100 hover:bg-rose-200 text-rose-700 px-3 py-2 rounded-xl text-[10px] font-black uppercase border border-rose-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                                  >
                                    <Trash2 size={12} /> Discard Application
                                  </button>
                                </div>

                              </div>
                            ))}
                          </div>
                        );
                      })()
                    )}
                  </div>
                )}

              </div>
            )}

          </div>
        )}
      </main>

      {/* FOOTER AREA — DETAILED SCHOLASTIC INFOS & GOOGLE MAPS EMBED SECTION */}
      <footer id="contact" className="bg-slate-950 text-slate-400 border-t-8 border-slate-900 pt-16 pb-8 px-4">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Column 1: School credentials description list */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center gap-4">
                {data.logoImg ? (
                  <img 
                    src={data.logoImg} 
                    alt="School Logo" 
                    className="h-24 md:h-28 lg:h-32 w-auto object-contain flex-shrink-0 select-none" 
                    referrerPolicy="no-referrer" 
                  />
                ) : (
                  <SwaraLogo 
                    size={100} 
                    interactive={false} 
                    className="flex-shrink-0" 
                  />
                )}
                <div className="space-y-1.5 md:space-y-2">
                  <h3 className="text-2xl md:text-3xl font-black text-white leading-none uppercase">{data.name}</h3>
                  <span className="text-xs md:text-sm text-lime-400 font-mono tracking-widest block font-bold">{data.logoDescription}</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                Nurturing young minds through physical sensory games, high technology visual SMART classes, and climate compassion. A stellar launch pad situated cleanly in Basti, UP.
              </p>
              
              <div className="space-y-2 pt-2 text-xs">
                <div className="flex items-start gap-2.5">
                  <Phone size={15} className="text-lime-400 mt-0.5 flex-shrink-0" />
                  <span>Call Admissions Desk: <span className="text-white font-bold">{data.contact.phone}</span></span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Mail size={15} className="text-lime-400 mt-0.5 flex-shrink-0" />
                  <span>Official Admissions Email: <span className="text-white font-bold">{data.contact.email}</span></span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Clock size={15} className="text-lime-400 mt-0.5 flex-shrink-0" />
                  <span>Working Office Hours: <span className="text-white font-semibold">{data.contact.workingHours}</span></span>
                </div>
              </div>
            </div>

            {/* Column 2: Program Quick guides */}
            <div className="hidden sm:block lg:col-span-3 space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-white">Programs Catalog</h4>
              <div className="flex flex-col gap-2.5 text-xs">
                <span className="hover:text-white transition-colors cursor-pointer flex items-center gap-1">🟢 Playgroup Montessori (Ages 2-3)</span>
                <span className="hover:text-white transition-colors cursor-pointer flex items-center gap-1">🟢 Nursery Coding Logic (Ages 3-4)</span>
                <span className="hover:text-white transition-colors cursor-pointer flex items-center gap-1">🟢 Kindergarten Prep-I (Ages 4-5)</span>
                <span className="hover:text-white transition-colors cursor-pointer flex items-center gap-1">🟢 Kindergarten Prep-II (Ages 5-6)</span>
                <span className="hover:text-white transition-colors cursor-pointer flex items-center gap-1">🟢 Co-Curricular Clay Art Clubs</span>
                <span className="hover:text-white transition-colors cursor-pointer flex items-center gap-1">🟢 Little Champs Agility Track</span>
              </div>
            </div>

            {/* Column 3: INTEGRATED GOOGLE MAPS AREA EDITABLE BY THE ADMIN PANEL */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                  <MapPin size={16} className="text-rose-500 animate-pulse" /> Location Map
                </h4>
                
                {/* Admin quick address helper */}
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Basti, Uttar Pradesh</span>
              </div>

              {/* Robust IFrame embedding Station Road address map which reflects immediately! */}
              <div className="w-full h-56 rounded-2xl overflow-hidden border-2 border-slate-800 shadow-inner group relative">
                
                {/* Google Maps Embed iframe with correct source address query fallback */}
                <iframe 
                  title="Swara Academy Map Coordinates"
                  src={data.contact.mapEmbedCode}
                  width="100%" 
                  height="100%" 
                  className="w-full h-full block opacity-85 hover:opacity-100 transition-opacity"
                  loading="lazy"
                  allowFullScreen={false}
                ></iframe>

                {/* Little overlay chip linking directions */}
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.contact.address)}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="absolute bottom-3 right-3 bg-slate-900 border border-slate-700 text-white text-[10px] font-black tracking-wide uppercase px-2.5 py-1 rounded inline-flex items-center gap-1 hover:bg-slate-800 transition-transform"
                >
                  Open Directions <ExternalLink size={10} />
                </a>
              </div>

              {/* Under-map location citation */}
              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-900 flex items-start gap-2.5">
                <MapPin size={18} className="text-rose-400 flex-shrink-0 mt-0.5" />
                <span className="text-[11px] leading-relaxed font-medium text-slate-400">
                  <strong className="text-white">Registered Address:</strong> {data.contact.address}
                </span>
              </div>
            </div>

          </div>

          {/* Bottom rights copyright and administrative quick toggle */}
          <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-bold text-slate-500 select-none">
            
            <div className="text-center sm:text-left">
              © {new Date().getFullYear()} Swara Academy pre-primary campus. Station Road, Basti, UP. All Rights Reserved.
            </div>

            <div className="flex items-center gap-4">
              <span className="text-rose-500">❤ Empathetic Education Initiated</span>
              <span>•</span>
              <button 
                onClick={() => {
                  setActiveTab(activeTab === "parents" ? "admin" : "parents");
                  setIsUnlocked(true);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }} 
                className="hover:text-white transition-colors"
              >
                Principal Login Gate
              </button>
            </div>

          </div>

        </div>
      </footer>

      {/* SWARA INTELLIGENT CUSTOM ASSISTANT BOT */}
      <SwaraChatbot />

    </div>
  );
}
