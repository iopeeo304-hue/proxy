
import React, { useState, useRef } from 'react';
import { Camera, X, Loader2, Award, Sparkles, PartyPopper, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plant } from '../types';

interface CaptureUIProps {
  onClose: () => void;
  onCaptured: (plantData: any, isNew: boolean) => void;
  targetPlant: Plant | null;
}

// 增強版彩炮組件
const Confetti: React.FC = () => {
  const particles = Array.from({ length: 60 });
  return (
    <div className="absolute inset-0 pointer-events-none z-[160] overflow-hidden">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            x: "50%", 
            y: "50%", 
            scale: 0,
            rotate: 0,
            opacity: 1
          }}
          animate={{ 
            x: `${Math.random() * 120 - 10}%`, 
            y: `${Math.random() * 120 - 10}%`, 
            scale: [0, 1.2, 0],
            rotate: Math.random() * 720,
            opacity: [1, 1, 0]
          }}
          transition={{ 
            duration: 2 + Math.random(), 
            ease: "easeOut",
            repeat: Infinity,
            repeatDelay: 0.5
          }}
          className="absolute w-5 h-3 rounded-full shadow-sm"
          style={{ 
            backgroundColor: ['#4ade80', '#fbbf24', '#f87171', '#60a5fa', '#c084fc', '#f472b6'][Math.floor(Math.random() * 6)]
          }}
        />
      ))}
    </div>
  );
};

const CaptureUI: React.FC<CaptureUIProps> = ({ onClose, onCaptured, targetPlant }) => {
  const [image, setImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        triggerSuccess();
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerSuccess = () => {
    setIsCapturing(true);
    // 模擬拍照處理時間
    setTimeout(() => {
      setIsCapturing(false);
      setIsSuccess(true);
      // 成功慶祝展示後跳轉
      setTimeout(() => {
        const mockData = {
          name: targetPlant?.name || "未知植物",
          scientificName: "Discovery in Progress",
          description: "您成功捕捉了校園的一抹綠意！這株植物將永久收藏在您的數位圖鑑中。",
          rarity: targetPlant?.type || "common"
        };
        onCaptured(mockData, !targetPlant?.isDiscovered);
      }, 3000);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[150] bg-emerald-50/98 backdrop-blur-2xl flex flex-col items-center justify-center p-4">
      <AnimatePresence>
        {!isSuccess && (
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-3 bg-white border-2 border-emerald-100 rounded-full text-emerald-500 hover:scale-110 transition-all shadow-lg active:scale-95"
          >
            <X size={24} strokeWidth={3} />
          </button>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!isSuccess ? (
          <motion.div 
            key="capture-form"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="w-full max-w-sm bg-white rounded-[3.5rem] overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] border-[10px] border-white flex flex-col"
          >
            <div className="relative aspect-square bg-emerald-50 flex items-center justify-center overflow-hidden">
              {image ? (
                <img src={image} alt="Captured" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center text-emerald-300">
                  <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-inner mb-6">
                    <Camera size={48} />
                  </div>
                  <p className="text-xs font-black uppercase tracking-[0.3em]">Ready to Discover</p>
                </div>
              )}

              {isCapturing && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-emerald-500/90 backdrop-blur-md flex flex-col items-center justify-center text-white"
                >
                  <Loader2 size={64} className="animate-spin mb-6" />
                  <p className="text-3xl font-black italic tracking-tighter">IDENTIFYING...</p>
                </motion.div>
              )}
            </div>

            <div className="p-10 text-center">
              <div className="flex justify-center gap-1 mb-3">
                 {[...Array(3)].map((_, i) => (
                   <div key={i} className="w-2 h-2 rounded-full bg-emerald-200" />
                 ))}
              </div>
              <h3 className="text-2xl font-black text-slate-800 mb-2">
                發現 {targetPlant?.name || "野生植物"}
              </h3>
              <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest mb-8">校園長征：解鎖新的植物物種</p>
              
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isCapturing}
                className="w-full py-5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-3xl font-black text-xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-emerald-200"
              >
                <Camera size={32} />
                捕捉植物
              </button>
              <input 
                type="file" 
                accept="image/*" 
                capture="environment"
                className="hidden" 
                ref={fileInputRef}
                onChange={handleFileChange}
              />
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="celebration"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center text-center relative"
          >
            <Confetti />
            
            {/* 核心慶祝圓盤 */}
            <motion.div 
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', damping: 12 }}
              className="w-56 h-56 bg-white rounded-[4rem] flex items-center justify-center shadow-[0_40px_100px_-20px_rgba(52,211,153,0.4)] border-[12px] border-emerald-400 mb-12 relative z-[170]"
            >
               <PartyPopper size={100} className="text-emerald-500" />
               <motion.div 
                 animate={{ scale: [1, 1.3, 1], rotate: [0, 15, -15, 0] }}
                 transition={{ repeat: Infinity, duration: 2.5 }}
                 className="absolute -top-6 -right-6 bg-yellow-400 p-4 rounded-3xl shadow-xl border-4 border-white"
               >
                 <Sparkles className="text-white" size={32} strokeWidth={3} />
               </motion.div>
            </motion.div>

            {/* 成功捕獲大字 */}
            <div className="relative z-[170] space-y-2">
              <motion.h2 
                initial={{ y: 50, opacity: 0, scale: 0.8 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="text-[72px] font-black text-emerald-500 leading-none tracking-tighter italic drop-shadow-[0_12px_0_rgba(16,185,129,0.1)]"
              >
                SUCCESS!
              </motion.h2>
              <motion.h3
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-3xl font-black text-slate-800 tracking-tighter bg-white/80 backdrop-blur-sm px-8 py-2 rounded-full inline-block shadow-sm"
              >
                CAPTURED
              </motion.h3>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="flex items-center justify-center gap-2 mt-6 text-emerald-600 font-black uppercase tracking-[0.4em] text-[12px]"
              >
                <Check size={18} strokeWidth={4} />
                圖鑑收錄完成
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {!isSuccess && (
        <div className="mt-12 px-8 py-3 bg-white rounded-full text-emerald-500 text-[12px] font-black uppercase tracking-[0.2em] flex items-center gap-3 shadow-xl border border-emerald-100">
          <Award size={18} />
          第一位紀錄者可獲得「首發探險家」勳章
        </div>
      )}
    </div>
  );
};

export default CaptureUI;
