import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Slider } from './slider';
import { Button } from './button';
import { Sun, Lightbulb, Zap, Settings } from 'lucide-react';
import { sunMap } from '@/data/solarSystem';

interface SunIntensityControlProps {
  intensity: number;
  onIntensityChange: (intensity: number) => void;
}

export const SunIntensityControl: React.FC<SunIntensityControlProps> = ({
  intensity,
  onIntensityChange
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const presetButtons = [
    {
      name: 'Minimum',
      value: sunMap.intensitySettings.minimum,
      icon: <Lightbulb className="w-3 h-3" />,
      color: 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400'
    },
    {
      name: 'Réaliste',
      value: sunMap.intensitySettings.realistic,
      icon: <Sun className="w-3 h-3" />,
      color: 'bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400'
    },
    {
      name: 'Défaut',
      value: sunMap.intensitySettings.default,
      icon: <Settings className="w-3 h-3" />,
      color: 'bg-orange-500/20 hover:bg-orange-500/30 text-orange-400'
    },
    {
      name: 'Dramatique',
      value: sunMap.intensitySettings.dramatic,
      icon: <Zap className="w-3 h-3" />,
      color: 'bg-red-500/20 hover:bg-red-500/30 text-red-400'
    }
  ];

  const getIntensityLabel = () => {
    if (intensity <= 1) return 'Très faible';
    if (intensity <= 2) return 'Faible';
    if (intensity <= 3) return 'Modérée';
    if (intensity <= 4) return 'Normale';
    if (intensity <= 5) return 'Forte';
    if (intensity <= 6) return 'Très forte';
    return 'Extrême';
  };

  const getIntensityColor = () => {
    if (intensity <= 1) return 'text-blue-400';
    if (intensity <= 2) return 'text-cyan-400';
    if (intensity <= 3) return 'text-green-400';
    if (intensity <= 4) return 'text-yellow-400';
    if (intensity <= 5) return 'text-orange-400';
    if (intensity <= 6) return 'text-red-400';
    return 'text-pink-400';
  };

  return (
    <Card className="glass-panel">
      <CardHeader 
        className="pb-2 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sun className="w-4 h-4 text-yellow-400" />
            Intensité du Soleil
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs ${getIntensityColor()}`}>
              {getIntensityLabel()}
            </span>
            <span className="text-xs text-gray-400">
              {intensity.toFixed(1)}
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="pt-0 space-y-3">
          {/* Slider principal */}
          <div className="space-y-2">
            <Slider
              value={[intensity]}
              onValueChange={(value) => onIntensityChange(value[0])}
              min={sunMap.intensitySettings.minimum}
              max={sunMap.intensitySettings.maximum}
              step={0.1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>{sunMap.intensitySettings.minimum}</span>
              <span>{sunMap.intensitySettings.maximum}</span>
            </div>
          </div>

          {/* Boutons de préréglages */}
          <div className="grid grid-cols-2 gap-2">
            {presetButtons.map((preset) => (
              <Button
                key={preset.name}
                variant="ghost"
                size="sm"
                onClick={() => onIntensityChange(preset.value)}
                className={`${preset.color} flex items-center gap-1 text-xs h-8`}
              >
                {preset.icon}
                {preset.name}
              </Button>
            ))}
          </div>

          {/* Informations sur l'effet */}
          <div className="text-xs text-gray-400 space-y-1">
            <div className="flex justify-between">
              <span>Luminosité:</span>
              <span className={getIntensityColor()}>
                {Math.round((intensity / sunMap.intensitySettings.maximum) * 100)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span>Portée d'éclairage:</span>
              <span className="text-white">
                {Math.round(intensity * 50)} UA
              </span>
            </div>
            <div className="flex justify-between">
              <span>Température couleur:</span>
              <span className="text-yellow-300">
                {Math.round(5778 * (0.8 + intensity * 0.05))}K
              </span>
            </div>
          </div>

          {/* Description de l'effet actuel */}
          <div className="text-xs text-gray-500 bg-black/20 p-2 rounded">
            {intensity <= 1 && "Éclairage très doux, idéal pour observer les détails des planètes lointaines."}
            {intensity > 1 && intensity <= 2 && "Éclairage subtil, proche de la réalité spatiale."}
            {intensity > 2 && intensity <= 3 && "Éclairage équilibré pour une observation générale."}
            {intensity > 3 && intensity <= 4 && "Éclairage standard, bon compromis visibilité/réalisme."}
            {intensity > 4 && intensity <= 5 && "Éclairage intense, met en valeur les textures planétaires."}
            {intensity > 5 && intensity <= 6 && "Éclairage dramatique, effet spectaculaire."}
            {intensity > 6 && "Éclairage extrême, effet artistique maximum."}
          </div>
        </CardContent>
      )}
    </Card>
  );
};
