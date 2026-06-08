import React, { useEffect, useRef, useState } from 'react';

interface PlaygroundItem {
  id: string;
  name: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  size: number;
  color: string;
  emoji: string;
  speed: number;
  bounceOffset: number;
  zDepth: number; // 3D depth layers
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
  maxLife: number;
}

export default function ActivePlayground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [hoveredDescription, setHoveredDescription] = useState<string>("Hover anywhere or click to pop balloons!");
  const [score, setScore] = useState<number>(0);
  const [balloonCount, setBalloonCount] = useState<number>(12);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // Position of user's cursor
  const mouseRef = useRef({ x: 0, y: 0, prevX: 0, prevY: 0, speed: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Floating Toy Elements State
  const elementsRef = useRef<PlaygroundItem[]>([]);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    // Generate initial items in the pre-school sandbox
    const ems = [
      { emoji: "🎈", name: "Helium Balloon", desc: "Pop me for confetti bursts!", color: "#ec4899", zDepth: 1.5 },
      { emoji: "🎈", name: "Crimson Balloon", desc: "High floating speed energy!", color: "#ef4444", zDepth: 2 },
      { emoji: "🎈", name: "Lime Balloon", desc: "Bounces with a cute swing!", color: "#84cc16", zDepth: 1.2 },
      { emoji: "🧸", name: "Teddy Bear", desc: "A cuddly teddy looking for hugs!", color: "#fb923c", zDepth: 1.8 },
      { emoji: "🎨", name: "Art Palette", desc: "Unlock creative paint splatters!", color: "#a855f7", zDepth: 1 },
      { emoji: "🍎", name: "Organic Apple", desc: "Healthy snack time energy!", color: "#dc2626", zDepth: 1.4 },
      { emoji: "⚽", name: "Soccer Ball", desc: "Click to kick across the board!", color: "#ffffff", zDepth: 2.2 },
      { emoji: "🧱", name: "Alphabet Block", desc: "Stack and play in 3D!", color: "#3b82f6", zDepth: 0.8 },
      { emoji: "🚀", name: "Toy Rocket", desc: "Fly to cosmic pre-school stars!", color: "#6366f1", zDepth: 2.5 },
      { emoji: "☀️", name: "Happy Sun", desc: "Warms up the Swara sandpit!", color: "#eab308", zDepth: 0.5 },
      { emoji: "🍭", name: "Sweet Candy", desc: "Yummy dessert helper!", color: "#f43f5e", zDepth: 1.1 },
      { emoji: "🦄", name: "Cute Unicorn", desc: "Magical co-curricular values!", color: "#ec4899", zDepth: 2.1 }
    ];

    elementsRef.current = ems.map((item, index) => {
      const rx = 100 + Math.random() * 600;
      const ry = 100 + Math.random() * 300;
      return {
        id: `item-${index}`,
        name: item.name,
        x: rx,
        y: ry,
        targetX: rx,
        targetY: ry,
        size: 35 + Math.random() * 20,
        color: item.color,
        emoji: item.emoji,
        speed: 0.02 + Math.random() * 0.03,
        bounceOffset: Math.random() * 100,
        zDepth: item.zDepth
      };
    });

    // Handle Resize
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrame: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = 450);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || 800;
      height = canvas.height = 450;
    };
    window.addEventListener('resize', handleResize);

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle pastel cybergrid background for the 3D preschool feel
      ctx.strokeStyle = "rgba(59, 130, 246, 0.06)";
      ctx.lineWidth = 1;
      const gridSize = 40;
      
      // Dynamic shift of grid based on mouse position to create continuous 3D depth/parallax
      const offsetX = (mouseRef.current.x - width / 2) * 0.04;
      const offsetY = (mouseRef.current.y - height / 2) * 0.04;

      for (let x = offsetX % gridSize; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = offsetY % gridSize; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw a cute physical pre-school isometric landscape in base layer
      ctx.fillStyle = "rgba(163, 230, 53, 0.09)"; // Lime sandbox
      ctx.beginPath();
      ctx.ellipse(width / 2 + offsetX * 0.3, height - 60 + offsetY * 0.3, width * 0.4, 40, 0, 0, Math.PI * 2);
      ctx.fill();

      // Draw interactive toys playground slides & swings inside base shadows
      ctx.strokeStyle = "rgba(13, 148, 136, 0.2)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      // Slide frame
      ctx.moveTo(width / 4 + offsetX * 0.4, height - 40);
      ctx.lineTo(width / 4 + 40 + offsetX * 0.4, height - 100);
      ctx.lineTo(width / 4 + 110 + offsetX * 0.4, height - 30);
      ctx.stroke();

      // Swing frame
      ctx.beginPath();
      ctx.moveTo(width * 0.75 + offsetX * 0.4, height - 35);
      ctx.lineTo(width * 0.75 - 30 + offsetX * 0.4, height - 110);
      ctx.lineTo(width * 0.75 - 60 + offsetX * 0.4, height - 35);
      ctx.stroke();
      // Swing rope/seat
      ctx.strokeStyle = "rgba(37, 99, 235, 0.4)";
      ctx.beginPath();
      ctx.moveTo(width * 0.75 - 30 + offsetX * 0.4, height - 110);
      ctx.lineTo(width * 0.75 - 35 + offsetX * 0.4, height - 60);
      ctx.lineTo(width * 0.75 - 25 + offsetX * 0.4, height - 60);
      ctx.closePath();
      ctx.stroke();

      // Update and draw floating items with 3D cursor-gravity attraction/parallaxes
      elementsRef.current.forEach(item => {
        // Natural floating behavior using sine wave offsets
        item.bounceOffset += 0.015;
        const hoverWave = Math.sin(item.bounceOffset) * 1.5;

        // Calculate cursor displacement factor based on item depth layer
        const dx = mouseRef.current.x - item.x;
        const dy = mouseRef.current.y - item.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let forceX = 0;
        let forceY = 0;

        // Interactive "Magnetic Cursor Wand" effect
        if (dist < 180) {
          const strength = (180 - dist) / 180;
          // Items closer to the cursor are magnetically pushed or attracted based on depth
          const dirX = dx / dist;
          const dirY = dy / dist;

          // Add a circular orbit swirl or repulse based on zDepth
          if (item.zDepth > 1.5) {
            // High depth: pull slightly closer like a magnetic orbit
            forceX = dirX * strength * 45 * item.zDepth;
            forceY = dirY * strength * 45 * item.zDepth;
          } else {
            // Mid depth: push away gently to allow playful dodging
            forceX = -dirX * strength * 55 * (2 - item.zDepth);
            forceY = -dirY * strength * 55 * (2 - item.zDepth);
          }
        }

        // Float up slowly like continuous helium balloons
        item.targetY -= 0.25;
        if (item.targetY < -50) {
          item.targetY = height + 50;
          item.targetX = 50 + Math.random() * (width - 100);
          item.x = item.targetX;
          item.y = item.targetY;
        }

        // Ease towards the target positions + mouse force
        const targetXWithForce = item.targetX + forceX + (offsetX * item.zDepth);
        const targetYWithForce = item.targetY + forceY + hoverWave + (offsetY * item.zDepth);

        item.x += (targetXWithForce - item.x) * item.speed;
        item.y += (targetYWithForce - item.y) * item.speed;

        // Draw shadow of balloons on floor for 3D illusion
        const shadowScale = Math.max(0.2, (height - item.y) / height);
        ctx.fillStyle = "rgba(13, 35, 72, 0.12)";
        ctx.beginPath();
        ctx.ellipse(item.x, height - 30 + (offsetY * 0.1), item.size * 0.4 * shadowScale, 8, 0, 0, Math.PI * 2);
        ctx.fill();

        // Draw the cartoon pre-school items on canvas!
        ctx.save();
        ctx.translate(item.x, item.y);

        // Add 3D rotation based on mouse displacement
        const rotateAngle = (dx / width) * 0.35 * item.zDepth;
        ctx.rotate(rotateAngle);

        // Dynamic 3D scale reflection
        const breathe = 1 + Math.sin(item.bounceOffset) * 0.04;
        ctx.scale(breathe, breathe);

        // Draw outer glowing indicator rings when user hovers nearby
        if (dist < 80) {
          ctx.strokeStyle = item.color + "9e";
          ctx.lineWidth = 2.5;
          ctx.setLineDash([4, 6]);
          ctx.beginPath();
          ctx.arc(0, 0, item.size * 0.75, 0, Math.PI * 2);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // Output Emoji Text centered in item
        ctx.font = `${item.size}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(item.emoji, 0, 0);

        // Balloon string
        if (item.emoji === "🎈") {
          ctx.strokeStyle = "rgba(255, 255, 255, 0.45)";
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.moveTo(0, item.size * 0.4);
          ctx.bezierCurveTo(5, item.size * 0.4 + 10, -5, item.size * 0.4 + 25, 0, item.size * 0.4 + 40);
          ctx.stroke();
        }

        ctx.restore();
      });

      // Update and Draw Confetti and Sparkle particles
      particlesRef.current.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.08; // Gravity on particles!
        p.life -= 1;

        ctx.fillStyle = p.color;
        ctx.beginPath();
        if (idx % 2 === 0) {
          // Draw star shape for magic sparks
          ctx.arc(p.x, p.y, p.size * (p.life / p.maxLife), 0, Math.PI * 2);
        } else {
          // Draw square confetti bits
          ctx.rect(p.x - p.size/2, p.y - p.size/2, p.size, p.size);
        }
        ctx.fill();
      });

      // Filter dead sparkles
      particlesRef.current = particlesRef.current.filter(p => p.life > 0);

      // Draw Cursor "Magic wand particles" trail in real-time
      if (isHovered) {
        ctx.strokeStyle = "rgba(163, 230, 53, 0.4)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(mouseRef.current.x, mouseRef.current.y, 15, 0, Math.PI * 2);
        ctx.stroke();

        ctx.font = "14px system-ui";
        ctx.fillStyle = "#ffffff";
        ctx.fillText("🪄 Swara Wand", mouseRef.current.x + 20, mouseRef.current.y - 10);
      }

      animFrame = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener('resize', handleResize);
    };
  }, [balloonCount, isHovered]);

  // Handle Mouse movement across interactive pre-school play grid
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Track speed of cursor to generate dynamic trail volumes!
    const dx = x - mouseRef.current.x;
    const dy = y - mouseRef.current.y;
    mouseRef.current.speed = Math.sqrt(dx * dx + dy * dy);
    mouseRef.current.prevX = mouseRef.current.x;
    mouseRef.current.prevY = mouseRef.current.y;
    mouseRef.current.x = x;
    mouseRef.current.y = y;

    setMousePos({ x: Math.round(x), y: Math.round(y) });

    // Generate little magical star sparkles on fast cursor moves!
    if (mouseRef.current.speed > 5 && Math.random() < 0.45) {
      const colors = ["#fbbf24", "#38bdf8", "#818cf8", "#f472b6", "#a3e635", "#fb7185"];
      particlesRef.current.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        color: colors[Math.floor(Math.random() * colors.length)] + "cc",
        size: 3 + Math.random() * 5,
        life: 25 + Math.random() * 20,
        maxLife: 45
      });
    }

    // Check which item the user is general hovering on
    let foundHovered = false;
    elementsRef.current.forEach(item => {
      const idx = x - item.x;
      const idy = y - item.y;
      const d = Math.sqrt(idx * idx + idy * idy);
      if (d < item.size * 0.8) {
        setHoveredDescription(`🧸 ${item.name}: ${item.emoji} ${elementsRef.current.find(e => e.id === item.id)?.name === "Helium Balloon" ? 'Click to pop me!' : 'Hovering over ' + item.name + '!'}`);
        foundHovered = true;
      }
    });

    if (!foundHovered && Math.random() < 0.05) {
      setHoveredDescription("Move your mouse to swing or tilt objects! Click to pop balloons.");
    }
  };

  // Pop interactive items
  const handlePlaygroundClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    let popped = false;

    elementsRef.current = elementsRef.current.map(item => {
      const dx = x - item.x;
      const dy = y - item.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < item.size * 0.9) {
        // High fidelity popping event!
        popped = true;
        
        // Spawn 35 colorful physical confetti particles flying outwards!
        const candyColors = ["#f43f5e", "#ec4899", "#d946ef", "#8b5cf6", "#3b82f6", "#06b6d4", "#10b981", "#84cc16", "#eab308"];
        for (let i = 0; i < 35; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 2 + Math.random() * 8;
          particlesRef.current.push({
            x: item.x,
            y: item.y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - (1 + Math.random() * 3), // lift up initially
            color: candyColors[Math.floor(Math.random() * candyColors.length)],
            size: 4 + Math.random() * 6,
            life: 30 + Math.floor(Math.random() * 40),
            maxLife: 70
          });
        }

        // Trigger Score elevation!
        setScore(prev => prev + 10);
        setHoveredDescription(`✨ Popped spectacular ${item.name}! +10 Swara Points!`);

        // If it's a balloon, we respawn it at the bottom to continue the gaming flow
        if (item.emoji === "🎈") {
          return {
            ...item,
            x: Math.random() * canvas.width,
            y: canvas.height + 60,
            targetY: canvas.height + Math.random() * 100,
            targetX: 50 + Math.random() * (canvas.width - 100)
          };
        } else {
          // Push normal items into a spinning tumble orbit instead of full removal
          return {
            ...item,
            bounceOffset: item.bounceOffset + 15,
            targetX: 50 + Math.random() * (canvas.width - 100),
            targetY: 80 + Math.random() * 220
          };
        }
      }
      return item;
    });

    if (!popped) {
      // Shoot sparkles at normal mouse click anywhere else
      const sparkles = ["#a3e635", "#38bdf8", "#fbbf24", "#f43f5e"];
      for (let i = 0; i < 10; i++) {
        const ag = Math.random() * Math.PI * 2;
        const sp = 1 + Math.random() * 4;
        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(ag) * sp,
          vy: Math.sin(ag) * sp - 1,
          color: sparkles[Math.floor(Math.random() * sparkles.length)],
          size: 2.5 + Math.random() * 3,
          life: 15 + Math.random() * 15,
          maxLife: 30
        });
      }
    }
  };

  return (
    <div 
      className="relative w-full rounded-3xl overflow-hidden border-4 border-slate-900 bg-slate-950 text-white min-h-[480px] shadow-2xl flex flex-col transition-all duration-300"
      id="swara-3d-interactive-canvas-screen"
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
    >
      {/* Playful Console bar on Top */}
      <div className="bg-slate-900 border-b-2 border-slate-900 px-6 py-3 flex items-center justify-between text-xs font-mono select-none">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
          <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
          <span className="w-3 h-3 rounded-full bg-green-500"></span>
          <span className="text-lime-400 font-bold ml-2">SWARA 3D TOY-BOX ACTIVE</span>
        </div>
        <div className="hidden sm:flex items-center gap-6 text-slate-400">
          <span>CURSOR: {mousePos.x}px, {mousePos.y}px</span>
          <span>SPARKLES: {particlesRef.current.length}</span>
          <span className="bg-blue-600/30 text-blue-400 px-2 py-0.5 rounded border border-blue-500/50">PARALLAX ON</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-yellow-400 font-bold">🎯 PLAYGROUP SCORE:</span>
          <span className="bg-slate-950 px-3 py-1 rounded text-yellow-300 font-bold border border-yellow-500/30 text-sm">
            {score}
          </span>
        </div>
      </div>

      {/* Main interactive area rendering the Canvas elements */}
      <div className="relative flex-grow h-[350px]">
        {/* Cute Instruction label */}
        <div className="absolute top-4 left-6 z-10 pointers-none max-w-sm pointer-events-none select-none">
          <h4 className="text-xl font-black text-lime-400 drop-shadow-md">Active 3D Sandbox</h4>
          <p className="text-xs text-slate-300 drop-shadow">Hover around to tilt or cast wind forces, click elements directly to trigger pop mechanics.</p>
        </div>

        <canvas 
          ref={canvasRef} 
          onClick={handlePlaygroundClick}
          className="absolute inset-0 w-full h-full cursor-none block z-0"
        />

        {/* Dynamic Speech bubble floating inside board */}
        <div className="absolute bottom-4 left-6 z-10 bg-slate-900/95 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-800 text-xs text-lime-300 font-mono shadow-lg flex items-center gap-3 animate-bounce">
          <span className="text-lg">🧸</span>
          <div>
            <div className="text-slate-400 font-bold text-[10px]">TIPS:</div>
            <div>{hoveredDescription}</div>
          </div>
        </div>

        {/* Small indicator explaining 3D gyroscope/mouse link */}
        <div className="absolute bottom-4 right-6 z-10 text-[10px] text-slate-500 font-mono flex items-center gap-1.5 bg-slate-900/40 px-2 py-1 rounded">
          <span>🔄 Mouse Gyro Depth Activated</span>
        </div>
      </div>
    </div>
  );
}
