import React, { useState } from "react";
import { ArrowLeft, Search, Download, X, Play, Film, Image as ImageIcon, Sparkles } from "lucide-react";
import { SchoolData, GalleryMedia } from "../data/schoolData";

interface ImmersiveMediaPageProps {
  data: SchoolData;
  setParentsView: (view: "home" | "apply" | "gallery") => void;
}

export default function ImmersiveMediaPage({ data, setParentsView }: ImmersiveMediaPageProps) {
  const [search, setSearch] = useState("");
  const [activeTopic, setActiveTopic] = useState("All Moments");
  const [activeType, setActiveType] = useState<"all" | "image" | "video">("all");
  const [lightboxItem, setLightboxItem] = useState<GalleryMedia | null>(null);

  // Get all approved gallery moments
  const approvedMedia = (data.gallery || []).filter(item => item.approved);

  // Auto-extract unique topics from currently approved media to render filter pills dynamically
  const existingTopics = Array.from(
    new Set(approvedMedia.map(item => item.topic || "General Montessori").filter(Boolean))
  );
  
  const topicsList = ["All Moments", ...existingTopics];

  // Filter media based on topic, type, and caption keyword searches
  const filteredMedia = approvedMedia.filter(item => {
    // Topic match
    const itemTopic = item.topic || "General Montessori";
    const matchesTopic = activeTopic === "All Moments" || itemTopic.toLowerCase() === activeTopic.toLowerCase();
    
    // Type match
    const matchesType = activeType === "all" || item.type === activeType;
    
    // Search keyword match
    const matchesKeyword = item.title.toLowerCase().includes(search.toLowerCase()) || 
                           itemTopic.toLowerCase().includes(search.toLowerCase());
    
    return matchesTopic && matchesType && matchesKeyword;
  });

  return (
    <div className="bg-slate-50 min-h-screen font-sans pb-20 select-none">
      
      {/* Dynamic Header Wave Segment */}
      <div 
        className="bg-slate-900 overflow-hidden py-14 px-4 text-center text-white relative border-b-4 border-slate-900"
        style={{ backgroundImage: "radial-gradient(ellipse at bottom, #0f2d59 0%, #030a16 100%)" }}
      >
        {/* Floating circles decoration */}
        <div className="absolute top-4 left-6">
          <button 
            onClick={() => setParentsView("home")}
            className="bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all border border-white/20 inline-flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft size={14} /> Back to School Home
          </button>
        </div>

        <div className="max-w-3xl mx-auto space-y-3 mt-8 md:mt-2">
          <span className="bg-amber-400 text-slate-950 font-black text-[9px] uppercase tracking-widest px-3 py-1 rounded-full border-2 border-slate-950 inline-flex items-center gap-1">
            <Sparkles size={10} className="fill-slate-950" /> Curated Parents Media Portal
          </span>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight">Immersive Media World</h2>
          <p className="text-xs text-slate-300 font-medium max-w-xl mx-auto leading-relaxed">
            Witness real-time snapshots, learning milestones, and playground snapshots direct from the principal's verified gallery! (Parent Mode: Strict Read-Only Access)
          </p>
        </div>
      </div>

      {/* FILTER & EXPLORATION CONTROL CENTER */}
      <div className="max-w-7xl mx-auto px-4 -mt-6 relative z-10">
        <div className="bg-white border-4 border-slate-900 rounded-3xl p-5 shadow-xl space-y-5">
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Real Search bar */}
            <div className="relative flex-grow max-w-lg">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                <Search size={16} />
              </span>
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search classroom highlights, playtimes, water sports..."
                className="w-full bg-slate-50 border-2 border-slate-200 focus:border-slate-900 focus:bg-white rounded-2xl pl-10 pr-4 py-3 text-xs font-bold outline-none transition-all placeholder:text-slate-400 text-slate-800"
              />
            </div>

            {/* Media Type toggles */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl self-start lg:self-auto font-black uppercase text-[10px] tracking-wide">
              <button
                onClick={() => setActiveType("all")}
                className={`px-3 py-2 rounded-xl transition-all cursor-pointer ${activeType === "all" ? "bg-slate-900 text-white shadow" : "text-slate-600 hover:text-slate-905"}`}
              >
                🌟 All Moments
              </button>
              <button
                onClick={() => setActiveType("image")}
                className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1 cursor-pointer ${activeType === "image" ? "bg-slate-900 text-white shadow" : "text-slate-600"}`}
              >
                <ImageIcon size={12} /> Snapshots
              </button>
              <button
                onClick={() => setActiveType("video")}
                className={`px-3 py-2 rounded-xl transition-all flex items-center gap-1 cursor-pointer ${activeType === "video" ? "bg-slate-900 text-white shadow" : "text-slate-600"}`}
              >
                <Film size={12} /> Video Clips
              </button>
            </div>

          </div>

          {/* Dynamically grouped Topics tab list */}
          <div className="border-t border-slate-150 pt-4 space-y-2 text-left">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
              📚 Browse By Specific Topic Categories ({approvedMedia.length} total moments):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {topicsList.map((topic) => {
                const countOfMoments = topic === "All Moments" 
                  ? approvedMedia.length 
                  : approvedMedia.filter(m => (m.topic || "General Montessori").toLowerCase() === topic.toLowerCase()).length;

                return (
                  <button
                    key={topic}
                    onClick={() => setActiveTopic(topic)}
                    className={`px-3.5 py-2 rounded-full border-2 text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                      activeTopic === topic
                        ? "bg-amber-400 text-slate-950 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] -translate-y-0.5"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-350 hover:bg-slate-100"
                    }`}
                  >
                    🚀 {topic} <span className="opacity-60 font-medium">({countOfMoments})</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* DYNAMIC MEDIA GALLERY GRID */}
      <div className="max-w-7xl mx-auto px-4 mt-8">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMedia.map((media) => (
            <div
              key={media.id}
              onClick={() => setLightboxItem(media)}
              className="bg-white border-3 border-slate-900 rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:-translate-y-1 active:translate-y-0 cursor-pointer group flex flex-col justify-between"
            >
              {/* Media preview window */}
              <div className="relative aspect-video bg-slate-950 overflow-hidden border-b-3 border-slate-900">
                {media.type === "video" ? (
                  <div className="w-full h-full relative">
                    <video src={media.url} muted className="w-full h-full object-cover" />
                    {/* Floating play indicator overlay */}
                    <div className="absolute inset-0 bg-black/25 flex items-center justify-center group-hover:bg-black/45 transition-colors duration-450">
                      <div className="bg-white/90 text-slate-950 p-2.5 rounded-full border-2 border-slate-900 shadow">
                        <Play size={16} className="fill-slate-950 ml-0.5" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <img 
                    src={media.url} 
                    alt={media.title} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                )}

                {/* Categories and Type badges */}
                <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1">
                  <span className="bg-slate-900/95 text-white border border-slate-700 text-[8px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider">
                    {media.type === "video" ? "🎥 Video Clip" : "📸 Snapshot"}
                  </span>
                  <span className="bg-indigo-500 text-white text-[8px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider">
                    #{media.topic || "General"}
                  </span>
                </div>

                <div className="absolute top-2.5 right-2.5 bg-lime-400 text-slate-950 text-[8px] font-black uppercase px-2 py-0.5 rounded-full border border-slate-900 flex items-center gap-0.5 shadow-sm">
                  ✓ Verified Live
                </div>
              </div>

              {/* Caption details box */}
              <div className="p-4 flex-grow flex flex-col justify-between text-left space-y-1.5">
                <p className="text-xs font-black uppercase text-slate-900 leading-snug font-sans line-clamp-2">
                  {media.title}
                </p>
                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-mono">
                  Curated by Sneha Sen • Press to open ↗
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Empty status state */}
        {filteredMedia.length === 0 && (
          <div className="text-center py-20 bg-white border-4 border-dashed border-slate-200 rounded-3xl max-w-lg mx-auto">
            <span className="text-5xl">🔭</span>
            <h4 className="text-base font-black text-slate-800 uppercase mt-4">No Media Matches Found</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto font-medium">
              We couldn't find any approved media clips matching topic "<strong>{activeTopic}</strong>" with your current keywords search. Try exploring other bubbles!
            </p>
          </div>
        )}

      </div>

      {/* THEATRICAL LIGHTBOX COMPONENT - READ-ONLY WITH FULLSCALE VIEW & DOWNLOAD */}
      {lightboxItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 text-white rounded-3xl border-4 border-slate-950 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col justify-between">
            
            {/* Header portion */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between text-left">
              <div className="space-y-0.5">
                <span className="bg-amber-400 text-slate-950 text-[9px] font-black uppercase px-2.5 py-0.5 rounded-md">
                  #{lightboxItem.topic || "General Montessori"}
                </span>
                <h3 className="text-sm font-black uppercase tracking-tight text-white line-clamp-1">
                  {lightboxItem.title}
                </h3>
              </div>
              <button 
                onClick={() => setLightboxItem(null)}
                className="bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-full cursor-pointer transition-colors"
                title="Close Viewer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Media rendering stage */}
            <div className="bg-black/80 flex-grow h-[55vh] flex items-center justify-center overflow-hidden relative">
              {lightboxItem.type === "video" ? (
                <video 
                  src={lightboxItem.url} 
                  controls 
                  autoPlay
                  className="max-h-full max-w-full object-contain" 
                />
              ) : (
                <img 
                  src={lightboxItem.url} 
                  alt={lightboxItem.title} 
                  referrerPolicy="no-referrer"
                  className="max-h-full max-w-full object-contain" 
                />
              )}
            </div>

            {/* Actions Footer */}
            <div className="p-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-450 bg-slate-905">
              <span className="font-medium text-[10px] text-slate-350 uppercase select-none text-left">
                🔐 Academic Verification Stamp: Sneha Sen Academic Principal
              </span>

              <div className="flex gap-2">
                <a 
                  href={lightboxItem.url} 
                  download={`swara-moment-${lightboxItem.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-lime-500 hover:bg-lime-400 text-slate-950 px-4 py-2 rounded-xl text-xs font-black uppercase flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download size={14} /> Download Highlight
                </a>
                <button
                  onClick={() => setLightboxItem(null)}
                  className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl text-xs font-black uppercase transition-colors cursor-pointer"
                >
                  Close Viewer
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
