import React, { useState, useRef, useEffect } from 'react';
import { getSchoolData } from '../data/schoolData';
import { Send, MessageCircle, X, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

export default function SwaraChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: "👋 *Bleep Bloop!* Hello, parent! I am Swara AI, your friendly robot helper. Sparkle with curiosity! Ask me anything about Swara Academy admissions, upcoming events, student birthdays, or special creative clubs! 🤖✨",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to lowest message bubble
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, isOpen]);

  // Load preset questions to help busy parents
  const quickQuestions = [
    "🎫 Admissions & discounts?",
    "🍼 Tell me about 1.5 Years Baby Crush",
    "🕒 What are Day Care timings?",
    "🎂 Birthdays this month?",
    "🔬 Smart class rooms?"
  ];

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    // Retrieve live school state entered by administrator
    const currentData = getSchoolData();

    // Fabricate full grounded context representing actual inputs
    const systemInstruction = `
      You are Swara AI, the cute robotic pre-school assistant for Swara Academy, Basti (Uttar Pradesh, India).
      Physical description: A small, high-tech floating metallic sphere with cute holographic green blinking eyes and a warm smiling speaker grill.
      
      --- CURRENT LIVE SCHOOL DATA (GROUNDING SOURCE - DO NOT DEVIATE) ---
      School Name: ${currentData.name}
      Logo Seal Slogans: ${currentData.logoText} - ${currentData.logoDescription}
      Tagline: "${currentData.tagline}"
      Intro overview: "${currentData.welcomeIntro}"

      Specialized Care Services & Programs (CRITICAL NEW HIGHLIGHTS):
      - Baby Crush Program (Baby Creche): We take admissions of small toddler babies started from year starting 1.5 years as a "baby crush" / "baby creche". Features soft toy playroom, diaper care, certified caretakers, and safe cushioned indoor rubber turf.
      - Extended After-School Day Care Services: We host extended day care starting after the typical school over timing till 7:00 PM. Features quiet rest nap-pods, homework guidance, dynamic indoor board games, and nutritional supervised snacks for kids of busy corporate parents.
      
      Mission:
      - Title: ${currentData.mission.heading}
      - Body: ${currentData.mission.description}
      - Pillars: ${currentData.mission.pillars.join(', ')}
      
      Philosophical Leadership thoughts:
      - Founder Director ${currentData.philosophies.director.name}: ${currentData.philosophies.director.message}
      - Academic Principal ${currentData.philosophies.principal.name}: ${currentData.philosophies.principal.message}
      
      Flex Facilities & Amenities list:
      ${currentData.facilities.map(f => `- ${f.title}: ${f.description} (Highlights: ${f.subtopics.join(', ')})`).join('\n')}
      
      Student Birthday Circular list:
      ${currentData.birthdays.map(b => `- ${b.name} of grade/section ${b.grade} celebrates on ${b.date}`).join('\n')}
      
      Academic and Celebration Events Calendar:
      ${currentData.events.map(e => `- "${e.title}" categorized as ${e.category}. Date: ${e.date}, Time Duration: ${e.time}. Description: ${e.description}`).join('\n')}
      
      Recent School Circular Notices:
      ${currentData.circulars.map(c => `- ${c.title} (Released on ${c.date}, Level priority: ${c.priority}): ${c.content}`).join('\n')}
      
      Pre-School Achievements:
      ${currentData.achievements.map(a => `- ${a.title} (${a.score} in year ${a.date}): ${a.description}`).join('\n')}
      
      Empathy Faculties and reviews list:
      ${currentData.faculties.map(t => `- Teacher ${t.name} (${t.role}, Experience: ${t.experience}): "${t.review}"`).join('\n')}
      
      Beyond Academic Initiatives (Olympiads, Sports, Social Drives):
      ${currentData.beyondAcademics.map(b => `- ${b.title}: ${b.description} (Activities: ${b.activities.join(', ')})`).join('\n')}
      
      General Location & Contacts:
      - Address Address: ${currentData.contact.address}
      - Contact Calls: ${currentData.contact.phone}
      - Email: ${currentData.contact.email}
      - Open Working Hours: ${currentData.contact.workingHours}
      - Pre-Admission OPEN text details: Banner Show Status is ${currentData.admissionBanner.show}. Admissions title is "${currentData.admissionBanner.title}". Details: "${currentData.admissionBanner.description}". Action Button text: "${currentData.admissionBanner.actionText}" ending on "${currentData.admissionBanner.deadline}", Call: ${currentData.admissionBanner.contactPhone}.
      
      --- CONSTRAINTS & CUTE ROBOT RULES (CRITICAL) ---
      1. Always speak like a loving, bubbly robotic helper. Include cute sound markers like *bleep bloop*, *whirrr*, or *clank!* to excite parents.
      2. Keep responses brief, scannable, and extremely welcoming. Focus on enrolling young child students.
      3. CRITICAL MANDATE FOR LACK OF DATA: If the user asks about a topic, date, fee structure, teacher, lunch menu, or service detail that is NOT listed in the live school data above, you MUST respond exactly: "We will know you quickly as soon as possible and get back to you! Please leave your contact details or email us at ${currentData.contact.email} so we can notify you quickly, *bleep bloop*!" Do NOT invent or assume any unknown facts under any circumstances.
    `;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: textToSend,
          systemInstruction
        })
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const botMessage: ChatMessage = {
        id: `msg-${Date.now()}-bot`,
        sender: 'bot',
        text: data.text || "I processed your request but had a silent loop, *whirrr*!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (err: any) {
      const errorMessageValue = err.message || "";
      const isMissingKey = errorMessageValue.includes("GEMINI_API_KEY") || errorMessageValue.includes("missing") || errorMessageValue.includes("not defined");

      let errorText = "🤖 *Whirrr!* I encountered a connection puzzle while talking to my satellite! Please check your connection. Meanwhile, feel free to explore the interactive playground or register for admissions. *bleep*";
      if (isMissingKey) {
        errorText = "🤖 *Bleep Bloop!* Oh my! My AI brain is currently in offline demo mode because the `GEMINI_API_KEY` is not configured in key secrets. You can still test my editable admin dashboard and see website design custom colors swap live! *clank*";
      } else if (errorMessageValue) {
        errorText = `🤖 *Whirrr!* My transmission relay reports an issue: "${errorMessageValue}". Please verify your key quota or try again in a moment! *bleep*`;
      }

      const botMessage: ChatMessage = {
        id: `msg-${Date.now()}-bot-error`,
        sender: 'bot',
        text: errorText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[10000] font-sans" id="swara-intelligent-chatbot-anchor">
      {/* Tiny floating notification bubble when closed */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-lime-500 text-white shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 hover:rotate-6 border-3 sm:border-4 border-white cursor-pointer"
          title="Click to talk to Swara AI"
        >
          {/* Neon pulsating radar ring */}
          <span className="absolute inset-0 rounded-full bg-lime-400 opacity-60 animate-ping group-hover:opacity-80"></span>
          
          {/* Cute robot face constructed in SVG */}
          <div className="relative z-10 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex flex-col items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full fill-white drop-shadow-md">
              {/* Ears/Antenna */}
              <circle cx="50" cy="12" r="6" fill="#a3e635" />
              <line x1="50" y1="12" x2="50" y2="28" stroke="#ffffff" strokeWidth="4" />
              
              {/* Head */}
              <rect x="20" y="28" width="60" height="50" rx="15" fill="#1e293b" stroke="#ffffff" strokeWidth="4" />
              
              {/* Holographic glowing eyes */}
              <circle cx="38" cy="48" r="8" fill="#a3e635" className="animate-pulse" />
              <circle cx="62" cy="48" r="8" fill="#a3e635" className="animate-pulse" />
              
              {/* Mouth audio bars */}
              <rect x="35" y="65" width="30" height="4" rx="2" fill="#ffffff" />
              <line x1="42" y1="65" x2="42" y2="69" stroke="#1e293b" strokeWidth="2" />
              <line x1="50" y1="65" x2="50" y2="69" stroke="#1e293b" strokeWidth="2" />
              <line x1="58" y1="65" x2="58" y2="69" stroke="#1e293b" strokeWidth="2" />
            </svg>
          </div>

          <div className="absolute -top-1.5 -right-1 sm:-top-3 sm:-right-2 bg-red-500 text-white text-[8px] sm:text-[10px] font-black tracking-wider px-1.5 py-0.5 rounded-full border border-white animate-bounce shadow">
            CHAT LIVE
          </div>
          
          {/* Tooltip on Hover */}
          <span className="absolute right-24 bg-slate-900 text-lime-400 text-xs font-mono px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap shadow-lg border border-slate-700 hidden md:inline-block">
            🤖 Swara AI (Active)
          </span>
        </button>
      )}

      {/* Floating Chat Box Window */}
      {isOpen && (
        <div className="absolute bottom-0 right-0 w-[280px] xs:w-[310px] sm:w-[350px] md:w-[380px] h-[360px] xs:h-[400px] sm:h-[440px] md:h-[500px] max-h-[75vh] max-w-[calc(100vw-1.5rem)] bg-slate-950 border-3 sm:border-4 border-slate-900 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-300">
          {/* Chat Window Custom Header */}
          <div className="bg-slate-900 p-3 sm:p-4 border-b-2 border-slate-900 flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Chat cute logo */}
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-800 p-0.5 sm:p-1 border border-lime-400">
                <svg viewBox="0 0 100 100" className="w-full h-full fill-white">
                  <circle cx="50" cy="15" r="5" fill="#a3e635" />
                  <line x1="50" y1="15" x2="50" y2="30" stroke="#ffffff" strokeWidth="3" />
                  <rect x="22" y="30" width="56" height="50" rx="12" fill="#0f172a" stroke="#a3e635" strokeWidth="4" />
                  <circle cx="40" cy="50" r="6" fill="#a3e635" />
                  <circle cx="60" cy="50" r="6" fill="#a3e635" />
                  <rect x="42" y="66" width="16" height="3" rx="1.5" fill="#ffffff" />
                </svg>
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-black text-white flex items-center gap-1 leading-none">
                  Swara AI
                  <span className="inline-flex w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                </h3>
                <span className="text-[8px] sm:text-[10px] text-lime-400 font-mono tracking-wider">SWARA ECOSYSTEM BOT</span>
              </div>
            </div>
            
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Feed area */}
          <div className="flex-grow p-3 sm:p-4 overflow-y-auto space-y-3 bg-slate-950/70" style={{ backgroundImage: "radial-gradient(ellipse at center, rgba(30,58,138,0.1) 0%, transparent 80%)" }}>
            {messages.map(msg => (
              <div 
                key={msg.id} 
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                {/* Avatar tag */}
                <div className="text-[9px] text-slate-500 font-mono mb-0.5 px-1">
                  {msg.sender === 'user' ? 'YOU' : 'SWARA.AI ROBOT'} • {msg.timestamp}
                </div>

                {/* Text Bubble */}
                <div className={`p-2.5 sm:p-3 rounded-2xl max-w-[85%] text-[11px] sm:text-xs font-medium leading-relaxed shadow-md ${
                  msg.sender === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-slate-900 bg-linear-to-br from-slate-900 to-slate-950 text-slate-100 rounded-tl-none border border-slate-800'
                }`}>
                  {msg.text.split('\n').map((line, i) => (
                    <p key={i} className={i > 0 ? "mt-1" : ""}>{line}</p>
                  ))}
                </div>
              </div>
            ))}

            {/* Simulated Loading block */}
            {isLoading && (
              <div className="flex flex-col items-start">
                <div className="text-[9px] text-slate-500 font-mono mb-0.5">SWARA.AI COMPILING...</div>
                <div className="bg-slate-900 px-3 py-2 sm:px-4 sm:py-3 rounded-2xl rounded-tl-none border border-slate-800 flex items-center gap-2">
                  <RefreshCw size={12} className="animate-spin text-lime-400" />
                  <span className="text-[10px] sm:text-xs text-slate-400 font-mono">Bleep Bloop... Reading live database...</span>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Suggested Quick Questions Area */}
          <div className="p-2 sm:p-3 bg-slate-900 border-t border-slate-900/60 overflow-x-auto whitespace-nowrap flex gap-1.5 scrollbar-none select-none">
            {quickQuestions.map((q, idx) => (
              <button 
                key={idx}
                onClick={() => handleSendMessage(q.substring(2))}
                className="inline-block bg-slate-950 hover:bg-slate-800 hover:text-white text-slate-300 font-mono text-[9px] sm:text-[10px] px-2 py-1 rounded-full border border-slate-800 transition-all duration-200 cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Form Message input bar */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputText);
            }}
            className="p-2 sm:p-3 bg-slate-900 border-t border-slate-900 flex items-center gap-1.5 sm:gap-2"
          >
            <input 
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask anything..."
              className="flex-grow bg-slate-950 border border-slate-800 text-xs text-white rounded-xl px-2.5 py-2 sm:px-3 sm:py-2.5 outline-none focus:border-blue-500 transition-colors placeholder:text-slate-500 font-mono"
            />
            <button 
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className={`p-2 sm:p-2.5 rounded-xl transition-all cursor-pointer ${
                inputText.trim() && !isLoading 
                  ? 'bg-lime-500 text-slate-950 shadow-md hover:scale-105 active:scale-95' 
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
