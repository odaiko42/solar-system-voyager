import { useState } from 'react';
import { MiniMap3D } from './MiniMap3D';
import { Button } from './button';
import { Card, CardContent } from './card';
import { Badge } from './badge';
import { getCurrentScale } from '@/utils/starSystemUtils';

interface EnhancedMiniMapProps {
  cameraDistance: number;
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
  onNavigate: (position: [number, number, number], target: [number, number, number]) => void;
  isVisible: boolean;
}

export const EnhancedMiniMap: React.FC<EnhancedMiniMapProps> = ({
  cameraDistance,
  cameraPosition,
  cameraTarget,
  onNavigate,
  isVisible
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const currentScale = getCurrentScale(cameraDistance);

  if (!isVisible) return null;

  return (
    <Card className={`
      fixed bottom-4 left-4 z-20 transition-all duration-300
      ${isExpanded ? 'w-80 h-64' : 'w-64 h-48'}
      bg-black/90 border-white/30 backdrop-blur-md overflow-hidden
    `}>
      {/* Header amélioré */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-r from-blue-900/80 to-purple-900/80 p-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs font-semibold text-white">Mini-Map 3D</span>
            <Badge variant="secondary" className="text-xs bg-white/20 text-white">
              {currentScale.name}
            </Badge>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-6 w-6 p-0 text-white hover:bg-white/20"
          >
            {isExpanded ? '−' : '+'}
          </Button>
        </div>
      </div>

      {/* Mini-Map 3D */}
      <div className="pt-8 h-full">
        <MiniMap3D
          cameraDistance={cameraDistance}
          cameraPosition={cameraPosition}
          cameraTarget={cameraTarget}
          onNavigate={onNavigate}
        />
      </div>

      {/* Footer avec informations étendues */}
      {isExpanded && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-2 border-t border-white/20">
          <div className="text-xs text-white/80 space-y-1">
            <div className="flex justify-between">
              <span>Échelle:</span>
              <span className="text-blue-300">{currentScale.description}</span>
            </div>
            <div className="flex justify-between">
              <span>Distance:</span>
              <span className="text-green-300">{(cameraDistance / 149597870.7).toFixed(2)} UA</span>
            </div>
            <div className="text-center text-yellow-300 font-medium">
              🎯 Vue d'ensemble interactive
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};