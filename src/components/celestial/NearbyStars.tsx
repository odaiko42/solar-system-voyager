import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';
import { Html } from '@react-three/drei';
import { StarSystem } from './StarSystem';
import { ExoplanetSystem, nearbyPlanetarySystems } from './ExoplanetSystem';
import { getCurrentScale } from '@/utils/starSystemUtils';

interface NearbyStarsProps {
  cameraDistance: number;
  currentDate: Date;
  timeScale: number;
}

// Étoiles proches dans un rayon de 20 années-lumière avec données complètes
const nearbyStarsData = [
  {
    id: 'proxima-centauri',
    name: 'Proxima Centauri',
    distance: 4.24,
    position: [2681000, 150000, -500000] as [number, number, number],
    color: '#FF6B6B',
    luminosity: 0.0017,
    temperature: 3042
  },
  {
    id: 'alpha-centauri-a',
    name: 'Alpha Centauri A',
    distance: 4.37,
    position: [2700000, 200000, -480000] as [number, number, number],
    color: '#FFF8DC',
    luminosity: 1.519,
    temperature: 5790
  },
  {
    id: 'alpha-centauri-b',
    name: 'Alpha Centauri B',
    distance: 4.37,
    position: [2702000, 180000, -485000] as [number, number, number],
    color: '#FFE4B5',
    luminosity: 0.5,
    temperature: 5260
  },
  {
    id: 'barnards-star',
    name: 'Étoile de Barnard',
    distance: 5.96,
    position: [1800000, -2500000, 2200000] as [number, number, number],
    color: '#FF4500',
    luminosity: 0.0004,
    temperature: 3134
  },
  {
    id: 'wolf-359',
    name: 'Wolf 359',
    distance: 7.86,
    position: [-3200000, 1800000, 3500000] as [number, number, number],
    color: '#FF0000',
    luminosity: 0.00001,
    temperature: 2800
  },
  {
    id: 'lalande-21185',
    name: 'Lalande 21185',
    distance: 8.31,
    position: [2800000, -3500000, 4200000] as [number, number, number],
    color: '#FF4500',
    luminosity: 0.021,
    temperature: 3560
  },
  {
    id: 'sirius-a',
    name: 'Sirius A',
    distance: 8.60,
    position: [4200000, -4800000, 1600000] as [number, number, number],
    color: '#B4D4FF',
    luminosity: 25.4,
    temperature: 9940
  },
  {
    id: 'sirius-b',
    name: 'Sirius B',
    distance: 8.60,
    position: [4205000, -4795000, 1605000] as [number, number, number],
    color: '#FFFFFF',
    luminosity: 0.026,
    temperature: 25200
  },
  {
    id: 'epsilon-eridani',
    name: 'Epsilon Eridani',
    distance: 10.5,
    position: [3200000, -4500000, -6800000] as [number, number, number],
    color: '#FFF8DC',
    luminosity: 0.34,
    temperature: 5084
  },
  {
    id: 'ross-128',
    name: 'Ross 128',
    distance: 11.0,
    position: [-4200000, 2800000, -7300000] as [number, number, number],
    color: '#FF6B6B',
    luminosity: 0.0036,
    temperature: 3192
  },
  {
    id: '61-cygni-a',
    name: '61 Cygni A',
    distance: 11.4,
    position: [5100000, 6200000, -4800000] as [number, number, number],
    color: '#FFCC99',
    luminosity: 0.153,
    temperature: 4374
  },
  {
    id: '61-cygni-b',
    name: '61 Cygni B',
    distance: 11.4,
    position: [5105000, 6205000, -4795000] as [number, number, number],
    color: '#FFAA66',
    luminosity: 0.085,
    temperature: 4077
  },
  {
    id: 'tau-ceti',
    name: 'Tau Ceti',
    distance: 11.9,
    position: [5800000, -3200000, -8100000] as [number, number, number],
    color: '#FFF8DC',
    luminosity: 0.52,
    temperature: 5344
  }
];

export const NearbyStars: React.FC<NearbyStarsProps> = ({ 
  cameraDistance, 
  currentDate, 
  timeScale 
}) => {
  const groupRef = useRef<Group>(null);
  
  // Ne montrer les étoiles que dans la bonne plage de distance
  const shouldShowStars = cameraDistance > 50000;
  const currentScale = getCurrentScale(cameraDistance);

  // Animation subtile du groupe entier
  useFrame((state, delta) => {
    if (groupRef.current && shouldShowStars) {
      groupRef.current.rotation.y += delta * 0.00001;
    }
  });

  if (!shouldShowStars) return null;

  return (
    <group ref={groupRef}>
      {/* Rendu des systèmes stellaires avec le nouveau composant */}
      {nearbyStarsData.map((star) => {
        // Trouver le système planétaire correspondant
        const planetarySystem = nearbyPlanetarySystems.find(sys => sys.starId === star.id);
        const planets = planetarySystem ? planetarySystem.planets : [];
        
        return (
          <StarSystem
            key={star.id}
            star={star}
            planets={planets}
            currentDate={currentDate}
            timeScale={timeScale}
            cameraDistance={cameraDistance}
          />
        );
      })}
      
      {/* Systèmes planétaires sans étoile référencée (cas particuliers) */}
      {nearbyPlanetarySystems
        .filter(system => !nearbyStarsData.find(star => star.id === system.starId))
        .map((system) => (
          <ExoplanetSystem
            key={system.starId}
            system={system}
            currentDate={currentDate}
            timeScale={timeScale}
            cameraDistance={cameraDistance}
          />
        ))}
      
      {/* Indicateur d'échelle global */}
      {cameraDistance > 500000 && (
        <Html
          position={[0, cameraDistance * 0.15, 0]}
          center
          style={{ pointerEvents: 'none' }}
        >
          <div className="text-white text-sm bg-black/90 px-4 py-3 rounded-xl backdrop-blur-sm border border-white/50 shadow-2xl">
            <div className="font-bold text-yellow-300 mb-2 flex items-center gap-2">
              📡 {currentScale.name}
              <span className="text-xs text-blue-300">({nearbyStarsData.length} étoiles)</span>
            </div>
            <div className="text-xs space-y-1">
              <div className="text-white/90">{currentScale.description}</div>
              <div className="text-blue-300 flex items-center gap-1">
                <span>📏 Échelle:</span> 1 unité ≈ {Math.round(cameraDistance / 100000)} milliers de km
              </div>
              <div className="text-green-300 flex items-center gap-1">
                <span>🚀 Distance:</span> {(cameraDistance / 149597870.7).toFixed(2)} UA
              </div>
              {cameraDistance > 10000000 && (
                <div className="text-purple-300 text-xs mt-1 pt-1 border-t border-white/20">
                  Zoom avant pour explorer les systèmes planétaires
                </div>
              )}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
};