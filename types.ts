
import React from 'react';

export interface Position {
  x: number;
  y: number;
}

export interface Plant {
  id: string;
  name: string;
  scientificName?: string;
  position: Position;
  type: 'common' | 'rare' | 'legendary';
  isDiscovered: boolean;
  discoveredBy?: string;
  description?: string;
  imageUrl?: string;
  visualIcon: string; 
}

export interface Building {
  id: string;
  name: string;
  description: string;
  position: Position;
  visualIcon: React.ReactNode;
  notableFlora?: string[]; // 此區域著名的植物
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  dateEarned?: string;
}

export interface Friend {
  id: string;
  name: string;
  avatar: string;
  level: number;
}

export interface UserState {
  level: number;
  exp: number;
  steps: number;
  inventory: Plant[];
  achievements: Achievement[];
  position: Position;
  friends: Friend[];
}
