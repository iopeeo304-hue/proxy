import React from 'react';
import { 
  Compass, 
  LibraryBig, 
  School, 
  Church,
  MapPin,
  Trees,
  Flower2,
  User,
  Book,
  Trophy
} from 'lucide-react';
import { Plant, Building, Friend } from './types';

export const MAP_SIZE = 3000; 
export const INTERACTION_RADIUS = 200; 
export const MOVE_SPEED = 25;

// 定義地圖上的建築物 (使用真正的 Icon 元件)
export const INITIAL_BUILDINGS: Building[] = [
  { 
    id: '1', 
    name: '靜宜校門', 
    visualIcon: <Compass size={32} />, 
    description: '冒險的入口。這道宏偉的校門見證了無數靜宜人的啟航。', 
    position: { x: 1500, y: 2850 }, 
    notableFlora: ['校園榕樹', '金黃葛'] 
  },
  { 
    id: '2', 
    name: '主顧聖母堂', 
    visualIcon: <Church size={32} />, 
    description: '最具指標性的建築，象徵魚與生命。', 
    position: { x: 1200, y: 2000 }, 
    notableFlora: ['聖母百合', '鳳凰木'] 
  },
  { 
    id: '3', 
    name: '蓋夏圖書館', 
    visualIcon: <LibraryBig size={32} />, 
    description: '中部地區規模數一數二的大學圖書館。', 
    position: { x: 2300, y: 1200 }, 
    notableFlora: ['智慧蕨', '書香桂花'] 
  },
  { 
    id: '4', 
    name: '至善樓', 
    visualIcon: <School size={32} />, 
    description: '教學與行政的核心建築。', 
    position: { x: 1800, y: 1500 }, 
    notableFlora: ['矮牽牛', '變葉木'] 
  },
];

// 隨機產生植物
const generateRandomPlants = (count: number): Plant[] => {
  const names = ['靜宜小芽', '校園野草', '幸運草', '探險蘑菇', '朝氣小花', '刺刺君'];
  const icons = ['🌿', '🌱', '🍃', '☘️', '🍀', '🌵', '🌻', '🌼', '🌷', '🌹', '🌾', '🍄'];
  
  return Array.from({ length: count }).map((_, i) => ({
    id: `random-${i}`,
    name: names[Math.floor(Math.random() * names.length)],
    visualIcon: icons[Math.floor(Math.random() * icons.length)], // 植物使用 Emoji
    position: {
      x: Math.random() * (MAP_SIZE - 400) + 200,
      y: Math.random() * (MAP_SIZE - 400) + 200
    },
    type: Math.random() > 0.9 ? 'rare' : 'common',
    isDiscovered: false
  }));
};

export const INITIAL_PLANTS: Plant[] = [
  { id: 'p1', name: '靜宜百合', visualIcon: '🌸', position: { x: 1150, y: 2050 }, type: 'rare', isDiscovered: false },
  { id: 'p2', name: '校門古榕', visualIcon: '🌳', position: { x: 1580, y: 2780 }, type: 'common', isDiscovered: true },
  ...generateRandomPlants(40)
];

export const MOCK_FRIENDS: Friend[] = [
  { id: 'f1', name: 'Gary', avatar: '🐱', level: 15 },
];