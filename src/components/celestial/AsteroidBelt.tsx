import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Group, BufferGeometry, Float32BufferAttribute, Points, PointsMaterial } from 'three';
import { CelestialBody } from '@/types/astronomy';
import { calculatePlanetPosition, calculateDisplayRadius } from '@/utils/orbitalCalculations';
import { asteroidBelt } from '@/data/solarSystem';

interface AsteroidBeltProps {
  currentDate: Date;
  timeScale: number;
  showMajorObjects: boolean;
  showBeltDensity: boolean;
  cameraDistance: number;
}

export const AsteroidBelt: React.FC<AsteroidBeltProps> = ({
  currentDate,
  timeScale,
  showMajorObjects,
  showBeltDensity,
  cameraDistance
}) => {
  const groupRef = useRef<Group>(null);
  const beltPointsRef = useRef<Points>(null);

  // Génération de la ceinture d'astéroïdes avec densité réaliste
  const beltParticles = useMemo(() => {
    const particles = [];
    const count = Math.min(2000, Math.max(500, 3000 - cameraDistance * 2)); // Moins de particules si on est loin
    
    for (let i = 0; i < count; i++) {
      // Distribution réaliste entre 2.2 et 3.2 UA
      const distance = 2.2 + Math.random() * 1.0; // UA
      const angle = Math.random() * Math.PI * 2;
      const heightVariation = (Math.random() - 0.5) * 0.2; // Variation en hauteur
      
      // Conversion en coordonnées 3D (échelle système)
      const scaledDistance = distance * 149.6; // Conversion UA vers millions de km
      const x = Math.cos(angle) * scaledDistance;
      const z = Math.sin(angle) * scaledDistance;
      const y = heightVariation * scaledDistance * 0.1; // Hauteur relative
      
      particles.push(x, y, z);
    }
    
    return new Float32Array(particles);
  }, [cameraDistance]);

  // Animation des objets majeurs
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Animation subtile de la ceinture de particules
    if (beltPointsRef.current && showBeltDensity) {
      beltPointsRef.current.rotation.y += delta * timeScale * 0.001; // Rotation très lente
    }
  });

  return (
    <group ref={groupRef}>
      {/* Ceinture de particules pour la densité visuelle */}
      {showBeltDensity && cameraDistance > 100 && (
        <points ref={beltPointsRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={beltParticles.length / 3}
              array={beltParticles}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            color="#D2B48C"
            size={Math.max(0.5, Math.min(2.0, cameraDistance / 200))}
            transparent
            opacity={0.6}
            sizeAttenuation={true}
          />
        </points>
      )}

      {/* Objets majeurs de la ceinture d'astéroïdes */}
      {showMajorObjects && cameraDistance < 2000 && asteroidBelt.map((asteroid) => {
        return <AsteroidObject 
          key={asteroid.id} 
          body={asteroid} 
          currentDate={currentDate}
          timeScale={timeScale}
          cameraDistance={cameraDistance}
        />;
      })}
    </group>
  );
};

// Composant pour un objet individuel de la ceinture
interface AsteroidObjectProps {
  body: CelestialBody;
  currentDate: Date;
  timeScale: number;
  cameraDistance: number;
}

const AsteroidObject: React.FC<AsteroidObjectProps> = ({ 
  body, 
  currentDate, 
  timeScale,
  cameraDistance 
}) => {
  const meshRef = useRef<Mesh>(null);
  const groupRef = useRef<Group>(null);

  const asteroidRadius = calculateDisplayRadius(body);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Calcul de la position orbitale
    const simulationTime = new Date(currentDate.getTime() + (state.clock.elapsedTime * timeScale * 24 * 60 * 60 * 1000));
    const position = calculatePlanetPosition(body, simulationTime);
    
    groupRef.current.position.set(position[0], position[1], position[2]);

    // Rotation de l'astéroïde
    if (meshRef.current) {
      const rotationSpeed = (delta * timeScale) / Math.abs(body.rotationPeriod);
      meshRef.current.rotation.y += rotationSpeed;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[asteroidRadius, 8, 8]} />
        <meshStandardMaterial
          color={body.color}
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>
    </group>
  );
};
