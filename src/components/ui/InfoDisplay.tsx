import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, Calendar, Ruler, Orbit } from 'lucide-react';
import { Asteroid, SimulationState } from '@/types/astronomy';

interface InfoDisplayProps {
  simulationState: SimulationState;
}

export const InfoDisplay: React.FC<InfoDisplayProps> = ({ simulationState }) => {
  const formatSpeed = (timeScale: number) => {
    if (timeScale < 1) return `${(timeScale * 100).toFixed(0)}%`;
    if (timeScale < 60) return `${timeScale.toFixed(1)}x`;
    if (timeScale < 1440) return `${(timeScale / 60).toFixed(1)}h/s`;
    return `${(timeScale / 1440).toFixed(1)}j/s`;
  };

  const formatDistance = (au: number) => {
    const km = au * 149597870.7;
    if (km > 1000000) return `${(km / 1000000).toFixed(1)}M km`;
    if (km > 1000) return `${(km / 1000).toFixed(0)}K km`;
    return `${km.toFixed(0)} km`;
  };

  const getCurrentPhase = () => {
    if (!simulationState.selectedAsteroid) return null;
    
    const asteroid = simulationState.selectedAsteroid;
    const currentDate = simulationState.currentDate;
    const discoveryDate = new Date(asteroid.discoveryDate);
    
    if (currentDate < discoveryDate) {
      return {
        name: "Pré-découverte",
        color: "bg-gray-500",
        description: "L'astéroïde n'a pas encore été découvert"
      };
    }
    
    // Événements spéciaux pour certains astéroïdes
    if (asteroid.id === 'apophis' && currentDate >= new Date('2029-04-13')) {
      return {
        name: "Approche maximale",
        color: "bg-red-500",
        description: "Passage au plus près de la Terre"
      };
    }
    
    return {
      name: "Suivi actif",
      color: "bg-green-500",
      description: "Astéroïde sous surveillance"
    };
  };

  const phase = getCurrentPhase();

  return (
    <div className="fixed bottom-4 left-4 w-80 z-10">
      <Card className="glass-panel border-0 bg-card/10">
        <CardContent className="p-4 space-y-4">
          {/* Statut de simulation */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Vitesse</span>
            </div>
            <Badge variant={simulationState.isPlaying ? "default" : "secondary"}>
              {simulationState.isPlaying ? formatSpeed(simulationState.timeScale) : "Pause"}
            </Badge>
          </div>

          {/* Date actuelle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-cosmic-cyan" />
              <span className="text-sm font-medium">Date</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {simulationState.currentDate.toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })}
            </span>
          </div>

          {/* Informations sur l'astéroïde sélectionné */}
          {simulationState.selectedAsteroid && (
            <>
              <div className="border-t border-border/50 pt-3 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold stellar-text">
                    {simulationState.selectedAsteroid.name}
                  </h3>
                  {phase && (
                    <Badge className={`${phase.color} text-white`}>
                      {phase.name}
                    </Badge>
                  )}
                </div>

                {/* Propriétés orbitales */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <Ruler className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">Périhélie</span>
                    </div>
                    <span className="font-medium">
                      {formatDistance(simulationState.selectedAsteroid.perihelion)}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <Ruler className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">Aphélie</span>
                    </div>
                    <span className="font-medium">
                      {formatDistance(simulationState.selectedAsteroid.aphelion)}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <Orbit className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">Période</span>
                    </div>
                    <span className="font-medium">
                      {simulationState.selectedAsteroid.orbitalPeriod.toFixed(1)} ans
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <Ruler className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">Diamètre</span>
                    </div>
                    <span className="font-medium">
                      {simulationState.selectedAsteroid.diameter} km
                    </span>
                  </div>
                </div>

                {/* Barre de progression orbitale */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Position orbitale</span>
                    <span className="font-medium">
                      {((simulationState.currentDate.getTime() % (simulationState.selectedAsteroid.orbitalPeriod * 365.25 * 24 * 60 * 60 * 1000)) / (simulationState.selectedAsteroid.orbitalPeriod * 365.25 * 24 * 60 * 60 * 1000) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <Progress 
                    value={(simulationState.currentDate.getTime() % (simulationState.selectedAsteroid.orbitalPeriod * 365.25 * 24 * 60 * 60 * 1000)) / (simulationState.selectedAsteroid.orbitalPeriod * 365.25 * 24 * 60 * 60 * 1000) * 100} 
                    className="h-2"
                  />
                </div>

                {phase && (
                  <p className="text-xs text-muted-foreground italic">
                    {phase.description}
                  </p>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};