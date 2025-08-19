import { useState } from 'react';
import { 
  Settings, 
  Map, 
  Rocket, 
  Eye, 
  Clock, 
  Target,
  ChevronDown,
  ChevronRight,
  PlayCircle,
  PauseCircle,
  RotateCcw,
  Sun,
  Search,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { SunIntensityControl } from '@/components/ui/SunIntensityControl';
import { SimulationState, Asteroid } from '@/types/astronomy';
import { famousAsteroids } from '@/data/solarSystem';

interface ControlsSidebarProps {
  simulationState: SimulationState;
  onSimulationChange: (updates: Partial<SimulationState>) => void;
  onResetCamera: () => void;
  onFocusEarth: () => void;
  onFocusSun: () => void;
  onFocusAsteroid: () => void;
  hasSelectedAsteroid: boolean;
  showMiniMap: boolean;
  onToggleMiniMap: () => void;
}

export const ControlsSidebar: React.FC<ControlsSidebarProps> = ({
  simulationState,
  onSimulationChange,
  onResetCamera,
  onFocusEarth,
  onFocusSun,
  onFocusAsteroid,
  hasSelectedAsteroid,
  showMiniMap,
  onToggleMiniMap
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openSections, setOpenSections] = useState({
    simulation: true,
    lighting: true,
    display: true,
    asteroids: false,
    navigation: true,
    minimap: true
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const timeScaleOptions = [
    { value: 0, label: 'Pause' },
    { value: 1, label: '1x' },
    { value: 10, label: '10x' },
    { value: 100, label: '100x' },
    { value: 1000, label: '1000x' }
  ];

  const getTimeScaleLabel = (value: number) => {
    const option = timeScaleOptions.find(opt => opt.value === value);
    return option ? option.label : `${value}x`;
  };

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

  return (
    <div className={`
      fixed top-0 right-0 h-full z-40 
      transition-all duration-300 ease-in-out
      ${isCollapsed ? 'w-16' : 'w-80'}
    `}>
      {/* Toggle Button */}
      <Button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -left-10 top-4 z-50 h-8 w-8 rounded-full bg-black/80 hover:bg-black/90 border border-white/30"
        size="sm"
      >
        <Settings className={`h-4 w-4 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
      </Button>

      {/* Sidebar Content */}
      <div className="h-full bg-black/90 backdrop-blur-md border-l border-white/20 overflow-y-auto">
        {!isCollapsed ? (
          <div className="p-4 space-y-4">
            {/* Header */}
            <div className="text-center">
              <h2 className="text-lg font-bold text-white mb-1">Contrôles</h2>
              <p className="text-xs text-white/60">Simulateur Spatial 3D</p>
            </div>

            <Separator className="bg-white/20" />

            {/* Section Simulation */}
            <Collapsible open={openSections.simulation} onOpenChange={() => toggleSection('simulation')}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between text-white hover:bg-white/10">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-400" />
                    <span>Simulation</span>
                  </div>
                  {openSections.simulation ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-3 mt-2">
                <Card className="bg-black/60 border-white/20">
                  <CardContent className="p-3 space-y-3">
                    {/* Play/Pause */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white">État</span>
                      <Button
                        size="sm"
                        onClick={() => onSimulationChange({ isPlaying: !simulationState.isPlaying })}
                        className={`${simulationState.isPlaying ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'}`}
                      >
                        {simulationState.isPlaying ? <PauseCircle className="h-4 w-4" /> : <PlayCircle className="h-4 w-4" />}
                        {simulationState.isPlaying ? 'Pause' : 'Play'}
                      </Button>
                    </div>

                    {/* Time Scale */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-white">Vitesse</span>
                        <Badge variant="secondary" className="bg-blue-900/50 text-blue-300">
                          {getTimeScaleLabel(simulationState.timeScale)}
                        </Badge>
                      </div>
                      <Slider
                        value={[simulationState.timeScale]}
                        onValueChange={([value]) => onSimulationChange({ timeScale: value })}
                        max={1000}
                        step={10}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-white/60 mt-1">
                        <span>0x</span>
                        <span>1000x</span>
                      </div>
                    </div>

                    {/* Date Display */}
                    <div className="text-center p-2 bg-black/40 rounded border border-white/10">
                      <p className="text-xs text-white/60">Date actuelle</p>
                      <p className="text-sm text-white font-mono">
                        {simulationState.currentDate.toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </CollapsibleContent>
            </Collapsible>

            {/* Section Éclairage */}
            <Collapsible open={openSections.lighting} onOpenChange={() => toggleSection('lighting')}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between text-white hover:bg-white/10">
                  <div className="flex items-center gap-2">
                    <Sun className="h-4 w-4 text-yellow-400" />
                    <span>Éclairage</span>
                  </div>
                  {openSections.lighting ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-3 mt-2">
                <Card className="bg-black/60 border-white/20">
                  <CardContent className="p-3 space-y-3">
                    {/* Sun Intensity Control Avancé */}
                    <SunIntensityControl
                      intensity={simulationState.sunIntensity}
                      onIntensityChange={(intensity) => onSimulationChange({ sunIntensity: intensity })}
                    />
                    
                    <div className="text-xs text-white/60 p-2 bg-yellow-900/20 rounded border border-yellow-500/30">
                      <p className="font-medium text-yellow-300 mb-1">💡 Éclairage Réaliste</p>
                      <p>Contrôle avancé basé sur les vraies données du Soleil : température, luminosité, et cycle solaire.</p>
                    </div>
                  </CardContent>
                </Card>
              </CollapsibleContent>
            </Collapsible>

            {/* Section Affichage */}
            <Collapsible open={openSections.display} onOpenChange={() => toggleSection('display')}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between text-white hover:bg-white/10">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-green-400" />
                    <span>Affichage</span>
                  </div>
                  {openSections.display ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-3 mt-2">
                <Card className="bg-black/60 border-white/20">
                  <CardContent className="p-3 space-y-3">
                    {/* Display Options */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white">Orbites planétaires</span>
                        <Switch
                          checked={simulationState.showOrbits}
                          onCheckedChange={(checked) => onSimulationChange({ showOrbits: checked })}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white">Voie Lactée & Andromède</span>
                        <Switch
                          checked={simulationState.showGalaxies}
                          onCheckedChange={(checked) => onSimulationChange({ showGalaxies: checked })}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white">Noms des planètes</span>
                        <Switch
                          checked={simulationState.showPlanetNames}
                          onCheckedChange={(checked) => onSimulationChange({ showPlanetNames: checked })}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white">Trajectoire astéroïde</span>
                        <Switch
                          checked={simulationState.showAsteroidPath}
                          onCheckedChange={(checked) => onSimulationChange({ showAsteroidPath: checked })}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white">Météorites</span>
                        <Switch
                          checked={simulationState.showMeteorites}
                          onCheckedChange={(checked) => onSimulationChange({ showMeteorites: checked })}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white">Traînées météorites</span>
                        <Switch
                          checked={simulationState.showMeteoriteTrails}
                          onCheckedChange={(checked) => onSimulationChange({ showMeteoriteTrails: checked })}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CollapsibleContent>
            </Collapsible>

            {/* Section Astéroïdes */}
            <Collapsible open={openSections.asteroids} onOpenChange={() => toggleSection('asteroids')}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between text-white hover:bg-white/10">
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-red-400" />
                    <span>Astéroïdes Célèbres</span>
                    <Badge variant="secondary" className="ml-auto text-xs">
                      {famousAsteroids.length}
                    </Badge>
                  </div>
                  {openSections.asteroids ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-3 mt-2">
                <Card className="bg-black/60 border-white/20">
                  <CardContent className="p-3">
                    <ScrollArea className="h-48">
                      <div className="space-y-2 pr-2">
                        {famousAsteroids.map((asteroid, index) => (
                          <div
                            key={asteroid.id}
                            className={`p-2 rounded-lg cursor-pointer transition-all duration-200 hover:bg-white/10 ${
                              simulationState.selectedAsteroid?.id === asteroid.id 
                                ? 'ring-1 ring-primary bg-primary/20' 
                                : 'hover:ring-1 hover:ring-white/30'
                            }`}
                            onClick={() => handleAsteroidSelect(asteroid)}
                          >
                            <div className="flex items-start justify-between mb-1">
                              <h4 className="font-medium text-xs text-white leading-tight">{asteroid.name}</h4>
                              <Badge 
                                variant={asteroid.type === 'Near-Earth' ? 'destructive' : 'secondary'}
                                className="text-xs px-1 py-0"
                              >
                                {asteroid.type === 'Near-Earth' ? 'NEO' : asteroid.type}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center justify-between text-xs text-white/60">
                              <span>Ø {asteroid.diameter} km</span>
                              <span>{new Date(asteroid.discoveryDate).getFullYear()}</span>
                            </div>
                            
                            {simulationState.selectedAsteroid?.id === asteroid.id && (
                              <div className="mt-1 text-xs text-primary animate-pulse flex items-center gap-1">
                                {isLoading ? (
                                  <>
                                    <LoadingSpinner size="sm" />
                                    <span>Chargement...</span>
                                  </>
                                ) : (
                                  <>✨ Suivi actif</>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </CollapsibleContent>
            </Collapsible>

            {/* Section Navigation */}
            <Collapsible open={openSections.navigation} onOpenChange={() => toggleSection('navigation')}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between text-white hover:bg-white/10">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-purple-400" />
                    <span>Navigation</span>
                  </div>
                  {openSections.navigation ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-3 mt-2">
                <Card className="bg-black/60 border-white/20">
                  <CardContent className="p-3 space-y-2">
                    <Button
                      onClick={onResetCamera}
                      className="w-full bg-gray-700 hover:bg-gray-600 text-white"
                      size="sm"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Vue d'ensemble
                    </Button>
                    
                    <Button
                      onClick={onFocusSun}
                      className="w-full bg-yellow-600 hover:bg-yellow-500 text-white"
                      size="sm"
                    >
                      ☀️ Centrer sur le Soleil
                    </Button>
                    
                    <Button
                      onClick={onFocusEarth}
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white"
                      size="sm"
                    >
                      🌍 Centrer sur la Terre
                    </Button>
                    
                    {hasSelectedAsteroid && (
                      <Button
                        onClick={onFocusAsteroid}
                        className="w-full bg-red-600 hover:bg-red-500 text-white"
                        size="sm"
                      >
                        🪨 Suivre l'astéroïde
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </CollapsibleContent>
            </Collapsible>

            {/* Section Mini-Map */}
            <Collapsible open={openSections.minimap} onOpenChange={() => toggleSection('minimap')}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-between text-white hover:bg-white/10">
                  <div className="flex items-center gap-2">
                    <Map className="h-4 w-4 text-cyan-400" />
                    <span>Mini-Map 3D</span>
                    <Badge variant={showMiniMap ? "default" : "secondary"} className="ml-auto">
                      {showMiniMap ? 'ON' : 'OFF'}
                    </Badge>
                  </div>
                  {openSections.minimap ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-3 mt-2">
                <Card className="bg-black/60 border-white/20">
                  <CardContent className="p-3 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white">Afficher Mini-Map</span>
                      <Switch
                        checked={showMiniMap}
                        onCheckedChange={onToggleMiniMap}
                      />
                    </div>
                    
                    <div className="text-xs text-white/60 p-2 bg-blue-900/20 rounded border border-blue-500/30">
                      <p className="font-medium text-blue-300 mb-1">💡 Astuce</p>
                      <p>Utilisez <kbd className="px-1 py-0.5 bg-white/20 rounded text-white font-mono text-xs">M</kbd> pour basculer rapidement</p>
                    </div>
                  </CardContent>
                </Card>
              </CollapsibleContent>
            </Collapsible>
          </div>
        ) : (
          // Collapsed state - show only icons
          <div className="p-2 space-y-4 mt-16">
            <Button
              variant="ghost"
              size="sm"
              className="w-full h-12 text-white hover:bg-white/10"
              onClick={() => toggleSection('simulation')}
            >
              <Clock className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full h-12 text-white hover:bg-white/10"
              onClick={() => toggleSection('lighting')}
            >
              <Sun className={`h-5 w-5 ${openSections.lighting ? 'text-yellow-400' : 'text-white'}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full h-12 text-white hover:bg-white/10"
              onClick={() => toggleSection('display')}
            >
              <Eye className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full h-12 text-white hover:bg-white/10"
              onClick={() => toggleSection('asteroids')}
            >
              <Search className={`h-5 w-5 ${openSections.asteroids ? 'text-red-400' : 'text-white'}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full h-12 text-white hover:bg-white/10"
              onClick={() => toggleSection('navigation')}
            >
              <Target className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full h-12 text-white hover:bg-white/10"
              onClick={onToggleMiniMap}
            >
              <Map className={`h-5 w-5 ${showMiniMap ? 'text-cyan-400' : 'text-white'}`} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};