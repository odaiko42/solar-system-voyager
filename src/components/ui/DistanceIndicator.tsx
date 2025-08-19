import { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface DistanceIndicatorProps {
  cameraDistance: number;
}

export const DistanceIndicator: React.FC<DistanceIndicatorProps> = ({ cameraDistance }) => {
  const scaleInfo = useMemo(() => {
    // Convertir la distance de caméra en unités astronomiques réelles
    const distanceInAU = cameraDistance / 10; // Notre échelle: 1 AU = 10 unités
    const distanceInKm = distanceInAU * 149597870.7; // 1 AU en km
    const distanceInLightYears = distanceInAU / 63240; // 1 AL ≈ 63240 AU
    
    if (cameraDistance < 100) {
      return {
        scale: 'Système Solaire Interne',
        distance: `${distanceInAU.toFixed(1)} AU`,
        description: 'Planètes rocheuses visibles',
        color: 'text-green-400',
        icon: '🪐'
      };
    } else if (cameraDistance < 1000) {
      return {
        scale: 'Système Solaire Externe',
        distance: `${distanceInAU.toFixed(0)} AU`,
        description: 'Géantes gazeuses et leurs lunes',
        color: 'text-blue-400',
        icon: '🌌'
      };
    } else if (cameraDistance < 100000) {
      return {
        scale: 'Ceinture de Kuiper',
        distance: `${distanceInAU.toFixed(0)} AU`,
        description: 'Objets transneptuniens',
        color: 'text-purple-400',
        icon: '❄️'
      };
    } else if (cameraDistance < 1000000) {
      return {
        scale: 'Nuage d\'Oort',
        distance: `${(distanceInKm / 1e9).toFixed(1)} milliards km`,
        description: 'Limite gravitationnelle du Soleil',
        color: 'text-orange-400',
        icon: '☄️'
      };
    } else if (cameraDistance < 10000000) {
      return {
        scale: 'Espace Interstellaire',
        distance: `${distanceInLightYears.toFixed(1)} AL`,
        description: 'Étoiles voisines visibles',
        color: 'text-yellow-400',
        icon: '⭐'
      };
    } else if (cameraDistance < 100000000) {
      return {
        scale: 'Voisinage Galactique',
        distance: `${distanceInLightYears.toFixed(0)} AL`,
        description: 'Structure spirale de la Voie Lactée',
        color: 'text-purple-400',
        icon: '🌌'
      };
    } else {
      return {
        scale: 'Échelle Galactique',
        distance: `${(distanceInLightYears / 1000).toFixed(1)} k AL`,
        description: 'Voie Lactée et galaxies voisines',
        color: 'text-pink-400',
        icon: '🌠'
      };
    }
  }, [cameraDistance]);

  const getProximaCentauriInfo = () => {
    const proximaDistance = 4.24; // années-lumière
    const currentDistanceInLY = (cameraDistance / 10) / 63240;
    const percentageToProxima = (currentDistanceInLY / proximaDistance) * 100;
    
    if (currentDistanceInLY > 0.1) {
      return {
        show: true,
        percentage: Math.min(percentageToProxima, 100),
        canSeeProxima: currentDistanceInLY >= proximaDistance * 0.8
      };
    }
    return { show: false, percentage: 0, canSeeProxima: false };
  };

  const proximaInfo = getProximaCentauriInfo();

  return (
    <Card className="fixed top-4 left-4 glass-panel border-white/20 max-w-xs z-20">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Échelle actuelle */}
          <div className="flex items-center gap-2">
            <span className="text-lg">{scaleInfo.icon}</span>
            <div>
              <div className={`font-semibold ${scaleInfo.color}`}>
                {scaleInfo.scale}
              </div>
              <div className="text-xs text-muted-foreground">
                {scaleInfo.description}
              </div>
            </div>
          </div>

          {/* Distance actuelle */}
          <div className="bg-black/20 rounded p-2">
            <div className="text-xs text-muted-foreground">Distance de vue</div>
            <div className="font-mono text-sm font-semibold text-white">
              {scaleInfo.distance}
            </div>
          </div>

          {/* Progression vers Proxima Centauri */}
          {proximaInfo.show && (
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">
                Progression vers Proxima Centauri
              </div>
              <div className="w-full bg-black/30 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    proximaInfo.canSeeProxima ? 'bg-yellow-400' : 'bg-blue-400'
                  }`}
                  style={{ width: `${Math.min(proximaInfo.percentage, 100)}%` }}
                />
              </div>
              <div className="text-xs">
                {proximaInfo.canSeeProxima ? (
                  <span className="text-yellow-400 flex items-center gap-1">
                    <span>⭐</span>
                    Proxima Centauri visible !
                  </span>
                ) : (
                  <span className="text-blue-400">
                    {proximaInfo.percentage.toFixed(1)}% du chemin
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Échelle de comparaison */}
          {cameraDistance > 50000 && (
            <div className="text-xs text-muted-foreground border-t border-white/10 pt-2">
              <div>À cette échelle:</div>
              <div>• Notre système solaire = {
                cameraDistance > 100000000 ? 'point invisible' :
                cameraDistance > 10000000 ? 'grain de poussière' :
                cameraDistance > 1000000 ? 'point de lumière' : 'petite zone'
              }</div>
              {cameraDistance > 1000000 && cameraDistance < 10000000 && (
                <div>• 1 pixel ≈ {Math.round(cameraDistance / 100000)} millions km</div>
              )}
              {cameraDistance >= 10000000 && cameraDistance < 100000000 && (
                <div>• 1 pixel ≈ {(cameraDistance / 630000).toFixed(1)} AL</div>
              )}
              {cameraDistance >= 100000000 && (
                <div>• 1 pixel ≈ {Math.round(cameraDistance / 63000000)} k AL</div>
              )}
              {cameraDistance > 10000000 && (
                <div>• Voie Lactée = {cameraDistance > 100000000 ? 'disque spiral visible' : 'commence à être visible'}</div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};