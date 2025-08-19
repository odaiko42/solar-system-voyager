import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Eye, 
  EyeOff, 
  Search,
  Info,
  ChevronDown,
  ChevronUp,
  Calendar
} from 'lucide-react';
import { Asteroid, SimulationState } from '@/types/astronomy';
import { famousAsteroids } from '@/data/solarSystem';
import { useState } from 'react';

interface AsteroidPanelProps {
  simulationState: SimulationState;
  onSimulationChange: (state: Partial<SimulationState>) => void;
}

export const AsteroidPanel: React.FC<AsteroidPanelProps> = ({
  simulationState,
  onSimulationChange
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAsteroidSelect = async (asteroid: Asteroid) => {
    setIsLoading(true);
    
    // Calculer une date historique pertinente pour l'astéroïde
    const getAsteroidDate = (asteroid: Asteroid) => {
      const discoveryDate = new Date(asteroid.discoveryDate);
      const currentDate = new Date();
      
      // Pour les astéroïdes récents, utiliser une date proche de la découverte
      // Pour les plus anciens, utiliser une date plus récente pour la visibilité
      if (asteroid.id === 'apophis') {
        return new Date('2029-04-13'); // Date de passage proche de la Terre
      } else if (asteroid.id === 'bennu') {
        return new Date('2020-10-20'); // Date de collecte d'échantillons OSIRIS-REx
      } else if (asteroid.id === 'vesta') {
        return new Date('2011-07-16'); // Arrivée de la sonde Dawn
      } else if (asteroid.id === 'ceres') {
        return new Date('2015-03-06'); // Arrivée de Dawn à Ceres
      } else if (asteroid.id === 'eros') {
        return new Date('2001-02-12'); // Atterrissage de NEAR Shoemaker
      } else if (asteroid.id === 'itokawa') {
        return new Date('2005-09-12'); // Arrivée de Hayabusa
      }
      
      // Date par défaut : milieu entre découverte et maintenant
      const timeDiff = currentDate.getTime() - discoveryDate.getTime();
      return new Date(discoveryDate.getTime() + timeDiff * 0.7);
    };

    const targetDate = getAsteroidDate(asteroid);
    
    // Simuler un petit délai pour le feedback visuel
    setTimeout(() => {
      onSimulationChange({ 
        selectedAsteroid: asteroid,
        showAsteroidPath: true,
        currentDate: targetDate,
        isPlaying: false // Pause pour observer la position
      });
      setIsLoading(false);
    }, 500);
  };

  const togglePlayPause = () => {
    onSimulationChange({ isPlaying: !simulationState.isPlaying });
  };

  const resetSimulation = () => {
    onSimulationChange({ 
      currentDate: new Date(),
      selectedAsteroid: null,
      showAsteroidPath: false,
      isPlaying: false
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTimeScaleLabel = (scale: number) => {
    if (scale < 1) return `${(scale * 100).toFixed(0)}% réel`;
    if (scale === 1) return "Temps réel";
    if (scale < 60) return `${scale.toFixed(1)}x plus rapide`;
    if (scale < 1440) return `${(scale / 60).toFixed(1)} heures/seconde`;
    return `${(scale / 1440).toFixed(1)} jours/seconde`;
  };

  return (
    <div className={`fixed left-4 top-4 w-80 max-h-[calc(100vh-2rem)] glass-panel rounded-lg z-10 transition-all duration-300 ${isCollapsed ? 'h-14' : ''}`}>
      <Card className="bg-transparent border-0 shadow-none h-full">
        <CardHeader className="p-4 pb-2">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="h-6 w-6 p-0 ml-auto"
            >
              {isCollapsed ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {formatDate(simulationState.currentDate)}
            </p>
          </div>
        </CardHeader>

        {!isCollapsed && (
          <CardContent className="p-4 pt-0 space-y-6 overflow-y-auto max-h-[calc(100vh-8rem)]">
            {/* Simulation Controls */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Play className="h-4 w-4" />
                Contrôles Temporels
              </h3>
              
              <div className="flex gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={simulationState.isPlaying ? "default" : "outline"}
                        size="sm"
                        onClick={togglePlayPause}
                        className="flex-1 transition-all duration-200"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <LoadingSpinner size="sm" className="mr-2" />
                        ) : simulationState.isPlaying ? (
                          <Pause className="w-3 h-3 mr-2" />
                        ) : (
                          <Play className="w-3 h-3 mr-2" />
                        )}
                        {simulationState.isPlaying ? 'Pause' : 'Lecture'}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{simulationState.isPlaying ? 'Mettre en pause' : 'Démarrer la simulation'}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={resetSimulation}
                        className="cosmic-button"
                      >
                        <RotateCcw className="w-3 h-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Remettre à zéro</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="timeScale" className="text-xs font-medium">
                    Vitesse temporelle
                  </Label>
                  <Badge variant="secondary" className="text-xs">
                    {getTimeScaleLabel(simulationState.timeScale)}
                  </Badge>
                </div>
                <Slider
                  id="timeScale"
                  min={0.1}
                  max={100}
                  step={0.1}
                  value={[simulationState.timeScale]}
                  onValueChange={(value) => 
                    onSimulationChange({ timeScale: value[0] })
                  }
                  className="w-full"
                />
              </div>
            </div>

            <Separator className="bg-border/50" />

            {/* Display Options */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Options d'Affichage
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 rounded-md bg-card/20">
                  <Label htmlFor="showOrbits" className="text-xs flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-white/50"></div>
                    Orbites planétaires
                  </Label>
                  <Switch
                    id="showOrbits"
                    checked={simulationState.showOrbits}
                    onCheckedChange={(checked) => 
                      onSimulationChange({ showOrbits: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-2 rounded-md bg-card/20">
                  <Label htmlFor="showAsteroidPath" className="text-xs flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    Trajectoire astéroïde
                  </Label>
                  <Switch
                    id="showAsteroidPath"
                    checked={simulationState.showAsteroidPath}
                    onCheckedChange={(checked) => 
                      onSimulationChange({ showAsteroidPath: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-2 rounded-md bg-card/20">
                  <Label htmlFor="showPlanetNames" className="text-xs flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                    Noms des planètes
                  </Label>
                  <Switch
                    id="showPlanetNames"
                    checked={simulationState.showPlanetNames}
                    onCheckedChange={(checked) => 
                      onSimulationChange({ showPlanetNames: checked })
                    }
                  />
                </div>
              </div>
            </div>

            <Separator className="bg-border/50" />

            {/* Selected Asteroid Info */}
            {simulationState.selectedAsteroid && (
              <>
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    Astéroïde Actuel
                  </h3>
                  
                  <div className="glass-panel rounded-lg p-3 space-y-3 animate-fade-in">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-sm stellar-text">
                          {simulationState.selectedAsteroid.name}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          Découvert le {new Date(simulationState.selectedAsteroid.discoveryDate).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <Badge 
                        variant={simulationState.selectedAsteroid.type === 'Near-Earth' ? 'destructive' : 'secondary'} 
                        className="text-xs animate-pulse"
                      >
                        {simulationState.selectedAsteroid.type}
                      </Badge>
                    </div>
                    
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {simulationState.selectedAsteroid.description}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="bg-card/30 rounded p-2">
                        <span className="text-muted-foreground block">Diamètre</span>
                        <span className="font-medium text-primary">
                          {simulationState.selectedAsteroid.diameter} km
                        </span>
                      </div>
                      <div className="bg-card/30 rounded p-2">
                        <span className="text-muted-foreground block">Période</span>
                        <span className="font-medium text-primary">
                          {simulationState.selectedAsteroid.orbitalPeriod.toFixed(1)} ans
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Separator className="bg-border/50" />
              </>
            )}

            {/* Asteroid List */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Info className="h-4 w-4" />
                Informations Simulateur
              </h3>
              
              <div className="text-xs text-muted-foreground space-y-2">
                <p>Le simulateur affiche le système solaire avec des astéroïdes célèbres et leurs trajectoires historiques.</p>
                <p className="text-primary">💡 Utilisez les contrôles à droite pour sélectionner des astéroïdes et ajuster la simulation.</p>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};