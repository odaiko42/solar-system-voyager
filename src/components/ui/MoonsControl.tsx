import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { solarSystemBodies } from '@/data/solarSystem';

interface MoonsControlProps {
  showMoons: { [planetId: string]: boolean };
  onMoonsChange: (planetId: string, show: boolean) => void;
}

export const MoonsControl: React.FC<MoonsControlProps> = ({
  showMoons,
  onMoonsChange
}) => {
  // Grouper les lunes par planète parent
  const moonsByPlanet = solarSystemBodies
    .filter(body => body.type === 'moon')
    .reduce((acc, moon) => {
      if (moon.parent) {
        if (!acc[moon.parent]) acc[moon.parent] = [];
        acc[moon.parent].push(moon);
      }
      return acc;
    }, {} as { [planetId: string]: typeof solarSystemBodies });

  // Obtenir le nom de la planète
  const getPlanetName = (planetId: string) => {
    const planet = solarSystemBodies.find(body => body.id === planetId);
    return planet?.name || planetId;
  };

  // Compter le nombre de lunes par planète
  const getMoonCount = (planetId: string) => {
    return moonsByPlanet[planetId]?.length || 0;
  };

  // Icônes et couleurs par planète
  const getPlanetInfo = (planetId: string) => {
    const colors = {
      earth: 'text-blue-500',
      jupiter: 'text-orange-400',
      saturn: 'text-yellow-400',
      uranus: 'text-cyan-400',
      neptune: 'text-blue-600'
    };
    return colors[planetId as keyof typeof colors] || 'text-gray-400';
  };

  return (
    <Card className="glass-panel">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          🌙 Affichage des Lunes
          <Badge variant="secondary" className="text-xs">
            {Object.keys(moonsByPlanet).length} planètes
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {Object.entries(moonsByPlanet).map(([planetId, moons]) => (
          <div key={planetId} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Label 
                  htmlFor={`moons-${planetId}`} 
                  className={`text-sm font-medium ${getPlanetInfo(planetId)}`}
                >
                  {getPlanetName(planetId)}
                </Label>
                <Badge variant="outline" className="text-xs h-5">
                  {getMoonCount(planetId)}
                </Badge>
              </div>
              <Switch
                id={`moons-${planetId}`}
                checked={showMoons[planetId] || false}
                onCheckedChange={(checked) => onMoonsChange(planetId, checked)}
              />
            </div>
            
            {/* Liste des lunes quand activé */}
            {showMoons[planetId] && (
              <div className="ml-4 text-xs text-muted-foreground space-y-1">
                {moons.map(moon => (
                  <div key={moon.id} className="flex items-center gap-2">
                    <div 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: moon.color }}
                    />
                    <span>{moon.name}</span>
                    <span className="text-xs opacity-70">
                      ({moon.radius.toFixed(0)} km)
                    </span>
                  </div>
                ))}
              </div>
            )}
            
            {Object.keys(moonsByPlanet).indexOf(planetId) < Object.keys(moonsByPlanet).length - 1 && (
              <Separator className="opacity-30" />
            )}
          </div>
        ))}
        
        <div className="pt-2 text-xs text-muted-foreground">
          <p>💡 Tip: Les lunes sont à l'échelle réelle mais leurs orbites sont réduites pour la visibilité</p>
        </div>
      </CardContent>
    </Card>
  );
};