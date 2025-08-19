import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, Mesh, Vector3 } from 'three';
import { Html } from '@react-three/drei';
import { getCurrentScale, getStarBrightness, getStarSize } from '@/utils/starSystemUtils';

interface Star {
  id: string;
  name: string;
  distance: number;
  position: [number, number, number];
  color: string;
  luminosity: number;
  temperature: number;
}

interface Planet {
  id: string;
  name: string;
  radius: number;
  orbitalRadius: number;
  orbitalPeriod: number;
  color: string;
  type: string;
  inHabitableZone: boolean;
}

interface StarSystemProps {
  star: Star;
  planets: Planet[];
  currentDate: Date;
  timeScale: number;
  cameraDistance: number;
}

export const StarSystem: React.FC<StarSystemProps> = ({
  star,
  planets,
  currentDate,
  timeScale,
  cameraDistance
}) => {
  const starRef = useRef<Mesh>(null);
  const systemRef = useRef<Group>(null);
  
  const currentScale = getCurrentScale(cameraDistance);
  const starSize = getStarSize(star.luminosity, star.distance, cameraDistance);
  const starBrightness = getStarBrightness(star.luminosity, star.distance, cameraDistance);
  
  // Calculer les positions des planètes
  const planetPositions = useMemo(() => {
    return planets.map(planet => {
      const timeInDays = (currentDate.getTime() - new Date(2000, 0, 1).getTime()) / (1000 * 60 * 60 * 24);
      const scaledTime = timeInDays * timeScale;
      const angle = (scaledTime / planet.orbitalPeriod) * 2 * Math.PI;
      const scaledRadius = planet.orbitalRadius * 1000;
      
      return {
        planet,
        position: [
          Math.cos(angle) * scaledRadius,
          (Math.random() - 0.5) * 50, // Légère inclinaison
          Math.sin(angle) * scaledRadius
        ] as [number, number, number]
      };
    });
  }, [planets, currentDate, timeScale]);
  
  // Animation de scintillement des étoiles
  useFrame((state, delta) => {
    if (starRef.current) {
      const scintillation = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      starRef.current.scale.setScalar(scintillation);
    }
    
    if (systemRef.current) {
      // Rotation très subtile du système
      systemRef.current.rotation.y += delta * 0.00001;
    }
  });
  
  // Visibilité basée sur l'échelle
  const showStar = cameraDistance > 10000;
  const showPlanets = cameraDistance > 10000 && cameraDistance < 20000000;
  const showOrbits = cameraDistance > 50000 && cameraDistance < 5000000;
  const showLabels = cameraDistance > 20000 && cameraDistance < 8000000;
  
  if (!showStar) return null;
  
  return (
    <group ref={systemRef} position={star.position}>
      {/* Étoile principale avec effets */}
      <group>
        <mesh ref={starRef}>
          <sphereGeometry args={[starSize, 32, 32]} />
          <meshBasicMaterial
            color={star.color}
            transparent
            opacity={starBrightness}
            toneMapped={false}
          />
        </mesh>
        
        {/* Halo stellaire */}
        {star.luminosity > 0.1 && (
          <mesh>
            <sphereGeometry args={[starSize * 2, 16, 16]} />
            <meshBasicMaterial
              color={star.color}
              transparent
              opacity={Math.min(0.3, starBrightness * 0.5)}
              toneMapped={false}
            />
          </mesh>
        )}
        
        {/* Couronne pour les étoiles très lumineuses */}
        {star.luminosity > 5 && cameraDistance > 100000 && (
          <mesh>
            <sphereGeometry args={[starSize * 3, 12, 12]} />
            <meshBasicMaterial
              color={star.color}
              transparent
              opacity={0.1}
              toneMapped={false}
            />
          </mesh>
        )}
      </group>
      
      {/* Système planétaire */}
      {showPlanets && planetPositions.map(({ planet, position }) => {
        const planetSize = Math.max(planet.radius * 150, 30);
        
        return (
          <group key={planet.id}>
            {/* Orbite */}
            {showOrbits && (
              <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry 
                  args={[
                    planet.orbitalRadius * 1000 - 5, 
                    planet.orbitalRadius * 1000 + 5, 
                    64
                  ]} 
                />
                <meshBasicMaterial
                  color={planet.inHabitableZone ? '#00FF00' : '#666666'}
                  transparent
                  opacity={planet.inHabitableZone ? 0.3 : 0.1}
                />
              </mesh>
            )}
            
            {/* Planète */}
            <mesh position={position}>
              <sphereGeometry args={[planetSize, 16, 16]} />
              <meshBasicMaterial
                color={planet.color}
                transparent
                opacity={0.9}
              />
              
              {/* Atmosphère pour les planètes habitables */}
              {planet.inHabitableZone && (
                <mesh>
                  <sphereGeometry args={[planetSize * 1.2, 12, 12]} />
                  <meshBasicMaterial
                    color="#87CEEB"
                    transparent
                    opacity={0.2}
                  />
                </mesh>
              )}
            </mesh>
            
            {/* Label de la planète */}
            {showLabels && (
              <Html
                position={[position[0], position[1] + planetSize * 2, position[2]]}
                center
                distanceFactor={Math.min(cameraDistance / 2000, 500)}
                style={{ pointerEvents: 'none' }}
              >
                <div className={`text-xs px-2 py-1 rounded-lg backdrop-blur-sm border ${
                  planet.inHabitableZone 
                    ? 'text-green-200 bg-green-900/80 border-green-400/60' 
                    : 'text-white bg-black/80 border-white/40'
                }`}>
                  <div className="font-bold">{planet.name}</div>
                  <div className="text-xs opacity-80">{planet.type}</div>
                  {planet.inHabitableZone && (
                    <div className="text-xs text-green-300">🌍 Zone habitable</div>
                  )}
                </div>
              </Html>
            )}
          </group>
        );
      })}
      
      {/* Label de l'étoile */}
      {showLabels && cameraDistance > 200000 && (
        <Html
          position={[0, starSize * 2, 0]}
          center
          distanceFactor={Math.max(cameraDistance / 5000, 100)}
          style={{ pointerEvents: 'none' }}
        >
          <div className="text-white text-sm bg-black/90 px-3 py-2 rounded-lg backdrop-blur-sm border border-white/50">
            <div className="font-bold text-yellow-300">⭐ {star.name}</div>
            <div className="text-xs space-y-1 mt-1">
              <div>Distance: {star.distance.toFixed(2)} AL</div>
              <div>Température: {star.temperature.toLocaleString()} K</div>
              <div>Luminosité: {star.luminosity.toFixed(3)} ☉</div>
              {planets.length > 0 && (
                <div>Planètes: {planets.length}</div>
              )}
            </div>
          </div>
        </Html>
      )}
      
      {/* Indicateur d'échelle */}
      {cameraDistance > 1000000 && (
        <Html
          position={[starSize * 3, starSize * 3, 0]}
          center
          style={{ pointerEvents: 'none' }}
        >
          <div className="text-xs text-blue-300 bg-black/60 px-2 py-1 rounded border border-blue-400/30">
            Échelle: {currentScale.name}
          </div>
        </Html>
      )}
    </group>
  );
};