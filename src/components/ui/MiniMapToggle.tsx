import { useState, useEffect } from 'react';
import { MiniMap3D } from './MiniMap3D';

interface MiniMapToggleProps {
  cameraDistance: number;
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
  onNavigate: (position: [number, number, number], target: [number, number, number]) => void;
}

export const MiniMapToggle: React.FC<MiniMapToggleProps> = ({
  cameraDistance,
  cameraPosition,
  cameraTarget,
  onNavigate
}) => {
  const [showMiniMap, setShowMiniMap] = useState(true);

  // Gestion du raccourci clavier 'M'
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'm') {
        event.preventDefault();
        setShowMiniMap(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div className="fixed bottom-4 left-4 z-30">
      {/* Mini-Map 3D */}
      {showMiniMap && (
        <div className="animate-fade-in">
          <MiniMap3D
            cameraDistance={cameraDistance}
            cameraPosition={cameraPosition}
            cameraTarget={cameraTarget}
            onNavigate={onNavigate}
          />
        </div>
      )}
      
      {/* Bouton de contrôle élégant */}
      <button
        onClick={() => setShowMiniMap(!showMiniMap)}
        className={`
          ${showMiniMap ? 'mt-2' : ''}
          flex items-center gap-2 px-3 py-2 
          bg-gradient-to-r from-blue-900/80 to-purple-900/80 
          hover:from-blue-800/90 hover:to-purple-800/90
          border border-white/30 hover:border-white/50
          rounded-lg backdrop-blur-sm 
          text-white text-xs font-medium
          transition-all duration-300 hover:scale-105
          shadow-lg hover:shadow-xl hover:shadow-blue-500/20
          group
        `}
        title={showMiniMap ? "Masquer la Mini-Map 3D" : "Afficher la Mini-Map 3D"}
      >
        {/* Indicateur de statut */}
        <div className={`
          w-2 h-2 rounded-full transition-all duration-300
          ${showMiniMap ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}
        `}></div>
        
        {/* Icône et texte */}
        <div className="flex items-center gap-1">
          <span className="text-sm transition-transform duration-200 group-hover:scale-110">🗺️</span>
          <span className="hidden sm:inline">
            {showMiniMap ? 'Masquer' : 'Afficher'} Mini-Map
          </span>
        </div>
        
        {/* Indicateur d'animation */}
        <div className={`
          w-1 h-1 rounded-full bg-white/50 
          transition-all duration-300
          ${showMiniMap ? 'animate-bounce' : 'opacity-0'}
        `}></div>
      </button>
      
      {/* Raccourci clavier */}
      {!showMiniMap && (
        <div className="absolute -top-8 left-0 text-xs text-white/60 bg-black/40 px-2 py-1 rounded backdrop-blur-sm animate-fade-in">
          Appuyez sur <kbd className="px-1 py-0.5 bg-white/20 rounded text-white font-mono">M</kbd> pour activer
        </div>
      )}
    </div>
  );
};