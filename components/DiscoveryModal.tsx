
import React from 'react';
import { CheckCircle2, Award, Sparkles, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DiscoveryModalProps {
  plantData: any;
  isNew: boolean;
  onClose: () => void;
}

const DiscoveryModal: React.FC<DiscoveryModalProps> = ({ plantData, isNew, onClose }) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-zinc-900 border border-white/10 rounded-[2.5rem] w-full max-w-sm p-8 text-center relative overflow-hidden"
      >
        {isNew && (
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 via-green-400 to-emerald-400" />
        )}
        
        <div className="mb-6 relative">
          <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto border border-green-500/30">
            {isNew ? <Award className="text-yellow-400 w-12 h-12" /> : <CheckCircle2 className="text-green-400 w-12 h-12" />}
          </div>
          {isNew && (
            <div className="absolute top-0 right-1/4 -mt-2">
              <Sparkles className="text-yellow-400 animate-pulse" size={24} />
            </div>
          )}
        </div>

        <h2 className="text-2xl font-black text-white mb-2">
          {isNew ? "First Explorer!" : "Plant Cataloged!"}
        </h2>
        <p className="text-zinc-400 text-sm mb-6">
          {isNew 
            ? `You are the first person to record this plant here!`
            : `Information added to your botanical journal.`}
        </p>

        <div className="bg-black/40 rounded-3xl p-6 mb-8 text-left border border-white/5">
          <h3 className="text-green-400 font-bold text-lg leading-tight">{plantData.name}</h3>
          <p className="text-zinc-500 text-xs italic mb-2">{plantData.scientificName}</p>
          <p className="text-zinc-300 text-sm line-clamp-3">{plantData.description}</p>
          
          <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
            <span className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Rarity</span>
            <span className={`text-xs px-2 py-1 rounded-full font-bold uppercase ${
              plantData.rarity === 'legendary' ? 'bg-purple-500/20 text-purple-400' :
              plantData.rarity === 'rare' ? 'bg-orange-500/20 text-orange-400' : 'bg-green-500/20 text-green-400'
            }`}>
              {plantData.rarity}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <button 
            onClick={onClose}
            className="w-full py-4 bg-white text-black rounded-2xl font-bold transition-all active:scale-95"
          >
            Awesome!
          </button>
          <button className="w-full py-3 text-zinc-400 text-sm font-bold flex items-center justify-center gap-2">
            <Share2 size={16} />
            Share Discovery
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default DiscoveryModal;
