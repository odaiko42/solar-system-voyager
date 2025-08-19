import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Group, Points, PointsMaterial, Float32BufferAttribute } from 'three';
import { CelestialBody } from '@/types/astronomy';
import { calculatePlanetPosition, calculateDisplayRadius } from '@/utils/orbitalCalculations';
import { kuiperBelt } from '@/data/solarSystem';
import { PlanetLabel } from './PlanetLabel';

interface KuiperBeltProps {
  currentDate: Date;
  timeScale: number;
  showMajorObjects: boolean;
  showBeltDensity: boolean;
  showLabels: boolean;
  cameraDistance: number;
}

export const KuiperBelt: React.FC<KuiperBeltProps> = ({
  currentDate,
  timeScale,
  showMajorObjects,
  showBeltDensity,
  showLabels,
  cameraDistance
}) => {
  const groupRef = useRef<Group>(null);
  const beltPointsRef = useRef<Points>(null);

  // Génération de la ceinture de Kuiper avec densité réaliste
  const kuiperParticles = useMemo(() => {
    const particles = [];
    const count = Math.min(1500, Math.max(300, 2000 - cameraDistance)); // Moins dense que la ceinture d'astéroïdes
    
    for (let i = 0; i < count; i++) {
      // Distribution réaliste entre 30 et 55 UA
      const distance = 30 + Math.random() * 25; // UA
      const angle = Math.random() * Math.PI * 2;
      const heightVariation = (Math.random() - 0.5) * 0.3; // Variation en hauteur plus importante
      
      // Conversion en coordonnées 3D (échelle système)
      const scaledDistance = distance * 149.6; // Conversion UA vers millions de km
      const x = Math.cos(angle) * scaledDistance;
      const z = Math.sin(angle) * scaledDistance;
      const y = heightVariation * scaledDistance * 0.1; // Hauteur relative
      
      particles.push(x, y, z);
    }
    
    return new Float32Array(particles);
  }, [cameraDistance]);

  // Animation de la ceinture
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Animation subtile de la ceinture de particules
    if (beltPointsRef.current && showBeltDensity) {
      beltPointsRef.current.rotation.y += delta * timeScale * 0.0005; // Rotation très lente
    }
  });

  return (
    <group ref={groupRef}>
      {/* Ceinture de particules pour la densité visuelle */}
      {showBeltDensity && cameraDistance > 500 && (
        <points ref={beltPointsRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={kuiperParticles.length / 3}
              array={kuiperParticles}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            color="#E6E6FA"
            size={Math.max(1.0, Math.min(3.0, cameraDistance / 500))}
            transparent
            opacity={0.4}
            sizeAttenuation={true}
          />
        </points>
      )}

      {/* Objets majeurs de la ceinture de Kuiper */}
      {showMajorObjects && cameraDistance < 5000 && kuiperBelt
        .filter(obj => obj.type !== 'moon') // Traiter les lunes séparément
        .map((kuiperObject) => {
          return <KuiperObject 
            key={kuiperObject.id} 
            body={kuiperObject} 
            currentDate={currentDate}
            timeScale={timeScale}
            showLabel={showLabels}
            cameraDistance={cameraDistance}
          />;
        })}
      
      {/* Charon (lune de Pluton) */}
      {showMajorObjects && cameraDistance < 2000 && kuiperBelt
        .filter(obj => obj.type === 'moon' && obj.parent === 'pluto')
        .map((moon) => {
          const pluton = kuiperBelt.find(obj => obj.id === 'pluto');
          if (!pluton) return null;
          
          return <CharonMoon
            key={moon.id}
            moon={moon}
            pluton={pluton}
            currentDate={currentDate}
            timeScale={timeScale}
            showLabel={showLabels}
            cameraDistance={cameraDistance}
          />;
        })}
    </group>
  );
};

// Composant pour un objet individuel de la ceinture de Kuiper
interface KuiperObjectProps {
  body: CelestialBody;
  currentDate: Date;
  timeScale: number;
  showLabel: boolean;
  cameraDistance: number;
}

const KuiperObject: React.FC<KuiperObjectProps> = ({ 
  body, 
  currentDate, 
  timeScale,
  showLabel,
  cameraDistance 
}) => {
  const meshRef = useRef<Mesh>(null);
  const groupRef = useRef<Group>(null);

  const objectRadius = calculateDisplayRadius(body);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Calcul de la position orbitale
    const simulationTime = new Date(currentDate.getTime() + (state.clock.elapsedTime * timeScale * 24 * 60 * 60 * 1000));
    const position = calculatePlanetPosition(body, simulationTime);
    
    groupRef.current.position.set(position[0], position[1], position[2]);

    // Rotation de l'objet
    if (meshRef.current) {
      const rotationSpeed = (delta * timeScale) / Math.abs(body.rotationPeriod);
      meshRef.current.rotation.y += rotationSpeed;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[objectRadius, 12, 12]} />
        <meshStandardMaterial
          color={body.color}
          roughness={0.8}
          metalness={0.2}
          map={body.texture ? undefined : undefined} // Utiliser texture si disponible
        />
      </mesh>
      
      {/* Label pour les objets de Kuiper */}
      {showLabel && cameraDistance < 1000 && (
        <PlanetLabel
          body={body}
          position={[0, 0, 0]}
          visible={true}
          cameraDistance={cameraDistance}
        />
      )}
    </group>
  );
};

// Composant spécialisé pour Charon (système binaire avec Pluton)
interface CharonMoonProps {
  moon: CelestialBody;
  pluton: CelestialBody;
  currentDate: Date;
  timeScale: number;
  showLabel: boolean;
  cameraDistance: number;
}

const CharonMoon: React.FC<CharonMoonProps> = ({
  moon,
  pluton,
  currentDate,
  timeScale,
  showLabel,
  cameraDistance
}) => {
  const meshRef = useRef<Mesh>(null);
  const groupRef = useRef<Group>(null);

  const moonRadius = calculateDisplayRadius(moon);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Position de Pluton
    const simulationTime = new Date(currentDate.getTime() + (state.clock.elapsedTime * timeScale * 24 * 60 * 60 * 1000));
    const plutonPosition = calculatePlanetPosition(pluton, simulationTime);
    
    // Position relative de Charon par rapport à Pluton
    const moonOrbitRadius = moon.distance * 0.000067; // Conversion km vers échelle système
    const orbitAngle = (simulationTime.getTime() / (1000 * 60 * 60 * 24)) * (360 / moon.orbitalPeriod) * Math.PI / 180;
    
    const moonX = plutonPosition[0] + Math.cos(orbitAngle) * moonOrbitRadius;
    const moonY = plutonPosition[1];
    const moonZ = plutonPosition[2] + Math.sin(orbitAngle) * moonOrbitRadius;
    
    groupRef.current.position.set(moonX, moonY, moonZ);

    // Rotation synchrone
    if (meshRef.current) {
      meshRef.current.rotation.y = orbitAngle;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[moonRadius, 8, 8]} />
        <meshStandardMaterial
          color={moon.color}
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>
      
      {/* Label pour Charon */}
      {showLabel && cameraDistance < 500 && (
        <PlanetLabel
          body={moon}
          position={[0, 0, 0]}
          visible={true}
          cameraDistance={cameraDistance}
        />
      )}
    </group>
  );
};
