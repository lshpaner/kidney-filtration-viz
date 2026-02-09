import kidneyImage from './assets/kidney-cross-section.png'
import kfdLogo from '/kfd_logo_black.svg' 
import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Info, Droplet, AlertCircle } from 'lucide-react';

const KidneyFiltrationDemo = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [time, setTime] = useState(0);
  const [selectedView, setSelectedView] = useState('both');
  const [showInfo, setShowInfo] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(0.3);
  const [dropCount, setDropCount] = useState({ healthy: 0, ckd: 0 });
  const [ckdStage, setCkdStage] = useState(3); // CKD Stage 1-5

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setTime(t => {
          const newTime = (t + 0.015 * animationSpeed) % 1;
          if (newTime < t) {
            setDropCount(prev => ({
              healthy: prev.healthy + 10,
              ckd: prev.ckd + 6
            }));
          }
          return newTime;
        });
      }, 40);
    }
    return () => clearInterval(interval);
  }, [isPlaying, animationSpeed]);

  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;
    
    const handleKeyPress = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying(prev => !prev);
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        reset();
      } else if (e.code === 'KeyI') {
        e.preventDefault();
        setShowInfo(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Auto-cycle through CKD stages during animation
  useEffect(() => {
    let stageInterval;
    if (isPlaying) {
      stageInterval = setInterval(() => {
        setCkdStage(prev => (prev % 5) + 1); // 1→2→3→4→5→1
      }, 8000); // 8 seconds per stage
    }
    return () => clearInterval(stageInterval);
  }, [isPlaying]);

  const reset = () => {
    setTime(0);
    setIsPlaying(false);
    setDropCount({ healthy: 0, ckd: 0 });
  };

  const getBloodParticles = (type, count = 15) => {
    const particles = [];
    for (let i = 0; i < count; i++) {
      const particleTime = (time + i / count) % 1;
      let x, y, opacity;
      
      if (type === 'healthy') {
        if (particleTime < 0.3) {
          const t = particleTime / 0.3;
          x = 50 + t * 120;
          y = 200 + Math.sin(t * Math.PI) * 10;
          opacity = 0.8;
        } else if (particleTime < 0.6) {
          const t = (particleTime - 0.3) / 0.3;
          const angle = t * Math.PI * 4;
          x = 175 + Math.cos(angle) * 30;
          y = 200 + Math.sin(angle) * 30;
          opacity = 0.9;
        } else if (particleTime < 0.85) {
          const t = (particleTime - 0.6) / 0.25;
          x = 175 - t * 120;
          y = 220 + Math.sin(t * Math.PI) * 10;
          opacity = 0.8 - t * 0.5;
        } else {
          opacity = 0;
        }
      } else {
        if (particleTime < 0.35) {
          const t = particleTime / 0.35;
          x = 50 + t * 115;
          y = 200 + Math.sin(t * Math.PI * 0.8) * 12;
          opacity = 0.6;
        } else if (particleTime < 0.7) {
          const t = (particleTime - 0.35) / 0.35;
          const angle = t * Math.PI * 3;
          x = 175 + Math.cos(angle) * 25;
          y = 200 + Math.sin(angle) * 25;
          opacity = 0.65;
        } else if (particleTime < 0.95) {
          const t = (particleTime - 0.7) / 0.25;
          x = 175 - t * 115;
          y = 220 + Math.sin(t * Math.PI * 0.8) * 12;
          opacity = 0.6 - t * 0.5;
        } else {
          opacity = 0;
        }
      }
      
      if (opacity > 0) {
        particles.push({ x, y, opacity, id: i });
      }
    }
    return particles;
  };

  const getFiltrateParticles = (type, count = 10) => {
    const particles = [];
    for (let i = 0; i < count; i++) {
      const particleTime = (time + i / count + 0.35) % 1;
      let x, y, opacity;
      
      if (particleTime > 0.4 && particleTime < 0.75) {
        const t = (particleTime - 0.4) / 0.35;
        x = 119 + t * 10;
        y = 230 + t * 130;
        opacity = type === 'healthy' ? 1 - t * 0.2 : 0.5 - t * 0.20;
        particles.push({ x, y, opacity, id: i });
      }
    }
    return particles;
  };

  const calculateGFR = (type) => {
    if (type === 'healthy') {
      const baseGFR = 105;
      const variation = Math.sin(time * Math.PI * 2) * 5;
      return Math.max(0, baseGFR + variation);
    } else {
      const stageGFR = { 1: 95, 2: 75, 3: 45, 4: 20, 5: 8 };
      const baseGFR = stageGFR[ckdStage];
      const variation = Math.sin(time * Math.PI * 2) * 3;
      return Math.max(0, baseGFR + variation);
    }
  };

  const GFRGauge = ({ value, max, type, label }) => {
    const percentage = (value / max) * 100;
    const color = type === 'healthy' ? '#10b981' : '#ef4444';
    
    return (
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-gray-700">{label}</span>
          <span className="text-lg font-bold" style={{ color }}>
            {value.toFixed(1)} <span className="text-xs text-gray-500">mL/min/1.73m²</span>
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${Math.min(percentage, 100)}%`,
              backgroundColor: color
            }}
          />
        </div>
      </div>
    );
  };

  const HealthyKidney = () => {
    const bloodParticles = getBloodParticles('healthy');
    const filtrateParticles = getFiltrateParticles('healthy');
    
    return (
      <g>
        <defs>
          <filter id="glow-red">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="glow-blue">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          <radialGradient id="glomerulus-pulse">
            <stop offset="0%" stopColor="#DC143C" stopOpacity="0.8">
              <animate attributeName="stopOpacity" values="0.8;0.3;0.8" dur="2s" repeatCount="indefinite"/>
            </stop>
            <stop offset="100%" stopColor="#DC143C" stopOpacity="0"/>
          </radialGradient>
        </defs>
        
        <circle cx="175" cy="200" r="35" fill="url(#glomerulus-pulse)" opacity="0.4"/>
        
        <image
          href={kidneyImage}
          x="25"
          y="10"
          width="300"
          height="430"
          preserveAspectRatio="xMidYMid meet"
        />
        
        {bloodParticles.map(p => (
          <circle
            key={`blood-${p.id}`}
            cx={p.x}
            cy={p.y}
            r="3.5"
            fill="#DC143C"
            opacity={p.opacity}
            filter="url(#glow-red)"
          />
        ))}
        
        {filtrateParticles.map(p => (
          <circle
            key={`filtrate-${p.id}`}
            cx={p.x}
            cy={p.y}
            r="2"
            fill="#4169E1"
            opacity={p.opacity}
            filter="url(#glow-blue)"
          />
        ))}
        
        <g fontFamily="Arial, sans-serif" fontSize="11" fill="#1a5c1a" fontWeight="600">
          <text x="-20" y="207">Renal Artery</text>
          <line x1="75" y1="204" x2="115" y2="215" stroke="#1a5c1a" strokeWidth="1.5" />
          
          <text x="-20" y="242">Renal Vein</text>
          <line x1="45" y1="239" x2="115" y2="230" stroke="#1a5c1a" strokeWidth="1.5" />
          
          <text x="325" y="120">Capsule</text>
          <line x1="325" y1="123" x2="225" y2="130" stroke="#1a5c1a" strokeWidth="1.5" />
          
          <text x="325" y="175">Cortex</text>
          <line x1="325" y1="178" x2="240" y2="185" stroke="#1a5c1a" strokeWidth="1.5" />
          
          <text x="325" y="240">Medulla</text>
          <line x1="325" y1="243" x2="230" y2="250" stroke="#1a5c1a" strokeWidth="1.5" />
          
          <text x="325" y="295">Calyx</text>
          <line x1="325" y1="298" x2="210" y2="280" stroke="#1a5c1a" strokeWidth="1.5" />
          
          <text x="250" y="360">Pelvis</text>
          <line x1="250" y1="357" x2="185" y2="310" stroke="#1a5c1a" strokeWidth="1.5" />
          
          <text x="115" y="350">Ureter</text>
          <line x1="250" y1="415" x2="115" y2="422" />
        </g>
      </g>
    );
  };

  const CKDKidney = () => {
    const bloodParticles = getBloodParticles('ckd');
    const filtrateParticles = getFiltrateParticles('ckd');
    
    const saturation = 0.25 + (5 - ckdStage) * 0.15;
    const brightness = 0.65 - (ckdStage - 1) * 0.08;
    const proteinCount = ckdStage;
    
    const proteinParticles = [];
    for (let i = 0; i < proteinCount; i++) {
      const particleTime = (time + i * 0.2 + 0.45) % 1;
      if (particleTime > 0.4 && particleTime < 0.75) {
        const t = (particleTime - 0.4) / 0.35;
        proteinParticles.push({
          x: 120 + t * 2,
          y: 230 + t * 75,
          opacity: 1 - t * 0.2,
          id: i
        });
      }
    }
    
    return (
      <g>
        <defs>
          <filter id="ckd-filter">
            <feColorMatrix type="saturate" values={saturation}/>
            <feComponentTransfer>
              <feFuncR type="linear" slope={brightness}/>
              <feFuncG type="linear" slope={brightness}/>
              <feFuncB type="linear" slope={brightness}/>
            </feComponentTransfer>
          </filter>
          
          <filter id="glow-gold">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          <radialGradient id="damaged-glomerulus-pulse">
            <stop offset="0%" stopColor="#8B0000" stopOpacity="0.6">
              <animate attributeName="stopOpacity" values="0.6;0.2;0.6" dur="3s" repeatCount="indefinite"/>
            </stop>
            <stop offset="100%" stopColor="#8B0000" stopOpacity="0"/>
          </radialGradient>
        </defs>
        
        <circle cx="175" cy="200" r="30" fill="url(#damaged-glomerulus-pulse)" opacity="0.5"/>
        
        <image
          href={kidneyImage}
          x="25"
          y="10"
          width="300"
          height="430"
          preserveAspectRatio="xMidYMid meet"
          filter="url(#ckd-filter)"
        />
        
        {bloodParticles.map(p => (
          <circle
            key={`blood-ckd-${p.id}`}
            cx={p.x}
            cy={p.y}
            r="4"
            fill="#8B0000"
            opacity={p.opacity}
            filter="url(#glow-red)"
          />
        ))}
        
        {filtrateParticles.map(p => (
          <circle
            key={`filtrate-ckd-${p.id}`}
            cx={p.x}
            cy={p.y}
            r="2"
            fill="#4169E1"
            opacity={p.opacity * 0.6}
            filter="url(#glow-blue)"
          />
        ))}
        
        {proteinParticles.map(p => (
          <circle
            key={`protein-${p.id}`}
            cx={p.x}
            cy={p.y}
            r="3"
            fill="#FFD700"
            opacity={p.opacity}
            filter="url(#glow-gold)"
          />
        ))}
        
        <g fontFamily="Arial, sans-serif" fontSize="11" fill="#7a0000" fontWeight="600">
          <text x="-30" y="197">Narrowed</text>
          <text x="-30" y="209">Artery</text>
          <line x1="35" y1="203" x2="115" y2="215" stroke="#7a0000" strokeWidth="1.5" />
          
          <text x="-30" y="237">Congested</text>
          <text x="-30" y="249">Vein</text>
          <line x1="40" y1="243" x2="115" y2="230" stroke="#7a0000" strokeWidth="1.5" />
          
          <text x="325" y="110">Thinned</text>
          <text x="325" y="122">Capsule</text>
          <line x1="325" y1="116" x2="225" y2="130" stroke="#7a0000" strokeWidth="1.5" />
          
          <text x="325" y="165">Atrophied</text>
          <text x="325" y="177">Cortex</text>
          <line x1="325" y1="171" x2="240" y2="185" stroke="#7a0000" strokeWidth="1.5" />
          
          <text x="325" y="230">Fibrotic</text>
          <text x="325" y="242">Medulla</text>
          <line x1="325" y1="236" x2="230" y2="250" stroke="#7a0000" strokeWidth="1.5" />
          
          <text x="325" y="285">Blunted</text>
          <text x="325" y="297">Calyx</text>
          <line x1="325" y1="291" x2="210" y2="280" stroke="#7a0000" strokeWidth="1.5" />
          
          <text x="325" y="410" fill="#B8860B">Proteinuria</text>
          <line x1="320" y1="405" x2="135" y2="310" stroke="#B8860B" strokeWidth="1.5" strokeDasharray="3,2" />
          
          <text x="235" y="350">Dilated</text>
          <text x="240" y="362">Pelvis</text>
          <line x1="235" y1="356" x2="185" y2="310" stroke="#7a0000" strokeWidth="1.5" />
          
          <text x="115" y="350">Ureter</text>
          <line x1="250" y1="415" x2="115" y2="422" />
        </g>
      </g>
    );
  };

  const healthyGFR = calculateGFR('healthy');
  const ckdGFR = calculateGFR('ckd');

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="mb-8">
            <div className="flex items-center gap-1 mb-3">
              <img src={kfdLogo} alt="Kidney Filtration Dynamics" className="h-20 md:h-24" />
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 -mt-4">
                Healthy vs. Chronic Kidney Disease
              </h1>
            </div>
            <p className="text-lg text-gray-600">
              Comparative demonstration of glomerular filtration and tubular function in normal and CKD-affected nephrons
            </p>
          </div>

        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => setSelectedView('both')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              selectedView === 'both' 
                ? 'bg-blue-600 text-white shadow-lg scale-105' 
                : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-400 hover:shadow-md hover:scale-105'
            }`}
          >
            Compare Both
          </button>
          <button
            onClick={() => setSelectedView('healthy')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              selectedView === 'healthy' 
                ? 'bg-green-600 text-white shadow-lg scale-105' 
                : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-green-400 hover:shadow-md hover:scale-105'
            }`}
          >
            Healthy Kidney
          </button>
          <button
            onClick={() => setSelectedView('ckd')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              selectedView === 'ckd' 
                ? 'bg-red-600 text-white shadow-lg scale-105' 
                : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-red-400 hover:shadow-md hover:scale-105'
            }`}
          >
            CKD Kidney
          </button>

          <div className="hidden md:block w-px bg-gray-300 mx-2"></div>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-semibold"
          >
            {isPlaying ? <><Pause size={20} /> Pause</> : <><Play size={20} /> Animate</>}
          </button>
          
          <button
            onClick={reset}
            className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-semibold"
          >
            <RotateCcw size={20} /> Reset
          </button>
          
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="flex items-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-lg border-2 border-gray-200 hover:border-gray-400 hover:shadow-lg transform hover:scale-105 transition-all duration-200 font-semibold"
          >
            <Info size={20} /> {showInfo ? 'Hide' : 'Show'} Details
          </button>

          <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg border-2 border-gray-200 hover:border-blue-300 transition-all duration-200">
            <label className="text-sm font-semibold text-gray-700 whitespace-nowrap">
              Speed: {animationSpeed.toFixed(1)}x
            </label>
            <input
              type="range"
              min="0.25"
              max="2"
              step="0.25"
              value={animationSpeed}
              onChange={(e) => setAnimationSpeed(parseFloat(e.target.value))}
              className="w-24 h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer hover:bg-gray-400 transition-colors duration-200"
              style={{ accentColor: '#3b82f6' }}
            />
          </div>

          <div className="flex items-center gap-2 px-3 py-2 bg-red-50 rounded-lg border-2 border-red-200 hover:border-red-400 transition-all duration-200 -ml-1">
            <label className="text-xs font-semibold text-red-900 whitespace-nowrap">
              Stage: {ckdStage}
            </label>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={ckdStage}
              onChange={(e) => setCkdStage(parseInt(e.target.value))}
              className="w-20 h-2 bg-red-200 rounded-lg appearance-none cursor-pointer hover:bg-red-300 transition-colors duration-200"
              style={{ accentColor: '#ef4444' }}
            />
          </div>
        </div>

        <div className="hidden md:block text-xs text-gray-500 mb-6 text-center">
          💡 Keyboard shortcuts: <kbd className="px-2 py-1 bg-gray-100 rounded border border-gray-300">Space</kbd> Play/Pause · 
          <kbd className="px-2 py-1 bg-gray-100 rounded border border-gray-300 ml-1">R</kbd> Reset · 
          <kbd className="px-2 py-1 bg-gray-100 rounded border border-gray-300 ml-1">I</kbd> Toggle Info
        </div>

        {selectedView === 'both' ? (
          <div className="grid md:grid-cols-2 gap-6 mb-8 animate-fadeIn">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 shadow-lg border-2 border-green-300 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
              <h3 className="text-xl font-bold text-green-900 mb-4 text-center">Healthy Kidney</h3>
              <svg width="100%" viewBox="-50 0 450 450" preserveAspectRatio="xMidYMid meet" style={{ maxHeight: '450px' }}>
                <HealthyKidney />
              </svg>
              
              <div className="mt-4">
                <GFRGauge value={healthyGFR} max={120} type="healthy" label="Glomerular Filtration Rate" />
              </div>
              
              <div className="flex items-center gap-2 mt-3 text-green-800">
                <Droplet size={18} />
                <span className="text-sm font-semibold">Filtrate Drops: {dropCount.healthy}</span>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-6 shadow-lg border-2 border-red-300 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
              <h3 className="text-xl font-bold text-red-900 mb-4 text-center">Unhealthy Kidney</h3>
              <svg width="100%" viewBox="-50 0 450 450" preserveAspectRatio="xMidYMid meet" style={{ maxHeight: '450px' }}>
                <CKDKidney />
              </svg>
              
              <div className="mt-4">
                <GFRGauge value={ckdGFR} max={120} type="ckd" label="Glomerular Filtration Rate" />
              </div>
              
              <div className="flex items-center gap-2 mt-3 text-red-800">
                <Droplet size={18} />
                <span className="text-sm font-semibold">Filtrate Drops: {dropCount.ckd}</span>
              </div>

              <div className="mt-3 p-3 bg-red-100 rounded-lg border border-red-300">
                <div className="text-xs font-bold text-red-900 mb-1">
                  Stage {ckdStage} CKD: {
                    {
                      1: "Mild kidney damage, normal GFR (≥90)",
                      2: "Mild reduction in GFR (60-89)",
                      3: "Moderate reduction in GFR (30-59)",
                      4: "Severe reduction in GFR (15-29)",
                      5: "Kidney failure (GFR <15)"
                    }[ckdStage]
                  }
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center mb-8 animate-fadeIn">
            <div className={`rounded-xl p-6 shadow-lg border-2 w-full max-w-md transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${
              selectedView === 'healthy' 
                ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300' 
                : 'bg-gradient-to-br from-red-50 to-rose-50 border-red-300'
            }`}>
              <h3 className={`text-xl font-bold mb-4 text-center ${
                selectedView === 'healthy' ? 'text-green-900' : 'text-red-900'
              }`}>
                {selectedView === 'healthy' ? 'Healthy Kidney' : 'Unhealthy Kidney'}
              </h3>
              <svg width="100%" viewBox="-50 0 450 450" preserveAspectRatio="xMidYMid meet" style={{ maxHeight: '450px' }}>
                {selectedView === 'healthy' ? <HealthyKidney /> : <CKDKidney />}
              </svg>
              
              <div className="mt-4">
                <GFRGauge 
                  value={selectedView === 'healthy' ? healthyGFR : ckdGFR} 
                  max={120} 
                  type={selectedView === 'healthy' ? 'healthy' : 'ckd'} 
                  label="Glomerular Filtration Rate" 
                />
              </div>
              
              <div className={`flex items-center gap-2 mt-3 ${
                selectedView === 'healthy' ? 'text-green-800' : 'text-red-800'
              }`}>
                <Droplet size={18} />
                <span className="text-sm font-semibold">
                  Filtrate Drops: {selectedView === 'healthy' ? dropCount.healthy : dropCount.ckd}
                </span>
              </div>

              {selectedView === 'ckd' && (
                <div className="mt-3 p-3 bg-red-100 rounded-lg border border-red-300">
                  <div className="text-xs font-bold text-red-900 mb-1">
                    Stage {ckdStage} CKD: {
                      {
                        1: "Mild kidney damage, normal GFR (≥90)",
                        2: "Mild reduction in GFR (60-89)",
                        3: "Moderate reduction in GFR (30-59)",
                        4: "Severe reduction in GFR (15-29)",
                        5: "Kidney failure (GFR <15)"
                      }[ckdStage]
                    }
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {showInfo && (
          <>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border-2 border-green-300">
                <h3 className="text-xl font-bold text-green-900 mb-4">Healthy Kidney Function</h3>
                <div className="space-y-2 text-sm text-gray-800">
                  <div><span className="font-bold">GFR:</span> 90-120 mL/min/1.73m²</div>
                  <div><span className="font-bold">Blood Flow:</span> ~1,200 mL/min</div>
                  <div><span className="font-bold">Filtration:</span> Selective barrier retains albumin</div>
                  <div><span className="font-bold">Red Particles:</span> Blood cells in circulation</div>
                  <div><span className="font-bold">Blue Particles:</span> Filtrate/urine exiting via ureter</div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-rose-50 p-6 rounded-xl border-2 border-red-300">
                <h3 className="text-xl font-bold text-red-900 mb-4">CKD Pathophysiology</h3>
                <div className="space-y-2 text-sm text-gray-800">
                  <div><span className="font-bold">Reduced GFR:</span> &lt;60 mL/min/1.73m²</div>
                  <div><span className="font-bold">Blood Flow:</span> Reduced perfusion</div>
                  <div><span className="font-bold">Proteinuria:</span> Albumin leakage (gold particles)</div>
                  <div><span className="font-bold">Red Particles:</span> Slower, sparser blood flow</div>
                  <div><span className="font-bold">Blue Particles:</span> Reduced filtrate output</div>
                  <div><span className="font-bold">Gold Particles:</span> Protein leak into urine</div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-yellow-700 flex-shrink-0 mt-1" size={24} />
                <div>
                  <h4 className="font-bold text-yellow-900 mb-2">Educational Demonstration Only</h4>
                  <p className="text-sm text-yellow-800 leading-relaxed">
                    This visualization is a simplified educational model and does not represent complete kidney physiology. 
                    Actual renal function involves complex mechanisms including tubular reabsorption, secretion, hormonal regulation, 
                    and intricate hemodynamics. GFR values shown are illustrative and do not constitute medical advice. 
                    For clinical assessment of kidney function, consult qualified healthcare professionals and refer to validated 
                    diagnostic criteria including serum creatinine, eGFR calculations, urinalysis, and imaging studies.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-6 bg-blue-50 border-2 border-blue-300 rounded-xl p-6">
                          <h4 className="font-bold text-blue-900 mb-3">Key Terminology</h4>
                          <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-900">
                            <div>
                              <span className="font-bold">GFR:</span> Glomerular Filtration Rate - volume of fluid filtered by kidneys per unit time
                            </div>
                            <div>
                              <span className="font-bold">Proteinuria:</span> Presence of excess protein in urine, indicating glomerular damage
                            </div>
                            <div>
                              <span className="font-bold">Glomerulus:</span> Network of capillaries performing blood filtration
                            </div>
                            <div>
                              <span className="font-bold">Cortex:</span> Outer kidney region containing glomeruli
                            </div>
                            <div>
                              <span className="font-bold">Medulla:</span> Inner kidney region containing collecting tubules
                            </div>
                            <div>
                              <span className="font-bold">Nephron:</span> Functional filtering unit of the kidney
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Footer */}
                    <div className="mt-12 pt-6 border-t-2 border-gray-200 text-center">
                      <p className="text-sm text-gray-600">
                        © {new Date().getFullYear()} Leon Shpaner. All rights reserved.
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Educational visualization for kidney function research
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              );
            };

export default KidneyFiltrationDemo;