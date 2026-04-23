/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import MusicPlayer from './components/MusicPlayer.tsx';
import SnakeGame from './components/SnakeGame.tsx';
import Visualizer from './components/Visualizer.tsx';
import { TRACKS } from './constants.ts';
import { Track } from './types.ts';
import { Play, Terminal } from 'lucide-react';

export default function App() {
  const [currentTrack, setCurrentTrack] = useState<Track>(TRACKS[0]);
  const [appStarted, setAppStarted] = useState(false);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden select-none">
      {/* Immersive Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#151619_0%,#0a0a0c_100%)]" />
        
        {/* Animated Grid */}
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{ 
            backgroundImage: `linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }} 
        />

        {/* Dynamic Glows */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-1/4 -left-1/4 w-[80%] h-[80%] rounded-full blur-[120px] pointer-events-none"
          style={{ backgroundColor: `${currentTrack.accent}11` }}
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute -bottom-1/4 -right-1/4 w-[80%] h-[80%] rounded-full blur-[120px] pointer-events-none"
          style={{ backgroundColor: `${TRACKS[(TRACKS.indexOf(currentTrack) + 1) % TRACKS.length].accent}11` }}
        />
      </div>

      <AnimatePresence mode="wait">
        {!appStarted ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="z-10 relative text-center"
          >
            <div className="mb-12 relative">
              <motion.h1 
                animate={{ 
                  textShadow: [
                    `0 0 20px ${currentTrack.accent}`,
                    `0 0 40px ${currentTrack.accent}`,
                    `0 0 20px ${currentTrack.accent}`
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-7xl md:text-9xl font-black italic tracking-tighter leading-none uppercase mix-blend-screen"
                style={{ color: currentTrack.accent }}
              >
                SONIC<br/>STRIKE
              </motion.h1>
              <div className="flex flex-col items-center gap-2 mt-4">
                <div className="h-px w-24 bg-white/20" />
                <p className="text-[10px] uppercase tracking-[0.4em] text-white/40 font-mono">NEON ARCADE ENGINE v4.2</p>
              </div>
            </div>

            <button
              onClick={() => setAppStarted(true)}
              className="group relative px-12 py-5 bg-white text-black rounded-full font-bold text-xl overflow-hidden transition-all hover:scale-105 active:scale-95"
            >
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity"
                style={{ backgroundColor: currentTrack.accent }}
              />
              <span className="relative flex items-center gap-3">
                <Play size={24} fill="currentColor" />
                ENTER THE CORE
              </span>
            </button>

            <div className="mt-24 grid grid-cols-2 md:grid-cols-3 gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
               <div className="flex flex-col items-center gap-2">
                 <Terminal size={20} />
                 <span className="text-[10px] uppercase font-mono">SYST_BOOT</span>
               </div>
               <div className="flex flex-col items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                 <span className="text-[10px] uppercase font-mono">NEURAL_SYNC</span>
               </div>
               <div className="hidden md:flex flex-col items-center gap-2">
                 <div className="flex gap-1">
                   {[1,2,3].map(i => <div key={i} className="w-1 h-3 bg-white" />)}
                 </div>
                 <span className="text-[10px] uppercase font-mono">AUDIO_BUFF_OK</span>
               </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="z-10 w-full max-w-5xl flex flex-col items-center gap-8 relative"
          >
            {/* HUD Header */}
            <div className="w-full flex justify-between items-center px-4">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-widest text-white/40 font-mono">Now Mastering</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: currentTrack.accent }} />
                  <span className="font-bold text-sm tracking-tight">{currentTrack.title}</span>
                </div>
              </div>
              
              <Visualizer color={currentTrack.accent} />
              
              <div className="text-right">
                <span className="text-[10px] uppercase tracking-widest text-white/40 font-mono">Arcade Location</span>
                <p className="font-bold text-sm tracking-tight">NEO-TOKYO SECTOR 7</p>
              </div>
            </div>

            {/* Game & Player Column */}
            <div className="w-full flex flex-col md:flex-row gap-8 items-center md:items-start justify-center">
              <div className="flex-1 max-w-[440px] order-2 md:order-1">
                <MusicPlayer currentTrack={currentTrack} onTrackChange={setCurrentTrack} />
                
                {/* Secondary HUD info */}
                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="glass-panel p-4 rounded-2xl border-white/5">
                    <p className="text-[10px] uppercase text-white/40 mb-1">Controller</p>
                    <p className="text-xs font-mono">WASD / ARROWS</p>
                  </div>
                  <div className="glass-panel p-4 rounded-2xl border-white/5">
                    <p className="text-[10px] uppercase text-white/40 mb-1">Boost Status</p>
                    <p className="text-xs font-mono text-green-500">READY</p>
                  </div>
                </div>
              </div>

              <div className="order-1 md:order-2">
                <SnakeGame accentColor={currentTrack.accent} />
              </div>
            </div>
            
            {/* Footer Tech Info */}
            <div className="w-full flex justify-center mt-4">
               <p className="text-[9px] uppercase tracking-[0.6em] text-white/20 font-mono">
                 All assets generated by AI Studio Core // Prototype Version 0.98a
               </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
