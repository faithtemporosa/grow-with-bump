import { useEffect, useRef, useState } from "react";

export const FuturisticBackground = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
      {/* Subtle floating orbs */}
      <div 
        className="absolute w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float-slow"
        style={{ 
          top: '20%', 
          left: '10%',
        }}
      />
      <div 
        className="absolute w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-float-slower"
        style={{ 
          bottom: '15%', 
          right: '15%',
        }}
      />
      
      {/* Subtle mouse glow */}
      <div
        className="absolute w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none transition-all duration-300 opacity-0 hover:opacity-100"
        style={{
          left: mousePos.x - 128,
          top: mousePos.y - 128,
          opacity: mousePos.x > 0 ? 0.3 : 0,
        }}
      />
    </div>
  );
};
