/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Track } from './types.ts';

export const TRACKS: Track[] = [
  {
    id: '1',
    title: 'Cyber Drift',
    artist: 'AI Gen-01',
    duration: 180,
    genre: 'Synthwave',
    accent: '#00f3ff', // Cyan
  },
  {
    id: '2',
    title: 'Neon Pulse',
    artist: 'Neural Beats',
    duration: 215,
    genre: 'Electro',
    accent: '#ff00ff', // Magenta
  },
  {
    id: '3',
    title: 'Glitch Horizon',
    artist: 'Synth Mind',
    duration: 165,
    genre: 'Retrowave',
    accent: '#00ff00', // Neon Green
  },
];

export const GAME_CONFIG = {
  GRID_SIZE: 20,
  TILE_COUNT: 20,
  INITIAL_SPEED: 150,
  SPEED_INCREMENT: 2,
  MIN_SPEED: 60,
};
