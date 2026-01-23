import React, { useState, useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
// 1. 正式匯入圖標 (解決 [icon] 文字問題)
import { 
  User, Book, Trophy, X, Plus, 
  Sprout, Camera, Backpack, Binoculars, MapPin 
} from 'lucide-react';

import { Plant, Building, UserState, Position } from './types';
import { 
  INITIAL_PLANTS, INITIAL_BUILDINGS, MOCK_FRIENDS, 
  MAP_SIZE, INTERACTION_RADIUS, MOVE_SPEED 
} from './constants';

import CaptureUI from './components/CaptureUI';
import DiscoveryModal from './components/DiscoveryModal';
import LoginUI from './components/LoginUI';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserState>({
    level: 3, exp: 240, steps: 1240, inventory: [INITIAL_PLANTS[0]], 
    achievements: [], position: { x: 1500, y: 2500 }, friends: MOCK_FRIENDS
  });

  const [charConfig, setCharConfig] = useState({ gender: 'boy', accessories: [] as string[] });
  const [showCharPicker, setShowCharPicker] = useState(false);
  const [mapZoom, setMapZoom] = useState(1);
  const [plants, setPlants] = useState(INITIAL_PLANTS);
  const [buildings] = useState(INITIAL_BUILDINGS);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // 控制選單開關
  
  const [capturingPlant, setCapturingPlant] = useState<Plant | null>(null);
  const [lastDiscovery, setLastDiscovery] = useState<{data: any, isNew: boolean} | null>(null);
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null);

  const timeState = useMemo(() => {
    const h = new Date().getHours();
    return (h >= 6 && h < 17) ? 'sunny' : (h >= 17 && h < 19) ? 'cloudy' : 'night';
  }, []);

  // 鍵盤移動邏輯
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isAuthenticated || capturingPlant || selectedBuilding || showCharPicker) return;
      const key = e.key.toLowerCase();
      let dx = 0, dy = 0;
      if (['w', 'arrowup'].includes(key)) dy = -MOVE_SPEED;
      if (['s', 'arrowdown'].includes(key)) dy = MOVE_SPEED;
      if (['a', 'arrowleft'].includes(key)) dx = -MOVE_SPEED;
      if (['d', 'arrowright'].includes(key)) dx = MOVE_SPEED;
      
      if (dx !== 0 || dy !== 0) {
        setUser(prev => ({
          ...prev,
          position: { 
            x: Math.max(0, Math.min(MAP_SIZE, prev.position.x + dx)), 
            y: Math.max(0, Math.min(MAP_SIZE, prev.position.y + dy)) 
          }
        }));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthenticated, capturingPlant, selectedBuilding, showCharPicker]);

  const getDistance = (p1: Position, p2: Position) => Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));

  return (
    <div className="h-screen w-screen bg-[#f7faf8] overflow-hidden select-none relative font-sans text-slate-800">
      
      {/* 登入與角色選擇 */}
      <AnimatePresence>
        {!isAuthenticated && (
          <motion.div key="login" exit={{ opacity: 0 }} className="fixed inset-0 z-[300]">
            <LoginUI onLoginSuccess={() => { setIsAuthenticated(true); setShowCharPicker(true); }} />
          </motion.div>
        )}
        {isAuthenticated && showCharPicker && (
          <div className="fixed inset-0 z-[250] bg-white/95 flex items-center justify-center p-6">
            <div className="text-center max-w-sm">
              <h2 className="text-2xl font-black mb-8">選擇角色</h2>
              <div className="flex gap-4 justify-center mb-8">
                <button onClick={() => setCharConfig({...charConfig, gender: 'boy'})} className={`p-6 rounded-3xl border-4 ${charConfig.gender === 'boy' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100'}`}>
                  <User size={48} />
                </button>
                <button onClick={() => setCharConfig({...charConfig, gender: 'girl'})} className={`p-6 rounded-3xl border-4 ${charConfig.gender === 'girl' ? 'border-rose-400 bg-rose-50' : 'border-slate-100'}`}>
                  <User size={48} />
                </button>
              </div>
              <button onClick={() => setShowCharPicker(false)} className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-black text-xl shadow-lg">進入校園</button>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* 地圖層 */}
      <motion.div 
        className="absolute z-10 origin-center"
        style={{
          width: MAP_SIZE, height: MAP_SIZE, left: '50%', top: '50%',
          x: -user.position.x, y: -user.position.y, scale: mapZoom,
        }}
        transition={{ type: 'tween', ease: 'easeOut', duration: 0.1 }}
      >
        <div className="absolute inset-0 bg-[#f1f8f3]" style={{ backgroundImage: `radial-gradient(#d1e5d5 1.5px, transparent 1.5px)`, backgroundSize: '30px 30px' }} />
        
        {/* 建築物 */}
        {buildings.map(b => {
          const inRange = getDistance(user.position, b.position) <= INTERACTION_RADIUS;
          return (
            <div key={b.id} className="absolute z-20" style={{ left: b.position.x, top: b.position.y, transform: 'translate(-50%, -50%)' }}>
              <motion.div 
                whileHover={{ scale: 1.1 }}
                onClick={() => inRange && setSelectedBuilding(b)}
                className={`flex items-center justify-center p-6 rounded-[2.5rem] border-4 transition-all cursor-pointer shadow-lg
                  ${inRange ? 'bg-white border-emerald-400' : 'bg-white/40 border-slate-200 opacity-60 grayscale'}
                `}
              >
                <div className={inRange ? 'text-emerald-500' : 'text-slate-400'}>{b.visualIcon}</div>
              </motion.div>
              <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white/80 px-2 py-1 rounded-lg text-xs font-bold text-slate-600 shadow-sm">{b.name}</div>
            </div>
          );
        })}

        {/* 植物 */}
        {plants.map(p => {
          if (p.isDiscovered) return null;
          const inRange = getDistance(user.position, p.position) <= INTERACTION_RADIUS;
          return (
            <div key={p.id} className="absolute z-30" style={{ left: p.position.x, top: p.position.y, transform: 'translate(-50%, -50%)' }} onClick={() => inRange && setCapturingPlant(p)}>
              <div className={`w-14 h-14 flex items-center justify-center rounded-full border-4 transition-all 
                ${inRange ? 'bg-white border-emerald-400 scale-110 shadow-xl animate-bounce cursor-pointer' : 'bg-white/10 border-white/5 opacity-5 scale-50'}
              `}>
                <span className="text-2xl">{p.visualIcon}</span>
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* 2. 玩家角色 (恢復顯示) */}
      {isAuthenticated && !showCharPicker && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-40 scale-125">
          <div className="relative flex flex-col items-center">
            {/* 頭部 */}
            <div className={`w-16 h-16 ${charConfig.gender === 'boy' ? 'bg-[#ffcc99]' : 'bg-[#ffe0bd]'} rounded-full border-4 border-slate-800 shadow-inner overflow-hidden relative`}>
               <div className={`absolute top-0 w-full h-8 ${charConfig.gender === 'boy' ? 'bg-[#4e342e]' : 'bg-[#6d4c41]'} rounded-b-xl`} />
               <div className="absolute top-8 left-4 w-2 h-3 bg-slate-800 rounded-full" />
               <div className="absolute top-8 right-4 w-2 h-3 bg-slate-800 rounded-full" />
            </div>
            {/* 身體 */}
            <div className="w-12 h-10 bg-emerald-500 rounded-b-xl border-4 border-slate-800 -mt-2 z-[-1]" />
            {/* 偵測圈 */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-20 pointer-events-none">
                <div className="rounded-full border-[8px] border-emerald-400/10 bg-emerald-400/5" style={{ width: INTERACTION_RADIUS * 2, height: INTERACTION_RADIUS * 2 }} />
            </div>
          </div>
        </div>
      )}

      {/* 3. 恢復功能選單 (依照你的截圖 image_1d7376.png) */}
      {isAuthenticated && !showCharPicker && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-6">
          
          {/* 展開的三個按鈕 */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 20, scale: 0.8 }} 
                animate={{ opacity: 1, y: 0, scale: 1 }} 
                exit={{ opacity: 0, y: 20, scale: 0.8 }}
                className="flex gap-4 mb-2"
              >
                <button className="flex flex-col items-center gap-2">
                  <div className="w-14 h-14 bg-blue-400 rounded-2xl flex items-center justify-center text-white shadow-lg border-2 border-white">
                    <User size={24} />
                  </div>
                  <span className="text-xs font-bold text-slate-600 bg-white/80 px-2 py-1 rounded-full">檔案</span>
                </button>

                <button className="flex flex-col items-center gap-2 -mt-4">
                  <div className="w-14 h-14 bg-emerald-400 rounded-2xl flex items-center justify-center text-white shadow-lg border-2 border-white">
                    <Book size={24} />
                  </div>
                  <span className="text-xs font-bold text-slate-600 bg-white/80 px-2 py-1 rounded-full">圖鑑</span>
                </button>

                <button className="flex flex-col items-center gap-2">
                  <div className="w-14 h-14 bg-yellow-400 rounded-2xl flex items-center justify-center text-white shadow-lg border-2 border-white">
                    <Trophy size={24} />
                  </div>
                  <span className="text-xs font-bold text-slate-600 bg-white/80 px-2 py-1 rounded-full">成就</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 主按鈕 (粉紅色大按鈕) */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className={`w-20 h-20 rounded-full border-[6px] border-white shadow-2xl flex items-center justify-center transition-all duration-300 ${isMenuOpen ? 'bg-slate-800 rotate-45' : 'bg-rose-400 rotate-0'}`}
          >
            {isMenuOpen ? <Plus size={36} className="text-white" /> : <Plus size={36} className="text-white" />}
          </button>
        </div>
      )}

      {/* 彈出視窗：建築與拍照 */}
      <AnimatePresence>
        {selectedBuilding && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedBuilding(null)}>
             <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white p-8 rounded-[3rem] max-w-sm text-center shadow-2xl relative" onClick={e => e.stopPropagation()}>
                <button onClick={() => setSelectedBuilding(null)} className="absolute top-6 right-6 text-slate-300"><X /></button>
                <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center text-emerald-500 mx-auto mb-6 border-2 border-emerald-100">
                  {selectedBuilding.visualIcon}
                </div>
                <h2 className="text-2xl font-black text-slate-800 mb-4">{selectedBuilding.name}</h2>
                <p className="text-slate-500 mb-6 leading-relaxed text-sm bg-slate-50 p-4 rounded-2xl">{selectedBuilding.description}</p>
                <div className="flex justify-center gap-2 flex-wrap">
                  {selectedBuilding.notableFlora?.map(f => <span key={f} className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold">#{f}</span>)}
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {capturingPlant && <CaptureUI targetPlant={capturingPlant} onClose={() => setCapturingPlant(null)} onCaptured={(data, isNew) => { setCapturingPlant(null); setLastDiscovery({ data, isNew }); if (isNew) setPlants(p => p.map(x => x.id === capturingPlant.id ? {...x, isDiscovered: true} : x)); }} />}
      {lastDiscovery && <DiscoveryModal plantData={lastDiscovery.data} isNew={lastDiscovery.isNew} onClose={() => setLastDiscovery(null)} />}
    </div>
  );
};

export default App;