/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Play, Pause, SkipForward, SkipBack, Music2, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { TRACKS } from '../constants.ts';
import { Track } from '../types.ts';

interface MusicPlayerProps {
  currentTrack: Track;
  onTrackChange: (track: Track) => void;
}

export default function MusicPlayer({ currentTrack, onTrackChange }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) return 0;
          return prev + 0.5;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    const currentIndex = TRACKS.findIndex((t) => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % TRACKS.length;
    onTrackChange(TRACKS[nextIndex]);
    setProgress(0);
  };

  const handlePrev = () => {
    const currentIndex = TRACKS.findIndex((t) => t.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + TRACKS.length) % TRACKS.length;
    onTrackChange(TRACKS[prevIndex]);
    setProgress(0);
  };

  return (
    <motion.div 
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="glass-panel rounded-3xl p-6 w-full max-w-md mx-auto relative overflow-hidden"
      style={{ boxShadow: `0 0 30px ${currentTrack.accent}22` }}
    >
      {/* Background Glow */}
      <div 
        className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[80px]"
        style={{ backgroundColor: currentTrack.accent }}
      />

      <div className="flex items-center gap-6 relative z-10">
        <motion.div 
          animate={{ 
            rotate: isPlaying ? 360 : 0,
            scale: isPlaying ? 1.05 : 1
          }}
          transition={{ 
            rotate: { duration: 10, repeat: Infinity, ease: "linear" },
            scale: { duration: 0.5 }
          }}
          className="w-24 h-24 rounded-2xl flex items-center justify-center relative overflow-hidden bg-white/5 border border-white/10"
        >
          <Music2 size={40} style={{ color: currentTrack.accent }} />
          {/* Progress ring simulation */}
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="46%"
              fill="none"
              stroke={currentTrack.accent}
              strokeWidth="2"
              strokeDasharray="290"
              strokeDashoffset={290 - (290 * progress) / 100}
              className="transition-all duration-1000"
            />
          </svg>
        </motion.div>

        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTrack.id}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
            >
              <h3 className="font-bold text-xl truncate">{currentTrack.title}</h3>
              <p className="text-white/50 text-sm flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: currentTrack.accent }} />
                {currentTrack.artist}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="mt-4 flex items-center gap-4">
            <button 
              onClick={handlePrev}
              className="text-white/60 hover:text-white transition-colors"
            >
              <SkipBack size={20} />
            </button>
            <button 
              onClick={togglePlay}
              className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
              style={{ backgroundColor: currentTrack.accent, color: '#000' }}
            >
              {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
            </button>
            <button 
              onClick={handleNext}
              className="text-white/60 hover:text-white transition-colors"
            >
              <SkipForward size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <Volume2 size={16} className="text-white/40" />
        <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full transition-all duration-300"
            style={{ width: '70%', backgroundColor: currentTrack.accent }}
          />
        </div>
        <span className="text-[10px] uppercase tracking-widest font-mono text-white/40">
          {currentTrack.genre}
        </span>
      </div>
    </motion.div>
  );
}
