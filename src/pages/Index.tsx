import { SolarSystem, SolarSystemRef } from '@/components/SolarSystem';
import { MeteoritePanel } from '@/components/ui/MeteoritePanel';
import { NavigationControls } from '@/components/ui/NavigationControls';
import { DistanceIndicator } from '@/components/ui/DistanceIndicator';
import { MiniMap3D } from '@/components/ui/MiniMap3D';
import { MiniMapToggle } from '@/components/ui/MiniMapToggle';
import { ControlsSidebar } from '@/components/ui/ControlsSidebar';
import { EnhancedMiniMap } from '@/components/ui/EnhancedMiniMap';
import { useSimulation } from '@/hooks/useSimulation';
import { Meteorite } from '@/types/astronomy';
import { famousMeteorites } from '@/data/meteorites';
import { useRef, useState, useCallback, useEffect } from 'react';
import { StarSystemNavigation } from '@/components/ui/StarSystemNavigation';

const Index = () => {
  const { simulationState, updateSimulation } = useSimulation();
  const solarSystemRef = useRef<SolarSystemRef>(null);
  const [meteorites, setMeteorites] = useState<Meteorite[]>([]);
  const [catalogTrajectories, setCatalogTrajectories] = useState<string[]>([]);
  const [cameraDistance, setCameraDistance] = useState(30);
  const [cameraPosition, setCameraPosition] = useState<[number, number, number]>([0, 0, 30]);
  const [cameraTarget, setCameraTarget] = useState<[number, number, number]>([0, 0, 0]);
  const [showMiniMap, setShowMiniMap] = useState(true);

  const handleResetCamera = () => {
    solarSystemRef.current?.resetCamera();
  };

  const handleFocusEarth = () => {
    solarSystemRef.current?.focusOnEarth();
  };

  const handleFocusSun = () => {
    solarSystemRef.current?.focusOnSun();
  };

  const handleFocusAsteroid = () => {
    solarSystemRef.current?.focusOnAsteroid();
  };

  const handleFocusStar = (starId: string) => {
    solarSystemRef.current?.focusOnStar(starId);
  };

  // Gestion de la navigation depuis la minimap
  const handleMinimapNavigate = useCallback((position: [number, number, number], target: [number, number, number]) => {
    if (solarSystemRef.current) {
      // Utiliser la méthode interne pour positionner la caméra
      const controls = (solarSystemRef.current as any).controlsRef?.current;
      if (controls) {
        controls.object.position.set(...position);
        controls.target.set(...target);
        controls.update();
      }
    }
  }, []);

  // Callback pour mettre à jour la position de la caméra
  const handleCameraUpdate = useCallback(
    (distance: number, position?: [number, number, number], target?: [number, number, number]) => {
      setCameraDistance(distance);
      if (position) setCameraPosition(position);
      if (target) setCameraTarget(target);
    },
    []
  );

  // Gestion des raccourcis clavier pour la mini-map et autres
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
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-cosmic-black to-background">
      {/* Main 3D Solar System */}
      <SolarSystem
        ref={solarSystemRef}
        selectedAsteroid={simulationState.selectedAsteroid}
        currentDate={simulationState.currentDate}
        timeScale={simulationState.timeScale}
        showOrbits={simulationState.showOrbits}
        showAsteroidPath={simulationState.showAsteroidPath}
        showPlanetNames={simulationState.showPlanetNames}
        showMoons={simulationState.showMoons}
        meteorites={meteorites}
        showMeteorites={simulationState.showMeteorites}
        showMeteoriteTrails={simulationState.showMeteoriteTrails}
        catalogTrajectories={catalogTrajectories}
        onCameraDistanceChange={handleCameraUpdate}
        sunIntensity={simulationState.sunIntensity}
        showGalaxies={simulationState.showGalaxies}
        showAsteroidBelt={simulationState.showAsteroidBelt}
        showKuiperBelt={simulationState.showKuiperBelt}
        showBeltDensity={simulationState.showBeltDensity}
      />

      {/* Mini-Map 3D conditionnelle améliorée */}
      <EnhancedMiniMap
        cameraDistance={cameraDistance}
        cameraPosition={cameraPosition}
        cameraTarget={cameraTarget}
        onNavigate={handleMinimapNavigate}
        isVisible={showMiniMap}
      />

      {/* Sidebar de contrôles moderne */}
      <ControlsSidebar
        simulationState={simulationState}
        onSimulationChange={updateSimulation}
        onResetCamera={handleResetCamera}
        onFocusEarth={handleFocusEarth}
        onFocusSun={handleFocusSun}
        onFocusAsteroid={handleFocusAsteroid}
        hasSelectedAsteroid={!!simulationState.selectedAsteroid}
        showMiniMap={showMiniMap}
        onToggleMiniMap={() => setShowMiniMap(!showMiniMap)}
      />
      
      {/* Indicateur de distance pour l'échelle interstellaire */}
      <DistanceIndicator cameraDistance={cameraDistance} />
      
      {/* Navigation vers les systèmes stellaires */}
      <StarSystemNavigation 
        onFocusStar={handleFocusStar}
        cameraDistance={cameraDistance}
      />
      
      {/* Panneaux spécialisés repositionnés */}
      <div className="fixed bottom-4 right-[600px] z-20">
        <MeteoritePanel
          simulationState={simulationState}
          onSimulationChange={updateSimulation}
          meteorites={meteorites}
          onMeteoritesChange={setMeteorites}
          catalogTrajectories={catalogTrajectories}
          onCatalogTrajectoriesChange={setCatalogTrajectories}
        />
      </div>
      
      {/* Guide de navigation amélioré */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-10">
        <div className="glass-panel rounded-lg p-4 text-xs text-muted-foreground max-w-md space-y-2 animate-float">
          <div className="flex items-center gap-2 text-primary font-semibold justify-center">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
            <span>Guide de Navigation Spatiale</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-center">
            <div><strong>Rotation :</strong> Clic gauche + glisser</div>
            <div><strong>Zoom :</strong> Molette de la souris</div>
            <div><strong>Panoramique :</strong> Clic droit + glisser</div>
            <div><strong>Mini-Map :</strong> Touche <kbd className="px-1 py-0.5 bg-white/20 rounded text-white font-mono">M</kbd></div>
          </div>
          <div className="border-t border-border/50 pt-2 text-center">
            <p><strong>🚀 Astuce :</strong> Utilisez la sidebar à droite pour tous les contrôles !</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
