import React from 'react';
import { motion } from 'motion/react';

interface SwaraLogoProps {
  className?: string;
  size?: number;
  interactive?: boolean;
}

export default function SwaraLogo({ className = "", size, interactive = true }: SwaraLogoProps) {
  // A majestic, highly detailed, and formal reproduction of the Swara Academy logo using responsive SVG vector lines
  // Embellished with premium gold leaf metallic frames, deep royal hues, and realistic lighting overlays.
  
  const sizeStyle = size ? { width: size, height: size } : {};

  return (
    <motion.div 
      className={`relative inline-flex items-center justify-center transition-all ${className}`}
      style={sizeStyle}
      whileHover={interactive ? { 
        scale: 1.08, 
        rotate: 3,
        filter: "drop-shadow(0 20px 25px rgba(0, 0, 0, 0.15)) drop-shadow(0 0 15px rgba(245, 158, 11, 0.35))"
      } : {}}
      whileTap={interactive ? { scale: 0.96 } : {}}
      id="swara-academy-logo-container"
    >
      <svg 
        viewBox="0 0 500 500" 
        className="w-full h-full drop-shadow-md select-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Liquid Gold Gradient for Frame Embellishments */}
          <linearGradient id="goldMetallic" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#aa771c" />
            <stop offset="20%" stopColor="#fbf5b7" />
            <stop offset="40%" stopColor="#b38728" />
            <stop offset="60%" stopColor="#fcf6ba" />
            <stop offset="80%" stopColor="#bf953f" />
            <stop offset="100%" stopColor="#8a5c0b" />
          </linearGradient>

          {/* Deep Royal Navy Gradient for Body */}
          <linearGradient id="royalNavyBlue" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#152f5e" />
            <stop offset="50%" stopColor="#0c1e3f" />
            <stop offset="100%" stopColor="#050e1f" />
          </linearGradient>

          {/* Premium Crimson/Gold Core Rim Gradient */}
          <linearGradient id="nobleCrimson" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e11d48" />
            <stop offset="50%" stopColor="#b91c1c" />
            <stop offset="100%" stopColor="#7f1d1d" />
          </linearGradient>

          {/* Majestic Ivory-Green Glow gradient for Book pages */}
          <linearGradient id="emeraldPage" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#bef264" />
            <stop offset="50%" stopColor="#84cc16" />
            <stop offset="100%" stopColor="#166534" />
          </linearGradient>

          {/* Circular paths for top and bottom text layouts */}
          <path 
            id="textPathCenterTop" 
            d="M 58 250 A 192 192 0 1 1 442 250" 
            fill="none" 
          />
          <path 
            id="textPathCenterBottom" 
            d="M 442 250 A 192 192 0 1 1 58 250" 
            fill="none" 
          />

          {/* Drop shadow filter block */}
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <style>{`
          .crest-text-top {
            font-family: 'Cinzel', 'Playfair Display', serif;
            font-weight: 900;
            fill: #ffffff;
            letter-spacing: 5px;
            font-size: 36px;
            text-shadow: 0 4px 6px rgba(0,0,0,0.4);
          }
          .crest-text-bottom {
            font-family: 'Plus Jakarta Sans', sans-serif;
            font-weight: 800;
            fill: #fef08a; /* Soft warm light gold */
            letter-spacing: 3.5px;
            font-size: 20px;
            text-shadow: 0 2px 4px rgba(0,0,0,0.4);
          }
          .shimmer-glaze {
            fill: url(#goldMetallic);
            opacity: 0.15;
            mix-blend-mode: overlay;
          }
        `}</style>

        {/* Outer Premium Gold Ring */}
        <circle cx="250" cy="250" r="248" fill="url(#goldMetallic)" />
        
        {/* Outer Dark Blue Shadowing circle */}
        <circle cx="250" cy="250" r="238" fill="url(#royalNavyBlue)" />
        
        {/* Outer Red Ring stripe (Noble Crimson) */}
        <circle cx="250" cy="250" r="226" fill="url(#nobleCrimson)" />
        <circle cx="250" cy="250" r="224" fill="none" stroke="url(#goldMetallic)" strokeWidth="1.5" />

        {/* Inner Golden separation track */}
        <circle cx="250" cy="250" r="174" fill="url(#goldMetallic)" />
        
        {/* Inner core Disk (Deep Royal Navy Blue) */}
        <circle cx="250" cy="250" r="169" fill="url(#royalNavyBlue)" />
        <circle cx="250" cy="250" r="167" fill="none" stroke="url(#goldMetallic)" strokeWidth="1" opacity="0.5" />

        {/* Top Arc Text: SWARA ACADEMY */}
        <text className="crest-text-top">
          <textPath href="#textPathCenterTop" startOffset="50%" textAnchor="middle">
            SWARA ACADEMY
          </textPath>
        </text>

        {/* Bottom Arc Text: STATION ROAD BASTI (U.P.) */}
        <text className="crest-text-bottom">
          <textPath href="#textPathCenterBottom" startOffset="50%" textAnchor="middle">
            STATION ROAD BASTI (U.P.)
          </textPath>
        </text>

        {/* Left and Right Gold Star Separately Crafted (More formal than standard dots) */}
        {/* Left star */}
        <g transform="translate(62, 250) scale(1.4)">
          <path d="M 0 -7 L 2 -2 L 7 -2 L 3 1 L 5 6 L 0 3 L -5 6 L -3 1 L -7 -2 L -2 -2 Z" fill="url(#goldMetallic)" />
        </g>
        {/* Right star */}
        <g transform="translate(438, 250) scale(1.4)">
          <path d="M 0 -7 L 2 -2 L 7 -2 L 3 1 L 5 6 L 0 3 L -5 6 L -3 1 L -7 -2 L -2 -2 Z" fill="url(#goldMetallic)" />
        </g>

        {/* Center illustration: Open Green Book with custom gradients, gold spine */}
        <g transform="translate(136, 168) scale(1.15)">
          {/* Soft inner shadowing block */}
          <rect x="0" y="0" width="200" height="135" fill="none" />
          
          {/* Main Book Pages (Left Wing) */}
          <path 
            d="M 100 100 C 60 72, 40 72, 5 77 L 5 3 C 40 3, 60 3, 100 22 Z" 
            fill="url(#emeraldPage)" 
            stroke="#166534" 
            strokeWidth="3"
            strokeLinejoin="round" 
          />
          {/* Premium gold borders for left page wing */}
          <path d="M 5 3 C 40 3, 60 3, 100 22" stroke="url(#goldMetallic)" strokeWidth="1.5" fill="none" />
          
          {/* Left Inner Wing Lines of page */}
          <path d="M 15 18 Q 50 18 90 32" stroke="#14532d" strokeWidth="2.5" fill="none" opacity="0.7" />
          <path d="M 15 41 Q 50 41 90 55" stroke="#14532d" strokeWidth="2.5" fill="none" opacity="0.7" />
          <path d="M 15 64 Q 50 64 90 78" stroke="#14532d" strokeWidth="2.5" fill="none" opacity="0.7" />
          
          {/* Main Book Pages (Right Wing) */}
          <path 
            d="M 100 100 C 140 72, 160 72, 195 77 L 195 3 C 160 3, 140 3, 100 22 Z" 
            fill="url(#emeraldPage)" 
            stroke="#166534" 
            strokeWidth="3" 
            strokeLinejoin="round"
          />
          {/* Premium gold borders for right page wing */}
          <path d="M 195 3 C 160 3, 140 3, 100 22" stroke="url(#goldMetallic)" strokeWidth="1.5" fill="none" />

          {/* Right Inner Wing Lines */}
          <path d="M 185 18 Q 150 18 110 32" stroke="#14532d" strokeWidth="2.5" fill="none" opacity="0.7" />
          <path d="M 185 41 Q 150 41 110 55" stroke="#14532d" strokeWidth="2.5" fill="none" opacity="0.7" />
          <path d="M 185 64 Q 150 64 110 78" stroke="#14532d" strokeWidth="2.5" fill="none" opacity="0.7" />

          {/* Central fountain pen tip (symbolizing classical literacy) with gold outline */}
          <path 
            d="M 100 21 L 84 61 L 84 86 L 116 86 L 116 61 Z" 
            fill="#050e1f" 
            stroke="url(#goldMetallic)" 
            strokeWidth="2.5" 
          />
          {/* Nib point split */}
          <line x1="100" y1="21" x2="100" y2="65" stroke="url(#goldMetallic)" strokeWidth="2.5" />
          <circle cx="100" cy="53" r="3.5" fill="url(#goldMetallic)" />
        </g>

        {/* Text "SWARA" beneath center on inner disc - styled in elegant gold serif */}
        <text 
          x="250" 
          y="350" 
          fill="url(#goldMetallic)" 
          fontSize="28" 
          fontWeight="900" 
          fontFamily="'Cinzel', serif" 
          letterSpacing="6" 
          textAnchor="middle"
          filter="url(#softGlow)"
        >
          SWARA
        </text>
        
        {/* Text "ACADEMY" beneath "SWARA" - styled in sleek wide tracked sans serif */}
        <text 
          x="250" 
          y="374" 
          fill="#bef264" 
          fontSize="14" 
          fontWeight="bold" 
          fontFamily="'Plus Jakarta Sans', sans-serif" 
          letterSpacing="5.5" 
          textAnchor="middle"
        >
          ACADEMY
        </text>

        {/* Inner Rim Accent lines */}
        <circle cx="250" cy="250" r="12" fill="none" stroke="url(#goldMetallic)" strokeWidth="1" opacity="0.3" />
      </svg>

      {/* Decorative interactive shine rays */}
      {interactive && (
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none transition-opacity duration-300 group-hover:opacity-100" />
      )}
    </motion.div>
  );
}
