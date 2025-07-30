    "use client"
    import React, { useState, useEffect } from 'react';

const NeoB404Page: React.FC = () => {
  const [glitchText, setGlitchText] = useState('404');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [shakeIntensity, setShakeIntensity] = useState(0);

  const glitchChars = ['4', '0', '4', '█', '▓', '▒', '░', 'X', '#', '@'];
  
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (Math.random() < 0.3) {
        const randomText = Array.from({ length: 3 }, () => 
          glitchChars[Math.floor(Math.random() * glitchChars.length)]
        ).join('');
        setGlitchText(randomText);
        
        setTimeout(() => setGlitchText('404'), 150);
      }
    }, 800);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      setShakeIntensity(Math.random() * 2);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      clearInterval(glitchInterval);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const errorMessages = [
    "PAGE NOT FOUND",
    "DIGITAL VOID",
    "BROKEN LINK",
    "DEAD END",
    "ERROR STATE"
  ];

  const [currentMessage, setCurrentMessage] = useState(0);

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessage(prev => (prev + 1) % errorMessages.length);
    }, 2000);
    
    return () => clearInterval(messageInterval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-mono overflow-hidden relative">
      
      {/* Aggressive cursor */}
      <div 
        className="fixed w-8 h-8 bg-red-500 pointer-events-none z-50 mix-blend-difference border-2 border-white"
        style={{
          left: mousePos.x - 16,
          top: mousePos.y - 16,
          transform: `rotate(${mousePos.x * 0.1}deg) scale(${1 + shakeIntensity})`
        }}
      />
      
      {/* Static noise background */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="w-full h-full bg-white animate-pulse" 
             style={{
               backgroundImage: `radial-gradient(circle, transparent 1px, white 1px)`,
               backgroundSize: '4px 4px'
             }}
        />
      </div>
      
      {/* Floating brutal shapes */}
      <div className="fixed inset-0 pointer-events-none z-10">
        <div className="absolute top-10 left-10 w-24 h-24 bg-yellow-400 transform rotate-45 animate-spin" 
             style={{ animationDuration: '20s' }}></div>
        <div className="absolute top-1/4 right-20 w-16 h-40 bg-red-500 animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-32 h-8 bg-white animate-pulse"></div>
        <div className="absolute top-1/2 left-10 w-8 h-32 bg-yellow-400 transform -rotate-12 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-10 w-20 h-20 bg-red-500 transform rotate-12 animate-spin" 
             style={{ animationDuration: '15s' }}></div>
      </div>

      {/* Main content */}
      <div className="relative z-20 min-h-screen flex flex-col justify-center items-center px-4">
        
        {/* Glitching 404 */}
        <div className="text-center mb-16">
          <h1 className="text-[12rem] md:text-[20rem] font-black leading-none text-red-500 mb-8 select-none"
              style={{
                textShadow: '8px 8px 0px #ffff00, 16px 16px 0px #ffffff',
                transform: `translate(${shakeIntensity}px, ${shakeIntensity}px)`
              }}>
            {glitchText}
          </h1>
          
          {/* Rotating error messages */}
          <div className="bg-yellow-400 text-black px-8 py-4 border-8 border-white transform rotate-2 inline-block mb-8">
            <p className="text-2xl md:text-4xl font-black tracking-wider">
              {errorMessages[currentMessage]}
            </p>
          </div>
        </div>

        {/* Brutal message box */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="bg-white text-black p-8 border-8 border-red-500 transform -rotate-1 shadow-[12px_12px_0px_0px_#ff0000]">
            <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight">
              OOPS! YOU&apos;VE ENTERED THE <span className="text-red-500">DIGITAL WASTELAND</span>
            </h2>
            <p className="text-lg md:text-xl font-bold">
              THE PAGE YOU&apos;RE LOOKING FOR HAS BEEN BRUTALLY DELETED, 
              MOVED TO ANOTHER DIMENSION, OR SIMPLY NEVER EXISTED.
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col md:flex-row gap-6 mb-16">
          <button className="bg-red-500 text-white px-8 py-4 text-xl font-black border-8 border-white hover:bg-yellow-400 hover:text-black transition-all duration-200 transform hover:scale-110 hover:-rotate-2 shadow-[6px_6px_0px_0px_#000000] hover:shadow-none">
            GO HOME
          </button>
          
          <button className="bg-yellow-400 text-black px-8 py-4 text-xl font-black border-8 border-white hover:bg-red-500 hover:text-white transition-all duration-200 transform hover:scale-110 hover:rotate-2 shadow-[6px_6px_0px_0px_#000000] hover:shadow-none">
            TRY AGAIN
          </button>
          
          <button className="bg-black text-white px-8 py-4 text-xl font-black border-8 border-white hover:bg-white hover:text-black transition-all duration-200 transform hover:scale-110 shadow-[6px_6px_0px_0px_#ff0000] hover:shadow-none">
            CONTACT US
          </button>
        </div>

        {/* Brutal stats/info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-black border-8 border-yellow-400 p-6 text-center transform rotate-1">
            <div className="text-4xl font-black text-yellow-400 mb-2">ERROR</div>
            <div className="text-lg font-black">CODE 404</div>
          </div>
          
          <div className="bg-red-500 border-8 border-white p-6 text-center transform -rotate-1">
            <div className="text-4xl font-black text-white mb-2">STATUS</div>
            <div className="text-lg font-black">NOT FOUND</div>
          </div>
          
          <div className="bg-yellow-400 border-8 border-black p-6 text-center transform rotate-2">
            <div className="text-4xl font-black text-black mb-2">MOOD</div>
            <div className="text-lg font-black">BRUTAL</div>
          </div>
        </div>
      </div>

  
    </div>
  );
};

export default NeoB404Page;