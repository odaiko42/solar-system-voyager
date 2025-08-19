import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, Mesh } from 'three';
import { Html } from '@react-three/drei';

interface Exoplanet {
  id: string;
  name: string;
  radius: number; // En rayons terrestres
  orbitalRadius: number; // En UA
  orbitalPeriod: number; // En jours terrestres
  color: string;
  type: string;
  inHabitableZone: boolean;
}

interface ExoplanetSystemData {
  starId: string;
  starName: string;
  distance: number; // En années-lumière
  position: [number, number, number];
  planets: Exoplanet[];
}

interface ExoplanetSystemProps {
  system: ExoplanetSystemData;
  currentDate: Date;
  timeScale: number;
  cameraDistance: number;
}

// Données des systèmes planétaires proches
export const nearbyPlanetarySystems: ExoplanetSystemData[] = [
  {
    starId: 'proxima-centauri',
    starName: 'Proxima Centauri',
    distance: 4.24,
    position: [2681000, 150000, -500000],
    planets: [
      {
        id: 'proxima-b',
        name: 'Proxima Centauri b',
        radius: 1.17, // 1.17 rayons terrestres
        orbitalRadius: 0.0485, // 0.0485 UA
        orbitalPeriod: 11.186, // 11.186 jours
        color: '#D2691E',
        type: 'Planète rocheuse tempérée',
        inHabitableZone: true
      },
      {
        id: 'proxima-c',
        name: 'Proxima Centauri c',
        radius: 1.5, // ~1.5 rayons terrestres (estimation)
        orbitalRadius: 1.489, // 1.489 UA
        orbitalPeriod: 1928, // 5.28 années terrestres
        color: '#4682B4',
        type: 'Super-Terre froide',
        inHabitableZone: false
      },
      {
        id: 'proxima-d',
        name: 'Proxima Centauri d',
        radius: 0.29, // 0.29 rayons terrestres
        orbitalRadius: 0.029, // 0.029 UA (très proche)
        orbitalPeriod: 5.122, // 5.122 jours
        color: '#FF6347',
        type: 'Sous-Neptune chaude',
        inHabitableZone: false
      }
    ]
  },
  {
    starId: 'barnards-star',
    starName: 'Étoile de Barnard',
    distance: 5.96,
    position: [1800000, -2500000, 2200000],
    planets: [
      {
        id: 'barnard-b',
        name: 'Barnard b',
        radius: 0.37,
        orbitalRadius: 0.404,
        orbitalPeriod: 233,
        color: '#CD853F',
        type: 'Super-Terre (candidate)',
        inHabitableZone: false
      }
    ]
  },
  {
    starId: 'epsilon-eridani',
    starName: 'Epsilon Eridani',
    distance: 10.5,
    position: [3200000, -4500000, -6800000],
    planets: [
      {
        id: 'epsilon-eri-b',
        name: 'Epsilon Eridani b',
        radius: 11.2, // Rayons terrestres (géante gazeuse)
        orbitalRadius: 3.39,
        orbitalPeriod: 2502, // ~6.85 ans
        color: '#FF6347',
        type: 'Géante gazeuse',
        inHabitableZone: false
      }
    ]
  },
  {
    starId: 'ross-128',
    starName: 'Ross 128',
    distance: 11.0,
    position: [-4200000, 2800000, -7300000],
    planets: [
      {
        id: 'ross-128-b',
        name: 'Ross 128 b',
        radius: 1.35,
        orbitalRadius: 0.0496,
        orbitalPeriod: 9.9,
        color: '#228B22',
        type: 'Planète rocheuse',
        inHabitableZone: true
      }
    ]
  },
  {
    starId: 'tau-ceti',
    starName: 'Tau Ceti',
    distance: 11.9,
    position: [5800000, -3200000, -8100000],
    planets: [
      {
        id: 'tau-ceti-g',
        name: 'Tau Ceti g',
        radius: 1.75, // 1.75 rayons terrestres
        orbitalRadius: 0.133, // 0.133 UA (très proche)
        orbitalPeriod: 20.0, // 20 jours
        color: '#FF6347',
        type: 'Super-Terre chaude',
        inHabitableZone: false
      },
      {
        id: 'tau-ceti-h',
        name: 'Tau Ceti h',
        radius: 1.83, // 1.83 rayons terrestres
        orbitalRadius: 0.243, // 0.243 UA
        orbitalPeriod: 49.4, // 49.4 jours
        color: '#FFA500',
        type: 'Super-Terre tempérée',
        inHabitableZone: false
      },
      {
        id: 'tau-ceti-e',
        name: 'Tau Ceti e',
        radius: 1.83, // 1.83 rayons terrestres
        orbitalRadius: 0.552, // Zone habitable interne
        orbitalPeriod: 168.12, // 168 jours
        color: '#90EE90',
        type: 'Super-Terre habitable',
        inHabitableZone: true
      },
      {
        id: 'tau-ceti-f',
        name: 'Tau Ceti f',
        radius: 1.83, // 1.83 rayons terrestres
        orbitalRadius: 1.35, // Zone habitable externe
        orbitalPeriod: 642.46, // 1.76 années
        color: '#98FB98',
        type: 'Super-Terre habitable',
        inHabitableZone: true
      }
    ]
  },
  {
    starId: 'wolf-359',
    starName: 'Wolf 359',
    distance: 7.86,
    position: [-3200000, 1800000, 3500000],
    planets: [
      {
        id: 'wolf-359-b',
        name: 'Wolf 359 b',
        radius: 1.43,
        orbitalRadius: 0.018,
        orbitalPeriod: 2.7,
        color: '#FF4500',
        type: 'Super-Terre chaude',
        inHabitableZone: false
      }
    ]
  },
  {
    starId: 'lalande-21185',
    starName: 'Lalande 21185',
    distance: 8.31,
    position: [2800000, -3500000, 4200000],
    planets: [
      {
        id: 'lalande-b',
        name: 'Lalande 21185 b',
        radius: 2.03,
        orbitalRadius: 2.8,
        orbitalPeriod: 2507,
        color: '#CD853F',
        type: 'Super-Terre (candidate)',
        inHabitableZone: false
      }
    ]
  },
  {
    starId: '61-cygni-a',
    starName: '61 Cygni A',
    distance: 11.4,
    position: [5100000, 6200000, -4800000],
    planets: [
      {
        id: '61-cyg-a-b',
        name: '61 Cygni A b',
        radius: 1.7,
        orbitalRadius: 2.5,
        orbitalPeriod: 2190,
        color: '#DAA520',
        type: 'Super-Terre (candidate)',
        inHabitableZone: false
      }
    ]
  }
];

export const ExoplanetSystem: React.FC<ExoplanetSystemProps> = ({
  system,
  currentDate,
  timeScale,
  cameraDistance
}) => {
  const groupRef = useRef<Group>(null);
  
  // Ne montrer les exoplanètes que si on est dans la bonne plage de distance (zoom étendu)
  const shouldShowPlanets = cameraDistance > 10000 && cameraDistance < 50000000;
  
  // Calculer les positions orbitales des planètes
  const calculatePlanetPosition = (planet: Exoplanet): [number, number, number] => {
    const timeInDays = (currentDate.getTime() - new Date(2000, 0, 1).getTime()) / (1000 * 60 * 60 * 24);
    const scaledTime = timeInDays * timeScale;
    const angle = (scaledTime / planet.orbitalPeriod) * 2 * Math.PI;
    
    // Échelle : 1 UA = 1000 unités dans notre système
    const scaledRadius = planet.orbitalRadius * 1000;
    
    return [
      Math.cos(angle) * scaledRadius,
      (Math.random() - 0.5) * 100, // Légère inclinaison
      Math.sin(angle) * scaledRadius
    ];
  };
  
  // Animation des planètes
  useFrame((state, delta) => {
    if (groupRef.current && shouldShowPlanets) {
      // Rotation très subtile du système
      groupRef.current.rotation.y += delta * 0.00001;
    }
  });

  if (!shouldShowPlanets) return null;

  return (
    <group ref={groupRef} position={system.position as [number, number, number]}>
      {system.planets.map((planet) => {
        const planetPos = calculatePlanetPosition(planet);
        const planetSize = Math.max(planet.radius * 200, 50); // Taille augmentée pour meilleure visibilité
        
        return (
          <group key={planet.id}>
            {/* Orbite de la planète */}
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[planet.orbitalRadius * 1000 - 10, planet.orbitalRadius * 1000 + 10, 64]} />
              <meshBasicMaterial
                color={planet.inHabitableZone ? '#00FF00' : '#666666'}
                transparent
                opacity={0.1}
              />
            </mesh>
            
            {/* Corps de la planète */}
            <mesh position={planetPos}>
              <sphereGeometry args={[planetSize, 16, 16]} />
              <meshBasicMaterial
                color={planet.color}
                transparent
                opacity={0.8}
              />
              
              {/* Halo pour les planètes en zone habitable */}
              {planet.inHabitableZone && (
                <mesh>
                  <sphereGeometry args={[planetSize * 1.5, 12, 12]} />
                  <meshBasicMaterial
                    color="#00FF00"
                    transparent
                    opacity={0.2}
                  />
                </mesh>
              )}
            </mesh>
            
            {/* Label de la planète - visible dans une plage de zoom très étendue */}
            {cameraDistance > 10000 && cameraDistance < 10000000 && (
              <Html
                position={[planetPos[0], planetPos[1] + planetSize * 1.5, planetPos[2]]}
                center
                distanceFactor={Math.min(cameraDistance / 1000, 200)}
                style={{ pointerEvents: 'none' }}
              >
                <div className={`text-xs px-3 py-2 rounded-lg backdrop-blur-sm border-2 ${
                  planet.inHabitableZone 
                    ? 'text-green-200 bg-green-900/80 border-green-400/70 shadow-lg shadow-green-400/20' 
                    : 'text-white bg-black/80 border-white/40 shadow-lg'
                }`}>
                  <div className="font-bold text-sm mb-1">{planet.name}</div>
                  <div className="text-xs opacity-90 mb-1">{planet.type}</div>
                  <div className="text-xs space-y-0.5 border-t border-current/20 pt-1">
                    <div><span className="text-blue-300">Rayon:</span> {planet.radius.toFixed(2)} R⊕</div>
                    <div><span className="text-blue-300">Orbite:</span> {planet.orbitalRadius.toFixed(3)} UA</div>
                    <div><span className="text-blue-300">Période:</span> {planet.orbitalPeriod < 365 ? `${planet.orbitalPeriod.toFixed(1)} j` : `${(planet.orbitalPeriod/365).toFixed(1)} ans`}</div>
                    {planet.inHabitableZone && (
                      <div className="text-xs text-green-300 mt-1.5 font-bold flex items-center gap-1">
                        🌍 <span>Zone habitable - Eau liquide possible!</span>
                      </div>
                    )}
                  </div>
                </div>
              </Html>
            )}
          </group>
        );
      })}
      
      {/* Informations du système - visibles dans une plage très étendue */}
      {cameraDistance > 50000 && cameraDistance < 15000000 && (
        <Html
          position={[0, 10000, 0]}
          center
          distanceFactor={Math.max(cameraDistance / 10000, 50)}
          style={{ pointerEvents: 'none' }}
        >
          <div className="text-white text-sm bg-black/90 px-4 py-3 rounded-xl backdrop-blur-sm border border-white/50 max-w-lg shadow-2xl">
            <div className="font-bold text-yellow-300 mb-2 text-base flex items-center gap-2">
              ⭐ Système {system.starName}
              {system.starId === 'tau-ceti' && <span className="text-green-400">🎯</span>}
            </div>
            <div className="text-xs space-y-1.5">
              <div><span className="text-blue-300">Distance:</span> {system.distance} années-lumière</div>
              <div><span className="text-blue-300">Type d'étoile:</span> {
                system.starId === 'tau-ceti' ? 'G8V (similaire au Soleil)' : 
                system.starId === 'proxima-centauri' ? 'Naine rouge (M5.5Ve)' :
                'Étoile'
              }</div>
              <div><span className="text-blue-300">Planètes confirmées:</span> {system.planets.length}</div>
              <div>
                <span className="text-blue-300">Zone habitable:</span> {
                  system.planets.filter(p => p.inHabitableZone).length > 0 ? 
                  `✅ ${system.planets.filter(p => p.inHabitableZone).length} planète(s)` : 
                  '❌ Aucune'
                }
              </div>
              {system.starId === 'tau-ceti' && (
                <div className="mt-2 pt-2 border-t border-white/20">
                  <div className="text-green-300 font-medium">🎯 Système planétaire complexe</div>
                  <div className="text-xs opacity-85 mt-1">Deux Super-Terres en zone habitable</div>
                  <div className="text-xs text-yellow-300">Candidat prioritaire pour la vie extraterrestre</div>
                </div>
              )}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
};