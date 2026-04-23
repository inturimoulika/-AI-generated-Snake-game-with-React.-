/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

interface VisualizerProps {
  color: string;
}

export default function Visualizer({ color }: VisualizerProps) {
  const [bars, setBars] = useState<number[]>(new Array(24).fill(20));

  useEffect(() => {
    const interval = setInterval(() => {
      setBars(prev => prev.map(() => Math.random() * 60 + 10));
    }, 150);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-1 h-24 px-4">
      {bars.map((height, i) => (
        <motion.div
          key={i}
          initial={false}
          animate={{ 
            height,
            opacity: 0.2 + (height / 100)
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="w-1 rounded-full blur-[2px]"
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  );
}
