import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { Suspense, useRef, useImperativeHandle, forwardRef, useState, useEffect } from 'react';
import { Sun } from './celestial/Sun';
import { Planet } from './celestial/Planet';
import { Moon } from './celestial/Moon';
import { AsteroidVisualizer } from './celestial/AsteroidVisualizer';
import { AsteroidBelt } from './celestial/AsteroidBelt';
import { KuiperBelt } from './celestial/KuiperBelt';
import { Meteorite } from './celestial/Meteorite';
import { NearbyStars } from './celestial/NearbyStars';
import { MilkyWayGalaxy } from './celestial/MilkyWayGalaxy';
import { AndromedaGalaxy } from './celestial/AndromedaGalaxy';
import { nearbyPlanetarySystems } from './celestial/ExoplanetSystem';
import { LoadingSpinner } from './ui/LoadingSpinner';
import { solarSystemBodies } from '@/data/solarSystem';
import { famousMeteorites } from '@/data/meteorites';
import { CelestialBody, Asteroid } from '@/types/astronomy';
import { calculatePlanetPosition, calculateAsteroidPosition, calculateMoonPosition } from '@/utils/orbitalCalculations';

// Étoiles proches pour la navigation (avec données complètes)
const nearbyStarsData = [
  {
    id: 'proxima-centauri',
    name: 'Proxima Centauri',
    position: [2681000, 150000, -500000],
    distance: 4.24
  },
  {
    id: 'alpha-centauri-a', 
    name: 'Alpha Centauri A',
    position: [2700000, 200000, -480000],
    distance: 4.37
  },
  {
    id: 'barnards-star',
    name: 'Étoile de Barnard', 
    position: [1800000, -2500000, 2200000],
    distance: 5.96
  },
  {
    id: 'sirius-a',
    name: 'Sirius A',
    position: [4200000, -4800000, 1600000],
    distance: 8.60
  },
  {
    id: 'epsilon-eridani',
    name: 'Epsilon Eridani',
    position: [3200000, -4500000, -6800000],
    distance: 10.5
  },
  {
    id: 'ross-128',
    name: 'Ross 128',
    position: [-4200000, 2800000, -7300000],
    distance: 11.0
  },
  {
    id: 'tau-ceti',
    name: 'Tau Ceti',
    position: [5800000, -3200000, -8100000],
    distance: 11.9
  }
];

interface SolarSystemProps {
  selectedAsteroid: Asteroid | null;
  currentDate: Date;
  timeScale: number;
  showOrbits: boolean;
  showAsteroidPath: boolean;
  showPlanetNames: boolean;
  showMoons: { [planetId: string]: boolean };
  meteorites: import('@/types/astronomy').Meteorite[];
  showMeteorites: boolean;
  showMeteoriteTrails: boolean;
  catalogTrajectories: string[];
  sunIntensity: number; // Sun light intensity
  showGalaxies: boolean; // Show galaxies
  showAsteroidBelt: boolean; // Show asteroid belt
  showKuiperBelt: boolean; // Show Kuiper belt
  showBeltDensity: boolean; // Show belt particle clouds
  onCameraDistanceChange?: (
    distance: number, 
    position?: [number, number, number], 
    target?: [number, number, number]
  ) => void;
}

export interface SolarSystemRef {
  focusOnSun: () => void;
  focusOnEarth: () => void;
  focusOnAsteroid: () => void;
  focusOnStar: (starId: string) => void;
  resetCamera: () => void;
  controlsRef?: React.RefObject<any>; // Pour accéder aux contrôles depuis l'extérieur
}

export const SolarSystem = forwardRef<SolarSystemRef, SolarSystemProps>(({
  selectedAsteroid,
  currentDate,
  timeScale,
  showOrbits,
  showAsteroidPath,
  showPlanetNames,
  showMoons,
  meteorites,
  showMeteorites,
  showMeteoriteTrails,
  catalogTrajectories,
  sunIntensity,
  showGalaxies,
  showAsteroidBelt = true,
  showKuiperBelt = true,
  showBeltDensity = true,
  onCameraDistanceChange
}, ref) => {
  const groupRef = useRef<THREE.Group>(null);
  const controlsRef = useRef<any>(null);
  const [cameraDistance, setCameraDistance] = useState(30);

  const planets = solarSystemBodies.filter(body => 
    body.type === 'planet' && body.parent === 'sun'
  );
  
  const moons = solarSystemBodies.filter(body => 
    body.type === 'moon'
  );

  // Surveiller la distance de la caméra pour ajuster l'affichage
  useEffect(() => {
    if (controlsRef.current) {
      const controls = controlsRef.current;
      const updateCameraDistance = () => {
        const distance = controls.object.position.distanceTo(controls.target);
        const position = controls.object.position;
        const target = controls.target;
        
        setCameraDistance(distance);
        onCameraDistanceChange?.(
          distance,
          [position.x, position.y, position.z],
          [target.x, target.y, target.z]
        );
      };
      
      controls.addEventListener('change', updateCameraDistance);
      return () => controls.removeEventListener('change', updateCameraDistance);
    }
  }, [onCameraDistanceChange]);

  useImperativeHandle(ref, () => ({
    focusOnSun: () => {
      if (controlsRef.current) {
        controlsRef.current.target.set(0, 0, 0);
        controlsRef.current.object.position.set(5, 5, 5);
        controlsRef.current.update();
      }
    },
    focusOnEarth: () => {
      if (controlsRef.current) {
        const earthBody = solarSystemBodies.find(b => b.id === 'earth');
        if (earthBody) {
          const earthPos = calculatePlanetPosition(earthBody, currentDate);
          controlsRef.current.target.set(...earthPos);
          controlsRef.current.object.position.set(
            earthPos[0] + 3,
            earthPos[1] + 2,
            earthPos[2] + 3
          );
          controlsRef.current.update();
        }
      }
    },
    focusOnAsteroid: () => {
      if (controlsRef.current && selectedAsteroid) {
        const asteroidPos = calculateAsteroidPosition(selectedAsteroid, currentDate);
        controlsRef.current.target.set(...asteroidPos);
        controlsRef.current.object.position.set(
          asteroidPos[0] + 2,
          asteroidPos[1] + 1,
          asteroidPos[2] + 2
        );
        controlsRef.current.update();
      }
    },
    focusOnStar: (starId: string) => {
      if (controlsRef.current) {
        const star = nearbyStarsData.find(s => s.id === starId);
        const system = nearbyPlanetarySystems.find(s => s.starId === starId);
        
        if (star || system) {
          const targetPos = star ? star.position : system!.position;
          
          // Animation fluide améliorée avec zoom adaptatif
          const startPos = controlsRef.current.object.position.clone();
          const startTarget = controlsRef.current.target.clone();
          
          // Distance finale optimisée selon le système
          const systemDistance = star ? star.distance : system!.distance;
          const finalDistance = Math.max(300000, systemDistance * 50000); // Distance adaptative
          
          const direction = [
            targetPos[0] - startTarget.x,
            targetPos[1] - startTarget.y, 
            targetPos[2] - startTarget.z
          ];
          const dirLength = Math.sqrt(direction[0]**2 + direction[1]**2 + direction[2]**2);
          const normalizedDir = [
            direction[0] / dirLength,
            direction[1] / dirLength,
            direction[2] / dirLength
          ];
          
          const finalCameraPos = [
            targetPos[0] + normalizedDir[0] * finalDistance,
            targetPos[1] + normalizedDir[1] * finalDistance * 0.3, // Vue plus cinématique
            targetPos[2] + normalizedDir[2] * finalDistance
          ];
          
          // Animation améliorée avec vitesse adaptative
          let step = 0;
          const distance = Math.sqrt(
            (finalCameraPos[0] - startPos.x) ** 2 + 
            (finalCameraPos[1] - startPos.y) ** 2 + 
            (finalCameraPos[2] - startPos.z) ** 2
          );
          const totalSteps = Math.max(60, Math.min(180, distance / 100000)); // Durée adaptative
          
          const animate = () => {
            if (step < totalSteps && controlsRef.current) {
              const progress = step / totalSteps;
              
              // Courbe d'animation sophistiquée
              const easedProgress = 0.5 * (1 + Math.sin(Math.PI * progress - Math.PI / 2));
              
              // Interpolation avec léger overshoot pour plus de dynamisme
              const overshoot = Math.sin(progress * Math.PI) * 0.1;
              const adjustedProgress = easedProgress + overshoot;
              
              const currentCameraPos = [
                startPos.x + (finalCameraPos[0] - startPos.x) * adjustedProgress,
                startPos.y + (finalCameraPos[1] - startPos.y) * adjustedProgress,
                startPos.z + (finalCameraPos[2] - startPos.z) * adjustedProgress
              ];
              
              const currentTarget = [
                startTarget.x + (targetPos[0] - startTarget.x) * easedProgress,
                startTarget.y + (targetPos[1] - startTarget.y) * easedProgress,
                startTarget.z + (targetPos[2] - startTarget.z) * easedProgress
              ];
              
              controlsRef.current.object.position.set(...currentCameraPos);
              controlsRef.current.target.set(...currentTarget);
              controlsRef.current.update();
              
              step++;
              requestAnimationFrame(animate);
            }
          };
          
          animate();
        }
      }
    },
    resetCamera: () => {
      if (controlsRef.current) {
        controlsRef.current.target.set(0, 0, 0);
        controlsRef.current.object.position.set(0, 20, 30);
        controlsRef.current.update();
      }
    },
    controlsRef // Exposer la référence aux contrôles
  }));

  // Loading fallback component
  const LoadingFallback = () => (
    <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="text-center space-y-4">
        <LoadingSpinner size="lg" />
        <p className="text-sm text-muted-foreground">
          Initialisation du système solaire...
        </p>
      </div>
    </div>
  );

  return (
    <div className="w-full h-screen relative">
      <Canvas
        camera={{ position: [0, 20, 30], fov: 60, far: 20000000 }} // Augmentation du far clipping plane
        gl={{ 
          antialias: true, 
          logarithmicDepthBuffer: true,
          powerPreference: "high-performance"
        }}
        shadows // Enable shadows with default PCF
        className="bg-gradient-to-b from-cosmic-black to-background"
      >
        <Suspense fallback={null}>
          {/* Enhanced lighting setup with sun intensity adaptation */}
          <ambientLight intensity={Math.max(0.005, sunIntensity * 0.01)} color="#1a1a2e" />
          
          {/* Background stars with multiple layers for depth - ajustées pour distances réalistes */}
          <Stars 
            radius={cameraDistance > 1000000 ? 50000000 : 50000} 
            depth={cameraDistance > 1000000 ? 10000000 : 30000} 
            count={cameraDistance > 1000000 ? 50000 : 1500} 
            factor={cameraDistance > 1000000 ? 20 : 3} 
            saturation={0.6} 
            fade
          />
          
          {/* Distant star field for very far zoom */}
          {cameraDistance > 500000 && (
            <Stars 
              radius={100000000} 
              depth={50000000} 
              count={20000} 
              factor={50} 
              saturation={0.3} 
              fade
            />
          )}
          
          <group ref={groupRef}>
            {/* Sun - main light source */}
            <Sun 
              intensity={sunIntensity} 
              showLabel={showPlanetNames && cameraDistance < 800}
              cameraDistance={cameraDistance}
            />
            
            {/* Planets with enhanced materials and shadows - masqués à très grande distance */}
            {cameraDistance < 10000 && planets.map((planet) => {
              return (
                <group key={planet.id}>
                  <Planet
                    body={planet}
                    currentDate={currentDate}
                    timeScale={timeScale}
                    showOrbit={showOrbits && cameraDistance < 5000}
                    showLabel={showPlanetNames && cameraDistance < 1000}
                    cameraDistance={cameraDistance}
                  />
                </group>
              );
            })}
            
            {/* Moons with realistic materials - masquées à grande distance */}
            {cameraDistance < 5000 && moons.map((moon) => {
              const parentPlanet = solarSystemBodies.find(p => p.id === moon.parent);
              const isVisible = showMoons[moon.parent || ''];
              
              if (!parentPlanet || !isVisible) return null;
              
              return (
                <group key={moon.id}>
                  <Moon
                    body={moon}
                    parentBody={parentPlanet}
                    currentDate={currentDate}
                    timeScale={timeScale}
                    showOrbit={showOrbits && cameraDistance < 1000}
                    showLabel={showPlanetNames && cameraDistance < 800}
                    cameraDistance={cameraDistance}
                  />
                </group>
              );
            })}
            
            {/* Selected Asteroid with enhanced materials */}
            {selectedAsteroid && showAsteroidPath && (
              <AsteroidVisualizer
                asteroid={selectedAsteroid}
                currentDate={currentDate}
                timeScale={timeScale}
              />
            )}
            
            {/* Ceinture d'astéroïdes - entre Mars et Jupiter */}
            {showAsteroidBelt && (
              <AsteroidBelt
                currentDate={currentDate}
                timeScale={timeScale}
                showMajorObjects={cameraDistance < 2000}
                showBeltDensity={showBeltDensity}
                cameraDistance={cameraDistance}
              />
            )}
            
            {/* Ceinture de Kuiper - au-delà de Neptune */}
            {showKuiperBelt && (
              <KuiperBelt
                currentDate={currentDate}
                timeScale={timeScale}
                showMajorObjects={cameraDistance < 5000}
                showBeltDensity={showBeltDensity}
                showLabels={showPlanetNames}
                cameraDistance={cameraDistance}
              />
            )}
            
            {/* Étoiles proches - Proxima Centauri et autres */}
            <NearbyStars 
              cameraDistance={cameraDistance} 
              currentDate={currentDate}
              timeScale={timeScale}
            />
            
            {/* Voie Lactée et Andromède - échelle galactique */}
            {showGalaxies && (
              <>
                <MilkyWayGalaxy cameraDistance={cameraDistance} />
                <AndromedaGalaxy cameraDistance={cameraDistance} visible={showGalaxies} />
              </>
            )}
            
            {/* Météorites */}
            {showMeteorites && meteorites.map((meteorite) => (
              <Meteorite
                key={meteorite.id}
                meteorite={meteorite}
                currentDate={currentDate}
                timeScale={timeScale}
                showTrail={showMeteoriteTrails}
              />
            ))}
            
            {/* Catalogue Meteorite Trajectories */}
            {catalogTrajectories.map((meteoriteId) => {
              const meteorite = famousMeteorites.find(m => m.id === meteoriteId);
              if (!meteorite) return null;
              
              return (
                <Meteorite
                  key={`catalog-${meteorite.id}`}
                  meteorite={meteorite}
                  currentDate={currentDate}
                  timeScale={timeScale}
                  showTrail={true}
                />
              );
            })}
          </group>
          
          {/* Camera Controls - Zoom étendu pour l'échelle interstellaire */}
          <OrbitControls
            ref={controlsRef}
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={0.01} // Zoom ultra-proche pour les détails planétaires
            maxDistance={630000000} // 630 millions d'unités pour voir la Voie Lactée (~100 000 AL)
            target={[0, 0, 0]}
            dampingFactor={0.03} // Plus réactif
            enableDamping={true}
            autoRotate={false}
            autoRotateSpeed={0.5}
            zoomSpeed={8.0} // Zoom très rapide pour navigation fluide entre les échelles
            panSpeed={5.0} // Panoramique plus rapide
            rotateSpeed={1.5} // Rotation plus fluide
          />
        </Suspense>
      </Canvas>
      
      {/* Loading overlay */}
      <Suspense fallback={<LoadingFallback />}>
        <div />
      </Suspense>
    </div>
  );
});