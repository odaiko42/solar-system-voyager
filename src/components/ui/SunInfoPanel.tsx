import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { Sun, Thermometer, Zap, Clock, Globe, Palette } from 'lucide-react';
import { sunMap, getSolarSystemStats } from '@/data/solarSystem';

interface SunInfoPanelProps {
  currentIntensity: number;
}

export const SunInfoPanel: React.FC<SunInfoPanelProps> = ({ currentIntensity }) => {
  const stats = getSolarSystemStats();
  const sunData = stats.sunData;
  
  // Calculer la température de couleur basée sur l'intensité actuelle
  const currentColorTemp = Math.round(sunData.temperature * (0.8 + currentIntensity * 0.05));
  
  // Calculer le pourcentage d'intensité
  const intensityPercent = Math.round((currentIntensity / sunData.intensityRange.max) * 100);
  
  // Déterminer la classe spectrale effective
  const getEffectiveSpectralClass = () => {
    if (currentColorTemp > 6000) return 'F5V (Chaude)';
    if (currentColorTemp > 5500) return 'G2V (Normale)';
    if (currentColorTemp > 5000) return 'G8V (Fraîche)';
    return 'K0V (Froide)';
  };

  return (
    <Card className="glass-panel">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Sun className="w-4 h-4 text-yellow-400" />
          Données Solaires Temps Réel
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Informations de base */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs">
              <Thermometer className="w-3 h-3 text-orange-400" />
              <span className="text-gray-400">Température</span>
            </div>
            <div className="text-white font-mono">
              {currentColorTemp.toLocaleString()}K
            </div>
            <Badge variant="outline" className="text-xs">
              {getEffectiveSpectralClass()}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs">
              <Zap className="w-3 h-3 text-yellow-400" />
              <span className="text-gray-400">Intensité</span>
            </div>
            <div className="text-white font-mono">
              {currentIntensity.toFixed(1)}x
            </div>
            <Badge 
              variant="outline" 
              className={`text-xs ${
                intensityPercent > 75 ? 'text-red-400 border-red-400' :
                intensityPercent > 50 ? 'text-orange-400 border-orange-400' :
                intensityPercent > 25 ? 'text-yellow-400 border-yellow-400' :
                'text-blue-400 border-blue-400'
              }`}
            >
              {intensityPercent}%
            </Badge>
          </div>
        </div>

        {/* Données astronomiques */}
        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-400">Âge:</span>
            <span className="text-white font-mono">
              {(sunMap.age / 1e9).toFixed(1)} milliards d'années
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-400">Rayon:</span>
            <span className="text-white font-mono">
              {sunMap.radius.toLocaleString()} km
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-400">Masse:</span>
            <span className="text-white font-mono">
              {(sunMap.mass / 1e30).toFixed(2)} × 10³⁰ kg
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-400">Luminosité:</span>
            <span className="text-white font-mono">
              {(sunMap.luminosity / 1e26).toFixed(1)} × 10²⁶ W
            </span>
          </div>
        </div>

        {/* Période de rotation */}
        <div className="flex items-center gap-2 p-2 bg-black/20 rounded">
          <Clock className="w-3 h-3 text-blue-400" />
          <div className="flex-1">
            <div className="text-xs text-gray-400">Rotation équatoriale</div>
            <div className="text-white font-mono text-xs">
              {sunMap.rotationPeriod.toFixed(1)} jours
            </div>
          </div>
        </div>

        {/* Texture utilisée */}
        <div className="flex items-center gap-2 p-2 bg-black/20 rounded">
          <Palette className="w-3 h-3 text-purple-400" />
          <div className="flex-1">
            <div className="text-xs text-gray-400">Texture</div>
            <div className="text-white font-mono text-xs">
              {sunMap.texture.split('/').pop()}
            </div>
          </div>
        </div>

        {/* Portée d'éclairage estimée */}
        <div className="flex items-center gap-2 p-2 bg-black/20 rounded">
          <Globe className="w-3 h-3 text-green-400" />
          <div className="flex-1">
            <div className="text-xs text-gray-400">Portée d'éclairage</div>
            <div className="text-white font-mono text-xs">
              {Math.round(currentIntensity * 50)} UA
            </div>
          </div>
        </div>

        {/* Informations contextuelles */}
        <div className="text-xs text-gray-500 bg-black/20 p-2 rounded">
          <p className="font-medium text-gray-300 mb-1">ℹ️ À propos</p>
          <p>{sunMap.description}</p>
        </div>
      </CardContent>
    </Card>
  );
};
